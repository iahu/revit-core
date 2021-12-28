import { Maybe } from '@actions/helper'
import { ContainerConfig } from 'konva/lib/Container'
import { Circle } from 'konva/lib/shapes/Circle'
import { Vector2d } from 'konva/lib/types'
import Kroup from './kroup'
import { ChangedProp, observer } from './observer'

export interface ResizeHandlerOptions {
  stroke?: string
  fill?: string | CanvasGradient
  strokeWidth?: number
  radius?: number
  lockX?: boolean
  lockY?: boolean
}

export class ResizeHandler extends Kroup {
  @observer<ResizeHandler, 'stroke'>() stroke: string
  @observer<ResizeHandler, 'fill'>() fill: string | CanvasGradient
  @observer<ResizeHandler, 'strokeWidth'>() strokeWidth: number
  @observer<ResizeHandler, 'radius'>() radius = 4
  @observer<ResizeHandler, 'lockX'>() lockX = false
  @observer<ResizeHandler, 'lockY'>() lockY = false

  startPoint: Maybe<Vector2d>
  endPoint: Maybe<Vector2d>

  get deltaX() {
    if (this.startPoint && this.endPoint) {
      return this.endPoint?.x - this.startPoint?.x
    }
    return NaN
  }

  get deltaY() {
    if (this.startPoint && this.endPoint) {
      return this.endPoint?.y - this.startPoint?.y
    }
    return NaN
  }

  constructor(options: ResizeHandlerOptions & ContainerConfig) {
    super({ draggable: true, ...options })

    this.setAttrs(options)
    this.on('dragstart', this.onDragStart)
    this.on('dragmove', this.onDragMove)
    this.on('dragend', this.onDragEnd)
  }

  onDragStart() {
    this.startPoint = this.getPosition()
    this.fire('resizeStart', { ...new Event('resizeStart'), target: this, currentTarget: this }, true)
  }

  onDragMove() {
    const { lockX, lockY } = this
    const { x, y } = this.startPoint as Vector2d
    const endPoint = this.getPosition()
    this.endPoint = { x: lockX ? x : endPoint.x, y: lockY ? y : endPoint.y }

    this.setAttrs(this.endPoint)
    this.fire('resize', { ...new Event('resize'), target: this, currentTarget: this }, true)
  }

  onDragEnd() {
    this.fire('resizeEnd', { ...new Event('resizeEnd'), target: this, currentTarget: this }, true)
  }

  $dot = new Circle({ name: 'resize-handler' })

  propDidUpdate(prop: ChangedProp) {
    if (['radius', 'stroke', 'strokeWidth', 'fill'].includes(prop.key)) {
      const { radius, stroke, strokeWidth, fill = '#ffffffff' } = this
      this.$dot.setAttrs({ fill, radius, stroke, strokeWidth })
    }
  }

  render() {
    return [this.$dot]
  }
}
