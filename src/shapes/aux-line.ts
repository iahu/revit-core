import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { Vector2d } from 'konva/lib/types'
import { vector2Point } from '../actions/helper'
import Kroup from './kroup'
import { attr } from './observer'

export interface AuxLineOptions {
  stroke?: string
  strokeWidth?: number
  dash?: number[]
  startPoint?: Vector2d
  endPoint?: Vector2d
  label?: string
  labelOffset?: number
  direction?: 'x' | 'y'
  maxWidth?: number
}

const defaultPoint = { x: 0, y: 0 }

export class AuxLine extends Kroup implements AuxLineOptions {
  @attr<AuxLine, 'stroke'>() stroke = '#3399ff'
  @attr<AuxLine, 'strokeWidth'>() strokeWidth = 1
  @attr<AuxLine, 'dash'>() dash = [3, 3]
  @attr<AuxLine, 'startPoint'>() startPoint = defaultPoint
  @attr<AuxLine, 'endPoint'>() endPoint = defaultPoint
  @attr<AuxLine, 'label'>() label = ''
  @attr<AuxLine, 'labelOffset'>() labelOffset = 6
  @attr<AuxLine, 'direction'>() direction = 'x' as const
  @attr<AuxLine, 'maxWidth'>() maxWidth: number | undefined

  constructor(options = {} as AuxLineOptions & ContainerConfig) {
    super(options)

    this.setAttrs(options)
  }

  update() {
    const { stroke, strokeWidth, startPoint, endPoint, label, labelOffset, maxWidth } = this
    const tr = new Konva.Transform([
      endPoint.x - startPoint.x,
      endPoint.y - startPoint.y,
      0,
      1,
      startPoint.x,
      startPoint.y,
    ])
    const attrs = tr.decompose()
    const { scaleX, rotation } = attrs
    const maxScaleX = maxWidth && maxWidth >= 0 ? Math.min(maxWidth, scaleX) : scaleX

    this.line.setAttrs({
      x: startPoint.x,
      y: startPoint.y,
      stroke,
      strokeWidth,
      dash: this.dash,
      points: [0, 0, maxScaleX, 0],
      rotation,
    })

    if (label) {
      this.text.setAttrs({
        x: startPoint.x,
        y: startPoint.y,
        offsetY: -labelOffset,
        text: label ?? Math.abs(rotation).toFixed(2),
        width: Math.max(40, maxScaleX),
        fill: stroke,
        rotation,
      })

      if (Math.abs(rotation) > 90) {
        this.text.setAttrs({ offsetX: maxScaleX, rotation: rotation - 180 })
      } else {
        this.text.setAttrs({ offsetX: 0, rotation: rotation })
      }
    }
  }

  line: Konva.Line
  text: Konva.Text

  render() {
    const { stroke, strokeWidth, startPoint, endPoint } = this
    const points = vector2Point(startPoint).concat(vector2Point(endPoint))
    this.line = new Konva.Line({
      name: 'unselectable',
      stroke,
      strokeWidth,
      dash: this.dash,
      points,
    })
    this.text = new Konva.Text({
      name: 'unselectable',
      x: points[0],
      y: points[1],
      fontSize: 12,
      text: '',
      fill: stroke,
      align: 'center',
    })

    return [this.line, this.text]
  }
}
