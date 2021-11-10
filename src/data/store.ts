import { randomUUID, last } from './helper'
import Konva from 'konva'
import { BehaviorSubject, map, Subject } from 'rxjs'

export type Point = {
  x: number
  y: number
}
export type Position = [number, number]

export type EntityType = 'svgPath' | 'imgUrl' | 'img' | 'text' | 'line'
export interface BaseEntity extends Konva.ShapeConfig {
  id: string
  type: EntityType
}

export interface SvgPathEntity extends BaseEntity, Konva.PathConfig {
  id: string
  type: 'svgPath'
  data: string
}

export interface ImgUrlEntity extends BaseEntity, Omit<Konva.ImageConfig, 'image'> {
  id: string
  type: 'imgUrl'
  imgUrl: string
}

export interface ImgEntity extends BaseEntity, Konva.ImageConfig {
  id: string
  type: 'img'
}

export interface TextEntity extends BaseEntity, Konva.TextConfig {
  id: string
  type: 'text'
  text: string
}
export interface LineEntity extends BaseEntity, Konva.TextConfig {
  id: string
  type: 'line',
  /**是否是居中的对象 */
  alignTarget: boolean

}

export type Entity = SvgPathEntity | ImgUrlEntity | ImgEntity | TextEntity | LineEntity

export interface Layer extends Konva.LayerConfig {
  id: string
  name?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundPosition?: Position
  entities: Array<Entity>
}

// 暂时就支持一种中心方式
export type Center = 'world'

export type Action = {
  /**
   * 动作名
   */
  name: string

  /**
   * 关联的实体对象
   */
  entity: Entity

  /**
   * 执行时间，兼动作 `id`
   * @type {number}
   */
  timestamp: number
}

export type Canvas = {
  width: number
  height: number
}

export type InitStore = {
  stage: Konva.Stage
  canvas?: Canvas
  zoom?: number
  layers?: Layer[]
}

export type UpdateConfig = Map<string, Layer>

/**
 * Store 只维护一个 Konva.Layer
 * 但是维护多个 Konva.LayerConfig (Store.layers)
 * layers 每个元素对应一个 LayerConfig
 * 并扩展一个 entites 来存储 Konva.Layer 的 children
 */
export default class Store {
  stage: Konva.Stage

  canvas = {
    width: 0,
    height: 0,
  }

  zoom = 1

  center: Center = 'world'

  get centerPoint(): Point {
    const { canvas, center } = this
    if (center === 'world') {
      // 仅支持世界中心
      return { x: canvas.width / 2, y: canvas.height / 2 }
    }
    return { x: 0, y: 0 }
  }

  cursor: Point = {
    x: 0,
    y: 0,
  }

  layers = new Map<string, Layer>()
  get layer() {
    return last(Array.from(this.layers.values()))
  }

  get stageLayer() {
    return last(this.stage.getLayers())
  }

  get entities() {
    return Array.from(this.layers.values()).reduce((entities, layer) => {
      return entities.concat(layer.entities ?? [])
    }, [] as Entity[])
  }

  /**
   * id -> 原始 NodeConfig 的 Map
   * 在取消选择时，进行恢复
   */
  selectionSubject = new BehaviorSubject(new Map<string, Partial<Konva.NodeConfig>>())
  // new Map<string, Partial<Konva.NodeConfig>>()

  historyActions = new Set<Action>()

  updateLayers = new Subject<UpdateConfig>()

  constructor(initStore = {} as InitStore) {
    const { stage, canvas = { width: 0, height: 0 }, layers = [], zoom = 1 } = initStore
    this.stage = stage
    this.canvas = canvas
    this.zoom = zoom

    layers.forEach(this.addLayer)
    if (this.layers.size === 0) {
      this.addLayer({ id: 'background', name: 'background' })
    }
  }

  /**
   * 触发更新事件
   */
  requestUpdate<T extends Konva.Node, U extends Konva.NodeConfig>(node?: T, config?: U) {
    const nodeId = node?.id()
    const nextLayers = new Map<string, Layer>()

    for (const [id, layer] of this.layers) {
      const entities = layer.entities.map(entity => {
        if (entity.id === nodeId) {
          return { ...entity, ...config }
        } else {
          return entity
        }
      })
      nextLayers.set(id, { ...layer, entities })
    }
    this.updateLayers.next(nextLayers)
  }

  setCanvas = (width: number, height: number) => {
    this.canvas = { width, height }
  }

  setCursor = (point: Point): void => {
    this.cursor = point
  }

  addLayer = (layerConfig: Omit<Layer, 'entities'> & { entities?: Entity[] }): Map<string, Layer> => {
    const config = { ...layerConfig, id: layerConfig.id ?? randomUUID(), entities: layerConfig.entities ?? [] }
    this.layers.set(config.id, config)

    return this.layers
  }

  deleteLayer = (name: string): boolean => {
    return this.layers.delete(name)
  }

  getLayerByName = (name: string): Layer | undefined => {
    return Array.from(this.layers.values()).find(l => l.name === name)
  }

  getShapes = () => {
    this.layer.id
  }

  addEntity = (entity: Entity, layer?: Layer): void => {
    const { layerId } = entity
    const { layer: currentLayer } = this
    const innerLayer = layerId ? this.layers.get(layerId) : undefined
    const mergedLayer = layer ?? innerLayer ?? currentLayer
    const { entities = [] } = mergedLayer
    entities.push(entity)
    mergedLayer.entities = entities
  }

  pushToHistory = (action: Action): Set<Action> => {
    return this.historyActions.add(action)
  }

  addAction = (action: Action) => {
    this.addEntity(action.entity)
    this.pushToHistory(action)
  }

  setSelection(nodes: Konva.Node[]) {
    const next = new Map(nodes.map(node => [node.id(), { ...node.getAttrs() }]))
    return this.selectionSubject.next(next)
  }

  addSelection(nodes: Konva.Node[]) {
    const selection = this.selectionSubject.getValue()
    nodes.forEach(node => {
      selection.set(node.id(), { ...node.getAttrs() })
    })
    return this.selectionSubject.next(selection)
  }

  clearSelection() {
    return this.selectionSubject.next(new Map())
  }

  removeSelection(id: string) {
    return this.selectionSubject.pipe(
      map(selection => {
        selection.delete(id)
        return selection
      }),
    )
  }
}
