import Konva from 'konva'
import Store from '../data/store'

export const transform = (store: Store) => {
  const { stage, layer } = store
  const tr = new Konva.Transformer()

  layer.add(tr)
  // store.stage.on
}
