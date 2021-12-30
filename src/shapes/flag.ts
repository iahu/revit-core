import Konva from 'konva'
import { attr } from './observer'

export interface FlagOptions extends Konva.ShapeConfig {
  flagWidth?: number
  flipX?: boolean
  flipY?: boolean
}

export class Flag extends Konva.Shape {
  @attr<Flag, 'flagWidth'>() flagWidth = 20
  @attr<Flag, 'flipX'>() flipX = false
  @attr<Flag, 'flipY'>() flipY = false

  constructor(options?: FlagOptions) {
    super(options)

    this.setAttrs({ width: 80, height: 10, strokeWidth: 1, hitStrokeWidth: 4, ...options })
  }

  _sceneFunc(ctx: Konva.Context) {
    const { flagWidth, flipX, flipY } = this
    const { width, height } = this.getAttrs()
    const strokeOffset = 0
    const xSign = flipX ? -1 : 1
    const ySign = flipY ? -1 : 1
    const offsetY = ySign * (-height - strokeOffset)

    ctx.beginPath()
    ctx.moveTo((xSign * flagWidth) / 2, offsetY)
    ctx.lineTo(0, -strokeOffset)
    ctx.lineTo((xSign * -flagWidth) / 2, offsetY)

    ctx.lineTo(xSign * width, offsetY)

    ctx.stroke()
    ctx.fillStrokeShape(this)
  }
}
