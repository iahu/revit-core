import Konva from 'konva'
import Cross from './cross'
import { DEG_TO_RAD } from './helper'
import Kroup from './kroup'
import { Observed, attr } from './observer'

export interface CompassConfig {
  /**
   * 起点
   */
  startPoint?: number[]
  /**
   * 终点
   */
  endPoint?: number[]

  stroke?: string
  strokeWidth?: number
  crossRadius?: number

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

  /**
   * compass arc label offset
   */
  labelOffset?: number
}

export const mapPoint = (point: number[], oldPoint: number[]) => point.concat(oldPoint.slice(point.length))

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

export default class Compass extends Kroup implements Observed, CompassConfig {
  compass: Konva.Arc
  compassLabel: Konva.Text
  compassStartCross: Cross
  compassEndCross: Cross
  xAxis: Konva.Line
  yAxis: Konva.Line

  @attr<Compass, 'startPoint'>({ beforeSet: mapPoint }) startPoint = [0, 0]
  @attr<Compass, 'endPoint'>({ beforeSet: mapPoint }) endPoint = [0, 0]

  @attr<Compass, 'xAxisWidth'>() xAxisWidth = 300

  @attr<Compass, 'stroke'>() stroke = '#0099ff'
  @attr<Compass, 'strokeWidth'>() strokeWidth = 1

  @attr<Compass, 'crossRadius'>() crossRadius = 1
  @attr<Compass, 'compassRadius'>() compassRadius = 150

  @attr<Compass, 'snapAngles'>() snapAngles = [0, 45, 90, 135, 180]
  @attr<Compass, 'snapMaxAngle'>() snapMaxAngle = 1

  @attr<Compass, 'labelOffset'>() labelOffset = 14

  constructor(config = {} as CompassConfig & Konva.ContainerConfig) {
    super(config)

    this.setAttrs(config)
  }

  snaped = false

  /**
   * 角度捕捉后的 Promise 回调，参数是 `true`
   */
  hasSnaped = Promise.resolve(false)

  update() {
    const [x, y] = this.startPoint
    let [x2, y2] = this.endPoint
    const { xAxisWidth, snapMaxAngle, snapAngles, stroke, strokeWidth, compassRadius, crossRadius, labelOffset } = this

    const t = new Konva.Transform([x2 - x, y2 - y, x2, y2, x, y])
    const attrs = t.decompose()
    const { scaleX } = attrs
    let { rotation } = attrs
    const snapedAngle = getSnapAngle(snapAngles, snapMaxAngle, rotation)

    // 角度捕捉
    if (typeof snapedAngle === 'number') {
      const snapedRad = snapedAngle * DEG_TO_RAD
      const dx2 = x + scaleX * Math.cos(snapedRad)
      const dy2 = y + scaleX * Math.sin(snapedRad)
      if (dx2 !== x2 && dy2 !== y2) {
        x2 = dx2
        y2 = dy2
        this.endPoint = [x2, y2]
        this.fire('snap.assistor')

        this.snaped = true
        this.hasSnaped = Promise.resolve(true)
      }
      rotation = snapedAngle
      this.yAxis.setAttrs({
        points: [x, y, x + xAxisWidth * Math.cos(snapedRad), y + xAxisWidth * Math.sin(snapedRad)],
        visible: true,
      })
    } else {
      this.yAxis.visible(false)
    }

    const angle = rotation
    const angleText = Math.abs(angle).toFixed(2)

    this.xAxis.setAttrs({ x, y, points: [0, 0, xAxisWidth, 0], strokeWidth: strokeWidth + 2 })

    const compassLabelRad = (rotation / 2) * DEG_TO_RAD
    this.compassLabel.setAttrs({
      x: x + compassRadius * Math.cos(compassLabelRad),
      y: y + compassRadius * Math.sin(compassLabelRad),
      offsetX: this.compassLabel.width() / 2,
      offsetY: labelOffset,
      fill: stroke,
      text: angleText,
      rotation: rotation / 2 + 90,
    })

    this.compass.setAttrs({
      x,
      y,
      innerRadius: compassRadius,
      outerRadius: compassRadius + strokeWidth,
      angle,
      fill: stroke,
      clockwise: angle <= 0,
    })

    this.compassStartCross.setAttrs({ x, y, offsetX: -compassRadius, radius: crossRadius, stroke, strokeWidth })
    this.compassEndCross.setAttrs({
      x,
      y,
      offsetX: -compassRadius,
      radius: crossRadius,
      stroke,
      strokeWidth,
      rotation,
    })

    // Y轴翻转文本
    if (angle > 0) {
      this.compassLabel.rotate(180)
    }
  }

  render() {
    const { compassRadius: radius, stroke, strokeWidth, crossRadius } = this
    this.compass = new Konva.Arc({ innerRadius: radius, outerRadius: radius, angle: 0, fill: stroke })
    this.compassLabel = new Konva.Text({ fontSize: 12 })

    this.compassStartCross = new Cross({ id: 'compassStartCross', stroke, strokeWidth, radius: crossRadius })
    this.compassEndCross = new Cross({ id: 'compassEndCross', stroke, strokeWidth, rotation: 30, radius: crossRadius })

    this.xAxis = new Konva.Line({ stroke: '#333' })
    this.yAxis = new Konva.Line({ stroke, strokeWidth, dash: [3, 3], visible: false, zindex: 2 })

    return [this.xAxis, this.compass, this.compassLabel, this.compassStartCross, this.compassEndCross, this.yAxis]
  }
}
