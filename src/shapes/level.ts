import Konva from 'konva'

export type Direction = 'horizontal' | 'vertical'

export interface LevelOptions extends Konva.ShapeConfig {
  /** 如果设置了点距，数组的值会根据比例转成一个 0-10 的值 */
  dash?: number[]
}

/**
 * @class Level 水平线
 * 可设置水平或垂直方向，自动计算虚线点距
 */
export class Level extends Konva.Shape {
  constructor(config?: LevelOptions) {
    super(config)

    this.setAttrs({ hitStrokeWidth: 4, ...config })
  }

  _sceneFunc(context: Konva.Context) {
    const width = this.width()
    const add = (a: number, b: number) => a + b
    const _dash = this.dash() ?? [6, 1, 2, 1]
    const sum = _dash.reduce(add)
    const _scaledDash = _dash.map(d => (10 * d) / sum)
    const bottom = 20 * Math.floor(Math.abs(width) / 200)
    const ratio = Math.abs(width) / bottom
    const dash = _scaledDash.map(d => d * ratio)
    const scale = width / (width + dash[0])

    context.beginPath()
    context.setLineDash(dash.map(d => d * scale))
    context.moveTo(0, 0)
    context.lineTo(width, 0)
    context.stroke()

    context.fillStrokeShape(this)
  }
}
