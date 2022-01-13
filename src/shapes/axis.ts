import { isString } from '@actions/helper'
import { hitStrokeWidth } from '../config'
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Circle } from 'konva/lib/shapes/Circle'
import { DEG_TO_RAD } from './helper'
import { Level } from './level'
import { attr, ChangedProp, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'
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
  @attr() anchorRadius = 4
  @attr() startPointLabel: string | undefined
  @attr() endPointLabel: string | undefined
  @attr() resizable = true
  @attr() keepDirection = true

  getWidth() {
    const {
      labelRadius,
      startPoint: [x1, y1],
      endPoint: [x2, y2],
    } = this
    const { rotation, scaleX } = new Konva.Transform([x2 - x1, y2 - y1, 0, 0, 0, 0]).decompose()
    // 斜线宽 + 两个外接圆的宽(圆心边线宽 + 2 * R)
    return (2 * labelRadius + scaleX) * Math.cos(rotation * DEG_TO_RAD) + 2 * labelRadius
  }

  getHeight() {
    const {
      labelRadius,
      startPoint: [x1, y1],
      endPoint: [x2, y2],
    } = this
    const { rotation, scaleX } = new Konva.Transform([x2 - x1, y2 - y1, 0, 0, 0, 0]).decompose()
    // 斜线高 + 两个外接圆的高(圆心连线高 + 2 * R)
    return (2 * labelRadius + scaleX) * Math.sin(rotation * DEG_TO_RAD) + 2 * labelRadius
  }

  getClientRect() {
    const {
      labelRadius,
      startPoint: [x1, y1],
      endPoint: [x2, y2],
    } = this
    const { rotation } = new Konva.Transform([x2 - x1, y2 - y1, 0, 0, 0, 0]).decompose()
    const sPos = this.$startLabel.getAbsolutePosition()
    const ePos = this.$startLabel.getAbsolutePosition()
    const pos = { x: Math.min(sPos.x, ePos.x), y: Math.min(sPos.y, ePos.y) }

    return {
      x: pos.x - 2 * labelRadius * Math.cos(rotation * DEG_TO_RAD),
      y: pos.y - 2 * labelRadius * Math.sin(rotation * DEG_TO_RAD),
      width: this.getWidth(),
      height: this.getHeight(),
    }
  }

  constructor(options: AxisOptions & ContainerConfig) {
    super(options)
    this.setAttrs(options)

    this.on('textChange', this.onTextChange)

    this.on('resize', e => {
      const { originalValue = [0, 0], target, movementX, movementY } = e as ResizeEvent<number[]>
      if (target === this.$startAnchor) {
        this.startPoint = [originalValue[0] + movementX, originalValue[1] + movementY]
      } else if (target === this.$endAnchor) {
        this.endPoint = [originalValue[0] + movementX, originalValue[1] + movementY]
      }
    })
  }

  $level = new Level({ name: 'axis-level unselectable' })
  $startLabel = new TextCircle({ name: 'axis-label start-label unselectable' })
  $endLabel = new TextCircle({ name: 'axis-label end-label unselectable' })
  $startAnchor = new Circle({
    name: 'axis-anchor start-anchor unselectable',
    resizeAttrs: 'startPoint',
    hitStrokeWidth,
  })
  $endAnchor = new Circle({ name: 'axis-anchor end-anchor unselectable', resizeAttrs: 'endPoint', hitStrokeWidth })

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
    return [this.$level, this.$startLabel, this.$endLabel, this.$startAnchor, this.$endAnchor]
  }
}
