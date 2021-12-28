import { HIGHLIGHT_CLASSNAME } from '@actions/helper'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { FlagLabel } from './flag-label'
import Kroup from './kroup'
import { Level } from './level'
import { Observed, observer } from './observer'
import { ResizeHandler } from './resize-handler'

export interface ElevationOptions {
  flagWidth?: number
  flagHeight?: number
  title?: string
  label?: string
  editable?: boolean
  dotRadius?: number
}

export class Elevation extends Kroup implements Observed {
  @observer<Elevation, 'flagWidth'>() flagWidth = 80
  @observer<Elevation, 'flagHeight'>() flagHeight = 10
  @observer<Elevation, 'title'>() title: string | undefined
  @observer<Elevation, 'label'>() label: string | undefined
  @observer<Elevation, 'editable'>() editable = false
  @observer<Elevation, 'dotRadius'>() dotRadius = 4

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

  update() {
    const { flagWidth, flagHeight, title, label = '±0.00', editable } = this
    const { width, stroke, strokeWidth } = this.getAttrs()
    const dotVisible = this.hasName(HIGHLIGHT_CLASSNAME) || editable
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
