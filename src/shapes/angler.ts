import { point2Vector } from '@actions/helper'
import { Circle } from 'konva/lib/shapes/Circle'
import { AuxLine } from './aux-line'
import Komponent from './komponent'
import { LabelArc } from './label-arc'
import { attr, Observed } from './observer'

export interface AnglerOptions {
  stroke?: string
  strokeWidth?: number
  centerPoint?: number[]
  startPoint?: number[]
  endPoint?: number[]
  centerCircleVisible?: boolean
  centerCircleRadius?: number
  auxLineMaxWidth?: number
}

export class Angler extends Komponent implements Observed, AnglerOptions {
  @attr<Angler, 'stroke'>() stroke = '#0099ff'
  @attr<Angler, 'strokeWidth'>() strokeWidth = 1

  @attr<Angler, 'startPoint'>() startPoint: number[]
  @attr<Angler, 'centerPoint'>() centerPoint: number[]
  @attr<Angler, 'endPoint'>() endPoint: number[]
  @attr<Angler, 'centerCircleVisible'>() centerCircleVisible: boolean
  @attr<Angler, 'centerCircleRadius'>() centerCircleRadius: number
  @attr<Angler, 'auxLineMaxWidth'>() auxLineMaxWidth: number | undefined

  /**
   * create elements
   */
  readonly startAux = new AuxLine({ name: 'angelr-start-line' })
  readonly endAux = new AuxLine({ name: 'angler-end-line' })
  readonly labelArc = new LabelArc({ name: 'angler-label' })
  readonly centerCircle = new Circle({ name: 'angler-center-circle' })

  get angle() {
    return this.labelArc.$arc.angle()
  }

  update() {
    const {
      stroke,
      strokeWidth,
      centerPoint,
      startPoint,
      endPoint,
      centerCircleVisible = true,
      centerCircleRadius = 4,
      auxLineMaxWidth: maxWidth = 500,
    } = this

    if (centerPoint && startPoint) {
      this.startAux.setAttrs({
        startPoint: centerPoint,
        endPoint: startPoint,
        stroke,
        strokeWidth,
        maxWidth,
      })
    }
    if (centerPoint && endPoint) {
      this.endAux.setAttrs({
        startPoint: centerPoint,
        endPoint: endPoint,
        stroke,
        strokeWidth,
        maxWidth,
      })
    }
    if (centerPoint && startPoint && endPoint) {
      this.labelArc.setAttrs({ stroke, centerPoint, startPoint, endPoint })
    }

    if (centerPoint) {
      this.centerCircle.setAttrs({
        ...point2Vector(centerPoint),
        stroke,
        strokeWidth,
        visible: centerCircleVisible,
        radius: centerCircleRadius,
      })
    }
  }

  render() {
    return [this.startAux, this.endAux, this.labelArc, this.centerCircle]
  }
}
