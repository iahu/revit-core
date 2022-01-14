import { SnapSides } from '@actions/helper'
import { Rect, RectConfig } from 'konva/lib/shapes/Rect'
import { attr } from './observer'
import { Resizable, ResizableOptions } from './resizable'

export interface SnapButtonOptions extends Partial<RectConfig> {
  stroke?: string | CanvasGradient
  highlightedStroke?: string | CanvasGradient
  width?: number
  height?: number
  /**
   * 如果设置 `radius` 则忽略 width/height，并渲染成圆形
   */
  radius?: number
  // 圆角效果
  cornerRadius?: number | number[]
  // 默认高亮
  highlighted?: boolean
  keepTop?: boolean
  snapDistance?: number
  showSnapLine?: boolean
  snapLineWidth?: number
}

export class SnapButton extends Resizable {
  @attr() radius: number | undefined
  @attr() stroke = ''
  @attr() highlightedStroke = 'rgb(255,48,48)'
  @attr() keepTop = true
  @attr() snapSides = 'both' as SnapSides
  @attr() snapDistance = 5
  @attr() showSnapLine = true
  @attr() snapLineWidth = 500

  constructor(options?: SnapButtonOptions & ResizableOptions) {
    super(options)
    this.setAttrs(options)
    this.on('mouseover', this.onMouseOver)
    this.on('mouseout', this.onMouseOut)
    this.on('mouseup', this.bubbleUp)
  }

  onMouseOver() {
    this.highlighted = true
  }

  onMouseOut() {
    this.highlighted = false
  }

  bubbleUp() {
    if (this.keepTop) {
      this.moveToTop()
    }
  }

  $btn = new Rect({ name: 'snap-button-btn unselectable' })

  update() {
    const { radius, hitStrokeWidth, stroke, highlightedStroke, strokeWidth, highlighted } = this.getAttrs()
    let { width, height, cornerRadius } = this.getAttrs()

    if (radius) {
      width = 2 * radius
      height = width
      cornerRadius = radius
    }

    this.$btn.setAttrs({
      offsetX: width / 2,
      offsetY: height / 2,
      width,
      height,
      hitStrokeWidth,
      strokeWidth,
      stroke: highlighted ? highlightedStroke : stroke,
      cornerRadius,
    })
  }

  render() {
    return [this.$btn]
  }
}
