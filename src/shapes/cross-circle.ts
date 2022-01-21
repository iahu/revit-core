import Konva from 'konva'
import { DEG_TO_RAD } from './helper'

export interface CrossCircleOptions extends Konva.ShapeConfig {
  radius?: number
}

export default class CrossCircle extends Konva.Shape {
  angle: number
  radius: number

  getClassName() {
    return this.constructor.name
  }

  getSelfRect() {
    const { x = 0, y = 0, radius = 0 } = this.getAttrs()
    return { x: x - radius, y: y - radius, width: radius * 2, height: radius * 2 }
  }

  constructor(config?: CrossCircleOptions) {
    super(config)

    this.className = this.getClassName()
    this.setAttrs(config)
  }

  _sceneFunc(context: Konva.Context) {
    const { angle = 45, radius = 8 } = this.getAttrs()
    const x = radius * Math.cos(angle * DEG_TO_RAD)
    const y = radius * Math.sin(angle * DEG_TO_RAD)

    context.beginPath()
    context.arc(0, 0, radius, 0, 360 * DEG_TO_RAD, true)
    context.closePath()
    context.fillStrokeShape(this)

    // \
    context.beginPath()
    context.moveTo(-x, -y)
    context.lineTo(x, y)
    // /
    context.moveTo(x, -y)
    context.lineTo(-x, y)
    context.closePath()
    context.fillStrokeShape(this)

    context.fillStrokeShape(this)
  }
}
