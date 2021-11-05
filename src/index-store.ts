import Konva from 'konva'
import { highlight } from './__action/highlight'
import { move } from './__action/move'
import { select } from './__action/select'
import Store, { Entity, InitStore, Layer } from './data/store'

const noop = () => {}
const commands = {
  highlight,
  select,
  move,
  'draw-grid': noop,
  'create-shape': noop,
}

const memoShapes = new Map<Entity, Konva.Shape>()

export default class RevitCore {
  static commands = commands

  store: Store
  container: HTMLDivElement
  stage: Konva.Stage

  /**
   * 只用一个 Konva.Layer
   */
  stageLayer: Konva.Layer

  constructor(container: HTMLDivElement, initStore?: Omit<InitStore, 'stage'>) {
    this.container = container
    this.stage = this.createStage()
    this.stageLayer = this.addStageLayer({ id: 'background', name: 'background' })
    this.store = new Store({ stage: this.stage, ...initStore })

    this.renderToKonva()
    this.store.requestUpdate()

    // 默认命令
    this.execute('highlight')
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

  addStageLayer(config: Konva.LayerConfig) {
    const layer = new Konva.Layer(config)
    this.stage.add(layer)
    return layer
  }

  layout(width?: number, height?: number) {
    const { container } = this
    this.stage.width(width ?? container.scrollWidth)
    this.stage.height(height ?? container.scrollHeight)
  }

  execute(command: keyof typeof commands): void {
    if (Object.prototype.hasOwnProperty.call(commands, command)) {
      commands[command](this.store)
      console.log('execute', command)
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
    } else {
      // @todo 具体化
      shape = new Konva.Shape(config)
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

  renderToData(layers: Store['layers']): Store['layers'] {
    const selection = this.store.selectionSubject.getValue()
    const nextLayers = new Map() as Store['layers']
    for (const [id, layer] of layers) {
      const entities = layer.entities.map(entity => {
        const { draggable = true } = entity
        if (selection.has(entity.id)) {
          return { ...entity, fill: '#0099ff', draggable }
        }
        return { ...entity, draggable }
      })
      nextLayers.set(id, { ...layer, entities })
    }
    return nextLayers
  }

  private renderToKonva() {
    const { stageLayer } = this

    this.store.updateLayers.subscribe(_nextLayers => {
      const nextLayers = this.renderToData(_nextLayers)

      for (const [id, nextLayer] of nextLayers) {
        nextLayer.entities.map(entity => {
          const findNode = this.getShapes(entity.id)
          if (findNode) {
            // remove
            this.getShapes(entity.id)?.remove()
          }
          //  add
          stageLayer.add(this.createShape(entity))
        })
      }
    })
  }

  destroy() {
    this.stage.destroy()
    this.store.updateLayers.unsubscribe()
  }
}
