import { isKomponent, SELECTED_CLASSNAME, SnapSides } from '@actions/helper'
import { Container } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { ShapeGetClientRectConfig } from 'konva/lib/Shape'
import { Rect, RectConfig } from 'konva/lib/shapes/Rect'
import { Vector2d } from 'konva/lib/types'
import { cloneMousemoveEvent } from './helper'
import Komponent, { ContainerClientRectConfig, KomponentOptions } from './komponent'
import { attr, ChangedProp } from './observer'
import { Vector } from './vector'

export interface SnapButtonOptions extends Partial<RectConfig> {
  stroke?: string | CanvasGradient
  highlightStroke?: string | CanvasGradient
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
  inheritStroke?: boolean
  ghost?: boolean
}

type HasParent<T> = T & { parent: Container }

export class SnapButton extends Komponent {
  @attr() radius: number | undefined
  @attr() stroke = ''
  @attr() highlightStroke: string | undefined
  @attr() keepTop = true
  @attr() snapSides = 'both' as SnapSides
  @attr() snapDistance = 5
  @attr() showSnapLine = true
  @attr() snapLineWidth = 500
  @attr() ghost = true
  @attr() snapOffset = { x: 0, y: 0 }

  constructor(options?: SnapButtonOptions & KomponentOptions) {
    super(options)
    this.setAttrs(options)
    this.on('mouseout', this.onMouseOut)
    this.on('mouseup', this.bubbleUp)
  }

  getWidth() {
    return this.attrs.width ?? (this.radius ?? 0) * 2
  }

  getHeight() {
    return this.attrs.height ?? (this.radius ?? 0) * 2
  }

  firstRender() {
    if (!this.hasParent()) {
      // 单独使用时如果未设置高亮描边颜色，则默认使用红色
      this.highlightStroke = this.highlightStroke ?? 'red'
    }
  }

  onMouseOut() {
    this.highlighted = this.hasParent() ? this.parent.hasName(SELECTED_CLASSNAME) : false
  }

  bubbleUp() {
    if (this.keepTop) {
      this.moveToTop()
    }
  }

  $btn = new Rect({ name: 'snap-button-btn unselectable' })

  hasParent(): this is HasParent<this> {
    return isKomponent(this.parent)
  }

  propDidUpdate(prop: ChangedProp) {
    const { key, newVal } = prop
    if (this.ghost && key === 'selected' && this.hasParent()) {
      this.visible(newVal)
    }
  }

  update() {
    const { radius, hitStrokeWidth, strokeWidth, highlighted, stroke, highlightStroke = stroke } = this.getAttrs()
    let { width, height, cornerRadius } = this.getAttrs()

    if (radius) {
      width = 2 * radius
      height = width
      cornerRadius = radius
    }
    this.setAttrs({ offsetX: width / 2, offsetY: height / 2 })
    this.$btn.setAttrs({
      width,
      height,
      hitStrokeWidth,
      strokeWidth,
      stroke: highlighted ? highlightStroke : stroke,
      cornerRadius,
    })
  }

  render() {
    return [this.$btn]
  }
}
