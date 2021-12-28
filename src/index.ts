import { KAD_ACTION_NS, SELECTED_CLASSNAME } from '@actions/helper'
import Bluebird from 'bluebird'
import Konva from 'konva'
import * as actions from './actions'
import { getBackgroundLayer } from './helpers/background'
import { getDraftLayer } from './helpers/draft'
import { getSelectionRect } from './helpers/selection-rect'
import { getTransformer } from './helpers/transfomer'
import { createShape, Layer } from './shapes'
import type { ShapeOrGroup } from './actions/helper'
import { ContainerTypes, query } from '@helpers/query'
import { Container } from 'konva/lib/Container'

export type { ShapeOrGroup } from './actions/helper'
export type { Actions } from './actions'

// cancellable
Bluebird.config({ cancellation: true })

export type ActionTypes = keyof typeof actions

export interface KadConfig {
  layers?: Layer[]
  stageConfig?: Konva.ContainerConfig
}

export interface GlobalOptions {
  type: string
  [key: string]: any
}

export default class Kad {
  static actions = actions

  static isAction(action: ActionTypes): boolean {
    return Object.keys(actions).includes(action)
  }

  static createShape = createShape

  layers = [] as Layer[]

  container: HTMLDivElement
  stage: Konva.Stage

  get selectedNodes(): ShapeOrGroup[] {
    return this.stage.find(`.${SELECTED_CLASSNAME}`)
  }

  query = (selector: string, container?: ContainerTypes) => query(container ?? this.stage, selector)

  /**
   * 图形都渲染到这一层
   */
  stageLayer: Konva.Layer
  /**
   * 辅助图形在这一层
   */
  draftLayer: Konva.Layer

  get currentLayer() {
    const layers = [...this.stage.getLayers()]
    while (layers.length > 0) {
      const layer = layers.pop()
      if (layer?.visible()) {
        return layer
      }
    }
  }

  constructor(container: HTMLDivElement, config: KadConfig) {
    const { stageConfig, layers = [] } = config
    this.container = container
    this.layers = layers
    this.stage = this.createStage()
    this.stage.setAttrs(stageConfig)
    this.stageLayer = getBackgroundLayer(this.stage)
    this.draftLayer = getDraftLayer(this.stage)

    this.renderToKonva()
    // 默认命令
    this.execute('select')
  }

  private createStage() {
    const { scrollWidth, scrollHeight } = this.container
    return new Konva.Stage({
      container: this.container,
      width: scrollWidth,
      height: scrollHeight,
      uniformScaling: true,
      uniScaleKey: 'ctrlKey',
      rotationCursor: 'grab',
    })
  }

  private createBackgroundLayer() {
    const { stage } = this
    const layer = getBackgroundLayer(stage)
    layer.add(getTransformer(stage))
    layer.add(getSelectionRect(stage))

    return layer
  }

  addLayer(config: Konva.LayerConfig) {
    const layer = new Konva.Layer(config)
    this.stage.add(layer)
    return layer
  }

  layout(width?: number, height?: number) {
    const { container } = this
    this.stage.width(width ?? container.scrollWidth)
    this.stage.height(height ?? container.scrollHeight)
  }

  clearBeforeExecute(container: Konva.Stage | Konva.Layer) {
    const { eventListeners } = container
    Object.keys(eventListeners).forEach(key => {
      const listeners = eventListeners[key]
      listeners.forEach(item => {
        const { name, handler } = item
        if (name === KAD_ACTION_NS) {
          container.off(`${key}.${name}`, handler)
        }
      })
    })
  }

  // 全局配置项
  globalActionOptions = {} as GlobalOptions

  #currentAction: Bluebird<unknown> | undefined

  execute(action: ActionTypes, args?: any) {
    if (Object.prototype.hasOwnProperty.call(actions, action)) {
      // clear action handlers before execute next action
      this.clearBeforeExecute(this.stage)
      this.clearBeforeExecute(this.stageLayer)
      this.cancelCurrentAction()
      // execute
      this.#currentAction = actions[action](this.stageLayer, args)

      this.#currentAction.catch(console.error).then(() => {
        this.execute('select', args)
      })
      return this.#currentAction
    }
    return Bluebird.resolve()
  }

  cancelCurrentAction() {
    this.#currentAction?.cancel()
  }

  private drawLayer(layer: Layer) {
    const nodes = layer.entities?.map(createShape) ?? []
    nodes.forEach(node => {
      if (node) {
        this.stageLayer.add(node)
      }
    })
  }

  getShapes(id: string) {
    return this.stageLayer.findOne(`#${id}`)
  }

  ready = Promise.resolve(false)

  private renderToKonva() {
    const { stageLayer, layers } = this

    for (const layer of layers) {
      layer.entities.map(entity => {
        // const findNode = this.getShapes(entity.id)
        // if (findNode) {
        //   // remove
        //   this.getShapes(entity.id)?.remove()
        // }
        //  add
        const shape = createShape(entity)
        if (shape) {
          stageLayer.add(shape)
        }
      })
    }

    this.ready = Promise.resolve(true)
  }

  destroy() {
    this.stage.destroy()
  }
}
