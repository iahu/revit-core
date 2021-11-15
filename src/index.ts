import Konva from 'konva'
import { align, highlight, move, rotate, select } from './actions'
import { Entity, Layer } from './data/store'
import { getBackgroundLayer } from './helpers/background'
import { getDraftLayer } from './helpers/draft'
import { getSelectionRect } from './helpers/selection-rect'
import { getTransformer } from './helpers/transfomer'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
const actions = {
  highlight,
  select,
  move,
  rotate,
  align,
  'draw-grid': noop,
  'create-shape': noop,
}

export type Actions = keyof typeof actions

const memoShapes = new Map<Entity, Konva.Shape>()

export interface KadConfig {
  layers?: Layer[]
}

export default class Kad {
  static commands = actions

  layers = [] as Layer[]

  container: HTMLDivElement
  stage: Konva.Stage

  /**
   * 图形都渲染到这一层
   */
  stageLayer: Konva.Layer
  /**
   * 辅助图形在这一层
   */
  draftLayer: Konva.Layer

  constructor(container: HTMLDivElement, config: KadConfig) {
    const { layers = [] } = config
    this.container = container
    this.layers = layers
    this.stage = this.createStage()
    this.stageLayer = getBackgroundLayer(this.stage)
    this.draftLayer = getDraftLayer(this.stage)

    this.renderToKonva()
    // 默认命令
    // this.execute('highlight')
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

  execute(action: keyof typeof actions): void {
    if (Object.prototype.hasOwnProperty.call(actions, action)) {
      actions[action](this.stageLayer)
      console.log('execute', action)
    }
  }

  private createShape = (entity: Entity) => {
    const memo = memoShapes.get(entity)
    if (memo) {
      return memo
    }

    const { type, ...config } = entity

    let shape: Konva.Shape
    if (type === 'imgUrl') {
      const image = new Image()
      image.src = config.imgUrl
      shape = new Konva.Image({ image })
      shape.setAttrs(config)
    } else if (type === 'svgPath') {
      shape = new Konva.Path(config)
    } else if (type === 'text') {
      shape = new Konva.Text(config)
    } else if (type === 'line') {
      shape = new Konva.Line(config)
    } else {
      // @todo 具体化
      shape = new Konva.Shape(config)
    }

    if (typeof config.draggable !== 'boolean') {
      shape.draggable(true)
    }

    memoShapes.set(entity, shape)
    return shape
  }

  private drawLayer(layer: Layer) {
    const nodes = layer.entities?.map(this.createShape) ?? []
    nodes.forEach(node => {
      this.stageLayer.add(node)
    })
  }

  getShapes(id: string) {
    return this.stageLayer.findOne(`#${id}`)
  }

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
        stageLayer.add(this.createShape(entity))
      })
    }
  }

  destroy() {
    this.stage.destroy()
  }
}
