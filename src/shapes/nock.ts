import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Circle } from 'konva/lib/shapes/Circle'
import { Line } from 'konva/lib/shapes/Line'
import { attr, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'

export interface NockOptions {
  startPoint?: number[]
  endPoint?: number[]
  nockPoint?: number[]
  dotRadius?: number
  lockStartPoint?: boolean
  lockEndPoint?: boolean
  /**
   * 跟随弯头变换的点
   */
  followerPoint?: 'start' | 'end'
  /**
   * 复原直线（三点一线）与 x 轴的夹角
   * 比如：90 表示直线与 x 轴垂直
   */
  altitude?: number
}

export class Nock extends Resizable implements Observed, NockOptions {
  @attr() startPoint = [0, 0]
  @attr() endPoint = [0, 0]
  @attr() nockPoint = [0, 0]
  @attr() dotRadius = 3
  @attr() lockStartPoint = false
  @attr() lockEndPoint = false
  @attr() followerPoint: undefined | NockOptions['followerPoint']
  @attr() altitude = 0

  getWidth() {
    const {
      startPoint: [x1],
      endPoint: [x2],
      dotRadius,
    } = this
    return Math.max(Math.abs(x2 - x1), dotRadius)
  }

  getHeight() {
    return Math.max(Math.abs(this.endPoint[1] - this.startPoint[1]), this.dotRadius)
  }

  /**
   * 起始点连线的角度
   */
  get joinAngle(): number {
    const {
      startPoint: [x1, y1],
      endPoint: [x2, y2],
    } = this
    const tr = new Konva.Transform([x2 - x1, y1 - y2, 0, 0, x1, y1])
    return tr.decompose().rotation
  }

  get isStraight(): boolean {
    const {
      startPoint: [x1, y1],
      endPoint: [x2, y2],
      nockPoint: [x3, y3],
    } = this
    return (y3 - y1) * (x2 - x1) === (y2 - y1) * (x3 - x1)
  }

  constructor(options?: NockOptions & ContainerConfig) {
    super(options)
    this.setAttrs(options)

    this.on('resize', this.onResize)
  }

  onResize = (e: KonvaEventObject<Event>) => {
    const { originalValue = [0, 0], target, resizeX, resizeY } = e as ResizeEvent<number[]>
    const point = [originalValue[0] + resizeX, originalValue[1] + resizeY]
    if (target === this.$startDot) {
      this.startPoint = point
    } else if (target === this.$nockDot) {
      this.nockPoint = point
      /**
       * @todo follower point
       */
    } else if (target === this.$endDot) {
      this.endPoint = point
    }
  }

  $line = new Line({ name: 'nock-line unselectable', hitStrokeWidth: 3 })
  $startDot = new Circle({ name: 'nock-line start-dot', hitStrokeWidth: 3 })
  $nockDot = new Circle({ name: 'nock-line nock-dot', hitStrokeWidth: 3 })
  $endDot = new Circle({ name: 'nock-line end-dot', hitStrokeWidth: 3 })

  update() {
    const {
      stroke,
      strokeWidth,
      startPoint,
      endPoint,
      nockPoint,
      startPoint: [x1, y1],
      endPoint: [x2, y2],
      dotRadius: radius,
      resizable: draggable,
      lockStartPoint,
      lockEndPoint,
      followerPoint,
    } = this.getAttrs()

    this.$line.setAttrs({ stroke, strokeWidth, points: [...startPoint, ...nockPoint, ...endPoint] })
    this.$startDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: startPoint[0],
      y: startPoint[1],
      resizeAttrs: 'startPoint',
      draggable,
      visible: !lockStartPoint && followerPoint !== 'start',
    })
    this.$nockDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: nockPoint[0],
      y: nockPoint[1],
      resizeAttrs: 'nockPoint',
      draggable,
    })
    this.$endDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: endPoint[0],
      y: endPoint[1],
      resizeAttrs: 'endPoint',
      draggable,
      visible: !lockEndPoint && followerPoint !== 'end',
    })
  }

  render() {
    this.update()
    return [this.$line, this.$startDot, this.$nockDot, this.$endDot]
  }
}
