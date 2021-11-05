import Konva from 'konva'
import { DEG_TO_RAD } from './helper'
import { observer } from './observer'

export interface CrossConfig extends Konva.ShapeConfig {
  /**
   * cross angle degree
   */
  angle?: number

  /**
   * cross line radius
   */
  radius?: number
}

export default class Cross extends Konva.Shape {
  @observer<Cross, 'angle'>() angle = 60
  @observer<Cross, 'radius'>() radius = 8

  constructor(config?: CrossConfig) {
    super(config)

    const { angle = 60, radius = 8 } = config ?? {}
    this.angle = angle
    this.radius = radius
  }

  _sceneFunc(context: Konva.Context) {
    const { angle, radius } = this

    const x = radius * Math.cos(angle * DEG_TO_RAD)
    const y = radius * Math.sin(angle * DEG_TO_RAD)

    // \
    context.beginPath()
    context.moveTo(-x, -y)
    context.lineTo(x, y)
    context.stroke()
    // /
    context.moveTo(x, -y)
    context.lineTo(-x, y)
    context.stroke()

    context.fillStrokeShape(this)
  }
}
