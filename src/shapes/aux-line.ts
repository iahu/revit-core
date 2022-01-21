import { point2Vector } from '@actions/helper'
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import Komponent from './komponent'
import { attr } from './observer'
import { ArrayVector } from './vector'

export interface AuxLineOptions {
  stroke?: string
  strokeWidth?: number
  dash?: number[]
  startPoint?: number[]
  endPoint?: number[]
  label?: string
  labelOffset?: number
  direction?: 'x' | 'y'
  maxWidth?: number
}

export class AuxLine extends Komponent implements AuxLineOptions {
  @attr<AuxLine, 'stroke'>() stroke = '#3399ff'
  @attr<AuxLine, 'strokeWidth'>() strokeWidth = 1
  @attr<AuxLine, 'dash'>() dash = [3, 3]
  @attr<AuxLine, 'startPoint'>() startPoint = [0, 0]
  @attr<AuxLine, 'endPoint'>() endPoint = [0, 0]
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
    const tr = new Konva.Transform([...ArrayVector.subtract(endPoint, startPoint).value, 0, 1, ...startPoint])
    const attrs = tr.decompose()
    const { scaleX, rotation } = attrs
    const maxScaleX = maxWidth && maxWidth >= 0 ? Math.min(maxWidth, scaleX) : scaleX

    this.line.setAttrs({
      ...point2Vector(startPoint),
      stroke,
      strokeWidth,
      dash: this.dash,
      points: [0, 0, maxScaleX, 0],
      rotation,
    })

    if (label) {
      this.text.setAttrs({
        ...point2Vector(startPoint),
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
    const points = [...startPoint, ...endPoint]
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
