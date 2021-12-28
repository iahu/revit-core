import { ShapeOrGroup } from 'index'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Rect } from 'konva/lib/shapes/Rect'
import { KonvaNodeEvent } from 'konva/lib/types'
import { EditableText } from './editable-text'
import { Elevation } from './elevation'
import { closest } from './helper'
import { createShape } from './index'
import Kroup from './kroup'
import { ChangedProp, KonvaChangeEvent, Observed, observer } from './observer'
import Ruler from './ruler'

interface LevelOptions {
  /** 与整体 x 差值 */
  x?: number
  /** 与整体 y 差值 */
  y: number
  /** 水平线本身长度 */
  width?: number
  /** 旗标高度 */
  height?: number
  title?: string
  /** 不传则用高度差 */
  label?: string
}

type Formatter = (label: number | string) => number | string
export interface FloorLevelsOptions {
  // 水平线列表，相对差
  floorLevels?: LevelOptions[]
  /** 标签格式化函数 */
  formatter?: Formatter
  editEnable?: boolean
  rulerVisiable?: boolean
}

const identity: Formatter = n => `${Number(n).toFixed(2)}`

export class FloorLevels extends Kroup implements Observed {
  @observer<FloorLevels, 'floorLevels'>() floorLevels = [] as LevelOptions[]
  @observer<FloorLevels, 'formatter'>() formatter: Formatter
  @observer<FloorLevels, 'editEnable'>() editEnable = false
  @observer<FloorLevels, 'rulerVisiable'>() rulerVisiable = false

  get sortedLevels() {
    return this.floorLevels.sort((a, b) => a.y - b.y)
  }

  findLevelByIndex(index: number) {
    return this.sortedLevels[index]
  }

  findElevationByIndex(index: number) {
    return this.children?.filter(item => item.className === 'Elevation')[index]
  }

  constructor(options: FloorLevelsOptions & ContainerConfig) {
    super({ draggable: false, ...options })
    this.setAttrs({ draggable: false, ...options })
    this.on('click', this.onClick)
    this.on('textChange', this.onTextChange)
    this.on('editEnableChange', this.onEditEnable)
    this.on('dragstart', this.onDragStart)
    this.on('dragend', this.onDragEnd)
    this.on('resizeEnd', this.onResizeEnd)
  }

  @observer<FloorLevels, 'highlightElevation'>() highlightElevation: Elevation | undefined
  onClick = (e: KonvaEventObject<Event>) => {
    const { target } = e
    const elevation = closest<Elevation>(e.target, '.floor-levels-elevation')
    const isBackground = target.hasName('floor-levels-background')
    if (elevation) {
      this.highlightElevation = elevation
      this.rulerVisiable = elevation.getAttr('levelOrder') > 0
      this.updateRuler()
      // this.add(this.$ruler)
    } else if (!this.editEnable && isBackground) {
      // this.$ruler.remove()
      this.rulerVisiable = false
      this.highlightElevation = undefined
    }
  }

  updateRuler() {
    const elevation = this.highlightElevation
    if (!elevation) {
      return
    }
    const order = elevation.getAttr('levelOrder')
    if (order > 0) {
      const previous = this.findElevationByIndex(order - 1) ?? elevation
      const maxX = Math.max(previous.x(), elevation.x())
      const minWidth = Math.min(previous.x() + previous.width(), elevation.x() + elevation.width())
      const averagedX = (maxX + minWidth) / 2

      this.$ruler.setAttrs({
        x: averagedX,
        startPoint: [0, previous.y()],
        endPoint: [0, elevation.y()],
      })
    } else {
      this.highlightElevation = undefined
    }
  }

  onTextChange = (e: KonvaEventObject<Event>) => {
    const { target, newVal } = e as KonvaChangeEvent<EditableText, 'text'>
    const elevation = closest<ShapeOrGroup>(target, '.floor-levels-elevation')
    if (!elevation) return

    const index = elevation.getAttr('levelOrder')
    const level = this.sortedLevels[index]

    if (target.hasName('flag-label-title')) {
      if (level) {
        level.title = newVal
        this.floorLevels = [...this.sortedLevels]
      }
    }

    if (target.hasName('flag-label-label') || target.hasName('ruler-label')) {
      level.y = parseFloat(newVal ?? '')
      this.editEnable = false
      this.updated.then(() => {
        this.floorLevels = [...this.sortedLevels]
      })
    }
  }

