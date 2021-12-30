import { HIGHLIGHT_CLASSNAME, SELECTED_CLASSNAME } from '@actions/helper'
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { DEG_TO_RAD } from './helper'
import Komponent from './komponent'
import { Observed, attr } from './observer'

export interface DoorOptions {
  stroke?: string | CanvasGradient
  strokeWidth?: number
  panelWidth?: number
  panelThickness?: number
  panelStrokeWidth?: number
  panelFill?: string
  wallThickness?: number
  wallFill?: string
  /**
   * 开口方向
   */
  openDirection?: 'left' | 'right'
  /**
   * 门扇开关角度
   */
  openAngle?: number
}

export class Door extends Komponent implements Observed, DoorOptions {
  @attr<Door, 'panelWidth'>() panelWidth = 40
  @attr<Door, 'panelStrokeWidth'>() panelStrokeWidth = 1
  @attr<Door, 'panelThickness'>() panelThickness = 2
  @attr<Door, 'panelFill'>() panelFill = ''
  @attr<Door, 'wallThickness'>() wallThickness = 8
  @attr<Door, 'wallFill'>() wallFill = 'white'
  @attr<Door, 'openDirection'>() openDirection: DoorOptions['openDirection'] = 'right'
  @attr<Door, 'openAngle'>() openAngle = 90

  $cover = new Konva.Rect({ name: 'door-background unselectable' })
  $wall = new Konva.Rect({ name: 'door-wall', stroke: this.stroke, strokeWidth: this.strokeWidth })
  $panel = new Konva.Rect({ name: 'door-panel', stroke: this.stroke, strokeWidth: this.strokeWidth })
  $sector = new Konva.Arc({
    name: 'door-orientation',
    innerRadius: this.panelWidth,
    outerRadius: this.panelWidth,
    angle: this.openAngle,
    stroke: this.stroke,
    strokeWidth: this.strokeWidth,
  })

  constructor(options = {} as DoorOptions & ContainerConfig) {
    super(options)

    this.setAttrs(options)
    this.on('nameChange', this.handleNameChange)
  }

  private handleNameChange = () => {
    if (this.hasName(HIGHLIGHT_CLASSNAME) || this.hasName(SELECTED_CLASSNAME)) {
      this.$wall.setAttrs({ stroke: this.stroke, fill: '' })
    } else {
      this.$wall.setAttrs({ stroke: this.wallFill, fill: this.wallFill })
    }
  }

  update() {
    const {
      stroke,
      strokeWidth,
      wallThickness,
      panelWidth,
      panelFill,
      panelThickness,
      panelStrokeWidth,
      openDirection,
      openAngle,
      wallFill,
    } = this
    let x = 0
    let scaleX = 1
    if (openDirection === 'left') {
      x = panelWidth
      scaleX = -1
    }
    this.$wall.setAttrs({
      stroke: wallFill,
      strokeWidth,
      width: panelWidth,
      height: wallThickness,
      fill: wallFill,
    })
    this.$panel.setAttrs({
      x,
      y: wallThickness,
      scaleX,
      offsetX: -panelStrokeWidth / 2,
      offsetY: panelThickness + (5 / 2) * panelStrokeWidth,
      stroke,
      fill: panelFill,
      strokeWidth: panelStrokeWidth,
      width: panelWidth,
      height: panelThickness + 2 * panelStrokeWidth,
      rotation: scaleX * openAngle,
    })
    this.$sector.setAttrs({
      x,
      y: wallThickness,
      scaleX,
      innerRadius: panelWidth,
      outerRadius: panelWidth,
      stroke,
      strokeWidth,
      angle: openAngle,
    })

    this.$cover.setAttrs({
      strokeWidth,
      width: panelWidth,
      height: this.$sector.getSelfRect().height + wallThickness,
      hitFunc(ctx: Konva.Context) {
        ctx.beginPath()
        // wall rect
        ctx.moveTo(0, 0)
        ctx.rect(0, 0, panelWidth, wallThickness)

        // sector
        if (openDirection === 'right') {
          ctx.moveTo(0, wallThickness)
          ctx.arc(0, wallThickness, panelWidth, 0, openAngle * DEG_TO_RAD, false)
        } else {
          ctx.moveTo(panelWidth, wallThickness)
          ctx.arc(panelWidth, wallThickness, panelWidth, 180 * DEG_TO_RAD, (180 - openAngle) * DEG_TO_RAD, true)
        }

        ctx.closePath()
        ctx.fillStrokeShape(this)
      },
    })

    this.handleNameChange()
  }

  render() {
    // 不响应事件
    this.$wall.listening(false)
    this.$panel.listening(false)
    this.$sector.listening(false)

    this.update()

    return [this.$wall, this.$panel, this.$sector, this.$cover]
  }
}
