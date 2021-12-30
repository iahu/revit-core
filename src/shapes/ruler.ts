import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import Cross from './cross'
import { EditableText } from './editable-text'
import Kroup from './kroup'
import { Observed, attr } from './observer'

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

  stroke?: string | CanvasGradient
  strokeWidth?: number

  editable?: boolean

  /**
   * 手动设置标签文案
   */
  label?: string
  /**
   * 设置像素比例，默认是 `1:1`
   */
  pixelRatio?: number
}

export default class Ruler extends Kroup implements Observed {
  ruler = new Konva.Line({ name: 'ruler' })
  rulerLabel = new EditableText({ name: 'ruler-label', fontSize: 12, align: 'center' })
  startCross = new Cross()
  endCross = new Cross()

  @attr<Ruler, 'startPoint'>() startPoint = [0, 0]
  @attr<Ruler, 'endPoint'>() endPoint = [0, 0]
  @attr<Ruler, 'rulerOffset'>() rulerOffset = 20
  @attr<Ruler, 'crossRadius'>() crossRadius = 6
  @attr<Ruler, 'stroke'>() stroke = '#0099ff'
  @attr<Ruler, 'strokeWidth'>() strokeWidth = 1
  @attr<Ruler, 'label'>() label: string
  @attr<Ruler, 'pixelRatio'>() pixelRatio = 1

  constructor(options?: RulerConfig & ContainerConfig) {
    super(options)
    this.setAttrs(options ?? {})
  }

  update() {
    const { startPoint, endPoint, rulerOffset: offsetY, crossRadius, stroke, strokeWidth, label, pixelRatio = 1 } = this
    const [x, y] = startPoint
    const [x2, y2] = endPoint
    const tr = new Konva.Transform([x2 - x, y2 - y, 0, 1, x, y])
    const { scaleX, rotation } = tr.decompose()
    const text = label ?? Math.round(Math.abs(scaleX * pixelRatio))

    this.ruler.setAttrs({
      x,
      y,
      points: [0, 0, 0, -offsetY, scaleX, -offsetY, scaleX, 0],
      stroke,
      strokeWidth,
      rotation,
    })
    this.rulerLabel.setAttrs({ x, y, offsetY: offsetY + 14, width: scaleX, text: text, fill: stroke, rotation })

    this.startCross.setAttrs({ x, y, offsetY, radius: crossRadius, stroke, strokeWidth, rotation })
    this.endCross.setAttrs({ x: x2, y: y2, offsetY, radius: crossRadius, stroke, strokeWidth, rotation })

    if (Math.abs(rotation) > 90) {
      this.rulerLabel.setAttrs({ offsetX: scaleX, offsetY: -offsetY + 14, rotation: rotation - 180 })
    } else {
      this.rulerLabel.setAttrs({ offsetX: 0, offsetY: offsetY + 14, rotation: rotation })
    }
  }

  render() {
    return [this.ruler, this.rulerLabel, this.startCross, this.endCross]
  }
}
