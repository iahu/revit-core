import Konva from 'konva'
import { TextConfig } from 'konva/lib/shapes/Text'
import { Stage } from 'konva/lib/Stage'
import { fireChangeEvent } from './helper'
import Kroup from './kroup'
import { ChangedProp, Observed, observer } from './observer'
export interface EditableTextOptions extends Konva.ContainerConfig {
  text?: string
  fontSize?: number
  hideTextOnEditing?: boolean
  trigger?: keyof GlobalEventHandlersEventMap
  editable?: boolean
  useScale?: boolean
  minWidth?: number
  minHeight?: number
  editEnable?: boolean
}

export class EditableText extends Kroup implements Observed {
  @observer<EditableText, 'text'>() text: string | undefined
  @observer<EditableText, 'align'>() align: string | undefined
  @observer<EditableText, 'minWidth'>() minWidth: number | undefined
  @observer<EditableText, 'minHeight'>() minHeight: number | undefined
  @observer<EditableText, 'editable'>() editable = true
  @observer<EditableText, 'fontSize'>() fontSize = 12
  @observer<EditableText, 'hideTextOnEditing'>() hideTextOnEditing = true
  @observer<EditableText, 'trigger'>() trigger = 'dblclick' as keyof GlobalEventHandlersEventMap
  @observer<EditableText, 'useScale'>() useScale = true
  @observer<EditableText, 'editEnable'>() editEnable = false

  constructor(options = {} as EditableTextOptions & TextConfig) {
    super(options)
    this.setAttrs(options)
    this.render()

    if (this.trigger) {
      this.$text.on(this.trigger, this.handleEditor)
    }
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

  propDidUpdate(prop: ChangedProp) {
    const { key, oldVal, newVal } = prop
    if ('text' === key) {
      fireChangeEvent(this, key, { oldVal, newVal })
    } else if ('editEnable' === key) {
      fireChangeEvent(this, key, { oldVal, newVal })
    }
  }

  $text = new Konva.Text({ fontSize: this.fontSize })
  $input = document.createElement('input')

  handleEditor = () => {
    this.editEnable = true

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement
      this.$text.visible(true)
      this.$input.remove()
      const oldVal = this.text
      const newVal = target.value

      if (oldVal !== newVal) {
        this.text = newVal
      }
      this.editEnable = false
    }
    this.$input.addEventListener('blur', handleBlur, { once: true })
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.$input.blur()
        this.$input.removeEventListener('keyup', handleKeyup)
      }
    }
    this.$input.addEventListener('keyup', handleKeyup)
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

  update() {
    const { hideTextOnEditing, editEnable, align, text, fontSize } = this
    const stage = this.getStage()
    const container = stage?.container()
    if (editEnable && container) {
      this.setInputStyle()
      if (hideTextOnEditing) {
        this.$text.visible(false)
      }
      this.$input.value = text ?? ''
      container.appendChild(this.$input)
      this.$input.focus()
    } else {
      this.$text.visible(true)
      this.$input.remove()
    }
    this.$text.setAttrs({ align, text, fontSize })
  }

  setInputStyle() {
    const rotation = this.getAbsoluteRotation()
    const { x, y } = this.getClientRect()
    let { width, height } = this.getClientRect()
    if (Math.abs(rotation) === 90) {
      const tmp = width
      width = height
      height = tmp
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
    return [this.$text]
  }
}
