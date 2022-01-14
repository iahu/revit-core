import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Circle } from 'konva/lib/shapes/Circle'
import { Line } from 'konva/lib/shapes/Line'
import { Vector2d } from 'konva/lib/types'
import { asc } from './helper'
import { attr, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'
import { SnapButton } from './snap-button'

export interface SegmentOptions {
  /**
   * @todo lineStyle
   * lineStyle?: LineStyle
   */

  /** 可进行线段连接 */
  joinable?: boolean
  startPoint?: number[]
  endPoint?: number[]
  dotRadius?: number
  lockStartPoint?: boolean
  lockEndPoint?: boolean

  /**
   * 设置移动距离范围
   *
   * number[] 使用是自定义范围
   * boolean  使用起始点的值
   */
  limitX?: number[] | boolean
  limitY?: number[] | boolean

  lockX?: boolean
  lockY?: boolean
}

export class Segment extends Resizable implements Observed, SegmentOptions {
  @attr() joinable = true
  @attr() startPoint = [0, 0]
  @attr() endPoint = [0, 0]
  @attr() dotRadius = 3
  @attr() lockStartPoint = false
  @attr() lockEndPoint = false
  @attr() limitX = false
  @attr() limitY = false
  @attr() lockX = false
  @attr() lockY = false

  /**
   * @todo implements detected property
   */
  get detected(): boolean {
    return false
  }

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
      highlighted,
    } = this
    return Math.abs(x2 - x1) + Number(highlighted) * 2 * dotRadius
  }

  getHeight() {
    const { startPoint, endPoint, dotRadius, highlighted } = this
    return Math.abs(endPoint[1] - startPoint[1]) + Number(highlighted) * 2 * dotRadius
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

  constructor(options?: SegmentOptions & ContainerConfig) {
    super(options)
    this.setAttrs({ draggable: true, ...options })

    this.on('resize', this.onResize)
  }

  onResize(e: KonvaEventObject<Event>) {
    const { originalValue = {}, target, movementX, movementY } = e as ResizeEvent<Record<string, number[]>>
    const { lockX, lockY } = this
    const mx = movementX * Number(!lockX)
    const my = movementY * Number(!lockY)

    if (target === this.$startDot) {
      const startPoint = originalValue.startPoint
      this.startPoint = [startPoint[0] + mx, startPoint[1] + my]
    } else if (target === this.$endDot) {
      const endPoint = originalValue.endPoint
      this.endPoint = [endPoint[0] + mx, endPoint[1] + my]
    } else if (target === this) {
      // 自身移动
      const { x, y } = originalValue as unknown as Vector2d
      this.position({ x: x + mx, y: y + my })
    }
  }

  $line = new Line({ name: 'nock-line unselectable', hitStrokeWidth: 3 })
  $startDot = new SnapButton({ name: 'nock-line start-dot', hitStrokeWidth: 3, resizeAttrs: ['startPoint'] })
  $endDot = new SnapButton({ name: 'nock-line end-dot', hitStrokeWidth: 3, resizeAttrs: ['endPoint'] })

  update() {
    const {
      stroke,
      strokeWidth,
      startPoint,
      endPoint,
      startPoint: [x1, y1],
      endPoint: [x2, y2],
      dotRadius: radius,
      resizable: draggable,
      lockStartPoint,
      lockEndPoint,
      selected,
      highlighted,
      hitStrokeWidth,
    } = this.getAttrs()

    const interaction = selected || highlighted
    this.$line.setAttrs({ hitStrokeWidth, stroke, strokeWidth, points: [...startPoint, ...endPoint] })
    this.$startDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: x1,
      y: y1,
      draggable,
      visible: !lockStartPoint && interaction,
    })
    this.$endDot.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: x2,
      y: y2,
      draggable,
      visible: !lockEndPoint && interaction,
    })
  }

  render() {
    this.update()
    return [this.$line, this.$startDot, this.$endDot]
  }
}
