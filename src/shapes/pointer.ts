import Konva from 'konva'
import { DEG_TO_RAD } from './helper'
import { attr } from './observer'

export interface PointerOptions extends Konva.ShapeConfig {
  radius?: number
  strokeWidth?: number
}

export class Pointer extends Konva.Shape {
  @attr<Pointer, 'radius'>() radius = 20

  constructor(options?: PointerOptions) {
    super(options)

    this.setAttrs(options)
  }

  _sceneFunc(ctx: Konva.Context & CanvasRenderingContext2D) {
    const { radius, stroke } = this.getAttrs()

    // 三角
    ctx.beginPath()
    ctx.moveTo(Math.cos(45 * DEG_TO_RAD) * radius, Math.sin(45 * DEG_TO_RAD) * radius)
    ctx.lineTo(0, radius / Math.cos(45 * DEG_TO_RAD))
    ctx.lineTo(Math.cos(135 * DEG_TO_RAD) * radius, Math.sin(135 * DEG_TO_RAD) * radius)
    ctx.fillStyle = stroke
    ctx.fill()
    ctx.closePath()
    ctx.fillStrokeShape(this)

    // 圆-裁剪区域
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 360 * DEG_TO_RAD, false)
    ctx.closePath()
    ctx.fill()

    // 圆-路径
    ctx.globalCompositeOperation = 'source-over'
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 360 * DEG_TO_RAD, false)
    ctx.closePath()
    ctx.fillStrokeShape(this)
  }
}
