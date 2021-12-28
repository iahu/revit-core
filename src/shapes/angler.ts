import { Circle } from 'konva/lib/shapes/Circle'
import { Vector2d } from 'konva/lib/types'
import { AuxLine } from './aux-line'
import Kroup from './kroup'
import { LabelArc } from './label-arc'
import { Observed, observer } from './observer'

export interface AnglerOptions {
  stroke?: string
  strokeWidth?: number
  centerPoint?: Vector2d
  startPoint?: Vector2d
  endPoint?: Vector2d
  centerCircleVisible?: boolean
  centerCircleRadius?: number
  auxLineMaxWidth?: number
}

export class Angler extends Kroup implements Observed, AnglerOptions {
  @observer<Angler, 'stroke'>() stroke = '#0099ff'
  @observer<Angler, 'strokeWidth'>() strokeWidth = 1

  @observer<Angler, 'centerPoint'>() centerPoint: Vector2d
  @observer<Angler, 'startPoint'>() startPoint: Vector2d
  @observer<Angler, 'endPoint'>() endPoint: Vector2d
  @observer<Angler, 'centerCircleVisible'>() centerCircleVisible: boolean
  @observer<Angler, 'centerCircleRadius'>() centerCircleRadius: number
  @observer<Angler, 'auxLineMaxWidth'>() auxLineMaxWidth: number | undefined

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
      this.labelArc.setAttrs({ fill: stroke, centerPoint, startPoint, endPoint })
    }

    if (centerPoint) {
      this.centerCircle.setAttrs({
        x: centerPoint.x,
        y: centerPoint.y,
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
