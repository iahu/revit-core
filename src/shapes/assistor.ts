import Konva from 'konva'
import Cross from './cross'
import { DEG_TO_RAD } from './helper'
import { Observed, observer } from './observer'

export interface AssistorConfig {
  /**
   * 起点
   */
  startPoint?: number[]
  /**
   * 终点
   */
  endPoint?: number[]
  points?: number[]
  /**
   * 直尺垂直偏移量
   */
  rulerOffset?: number
  /**
   * 直尺交点标识的半径
   */
  crossRadius?: number
  stroke?: string
  strokeWidth?: number

  /**
   * X 轴直线宽度
   */
  xAxisWidth?: number

  /**
   * 量角器半径
   */
  compassRadius?: number

  /**
   * 一组要自动捕捉的角度度数
   * 角度不区分正负，即上下对称
   */
  snapAngles?: number[]

  /**
   * 自动捕捉角度左右范围
   */
  snapMaxAngle?: number
}

const mapPoint = (point: number[], oldPoint: number[]) => point.concat(oldPoint.slice(point.length))

const getSnapAngle = (snapAngles: number[], snapMaxAngle: number, angle: number) => {
  for (let i = 0; i < snapAngles.length; ++i) {
    const snapAngle = snapAngles[i]
    const diff = Math.abs(Math.abs(snapAngle) - Math.abs(angle))

    if (diff < snapMaxAngle) {
      if (angle < 0) {
        return -snapAngle
      }
      return snapAngle
    }
  }
}

export default class Assistor extends Konva.Group implements Observed, AssistorConfig {
  // group: Konva.Group
  protected xAxis: Konva.Line
  protected yAxis: Konva.Line

  rulerStart: Konva.Line
  rulerEnd: Konva.Line
  rulerBody: Konva.Line
  rulerLabel: Konva.Text
  rulerStartCross: Cross
  rulerEndCross: Cross

  compass: Konva.Arc
  compassLabel: Konva.Text
  compassStartCross: Cross
  compassEndCross: Cross

  // config
  @observer<Assistor, 'startPoint'>({ beforeSet: mapPoint }) startPoint = [0, 0]
  @observer<Assistor, 'endPoint'>({ beforeSet: mapPoint }) endPoint = [0, 0]

  @observer<Assistor, 'rulerOffset'>() rulerOffset = 30

  @observer<Assistor, 'stroke'>() stroke = '#0099ff'

  @observer<Assistor, 'strokeWidth'>() strokeWidth = 1

  @observer<Assistor, 'crossRadius'>() crossRadius = 6

  @observer<Assistor, 'xAxisWidth'>() xAxisWidth = 300

  @observer<Assistor, 'compassRadius'>() compassRadius = 150

  @observer<Assistor, 'snapAngles'>() snapAngles = [0, 45, 90, 135, 180]
  @observer<Assistor, 'snapMaxAngle'>() snapMaxAngle = 1

  constructor(config = {} as AssistorConfig & Konva.ContainerConfig) {
    super(config)

    this.assignArgs(config, [
      'startPoint',
      'endPoint',
      'strokeWidth',
      'stroke',
      'rulerOffset',
      'crossRadius',
      'xAxisWidth',
      'compassRadius',
      'snapAngles',
      'snapMaxAngle',
    ])

    this.render()
  }

  assignArgs<T, K extends keyof T>(config: T, keys: K[]) {
    keys.forEach(key => {
      const value = config[key]
      if (value !== undefined) {
        Reflect.set(this, key, value)
      }
    })
  }

  didUpdate() {
    this.render()
  }

  private createElements() {
    if (this.children?.length) {
      return
    }

    const stroke = this.stroke
    const strokeWidth = this.strokeWidth
    const radius = this.compassRadius
    const crossRadius = this.crossRadius

    this.xAxis = new Konva.Line({ stroke: '#333' })
    this.yAxis = new Konva.Line({ stroke, strokeWidth, dash: [3, 3], visible: false, zindex: 2 })

    this.rulerStart = new Konva.Line({ points: [0, 0, 0, 0] })
    this.rulerEnd = new Konva.Line({ points: [0, 0, 0, 0] })
    this.rulerBody = new Konva.Line({ points: [0, 0, 0, 0] })
    this.rulerLabel = new Konva.Text({ x: 0, y: 0, fontSize: 12, offsetY: 16, fill: stroke, align: 'center' })

    this.compass = new Konva.Arc({ innerRadius: radius, outerRadius: radius, angle: 0, fill: stroke })
    this.compassLabel = this.rulerLabel.clone()
    this.compassStartCross = new Cross({
      id: 'compassStartCross',
      stroke,
      strokeWidth,
      rotation: 30,
      radius: crossRadius,
    })
    this.compassEndCross = new Cross({ id: 'compassEndCross', stroke, strokeWidth, rotation: 30, radius: crossRadius })

    this.rulerStartCross = new Cross({ id: 'rulerStartCross', stroke, rotation: 30, radius: crossRadius })
    this.rulerEndCross = new Cross({ id: 'rulerEndCross', stroke, rotation: 30, radius: crossRadius })

    this.add(
      this.xAxis,
      this.yAxis,

      this.rulerStart,
      this.rulerEnd,
      this.rulerBody,
      this.rulerLabel,
      this.rulerStartCross,
      this.rulerEndCross,

      this.compass,
      this.compassLabel,
      this.compassStartCross,
      this.compassEndCross,
    )
  }

