import Konva from 'konva'
import { attr } from './observer'

export type Direction = 'horizontal' | 'vertical'

export interface LevelOptions extends Konva.ShapeConfig {
  /** 如果设置了点距，数组的值会根据比例转成一个动态的值 */
  dash?: number[]
  startPoint?: number[]
  endPoint?: number[]
  /**
   * 虚线密度，取正数
   * 值越小越密
   */
  pace?: number
}

/**
 * @class Level 水平线
 * 可设置水平或垂直方向，自动计算虚线点距
 */
export class Level extends Konva.Shape {
  @attr() startPoint = [0, 0]
  @attr() endPoint = [0, 0]
  @attr() pace = 6

  getClassName() {
    return this.constructor.name
  }
  constructor(config?: LevelOptions) {
    super(config)
    this.className = this.getClassName()
    this.setAttrs({ hitStrokeWidth: 5, ...config })
  }

  getWidth() {
    const { startPoint, endPoint } = this.getAttrs()
    const x = startPoint[0] - endPoint[0]
    const y = startPoint[1] - endPoint[1]
    return Math.hypot(x, y)
  }

  _sceneFunc(context: Konva.Context) {
    const { startPoint, endPoint, pace } = this.getAttrs()
    const width = this.getWidth()
    const add = (a: number, b: number) => a + b
    const _dash = this.dash() ?? [10, 1, 1, 1, 4, 1, 1, 1]
    const sum = _dash.reduce(add)
    const bottom = sum * Math.floor(Math.abs(width) / (sum * Math.abs(pace)))
    const ratio = Math.abs(width) / bottom
    const dash = _dash.map(d => d * ratio)
    const scale = width / (width + dash[0])

    context.beginPath()
    context.setLineDash(dash.map(d => d * scale))
    context.moveTo(startPoint[0], startPoint[1])
    context.lineTo(endPoint[0], endPoint[1])

    context.fillStrokeShape(this)
  }
}
