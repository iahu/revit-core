import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Circle } from 'konva/lib/shapes/Circle'
import { EditableText } from './editable-text'
import Komponent from './komponent'
import { attr, ChangedProp, Observed } from './observer'

export interface TextCircleOptions {
  radius?: number
  text?: string
  fontSize?: number
  keepHorizontal?: boolean
}

export class TextCircle extends Komponent implements Observed, TextCircleOptions {
  @attr<TextCircle, 'radius'>() radius = 20
  @attr<TextCircle, 'text'>() text = ''
  @attr<TextCircle, 'label'>() label = this.text
  @attr<TextCircle, 'fontSize'>() fontSize = 12
  @attr<TextCircle, 'keepHorizontal'>() keepHorizontal = true

  constructor(options: TextCircleOptions & ContainerConfig) {
    super()
    this.setAttrs(options)

    this.on('textChange', this.onTextChange)
  }

  $circle = new Circle({ name: 'text-circle-circle unselectable' })
  $text = new EditableText({ name: 'text-circle-text unselectable' })

  onTextChange(e: KonvaEventObject<Event>) {
    this.label = (e as KonvaEventObject<Event> & ChangedProp).newVal
  }

  propWillUpdate(prop: ChangedProp) {
    if (prop.key === 'text') {
      this.label = prop.newVal
    }
  }

  update() {
    const { radius, stroke, strokeWidth, label, fontSize, keepHorizontal } = this.getAttrs()
    this.$circle.setAttrs({ stroke, strokeWidth, radius })
    this.$text.setAttrs({
      stroke,
      strokeWidth,
      text: label,
      width: 2 * radius,
      height: 2 * radius,
      lineHeight: (2 * radius) / fontSize,
      align: 'center',
      padding: 0,
      offsetX: radius,
      offsetY: radius,
      rotation: keepHorizontal ? -this.getAbsoluteRotation() : undefined,
    })
  }

  render() {
    return [this.$circle, this.$text]
  }
}
