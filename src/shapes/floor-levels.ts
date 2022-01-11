import { SELECTED_CLASSNAME } from '@actions/helper'
import { ShapeOrGroup } from 'index'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { EditableText } from './editable-text'
import { Elevation } from './elevation'
import { closest } from './helper'
import { createShape } from './index'
import Komponent from './komponent'
import { attr, ChangedProp, KonvaChangeEvent, Observed } from './observer'
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

type Formatter = (label: number | string) => string
export interface FloorLevelsOptions {
  // 水平线列表，相对差
  floorLevels?: LevelOptions[]
  /** 标签格式化函数 */
  formatter?: Formatter
  editEnable?: boolean
  rulerVisiable?: boolean
}

const identity: Formatter = n => `${Number(n).toFixed(2)}`

export class FloorLevels extends Komponent implements Observed {
  @attr<FloorLevels, 'floorLevels'>() floorLevels = [] as LevelOptions[]
  @attr<FloorLevels, 'formatter'>() formatter: Formatter
  @attr<FloorLevels, 'editable'>() editable = false
  @attr<FloorLevels, 'rulerVisiable'>() rulerVisiable = false

  get sortedLevels() {
    return this.floorLevels.sort((a, b) => a.y - b.y)
  }

  findLevelByIndex(index: number) {
    return this.sortedLevels[index]
  }

  findElevationByIndex(index: number) {
    return this.children?.filter(item => item.className === 'Elevation')[index] as Elevation
  }

  constructor(options: FloorLevelsOptions & ContainerConfig) {
    super({ draggable: false, ...options })

    this.setAttrs({ draggable: false, ...options })
    this.on('textChange', this.onTextChange)
    this.on('editableChange', this.onEditableChange)
    this.on('dragstart', this.onDragStart)
    this.on('dragend', this.onDragEnd)
    this.on('resizeEnd', this.onResizeEnd)
    this.on('selected', this.onSelected)
    this.on('unselected', this.onUnSelected)
  }

  @attr<FloorLevels, 'selectedElevation'>() selectedElevation: Elevation | undefined

  get previousElevation(): Elevation | undefined {
    return this.selectedElevation
      ? this.findElevationByIndex(this.selectedElevation.getAttr('levelOrder') - 1)
      : undefined
  }

  get nextElevation(): Elevation | undefined {
    return this.selectedElevation
      ? this.findElevationByIndex(this.selectedElevation.getAttr('levelOrder') + 1)
      : undefined
  }

  onSelected = (e: KonvaEventObject<Event>) => {
    const elevation = closest<Elevation>(e.target, 'Elevation')
    if (elevation) {
      this.selectedElevation = elevation
      this.rulerVisiable = true
    }

    if (e.target instanceof FloorLevels) {
      this.rulerVisiable = true
    }
  }
  onUnSelected = () => {
    // this.selectedElevation = undefined
    this.updated.then(() => {
      if (!this.findOne(`.${SELECTED_CLASSNAME}`) && !this.editable) {
        this.rulerVisiable = false
      }
    })
  }

  onTextChange = (e: KonvaEventObject<Event>) => {
    const { target, newVal } = e as KonvaChangeEvent<EditableText, 'text'>
    const elevation = closest<ShapeOrGroup>(target, '.floor-levels-elevation')
    const ruler = closest(target, '.floor-levels-ruler')

    if (ruler) {
      // bottom ruler
      if (ruler.hasName('bottom')) {
        const levelConfig = this.selectedElevation?.getAttr('levelConfig')
        const previous = this.previousElevation
        if (levelConfig && previous) {
          levelConfig.y = parseFloat(newVal ?? '') - previous.y()
          this.floorLevels = [...this.sortedLevels]
        }
      } else {
        // top ruler
        const { selectedElevation } = this
        const order = selectedElevation?.getAttr('levelOrder')
        const levelConfig = this.findElevationByIndex(order + 1)?.getAttr('levelConfig')
        if (selectedElevation && levelConfig) {
          levelConfig.y = parseFloat(newVal ?? '') - selectedElevation.y()
          this.floorLevels = [...this.sortedLevels]
        }
      }
    }

    if (elevation) {
      const level = elevation.getAttr('levelConfig')

      // title
      if (target.hasName('flag-label-title')) {
        if (level) {
          level.title = newVal
          this.floorLevels = [...this.sortedLevels]
        }
      }

      // label
      if (target.hasName('flag-label-label') || target.hasName('ruler-label')) {
        level.y = parseFloat(newVal ?? '')
        this.updated.then(() => {
          this.floorLevels = [...this.sortedLevels]
        })
      }
    }
  }