  onEditEnable = (e: KonvaEventObject<Event>) => {
    const { newVal } = e as KonvaChangeEvent<EditableText, 'editEnable'>
    setTimeout(() => {
      this.editEnable = newVal
    })
  }

  onDragStart(e: KonvaEventObject<Event>) {
    if ((e.target as unknown) !== this) {
      this.rulerVisiable = false
    }
  }

  onDragEnd(e: KonvaEventObject<Event>) {
    const { target } = e
    const elevation = closest<Elevation>(target, '.floor-levels-elevation')
    if ((target as unknown) !== this && elevation) {
      const level = this.findLevelByIndex(elevation.getAttr('levelOrder'))
      level.x = elevation.x()
      level.y = -elevation.y()
      level.width = elevation.width()
      this.floorLevels = [...this.sortedLevels]
      this.updated.then(() => {
        this.rulerVisiable = true
        this.updateRuler()
      })
    }
  }

  onResizeEnd(e: KonvaEventObject<Event>) {
    const { target } = e
    const elevation = closest<Elevation>(target, '.floor-levels-elevation')
    if (elevation) {
      const level = elevation.getAttr('levelConfig')
      level.width = elevation.width()
      level.x = elevation.x()
      this.floorLevels = [...this.sortedLevels]
    }
  }

  getWidth() {
    const widthList = this.floorLevels.map(l => {
      const { x = 0, width = 0 } = l
      return x + width
    })
    return Math.max(...widthList)
  }

  getHeight() {
    const heightList = this.floorLevels.map(l => {
      const { y = 0, height = 0 } = l
      return y + height
    })
    return Math.max(...heightList)
  }

  propDidUpdate(prop: ChangedProp) {
    const { key, newVal, oldVal } = prop
    if (key === 'floorLevels') {
      const elevations = this.renderLevels(newVal)
      this.removeAllChildren()
      if (elevations.length) {
        this.$background.setAttrs({ width: this.width(), height: -this.height(), opacity: 0 })
        this.add(this.$background)
        this.add(...elevations)
        this.highlightElevation = elevations[this.highlightElevation?.getAttr('levelOrder')]
        this.updateRuler()
      }
    } else if (key === 'formatter') {
      this.children?.forEach(child => {
        child.setAttrs({ label: newVal(child.getAttr('originalLabel')) })
      })
    } else if (key === 'rulerVisiable') {
      if (newVal) {
        this.$ruler.visible(true)
        this.updateRuler()
        this.add(this.$ruler)
      } else {
        this.$ruler.visible(false)
        this.$ruler.remove()
      }
    } else if (key === 'highlightElevation') {
      if (oldVal) {
        oldVal.editable = false
      }
      if (newVal) {
        newVal.editable = true
      }
    }
  }

  $background = new Rect({ name: 'floor-levels-background unselectable', index: 0, fill: 'red' })
  $ruler = new Ruler({ name: 'floor-levels-ruler', crossRadius: 4, startPoint: [0, 0], visible: false, rulerOffset: 0 })

  renderLevels(data: LevelOptions[]) {
    const width = this.width()
    const { formatter = identity } = this
    const sortedData = data.sort((a, b) => a.y - b.y)
    return sortedData.map((opts, idx) => {
      return createShape('elevation', {
        name: 'floor-levels-elevation',
        x: opts.x ?? 0,
        y: -opts.y,
        levelOrder: idx, // level order
        levelConfig: opts,
        width: opts.width ?? width,
        height: opts.height,
        title: opts.title ?? `标高${idx}`,
        originalLabel: opts.label ?? opts.y,
        label: formatter(opts.label ?? opts.y),
        draggable: false,
      })
    }) as Elevation[]
  }

  firstRender() {
    const elevations = this.renderLevels(this.sortedLevels)
    this.add(...elevations)
  }

  render() {
    return []
  }
}
