import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { Node } from 'konva/lib/Node'
import { Rect, RectConfig } from 'konva/lib/shapes/Rect'
import Komponent from './komponent'
import { attr } from './observer'
import { Resizable } from './resizable'

export interface SnapButtonOptions extends Partial<RectConfig> {
  stroke?: string | CanvasGradient
  highlightedStroke?: string | CanvasGradient
  width?: number
  height?: number
  // 圆角效果
  cornerRadius?: number
  // 默认高亮
  highlighted?: boolean
  keepTop?: boolean
}

export class SnapButton extends Resizable {
  @attr() stroke = ''
  @attr() highlightedStroke = 'rgb(255,48,48)'
  @attr() keepTop = true

  constructor(options?: SnapButtonOptions & ContainerConfig) {
    super(options)
    this.setAttrs(options)
    this.on('mouseover', this.onMouseOver)
    this.on('mouseout', this.onMouseOut)

    this.on('resizeStart', this.onResizeStart)
    this.on('resize', this.onResize)
  }

  onMouseOver() {
    this.highlighted = true
    if (this.keepTop) {
      this.moveToTop()
    }
  }

  onMouseOut() {
    this.highlighted = false
  }

  /**
   * 碰撞检测
   */
  collideCheck(targetNodes: Node[]) {
    const stage = this.getStage()
    if (!stage || !targetNodes.length) {
      return []
    }

    const rectConfig = { skipShadow: true, skipStroke: true }
    const selfRect = this.getClientRect(rectConfig)
    const result = targetNodes.reduce((nodes, s) => {
      const rect = s.getClientRect(rectConfig)
      const intersection = Konva.Util.haveIntersection(selfRect, rect) || Konva.Util.haveIntersection(selfRect, rect)
      if (intersection) {
        nodes.push(s)
      }
      return nodes
    }, [] as Node[])

    return result
  }

  targetNodes: Node[] | undefined

  onResizeStart() {
    const stage = this.getStage()
    if (stage) {
      this.targetNodes = stage.find('SnapButton').filter(s => s !== this)
    }
  }

  onResize() {
    if (this.targetNodes) {
      this.collideCheck(this.targetNodes)
    }
  }

  $btn = new Rect({ name: 'snap-button-btn unselectable' })

  update() {
    const {
      width = 10,
      height = 10,
      hitStrokeWidth,
      stroke,
      highlightedStroke,
      strokeWidth,
      highlighted,
      cornerRadius,
    } = this.getAttrs()

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
