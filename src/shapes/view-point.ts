import Konva from 'konva'
import { EditableText } from './editable-text'
import Komponent from './komponent'
import { attr, Observed } from './observer'
import { Pointer } from './pointer'

type Location = 'north' | 'east' | 'south' | 'west'

export interface ViewPointOptions {
  radius?: number
  innerRadius?: number
  strokeWidth?: number
  axisWidth?: number
  /**
   * @todo 使用 `location`
   * 基点本身的位置，与其朝向的位置正好相反
   */
  location?: Location
}

export class ViewPoint extends Komponent implements Observed, ViewPointOptions {
  @attr<ViewPoint, 'radius'>() radius = 12
  @attr<ViewPoint, 'innerRadius'>() innerRadius = 10
  @attr<ViewPoint, 'axisWidth'>() axisWidth = 1000
  @attr<ViewPoint, 'location'>() location: Location | undefined

  $pointer = new Pointer({ name: 'base-point-pointer unselectable' })

  $textInner = new EditableText({ name: 'base-point-text-inner unselectable', text: '-', readonly: true })
  $textOuter = new EditableText({ name: 'base-point-text-outer unselectable', text: '-', readonly: true })
  $axis = new Konva.Line({ name: 'base-point-axis unselectable', visible: false })

  update() {
    const { radius, innerRadius, rotation = 0, stroke, strokeWidth, axisWidth, selected } = this.getAttrs()

    this.$pointer.setAttrs({ radius, innerRadius, stroke })

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
      visible: selected,
    })
  }

  render() {
    // this.update()
    return [this.$pointer, this.$textInner, this.$textOuter, this.$axis]
  }
}
