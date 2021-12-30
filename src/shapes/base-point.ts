import Konva from 'konva'
import { SELECTED_CLASSNAME } from '@actions/helper'
import { EditableText } from './editable-text'
import Komponent from './komponent'
import { Observed, attr } from './observer'
import { Pointer } from './pointer'

export interface BasePointOptions {
  radius?: number
  strokeWidth?: number
  axisWidth?: number
}

export class BasePoint extends Komponent implements Observed, BasePointOptions {
  @attr<BasePoint, 'radius'>() radius = 20
  @attr<BasePoint, 'axisWidth'>() axisWidth = 1000

  $pointer = new Pointer({ name: 'base-point-pointer unselectable' })

  $textInner = new EditableText({ name: 'base-point-text-inner unselectable', text: '-', editable: false })
  $textOuter = new EditableText({ name: 'base-point-text-outer unselectable', text: '-', editable: false })
  $axis = new Konva.Line({ name: 'base-point-axis unselectable', visible: false })

  update() {
    const { radius, rotation = 0, stroke, strokeWidth, axisWidth } = this.getAttrs()

    this.$pointer.setAttrs({ radius, stroke })

    this.$textInner.setAttrs({ stroke, strokeWidth, offsetX: 2, offsetY: 6, rotation: -rotation })
    this.$textOuter.setAttrs({
      stroke,
      strokeWidth,
      text: '-',
      offsetX: 2,
      offsetY: 6,
      y: 1.414 * (radius + 6),
      rotation: -rotation,
    })

    const axisRadius = axisWidth / 2
    this.$axis.setAttrs({
      stroke,
      strokeWidth,
      points: [-axisRadius, 0, axisRadius, 0],
      visible: this.hasName(SELECTED_CLASSNAME),
    })
  }

  render() {
    // this.update()
    return [this.$pointer, this.$textInner, this.$textOuter, this.$axis]
  }
}
