import Konva from 'konva'
import { Vector2d } from 'konva/lib/types'
import { vector2Point } from '../actions/helper'
import { getScalar } from './helper'
import Kroup from './kroup'
import { Observed, observer } from './observer'

export interface LabelArcOptions {
  stroke?: string
  strokeWidth?: number
  centerPoint?: Vector2d
  startPoint?: Vector2d
  endPoint?: Vector2d
  radius?: number
}

export class LabelArc extends Kroup implements Observed, LabelArcOptions {
  @observer<LabelArc, 'stroke'>() stroke = '#3399ff'
  @observer<LabelArc, 'strokeWidth'>() strokeWidth = 1

  @observer<LabelArc, 'centerPoint'>() centerPoint = { x: 0, y: 0 } as Vector2d
  @observer<LabelArc, 'startPoint'>() startPoint: Vector2d
  @observer<LabelArc, 'endPoint'>() endPoint: Vector2d

  @observer<LabelArc, 'radius'>() radius = 10

  readonly $arc = new Konva.Arc({
    name: 'label-arc-arc',
    angle: 0,
    innerRadius: this.radius,
    outerRadius: this.radius + this.strokeWidth,
  })
  readonly $label = new Konva.Text({ name: 'label-arc-label', fontSize: 10 })

  update() {
    const { stroke, strokeWidth, centerPoint, startPoint, endPoint, radius: innerRadius } = this

    if (centerPoint && startPoint && endPoint) {
      const startScalar = getScalar(centerPoint, startPoint)
      const endScalar = getScalar(centerPoint, endPoint)

      const startTr = new Konva.Transform(startScalar.concat(endScalar, vector2Point(centerPoint)))
      const { rotation: startRotation } = startTr.decompose()
      const endTr = new Konva.Transform(endScalar.concat(startScalar, vector2Point(centerPoint)))
      const { x, y } = centerPoint
      const { rotation: endRotation } = endTr.decompose()
      const angle = endRotation - startRotation

      this.$arc.setAttrs({
        x,
        y,
        angle,
        innerRadius,
        outerRadius: innerRadius,
        stroke,
        strokeWidth,
        rotation: startRotation,
        clockwise: angle < 0,
      })

      this.$label.setAttrs({
        x,
        y,
        offsetX: this.$label.width() / 2,
        offsetY: innerRadius + 12,
        fill: stroke,
        text: Math.abs(angle).toFixed(2),
        rotation: startRotation + angle / 2 + 90,
      })

      if (endRotation > 0) {
        this.$label.rotate(180)
        this.$label.offsetY(12)
      }
    }
  }

  render() {
    return [this.$arc, this.$label]
  }
}
