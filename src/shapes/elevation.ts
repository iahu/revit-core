import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Line } from 'konva/lib/shapes/Line'
import { IRect, Vector2d } from 'konva/lib/types'
import { hitStrokeWidth } from '../config'
import { FlagLabel } from './flag-label'
import { fireChangeEvent } from './helper'
import { Level } from './level'
import { attr, ChangedProp, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'
import { SnapButton } from './snap-button'

export interface ElevationOptions {
  flagWidth?: number
  flagHeight?: number
  title?: string
  label?: string
  resizable?: boolean
  dotRadius?: number
}

export class Elevation extends Resizable implements Observed {
  @attr<Elevation, 'flagWidth'>() flagWidth = 80
  @attr<Elevation, 'flagHeight'>() flagHeight = 10
  @attr<Elevation, 'title'>() title: string | undefined
  @attr<Elevation, 'label'>() label: string | undefined
  @attr<Elevation, 'resizable'>() resizable = true
  @attr<Elevation, 'dotRadius'>() dotRadius = 3

  $bgLine = new Line({ name: 'elevation-line unselectable', hitStrokeWidth })
  $level = new Level({ name: 'elevation-level unselectable', hitStrokeWidth })
  $flagLabel = new FlagLabel({ name: 'elevation-label' })

  $startDot = new SnapButton({
    name: 'elevation-level-start-dot',
    radius: this.dotRadius,
    lockY: true,
    hitStrokeWidth,
    resizeAttrs: ['x', 'width'],
  })
  $endDot = new SnapButton({
    name: 'elevation-level-end-dot',
    radius: this.dotRadius,
    lockY: true,
    hitStrokeWidth,
    resizeAttrs: ['x', 'width'],
  })

  constructor(options: ElevationOptions & ContainerConfig) {
    super(options)

    this.setAttrs(options)

    this.on('resize', this.onResize)
  }

  onResize = (e: KonvaEventObject<Event>) => {
    const { originalValue, target, movementX } = e as ResizeEvent<Vector2d>
    const { x, width } = originalValue as IRect
    if (target === this.$startDot) {
      target.setPosition({ x: 0, y: 0 })
      this.setAttrs({ x: x + movementX, width: width - movementX })
    } else if (target === this.$endDot) {
      target.setPosition({ x: x + movementX, y: 0 })
      this.width(width + movementX)
    }
  }

  propDidUpdate(prop: ChangedProp) {
    if (prop.key === 'name') {
      fireChangeEvent(this, 'name', prop)
    }
  }

  update() {
    const { flagWidth, flagHeight, title = '标高', label = '±0.00', resizable, highlighted } = this
    const { width, stroke, strokeWidth } = this.getAttrs()

    this.$bgLine.setAttrs({ points: [0, 0, width, 0] })
    this.$level.setAttrs({ endPoint: [width, 0], stroke, strokeWidth })
    this.$flagLabel.setAttrs({ x: width, width: flagWidth, height: flagHeight, stroke, strokeWidth, title, label })
    this.$startDot.setAttrs({ x: 0, stroke, strokeWidth, visible: highlighted, draggable: resizable })
    this.$endDot.setAttrs({ x: width, stroke, strokeWidth, visible: highlighted, draggable: resizable })
  }

  render() {
    return [this.$bgLine, this.$level, this.$flagLabel, this.$startDot, this.$endDot]
  }
}
