import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Line } from 'konva/lib/shapes/Line'
import { hitStrokeWidth } from '../config'
import { asc, clamp } from './helper'
import { attr, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'
import { SnapButton } from './snap-button'

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
  followerPoint?: 'start' | 'end' | 'startX' | 'startY' | 'endX' | 'endY'

  /**
   * 设置弯折点在超始点范围内移动
   *
   * number[] 使用是自定义范围
   * boolean  使用起始点的值
   */
  limitX?: number[] | boolean
  limitY?: number[] | boolean
}

export class Nock extends Resizable implements Observed, NockOptions {
  @attr() startPoint = [0, 0]
  @attr() endPoint = [0, 0]
  @attr() nockPoint = [0, 0]
  @attr() dotRadius = 3
  @attr() lockStartPoint = false
  @attr() lockEndPoint = false
  @attr() followerPoint: undefined | NockOptions['followerPoint']
  @attr() limitX = false
  @attr() limitY = false

  get computedLimitX(): number[] {
    if (Array.isArray(this.limitX)) {
      return this.limitX
    }
    if (this.limitY) {
      return [this.startPoint[0], this.endPoint[0]].sort(asc)
    }
    return [-Infinity, Infinity]
  }

  get computedLimitY(): number[] {
    if (Array.isArray(this.limitY)) {
      return this.limitY
    }
    if (this.limitY) {
      return [this.startPoint[1], this.endPoint[1]].sort(asc)
    }
    return [-Infinity, Infinity]
  }

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
   * 跟随点与弯折点所在线段的角度
   */
  followerAngle: number | undefined

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
    const { originalValue = {}, target, movementX, movementY } = e as ResizeEvent<Record<string, number[]>>
    if (target === this.$startDot) {
      const startPoint = originalValue.startPoint
      this.startPoint = [startPoint[0] + movementX, startPoint[1] + movementY]
    } else if (target === this.$nockDot) {
      const { nockPoint, startPoint, endPoint } = originalValue
      const point = [nockPoint[0] + movementX, nockPoint[1] + movementY]
      if (this.limitX) {
        const [min, max] = this.computedLimitX
        point[0] = clamp(min, max, point[0])
      }
      if (this.limitY) {
        const [min, max] = this.computedLimitY
        point[1] = clamp(min, max, point[1])
      }
      this.nockPoint = point
      const { followerPoint = '' } = this
      const followStartX = ['start', 'startX'].includes(followerPoint)
      const followStartY = ['start', 'startY'].includes(followerPoint)
      const followEndX = ['start', 'endX'].includes(followerPoint)
      const followEndY = ['start', 'endY'].includes(followerPoint)
      this.startPoint = [startPoint[0] + movementX * +followStartX, startPoint[1] + movementY * +followStartY]
      this.endPoint = [endPoint[0] + movementX * +followEndX, endPoint[1] + movementY * +followEndY]
    } else if (target === this.$endDot) {
      const endPoint = originalValue.endPoint
      this.endPoint = [endPoint[0] + movementX, endPoint[1] + movementY]
    }
  }

  $line = new Line({ name: 'nock-line unselectable', hitStrokeWidth })
  $startDot = new SnapButton({
    name: 'nock-line start-dot',
    hitStrokeWidth,
    resizeAttrs: ['startPoint'],
    ghost: false,
  })
  $nockDot = new SnapButton({
    name: 'nock-line nock-dot',
    hitStrokeWidth,
    resizeAttrs: ['startPoint', 'endPoint', 'nockPoint'],
    ghost: false,
  })
  $endDot = new SnapButton({ name: 'nock-line end-dot', hitStrokeWidth, resizeAttrs: ['endPoint'], ghost: false })

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
      hitStrokeWidth,
    } = this.getAttrs()

    this.$line.setAttrs({ stroke, strokeWidth, hitStrokeWidth, points: [...startPoint, ...nockPoint, ...endPoint] })
    this.$startDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: x1,
      y: y1,
      draggable,
      visible: !lockStartPoint && !['start', 'startX', 'startY'].includes(followerPoint),
    })
    this.$nockDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: nockPoint[0],
      y: nockPoint[1],
      draggable,
      visible: true,
    })
    this.$endDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: x2,
      y: y2,
      draggable,
      visible: !lockEndPoint && !['end', 'endX', 'endY'].includes(followerPoint),
    })
  }

  render() {
    this.update()
    return [this.$line, this.$startDot, this.$nockDot, this.$endDot]
  }
}