  /**
   *           cL-------------cR
   *           |              |
   * p1(x1, y1) -------------- p2(x2,y2)
   */
  render() {
    this.createElements()

    const offset = this.rulerOffset
    const [x, y] = this.startPoint
    let [x2, y2] = this.endPoint

    const { snapAngles, snapMaxAngle } = this
    const stroke = this.stroke
    const strokeWidth = this.strokeWidth
    const xAxisWidth = this.xAxisWidth
    const crossRadius = this.crossRadius
    const radius = this.compassRadius

    const t = new Konva.Transform([x2 - x, y2 - y, 0, 0, x, y])
    const attrs = t.decompose()
    const { scaleX } = attrs
    let { rotation } = attrs
    const snapedAngle = getSnapAngle(snapAngles, snapMaxAngle, rotation)

    // 角度捕捉
    if (typeof snapedAngle === 'number') {
      const dx2 = x + scaleX * Math.cos(snapedAngle * DEG_TO_RAD)
      const dy2 = y + scaleX * Math.sin(snapedAngle * DEG_TO_RAD)
      if (dx2 !== x2 && dy2 !== y2) {
        x2 = dx2
        y2 = dy2
        this.endPoint = [x2, y2]
        this.fire('snap.assistor')
      }
      rotation = snapedAngle
      this.yAxis.setAttrs({
        points: [
          x,
          y,
          x + xAxisWidth * Math.cos(snapedAngle * DEG_TO_RAD),
          y + xAxisWidth * Math.sin(snapedAngle * DEG_TO_RAD),
        ],
        visible: true,
      })
    } else {
      this.yAxis.visible(false)
    }

    const angle = rotation

    const p1 = [x, y]
    const p2 = [x2, y2]
    const cL = [x, y - offset]
    const cR = [x2, y2 - offset]

    this.xAxis.setAttrs({ points: [x, y, x + xAxisWidth, y], strokeWidth: strokeWidth * 2 })

    this.rulerBody.setAttrs({ points: cL.concat(cR), stroke, strokeWidth })
    this.rulerStart.setAttrs({ points: p1.concat(cL[0], cL[1]), stroke, strokeWidth })
    this.rulerEnd.setAttrs({ points: p2.concat(cR[0], cR[1]), stroke, strokeWidth })
    this.rulerStartCross.setAttrs({ x, y: y - offset, stroke, strokeWidth, crossRadius: crossRadius })
    this.rulerEndCross.setAttrs({ x: x2, y: y2 - offset, stroke, strokeWidth, crossRadius: crossRadius })
    this.rulerLabel.setAttrs({
      x: cL[0],
      y: cL[1],
      width: scaleX,
      text: scaleX.toFixed(1),
      fill: stroke,
      rotation,
    })

    const labelRotation = rotation / 2 + 90
    this.compassLabel.setAttrs({
      offsetX: 20,
      offsetY: 12,
      x: x + radius * Math.cos((rotation / 2) * DEG_TO_RAD),
      y: y + radius * Math.sin((rotation / 2) * DEG_TO_RAD),
      text: Math.abs(angle).toFixed(2),
      fill: stroke,
      rotation: labelRotation,
    })

    this.compass.setAttrs({
      x,
      y,
      innerRadius: radius,
      outerRadius: radius + strokeWidth,
      angle,
      fill: stroke,
      clockwise: angle <= 0,
    })

    this.compassStartCross.setAttrs({ x: x + radius, y, radius: crossRadius, stroke, strokeWidth })
    this.compassEndCross.setAttrs({
      x: x + radius * Math.cos(rotation * DEG_TO_RAD),
      y: y + radius * Math.sin(rotation * DEG_TO_RAD),
      radius: crossRadius,
      stroke,
      strokeWidth,
    })

    // Y轴翻转文本
    if (angle > 0) {
      this.compassLabel.rotate(180)
    }
    if (Math.abs(angle) > 90) {
      this.rulerLabel.setAttrs({ x: cR[0], y: cR[1], rotation: rotation - 180 })
    }
  }
}
