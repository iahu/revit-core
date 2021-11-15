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
}

export class Angler extends Kroup implements Observed, AnglerOptions {
  @observer<Angler, 'stroke'>() stroke = '#0099ff'
  @observer<Angler, 'strokeWidth'>() strokeWidth = 1

  @observer<Angler, 'centerPoint'>() centerPoint: Vector2d
  @observer<Angler, 'startPoint'>() startPoint: Vector2d
  @observer<Angler, 'endPoint'>() endPoint: Vector2d

  /**
   * create elements
   */
  readonly startAux = new AuxLine({ name: 'angelr-start-line' })
  readonly endAux = new AuxLine({ name: 'angler-end-line' })
  readonly labelArc = new LabelArc({ name: 'angler-label' })

  update() {
    const { stroke, strokeWidth, centerPoint, startPoint, endPoint } = this

    if (centerPoint && startPoint) {
      this.startAux.setAttrs({
        startPoint: centerPoint,
        endPoint: startPoint,
        stroke,
        strokeWidth,
      })
    }
    if (centerPoint && endPoint) {
      this.endAux.setAttrs({
        startPoint: centerPoint,
        endPoint: endPoint,
        stroke,
        strokeWidth,
      })
    }
    if (centerPoint && startPoint && endPoint) {
      this.labelArc.setAttrs({ fill: stroke, centerPoint, startPoint, endPoint })
    }
  }

  render() {
    return [this.startAux, this.endAux, this.labelArc]
  }
}
