import { point2Vector } from '@actions/helper'
import { query } from '@api/query'
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Line } from 'konva/lib/shapes/Line'
import { Vector2d } from 'konva/lib/types'
import { hitStrokeWidth } from '../config'
import { asc } from './helper'
import Komponent from './komponent'
import { attr, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'
import { SnapButton } from './snap-button'
import { Vector } from './vector'

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
    } = this
    return Math.abs(x2 - x1) + dotRadius * 2
  }

  getHeight() {
    const { startPoint, endPoint, dotRadius } = this
    return Math.abs(endPoint[1] - startPoint[1]) + dotRadius * 2
  }

  getSelfRect() {
    return {
      x: Math.min(this.startPoint[0], this.endPoint[0]),
      y: Math.min(this.startPoint[1], this.endPoint[1]),
      width: this.getWidth(),
      height: this.getHeight(),
    }
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
    this.setAttrs(options)

    this.on('resizeStart', this.onResizeStart)
    this.on('resize', this.onResize)
  }

  get siblings() {
    const stage = this.getStage()
    if (stage) {
      return query<Segment>(stage, 'Segment')
    }
    return []
  }

  private connectedSegments = [] as Segment[]

  onResizeStart(e: KonvaEventObject<Event>) {
    const { target } = e

    if (target instanceof SnapButton) {
      const index = target.parent?.index
      const otherNodes = this.siblings.filter(n => n.index !== index)
      const { x, y } = target.getAbsolutePosition()
      const v = new Vector(x, y)
      this.connectedSegments = otherNodes.filter(node => {
        return v.equals(node.$startBtn.getAbsolutePosition()) || v.equals(node.$endBtn.getAbsolutePosition())
      })
    }
  }

  onResize(e: KonvaEventObject<Event>) {
    const { originalValue = {}, target, movementX, movementY } = e as ResizeEvent<Record<string, number[]>>
    const { lockX, lockY } = this
    const mx = movementX * Number(!lockX)
    const my = movementY * Number(!lockY)

    if (target === this.$startBtn) {
      const startPoint = originalValue.startPoint
      this.startPoint = [startPoint[0] + mx, startPoint[1] + my]
    } else if (target === this.$endBtn) {
      const endPoint = originalValue.endPoint
      this.endPoint = [endPoint[0] + mx, endPoint[1] + my]
    }

    if (target instanceof SnapButton) {
      const { startX, startY, movementX, movementY } = e as ResizeEvent
      this.connectedSegments.forEach(node => {
        node.setAbsolutePosition({ x: startX + movementX, y: startY + movementY })
      })
    } else if (target === this.$line) {
      const { x, y } = originalValue as unknown as Vector2d
      const pos = { x: x + mx, y: y + my }
      this.setAbsolutePosition(pos)
      target.setAbsolutePosition(pos)
    }
  }

  $line = new Line({ name: 'nock-line unselectable', hitStrokeWidth, draggable: true, resizeAttrs: 'absolutePosition' })
  $startBtn = new SnapButton({ name: 'nock-line start-btn unselectable', hitStrokeWidth, resizeAttrs: ['startPoint'] })
  $endBtn = new SnapButton({ name: 'nock-line end-btn unselectable', hitStrokeWidth, resizeAttrs: ['endPoint'] })

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
    this.$startBtn.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: x1,
      y: y1,
      draggable,
      visible: !lockStartPoint && interaction,
    })
    this.$endBtn.setAttrs({
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
    return [this.$line, this.$startBtn, this.$endBtn]
  }
}
