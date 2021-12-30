import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { Rect } from 'konva/lib/shapes/Rect'
import { TextConfig } from 'konva/lib/shapes/Text'
import { Stage } from 'konva/lib/Stage'
import { fireChangeEvent } from './helper'
import Komponent from './komponent'
import { ChangedProp, Observed, attr } from './observer'
export interface EditableTextOptions extends Konva.ContainerConfig {
  text?: string
  fontSize?: number
  hideTextOnEditing?: boolean
  trigger?: keyof GlobalEventHandlersEventMap
  useScale?: boolean
  minWidth?: number
  minHeight?: number
  /** 仅可读，即不可编辑 */
  readonly?: boolean
  /** 标识是否进入编辑状态 */
  editable?: boolean
  /** 是否允许空字符串 */
  allowEmpty?: boolean
  emptyMark?: string
}

export class EditableText extends Komponent implements Observed {
  @attr<EditableText, 'text'>() text: string | undefined
  @attr<EditableText, 'align'>() align: string | undefined
  @attr<EditableText, 'minWidth'>() minWidth: number | undefined
  @attr<EditableText, 'minHeight'>() minHeight: number | undefined
  @attr<EditableText, 'readonly'>() readonly = false
  @attr<EditableText, 'fontSize'>() fontSize = 12
  @attr<EditableText, 'hideTextOnEditing'>() hideTextOnEditing = true
  @attr<EditableText, 'trigger'>() trigger = 'dblclick' as keyof GlobalEventHandlersEventMap
  @attr<EditableText, 'useScale'>() useScale = true
  @attr<EditableText, 'editable'>() editable = false
  @attr<EditableText, 'allowEmpty'>() allowEmpty = false
  @attr<EditableText, 'emptyMark'>() emptyMark = '-'

  constructor(options = {} as EditableTextOptions & TextConfig) {
    super(options)
    this.setAttrs(options)
    this.render()

    if (this.trigger) {
      this.$text.on(this.trigger, this.handleEditor)
    }

    this.$input.addEventListener('blur', this.handleBlur)
    this.$input.addEventListener('keyup', this.handleKeyup)
  }

  propWillUpdate(prop: ChangedProp) {
    const { key, oldVal, newVal } = prop
    if (key === 'trigger') {
      this.$text.off(oldVal, this.handleEditor)
      this.$text.on(newVal, this.handleEditor)
    } else if (key === 'text') {
      const text = newVal ?? ''
      this.$text.setAttrs({ text })
      this.$input.value = text
    } else if (['width', 'align'].includes(key)) {
      this.$text.setAttrs({ [key]: newVal })
    }
  }

  $text = new Konva.Text({ name: 'editable-text', fontSize: this.fontSize })
  $input = document.createElement('input')
  $background = new Rect({ name: 'editable-text-background' })

  handleEditor = (e: KonvaEventObject<Event>) => {
    e.cancelBubble = true
    this.editable = true
  }

  handleBlur = (e: FocusEvent) => {
    const target = e.target as HTMLInputElement
    this.$text.visible(true)
    this.$input.remove()
    const { allowEmpty } = this
    const oldVal = this.text
    const newVal = target.value

    if (oldVal !== newVal && !(!newVal && !allowEmpty)) {
      this.text = newVal
      this.$text.text(newVal)
      fireChangeEvent(this, 'text', { oldVal, newVal })
    }
    this.editable = false
  }

  handleKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.$input.blur()
    }
  }

  getWidth() {
    return this.$text.width()
  }

  getHeight() {
    return this.$text.height()
  }

  firstRender() {
    const { align, text, fontSize } = this
    this.$text.setAttrs({ align, text, fontSize })
    this.$input.value = text ?? ''
  }

  propDidUpdate(prop: ChangedProp) {
    const { key, oldVal, newVal } = prop
    if ('editable' === key) {
      if (this.readonly) {
        return
      }
      const { editable, hideTextOnEditing, text } = this
      const stage = this.getStage()
      const container = stage?.container()
      if (editable && container) {
        this.setInputStyle()
        if (hideTextOnEditing) {
          this.$text.visible(false)
        }
        this.$input.value = text ?? ''
        container.appendChild(this.$input)
        this.$input.focus()
      } else if (!editable) {
        this.$text.visible(true)
        this.$input.remove()
      }

      fireChangeEvent(this, 'editable', { oldVal, newVal })
    }
  }

  update() {
    const { align, text, emptyMark, fontSize, minWidth, minHeight } = this
    const { width, height } = this.getAttrs()
    const mergedWidth = minWidth ? Math.max(width ?? 0, minWidth) : width
    const mergedHeight = minHeight ? Math.max(height ?? 0, minHeight) : height
    this.$text.setAttrs({ align, text: text || emptyMark, fontSize, width: mergedWidth, height: mergedHeight })
    this.$background.setAttrs({ width: mergedWidth, height: mergedHeight })
  }

  setInputStyle() {
    const rotation = this.getAbsoluteRotation()
    let { x, y, width, height } = this.getClientRect()
    if (Math.abs(rotation) === 90) {
      const tmp = width
      width = height
      height = tmp
      x = x - height / 2
      y = y + width / 2 - height / 2
    }
    const { align, editable, useScale, minWidth, minHeight } = this
    if (!editable) {
      return
    }
    const fontSize = this.$text.fontSize()
    const lineHeight = this.$text.lineHeight()
    const padding = this.getAttr('padding') ?? 2
    const stage = this.getStage() as Stage
    if (!stage) {
      return
    }

    const container = stage.container()
    const { scaleX = 1, scaleY = 1 } = stage.getAttrs()

    // 不考虑旋转
    this.$input.style.cssText = [
      'position: absolute',
      'box-sizing: content-box',
      `left: ${container.offsetLeft + x - (padding + 1) * scaleX}px`,
      `top: ${container.offsetTop + y - (padding + 1) * scaleY}px`,
      `width: ${width / scaleX}px`,
      `height: ${height / scaleY}px`,
      `min-width: ${minWidth ? minWidth / scaleX : ''}px`,
      `min-height: ${minHeight ? minHeight / scaleY : ''}px`,
      `line-height: ${lineHeight}`,
      `padding: ${padding * scaleX}px ${padding * scaleY}px`,
      `font-size: ${fontSize}px`,
      'border: 1px solid #333',
      'border-radius: 0',
      'outline: none',
      `text-align: ${align}`,
      useScale ? `transform: scale(${scaleX}, ${scaleY})` : '',
    ].join(';')
  }

  render() {
    return [this.$background, this.$text]
  }
}