  onEditableChange = (e: KonvaEventObject<Event>) => {
    const { newVal } = e as KonvaChangeEvent<EditableText, 'editable'>
    this.editable = newVal
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
      const order = elevation.getAttr('levelOrder')
      const level = this.findLevelByIndex(order)
      level.x = elevation.x()
      level.y = -elevation.y()
      level.width = elevation.width()
      this.rulerVisiable = true
      this.floorLevels = [...this.sortedLevels]
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
    const { key, newVal } = prop
    if (key === 'floorLevels') {
      this.rerender()
    } else if (key === 'formatter') {
      this.children?.forEach(child => {
        child.setAttrs({ label: newVal(child.getAttr('originalLabel')) })
      })
    } else if (key === 'rulerVisiable') {
      this.updateRuler()
    } else if (key === 'selectedElevation') {
      this.updateRuler()
    }
  }

  $topRuler = new Ruler({
    name: 'floor-levels-ruler top',
    crossRadius: 4,
    startPoint: [0, 0],
    rulerOffset: 0,
    visible: false,
  })

  $bottomRuler = new Ruler({
    name: 'floor-levels-ruler bottom',
    crossRadius: 4,
    startPoint: [0, 0],
    rulerOffset: 0,
    visible: false,
  })

  renderLevels(data: LevelOptions[]) {
    const width = this.width()
    const { formatter = identity } = this
    const sortedData = data.sort((a, b) => a.y - b.y)
    return sortedData.map((opts, idx) => {
      return new Elevation({
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
        zindex: idx,
      })
    }) as Elevation[]
  }

  caclutateRuleAttributes(first: Elevation, second: Elevation) {
    const maxX = Math.max(first.x(), second.x())
    const minWidth = Math.min(first.x() + first.width(), second.x() + second.width())
    const averagedX = (maxX + minWidth) / 2
    return {
      x: averagedX,
      startPoint: [0, first.y()],
      endPoint: [0, second.y()],
    }
  }

  updateRuler() {
    const { selectedElevation } = this
    if (!selectedElevation) {
      this.$topRuler.remove()
      this.$bottomRuler.remove()
      return
    }
    const order = selectedElevation.getAttr('levelOrder')
    if (order > 0) {
      const { rulerVisiable, nextElevation: next, previousElevation: previous } = this

      if (previous) {
        this.$bottomRuler.setAttrs(this.caclutateRuleAttributes(previous, selectedElevation))
        this.$bottomRuler.visible(rulerVisiable)
      }
      if (next) {
        this.$topRuler.setAttrs(this.caclutateRuleAttributes(selectedElevation, next))
        this.$topRuler.visible(rulerVisiable)
      }

      if (!this.children?.includes(this.$topRuler)) {
        this.add(this.$topRuler)
      }

      if (!this.children?.includes(this.$bottomRuler)) {
        this.$bottomRuler.parent = null
        this.add(this.$bottomRuler)
      }
    } else {
      this.$topRuler.visible(false)
      this.$bottomRuler.visible(false)
    }
  }

  rerender() {
    this.removeAllChildren()
    const elevations = this.renderLevels(this.sortedLevels)
    this.add(...elevations)
    const { selectedElevation } = this
    if (selectedElevation) {
      const order = selectedElevation?.getAttr('levelOrder')
      this.selectedElevation = elevations[order]
    }
    this.add(this.$topRuler)
    this.add(this.$bottomRuler)
    if (this.rulerVisiable && this.selectedElevation) {
      this.updateRuler()
    }
  }

  render() {
    this.rerender()
    return []
  }
}
