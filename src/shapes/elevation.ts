import { SELECTED_CLASSNAME } from '@actions/helper'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Circle } from 'konva/lib/shapes/Circle'
import { FlagLabel } from './flag-label'
import { fireChangeEvent } from './helper'
import { Level } from './level'
import { attr, ChangedProp, Observed } from './observer'
import { Resizable, ResizeEvent } from './resizable'

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
  @attr<Elevation, 'dotRadius'>() dotRadius = 4
  @attr<Elevation, 'dotVisible'>() dotVisible = false

  $level = new Level({ name: 'elevation-level unselectable' })
  $flagLabel = new FlagLabel({ name: 'elevation-label' })

  $startDot = new Circle({
    name: 'elevation-level-start-dot',
    radius: this.dotRadius,
    lockY: true,
    hitStrokeWidth: 3,
    fill: '#ffffff00',
  })
  $endDot = new Circle({
    name: 'elevation-level-end-dot',
    radius: this.dotRadius,
    lockY: true,
    hitStrokeWidth: 3,
    fill: '#ffffff00',
  })

  constructor(options: ElevationOptions & ContainerConfig) {
    super(options)

    this.setAttrs(options)

    this.on('resize', this.onResize)
    this.on('mouseover', this.onMouseOver)
    this.on('mouseout', this.onMouseOut)
  }

  onResize = (e: KonvaEventObject<Event>) => {
    const { target, pointerX } = e as ResizeEvent
    if (target === this.$startDot) {
      target.y(0)
      const { y } = this.getAbsolutePosition()
      this.width(this.$endDot.getAbsolutePosition().x - pointerX)
      this.setAbsolutePosition({ x: pointerX, y })
    } else if (target === this.$endDot) {
      target.y(0)
      this.width(this.$endDot.x() - this.$startDot.x())
    }
  }

  onMouseOver = () => {
    this.dotVisible = true
  }
  onMouseOut = () => {
    this.dotVisible = false
  }

  propDidUpdate(prop: ChangedProp) {
    if (prop.key === 'name') {
      fireChangeEvent(this, 'name', prop)
    }
  }

  update() {
    const { flagWidth, flagHeight, title = '标高', label = '±0.00', resizable } = this
    const { width, stroke, strokeWidth } = this.getAttrs()
    const dotVisible = this.hasName(SELECTED_CLASSNAME) || this.dotVisible
    this.$level.setAttrs({ endPoint: [width, 0], stroke, strokeWidth })
    this.$flagLabel.setAttrs({ x: width, width: flagWidth, height: flagHeight, stroke, strokeWidth, title, label })
    this.$startDot.setAttrs({ x: 0, stroke, strokeWidth, opacity: Number(dotVisible), draggable: resizable })
    this.$endDot.setAttrs({ x: width, stroke, strokeWidth, opacity: Number(dotVisible), draggable: resizable })
  }

  render() {
    return [this.$level, this.$flagLabel, this.$startDot, this.$endDot]
  }
}
