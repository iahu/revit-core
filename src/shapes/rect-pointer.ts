import Konva from 'konva'
import { DEG_TO_RAD } from './helper'
import { attr } from './observer'

export interface RectPointerOptions extends Konva.ShapeConfig {
  /**
   * 三角形度数
   */
  angle?: number
}

export class RectPointer extends Konva.Shape {
  @attr() angle = 90

  getClassName() {
    return this.constructor.name
  }

  constructor(options?: RectPointerOptions) {
    super(options)

    this.className = this.getClassName()
    this.setAttrs(options)
  }

  _sceneFunc(ctx: Konva.Context & CanvasRenderingContext2D) {
    const { width, height, angle } = this.getAttrs()
    const halfWidth = width / 2
    const triangleHeight = halfWidth / Math.tan((angle / 2) * DEG_TO_RAD)

    ctx.beginPath()
    ctx.moveTo(halfWidth, -triangleHeight)
    ctx.lineTo(0, 0)
    ctx.lineTo(-halfWidth, -triangleHeight)
    ctx.rect(-halfWidth, -triangleHeight, width, -height)
    ctx.closePath()
    ctx.fillStrokeShape(this)
  }
}
