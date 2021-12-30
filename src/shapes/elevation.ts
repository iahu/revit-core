import { SELECTED_CLASSNAME } from '@actions/helper'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { FlagLabel } from './flag-label'
import { fireChangeEvent } from './helper'
import Komponent from './komponent'
import { Level } from './level'
import { attr, ChangedProp, Observed } from './observer'
import { ResizeHandler } from './resize-handler'

export interface ElevationOptions {
  flagWidth?: number
  flagHeight?: number
  title?: string
  label?: string
  resizable?: boolean
  dotRadius?: number
}

export class Elevation extends Komponent implements Observed {
  @attr<Elevation, 'flagWidth'>() flagWidth = 80
  @attr<Elevation, 'flagHeight'>() flagHeight = 10
  @attr<Elevation, 'title'>() title: string | undefined
  @attr<Elevation, 'label'>() label: string | undefined
  @attr<Elevation, 'resizable'>() resizable = false
  @attr<Elevation, 'dotRadius'>() dotRadius = 4

  $level = new Level({ name: 'elevation-level unselectable' })
  $liveLevel = new Level({ name: 'elevation-live-level unselectable' })
  $flagLabel = new FlagLabel({ name: 'elevation-label' })

  $startDot = new ResizeHandler({ name: 'elevation-level-start-dot', radius: this.dotRadius, lockY: true })
  $endDot = new ResizeHandler({ name: 'elevation-level-end-dot', radius: this.dotRadius, lockY: true })

  constructor(options: ElevationOptions & ContainerConfig) {
    super(options)

    this.setAttrs(options)

    this.$startDot.on('resizeStart', this.onRepositionStart)
    this.$startDot.on('resize', this.onReposition)
    this.$startDot.on('resizeEnd', this.onRepositionEnd)
    this.$endDot.on('resizeStart', this.onResizeStart)
    this.$endDot.on('resize', this.onResize)
    this.on('mouseover', this.onMouseOver)
    this.on('mouseout', this.onMouseOut)
  }

  onRepositionStart = () => {
    this.setAttr('startWidth', this.width())
    this.setAttr('startX', this.x())
  }

  onReposition = (e: KonvaEventObject<Event>) => {
    const target = e.target
    if (target instanceof ResizeHandler) {
      this.$liveLevel.setAttrs({
        x: target.deltaX,
        width: this.getAttr('startWidth') - target.deltaX,
        stroke: 'blue',
        zIndex: 2,
      })
    }
  }

  onRepositionEnd = (e: KonvaEventObject<Event>) => {
    const target = e.target
    if (target instanceof ResizeHandler) {
      this.setAttrs({ x: this.$liveLevel.x() + this.x(), width: this.$liveLevel.width() })
      this.$liveLevel.setAttrs({ x: 0, stroke: '', zIndex: 0 })
    }
  }

  onResizeStart = () => {
    this.setAttr('startWidth', this.width())
  }

  onResize = (e: KonvaEventObject<Event>) => {
    const target = e.target
    if (target instanceof ResizeHandler) {
      this.setAttr('width', this.$endDot.x() - this.$startDot.x())
    }
  }

  onMouseOver = () => {
    this.resizable = true
  }
  onMouseOut = () => {
    this.resizable = false
  }

  propDidUpdate(prop: ChangedProp) {
    if (prop.key === 'name') {
      fireChangeEvent(this, 'name', prop)
    }
  }

  update() {
    const { flagWidth, flagHeight, title, label = '±0.00', resizable } = this
    const { width, stroke, strokeWidth } = this.getAttrs()
    const dotVisible = this.hasName(SELECTED_CLASSNAME) || resizable
    this.$level.setAttrs({ width, stroke, strokeWidth })
    this.$flagLabel.setAttrs({ x: width, width: flagWidth, height: flagHeight, stroke, strokeWidth, title, label })

    this.$startDot.setAttrs({ x: 0, stroke, strokeWidth, visible: dotVisible })
    this.$endDot.setAttrs({ x: width, stroke, strokeWidth, visible: dotVisible })
  }

  render() {
    this.$liveLevel.listening(false)
    return [this.$liveLevel, this.$level, this.$flagLabel, this.$startDot, this.$endDot]
  }
}
