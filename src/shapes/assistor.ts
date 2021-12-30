import Konva from 'konva'
import Compass from './compass'
import Kroup from './kroup'
import { attr } from './observer'
import Ruler from './ruler'

export interface AssistorConfig {
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

  pixelRatio?: number
}

const mapPoint = (point: number[], oldPoint: number[]) => point.concat(oldPoint.slice(point.length))

export default class Assistor extends Kroup {
  ruler: Ruler

  compass: Compass

  // config
  @attr<Assistor, 'startPoint'>({ beforeSet: mapPoint }) startPoint = [0, 0]
  @attr<Assistor, 'endPoint'>({ beforeSet: mapPoint }) endPoint = [0, 0]

  @attr<Assistor, 'rulerOffset'>() rulerOffset = 30

  @attr<Assistor, 'stroke'>() stroke = '#0099ff'

  @attr<Assistor, 'strokeWidth'>() strokeWidth = 1

  @attr<Assistor, 'crossRadius'>() crossRadius = 6

  @attr<Assistor, 'xAxisWidth'>() xAxisWidth = 300

  @attr<Assistor, 'compassRadius'>() compassRadius = 150

  @attr<Assistor, 'snapAngles'>() snapAngles = [0, 45, 90, 135, 180]
  @attr<Assistor, 'snapMaxAngle'>() snapMaxAngle = 1

  @attr<Assistor, 'showCompass'>() showCompass = true

  @attr<Assistor, 'pixelRatio'>() pixelRatio = 1

  constructor(config = {} as AssistorConfig & Konva.ContainerConfig) {
    super(config)
    this.setAttrs(config)
  }

  snaped = false

  /**
   *           cL-------------cR
   *           |              |
   * p1(x1, y1) -------------- p2(x2,y2)
   */
  update() {
    this.render()

    const {
      startPoint,
      endPoint,
      stroke,
      strokeWidth,
      crossRadius,
      xAxisWidth,
      compassRadius,
      rulerOffset,
      snapAngles,
      snapMaxAngle,
      showCompass,
      pixelRatio = 1,
    } = this

    this.compass.setAttrs({
      startPoint,
      endPoint,
      stroke,
      strokeWidth,
      compassRadius,
      xAxisWidth,
      snapAngles,
      snapMaxAngle,
      crossRadius,
      visible: showCompass,
    })

    this.snaped = this.compass.snaped
    const snapedEndPoint = this.compass.endPoint
    this.ruler.setAttrs({
      startPoint,
      endPoint: snapedEndPoint,
      stroke,
      strokeWidth,
      crossRadius,
      rulerOffset,
      pixelRatio,
    })
    if (this.snaped) {
      this.endPoint = snapedEndPoint
    }
  }

  render() {
    if (this.children?.length) {
      return null
    }
    this.compass = new Compass()
    this.ruler = new Ruler()
    return [this.compass, this.ruler]
  }
}
