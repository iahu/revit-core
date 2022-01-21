import Konva from 'konva'
import { ShapeGetClientRectConfig } from 'konva/lib/Shape'
import { DEG_TO_RAD } from './helper'
import { attr } from './observer'

export interface PointerOptions extends Konva.ShapeConfig {
  radius?: number
  innerRadius?: number
  strokeWidth?: number
}

export class Pointer extends Konva.Shape {
  @attr<Pointer, 'radius'>() radius = 10
  @attr<Pointer, 'innerRadius'>() innerRadius = 9

  getClassName() {
    return this.constructor.name
  }

  constructor(options?: PointerOptions) {
    super(options)

    this.className = this.getClassName()
    this.setAttrs(options)
  }

  getWidth() {
    return this.radius * 2
  }

  getHeight() {
    return this.radius * 2.414
  }

  getClientRect(config?: ShapeGetClientRectConfig) {
    const { skipTransform = false } = config ?? {}
    const x = skipTransform ? 0 : this.x()
    const y = skipTransform ? 0 : this.y()

    return {
      x: x - this.radius,
      y: y - this.radius,
      width: this.getWidth(),
      height: this.getHeight(),
    }
  }

  _sceneFunc(ctx: Konva.Context & CanvasRenderingContext2D) {
    const { radius, innerRadius, stroke } = this.getAttrs()

    // 三角
    ctx.beginPath()
    ctx.moveTo(Math.cos(45 * DEG_TO_RAD) * radius, Math.sin(45 * DEG_TO_RAD) * radius)
    ctx.lineTo(0, radius / Math.cos(45 * DEG_TO_RAD))
    ctx.lineTo(Math.cos(135 * DEG_TO_RAD) * radius, Math.sin(135 * DEG_TO_RAD) * radius)
    ctx.fillStyle = stroke
    ctx.fill()
    ctx.closePath()
    ctx.fillShape(this)

    // 实心圆
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 360 * DEG_TO_RAD, false)
    ctx.closePath()
    ctx.fill()
    ctx.fillShape(this)

    // 内圆-裁切问题
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(0, 0, innerRadius, 0, 360 * DEG_TO_RAD, false)
    ctx.closePath()
    ctx.fill()
    ctx.fillShape(this)
  }
}
