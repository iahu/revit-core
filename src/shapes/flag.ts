import Konva from 'konva'
import { hitStrokeWidth } from '../config'
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

  getClassName() {
    return this.constructor.name
  }

  constructor(options?: FlagOptions) {
    super(options)

    this.className = this.getClassName()
    this.setAttrs({ width: 80, height: 10, strokeWidth: 1, hitStrokeWidth, ...options })
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

    ctx.fillStrokeShape(this)
  }
}
