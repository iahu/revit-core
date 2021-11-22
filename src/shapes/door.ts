import { HIGHLIGHT_CLASSNAME, SELECTED_CLASSNAME } from '@actions/select'
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { DEG_TO_RAD } from './helper'
import Kroup from './kroup'
import { Observed, observer } from './observer'

export interface DoorOptions {
  stroke?: string | CanvasGradient
  panelWidth?: number
  panelThickness?: number
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

export class Door extends Kroup implements Observed, DoorOptions {
  // @observer<Door, 'stroke'>() stroke = '#0099ff'
  // @observer<Door, 'strokeWidth'>() strokeWidth = 1
  @observer<Door, 'panelWidth'>() panelWidth = 40
  @observer<Door, 'panelThickness'>() panelThickness = 2
  @observer<Door, 'wallThickness'>() wallThickness = 8
  @observer<Door, 'wallFill'>() wallFill = 'white'
  @observer<Door, 'openDirection'>() openDirection: DoorOptions['openDirection'] = 'right'
  @observer<Door, 'openAngle'>() openAngle = 90

  $background = new Konva.Rect({ name: 'door-background unselectable' })
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
    const { stroke, strokeWidth, wallThickness, panelWidth, panelThickness, openDirection, openAngle, wallFill } = this
    let x = 0
    let scaleX = 1
    if (openDirection === 'left') {
      x = panelWidth
      scaleX = -1
    }

    this.$wall.setAttrs({
      offsetY: wallThickness,
      stroke: wallFill,
      strokeWidth,
      width: panelWidth,
      height: wallThickness,
      fill: wallFill,
    })
    this.$panel.setAttrs({
      x,
      scaleX,
      offsetY: panelThickness,
      stroke,
      strokeWidth,
      width: panelWidth,
      height: panelThickness,
      rotation: scaleX * openAngle,
    })
    this.$sector.setAttrs({ x, scaleX, stroke, strokeWidth, angle: openAngle })

    this.$background.setAttrs({
      stroke: '',
      strokeWidth,
      opacity: 0,
      x: 0,
      y: -wallThickness,
      width: panelWidth,
      height: panelWidth + wallThickness,
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
          ctx.arc(panelWidth, wallThickness, panelWidth, 180 * DEG_TO_RAD, openAngle * DEG_TO_RAD, true)
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

    return [this.$background, this.$wall, this.$panel, this.$sector]
  }
}
