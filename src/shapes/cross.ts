import Konva from 'konva'
import { Factory } from 'konva/lib/Factory'
import { getNumberValidator } from 'konva/lib/Validators'
import { DEG_TO_RAD } from './helper'
import { attr } from './observer'

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
  angle: number
  radius: number

  getClassName() {
    return 'Cross'
  }

  constructor(config?: CrossConfig) {
    super(config)

    this.className = this.getClassName()
    this.setAttrs(config)
  }

  _sceneFunc(context: Konva.Context) {
    const { angle = 45, radius = 8 } = this.getAttrs()
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

    context._context.stroke()
    context.stroke()

    context.fillStrokeShape(this)
  }
}
