import { isString } from '@actions/helper'
import Konva from 'konva'
import { Container, ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject, Node } from 'konva/lib/Node'
import { Line } from 'konva/lib/shapes/Line'
import { hitStrokeWidth } from '../config'
import { DEG_TO_RAD } from './helper'
import { Level } from './level'
import { attr, ChangedProp, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'
import { SnapButton } from './snap-button'
import { TextCircle } from './text-circle'

export type Point = number[]

export interface AxisOptions {
  startPoint?: Point
  endPoint?: Point

  label?: string
  labelRadius?: number
  anchorRadius?: number
  /** 设置是否显示起点标签或标签文案 */
  startPointLabel?: string | boolean
  endPointLabel?: string | boolean
  resizabel?: boolean
  /**
   * 缩放时保持方向
   */
  keepDirection?: boolean
}

export class Axis extends Resizable implements Observed, AxisOptions {
  @attr() startPoint = [0, 0]
  @attr() endPoint = [0, 0]
  @attr() label = '1'
  @attr() labelRadius = 14
  @attr() anchorRadius = 3
  @attr() startPointLabel: string | undefined
  @attr() endPointLabel: string | undefined
  @attr() resizable = true
  @attr() keepDirection = true

  constructor(options: AxisOptions & ContainerConfig) {
    super(options)
    this.setAttrs(options)

    this.on('textChange', this.onTextChange)

    this.on('resize', e => {
      const { originalValue = [0, 0], target, movementX, movementY } = e as ResizeEvent<number[]>
      const point = [originalValue[0] + movementX, originalValue[1] + movementY]
      if (target === this.$startAnchor) {
        this.startPoint = point
      } else if (target === this.$endAnchor) {
        this.endPoint = point
      }
    })
  }

  getWidth() {
    const startRect = this.$startLabel.getClientRect()
    const endRect = this.$endLabel.getClientRect()
    return Math.abs(endRect.x - startRect.x) + this.labelRadius * 2
  }

  getHeight() {
    const startRect = this.$startLabel.getClientRect()
    const endRect = this.$endLabel.getClientRect()
    return Math.abs(endRect.y - startRect.y) + this.labelRadius * 2
  }

  getClientRect(config?: {
    skipTransform?: boolean
    skipShadow?: boolean
    skipStroke?: boolean
    relativeTo?: Container<Node>
  }) {
    const { skipTransform } = config ?? {}
    const { labelRadius } = this
    const {
      startPoint: [x1, y1],
      endPoint: [x2, y2],
    } = this
    const tr = new Konva.Transform([x2 - x1, y2 - y1, 0, 0, x1, y1])
    const rad = tr.decompose().rotation * DEG_TO_RAD
    const x = skipTransform ? 0 : this.x()
    const y = skipTransform ? 0 : this.y()

    return {
      x: x + Math.min(this.startPoint[0], this.endPoint[0]) - labelRadius - Math.cos(rad) * labelRadius,
      y: y + Math.min(this.startPoint[1], this.endPoint[1]) - labelRadius - Math.sin(rad) * labelRadius,
      width: this.getWidth(),
      height: this.getHeight(),
    }
  }

  getSelfRect() {
    return this.getClientRect()
  }

  $line = new Line({ name: 'axis-line unselectable', hitStrokeWidth })
  $level = new Level({ name: 'axis-level unselectable', hitStrokeWidth })
  $startLabel = new TextCircle({ name: 'axis-label start-label unselectable' })
  $endLabel = new TextCircle({ name: 'axis-label end-label unselectable' })
  $startAnchor = new SnapButton({
    name: 'axis-anchor start-anchor unselectable',
    resizeAttrs: 'startPoint',
    hitStrokeWidth,
    resizabel: true,
  })
  $endAnchor = new SnapButton({
    name: 'axis-anchor end-anchor unselectable',
    resizeAttrs: 'endPoint',
    hitStrokeWidth,
    resizable: true,
  })

  onTextChange(e: KonvaEventObject<Event>) {
    this.label = (e as KonvaEventObject<Event> & ChangedProp).newVal
  }

  update() {
    const {
      stroke,
      strokeWidth,
      startPoint,
      endPoint,
      startPoint: [x1, y1],
      endPoint: [x2, y2],
      label,
      labelRadius: radius,
      anchorRadius,
      startPointLabel = label,
      endPointLabel = label,
      resizable,
      highlighted,
    } = this.getAttrs()

    const { rotation } = new Konva.Transform([x2 - x1, y2 - y1, 0, 0, 0, 0]).decompose()

    const rad = rotation * DEG_TO_RAD
    const offsetX = radius * Math.cos(rad)
    const offsetY = radius * Math.sin(rad)
    this.$line.setAttrs({ points: [x1, y1, x2, y2] })
    this.$level.setAttrs({ stroke, strokeWidth, startPoint, endPoint })
    this.$startLabel.setAttrs({
      stroke,
      strokeWidth,
      radius,
      x: x1,
      y: y1,
      offsetX,
      offsetY,
      text: isString(startPointLabel) ? startPointLabel : label,
      visible: !!startPointLabel,
    })
    this.$endLabel.setAttrs({
      stroke,
      strokeWidth,
      x: x2,
      y: y2,
      offsetX: -offsetX,
      offsetY: -offsetY,
      radius,
      text: isString(endPointLabel) ? endPointLabel : label,
      visible: !!endPointLabel,
    })

    this.$startAnchor.setAttrs({
      stroke,
      strokeWidth,
      x: x1,
      y: y1,
      radius: anchorRadius,
      visible: highlighted,
      draggable: resizable,
    })
    this.$endAnchor.setAttrs({
      stroke,
      strokeWidth,
      x: x2,
      y: y2,
      radius: anchorRadius,
      visible: highlighted,
      draggable: resizable,
    })
  }

  render() {
    return [this.$line, this.$level, this.$startLabel, this.$endLabel, this.$startAnchor, this.$endAnchor]
  }
}
