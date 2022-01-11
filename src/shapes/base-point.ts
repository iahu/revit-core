import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Arrow } from 'konva/lib/shapes/Arrow'
import CrossCircle from './cross-circle'
import Komponent from './komponent'
import { attr, ChangedProp } from './observer'

export interface BasePointOptions {
  radius?: number
  axisLength?: number
  showAxis?: boolean
}

export class BasePoint extends Komponent {
  @attr<BasePoint, 'radius'>() radius = 10
  @attr<BasePoint, 'axisLength'>() axisLength = 50
  @attr<BasePoint, 'showAxis'>() showAxis = false

  constructor(options: BasePointOptions & ContainerConfig) {
    super(options)
    this.setAttrs(options)
  }

  $crossCircle = new CrossCircle({ name: 'base-point-cross-cricle unselectable', radius: this.radius })
  $xAxis = new Arrow({ name: 'base-point-x-axis unselectable', pointerWidth: 5, fill: 'white', points: [0, 0, 0, 0] })
  $yAxis = new Arrow({ name: 'base-point-y-axis unselectable', pointerWidth: 5, fill: 'white', points: [0, 0, 0, 0] })

  update() {
    const { stroke, strokeWidth, radius, axisLength, showAxis, selected } = this.getAttrs()
    this.$crossCircle.setAttrs({ stroke, strokeWidth, radius })
    const visible = showAxis || selected
    this.$xAxis.setAttrs({ stroke: 'red', strokeWidth, offsetY: radius, points: [0, 0, 0, -axisLength], visible })
    this.$yAxis.setAttrs({ stroke: 'green', strokeWidth, offsetX: radius, points: [0, 0, -axisLength, 0], visible })
  }

  render() {
    return [this.$xAxis, this.$yAxis, this.$crossCircle]
  }
}
