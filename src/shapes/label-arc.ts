import Konva from 'konva'
import { toDeg180, toDeg360 } from './helper'
import Komponent from './komponent'
import { attr, Observed } from './observer'
import { ArrayVector } from './vector'

export interface LabelArcOptions {
  stroke?: string
  strokeWidth?: number
  centerPoint?: number[]
  startPoint?: number[]
  endPoint?: number[]
  radius?: number
}

export class LabelArc extends Komponent implements Observed, LabelArcOptions {
  @attr<LabelArc, 'stroke'>() stroke = '#3399ff'
  @attr<LabelArc, 'strokeWidth'>() strokeWidth = 1

  @attr<LabelArc, 'centerPoint'>() centerPoint = [0, 0] as number[]
  @attr<LabelArc, 'startPoint'>() startPoint: number[]
  @attr<LabelArc, 'endPoint'>() endPoint: number[]

  @attr<LabelArc, 'radius'>() radius = 20

  readonly $arc = new Konva.Arc({
    name: 'label-arc-arc',
    angle: 0,
    innerRadius: this.radius,
    outerRadius: this.radius,
    stroke: '#0099ff',
    strokeWidth: 1,
  })
  readonly $label = new Konva.Text({ name: 'label-arc-label', fontSize: 10 })

  update() {
    const { stroke, strokeWidth, centerPoint, startPoint, endPoint, radius: innerRadius } = this

    if (centerPoint && startPoint && endPoint) {
      const startScalar = ArrayVector.subtract(startPoint, centerPoint)
      const endScalar = ArrayVector.subtract(endPoint, centerPoint)
      const centerScalar = centerPoint

      // Matrix of startPoint
      const startTr = new Konva.Transform([...startScalar, ...endScalar, ...centerScalar])
      const { rotation: startRotation } = startTr.decompose()
      // Matrix of endPoint
      const endTr = new Konva.Transform([...endScalar, ...startScalar, ...centerScalar])
      const [x, y] = centerPoint
      const { rotation: endRotation } = endTr.decompose()

      // angle between startPoint and endPont
      const angle = endRotation - startRotation

      const deg360 = toDeg360(angle)
      const deg180 = toDeg180(angle)
      let offsetY = -4 - innerRadius
      // 起始向量之合力向量的角度，即起始线段夹角的一半角度
      const joinAngle = startRotation + deg360 / 2
      // 合力向量的切线角度
      let tangentAngle = joinAngle - 90
      const labelHeight = this.$label.height()

      /**
       * 保证文字不上下翻转
       */
      if (joinAngle > 180) {
        tangentAngle += 180 // 翻转 180 度
        offsetY = labelHeight - offsetY // 翻转 Y 轴偏移量并加上自身高度
      }
      // 文字跟随渲染到锐角方向
      if (startRotation > 0 && deg360 > 180) {
        offsetY = labelHeight - offsetY
      }

      this.$arc.setAttrs({
        x,
        y,
        angle,
        innerRadius,
        outerRadius: innerRadius,
        stroke,
        strokeWidth,
        rotation: startRotation,
        clockwise: deg360 > 180,
      })

      this.$label.setAttrs({
        x,
        y,
        offsetX: this.$label.width() / 2,
        offsetY,
        fill: stroke,
        scaleY: 1,
        text: Math.abs(deg180).toFixed(2),
        rotation: tangentAngle,
      })
    }
  }

  render() {
    return [this.$arc, this.$label]
  }
}
