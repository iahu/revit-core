import Konva from 'konva'
import Cross from './cross'
import Kroup from './kroup'
import { observer } from './observer'

export interface RulerConfig {
  /**
   * 起点
   */
  startPoint?: number[]
  /**
   * 终点
   */
  endPoint?: number[]

  /**
   * 直尺垂直偏移量
   */
  rulerOffset?: number

  crossRadius?: number

  stroke?: string
  strokeWidth?: number
}

export default class Ruler extends Kroup {
  ruler: Konva.Line
  rulerLabel: Konva.Text
  startCross: Cross
  endCross: Cross

  @observer<Ruler, 'startPoint'>() startPoint = [0, 0]
  @observer<Ruler, 'endPoint'>() endPoint = [0, 0]
  @observer<Ruler, 'rulerOffset'>() rulerOffset = 20
  @observer<Ruler, 'crossRadius'>() crossRadius = 6
  @observer<Ruler, 'stroke'>() stroke = '#0099ff'
  @observer<Ruler, 'strokeWidth'>() strokeWidth = 1

  constructor(config = {} as RulerConfig & Konva.ContainerConfig) {
    super(config)

    this.assignArgs(config, ['startPoint', 'endPoint', 'rulerOffset', 'crossRadius', 'stroke', 'strokeWidth'])
  }

  update() {
    const { startPoint, endPoint, rulerOffset: offsetY, crossRadius, stroke, strokeWidth } = this
    const [x, y] = startPoint
    const [x2, y2] = endPoint
    const tr = new Konva.Transform([x2 - x, y2 - y, 0, 1, x, y])
    const { scaleX, rotation } = tr.decompose()
    const distance = Math.abs(scaleX).toFixed(2)

    this.ruler.setAttrs({
      x,
      y,
      points: [0, 0, 0, -offsetY, scaleX, -offsetY, scaleX, 0],
      stroke,
      strokeWidth,
      rotation,
    })
    this.rulerLabel.setAttrs({ x, y, offsetY: offsetY + 14, width: scaleX, text: distance, fill: stroke, rotation })

    this.startCross.setAttrs({ x, y, offsetY, crossRadius, stroke, strokeWidth, rotation })
    this.endCross.setAttrs({ x: x2, y: y2, offsetY, crossRadius, stroke, strokeWidth, rotation })

    if (Math.abs(rotation) > 90) {
      this.rulerLabel.setAttrs({ offsetX: scaleX, offsetY: -offsetY + 14, rotation: rotation - 180 })
    } else {
      this.rulerLabel.setAttrs({ offsetX: 0, offsetY: offsetY + 14, rotation: rotation })
    }
  }

  render() {
    this.ruler = new Konva.Line({ name: 'ruler' })
    this.rulerLabel = new Konva.Text({ name: 'ruler-label', fontSize: 12, align: 'center' })
    this.startCross = new Cross()
    this.endCross = new Cross()

    return [this.ruler, this.rulerLabel, this.startCross, this.endCross]
  }
}
