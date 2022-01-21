import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject, Node } from 'konva/lib/Node'
import Komponent from './komponent'
import { attr, ChangedProp } from './observer'
import { ResizeEvent } from './resizable'
import { Segment, SegmentOptions } from './segment'
import { SnapButton } from './snap-button'
import { Vector } from './vector'

type EntityType<T, U = string> = T & { type: U } & Konva.ShapeConfig
type SegmentOptionsEntity = EntityType<SegmentOptions, 'segment'>

export interface PathOptions {
  paths?: SegmentOptionsEntity[]
}

export class Path extends Komponent implements PathOptions {
  @attr() paths = [] as SegmentOptionsEntity[]

  nodes = [] as Segment[]

  constructor(options: PathOptions & ContainerConfig) {
    super(options)
    this.setAttrs(options)

    this.on('resizeStart', this.onResizeStart)
    this.on('resize', this.onResize)
  }

  private connectedPaths = [] as Node[]
  private combindedButtons = [] as Node[]

  onResizeStart(e: KonvaEventObject<Event>) {
    const { target } = e
    const { nodes } = this

    if (target instanceof SnapButton) {
      const index = target.parent?.index
      const otherNodes = nodes.filter(n => n.index !== index)
      const { x, y } = target.getAbsolutePosition()
      const v = new Vector(x, y)
      this.connectedPaths = otherNodes.filter(node => {
        return v.equals(node.$startBtn.getAbsolutePosition()) || v.equals(node.$endBtn.getAbsolutePosition())
      })
    }
  }

  onResize(e: KonvaEventObject<UIEvent>) {
    if (e.target instanceof SnapButton) {
      const { startX, startY, movementX, movementY } = e as ResizeEvent
      this.connectedPaths.forEach(node => {
        node.setAbsolutePosition({ x: startX + movementX, y: startY + movementY })
      })
    }
  }

  propWillUpdate(prop: ChangedProp) {
    const { key, newVal } = prop as ChangedProp<SegmentOptionsEntity[]>
    if (key === 'paths') {
      // 动态渲染
      this.nodes = newVal.map(o => new Segment(o))
      this.forceUpdate()
    }
  }

  update() {
    const { stroke, strokeWidth, hitStrokeWidth, highlighted } = this.getAttrs()
    this.nodes.forEach(c => c.setAttrs({ highlighted, stroke, strokeWidth, hitStrokeWidth }))
  }

  render() {
    this.update()
    return this.nodes
  }
}
