import Konva from 'konva'
import Store from '../data/store'
import { isShape } from './helper'

export const move = (store: Store) => {
  const { stage, stageLayer, selectionSubject } = store

  const subscription = selectionSubject.subscribe(selection => {
    const nodes = Array.from(selection.keys()).map(id => {
      const findNode = stageLayer.findOne(`#${id}`)
      if (isShape(findNode)) {
        return findNode
      }
    })

    const tr = new Konva.Transformer({
      resizeEnabled: false,
      rotateEnabled: false,
      radius: 0,
      draggable: false,
      borderDash: [3, 3],
      nodes,
    })

    stageLayer.add(tr)

    stage.on('mouseover', event => {
      const { target } = event
      if (selection.has(target.id())) {
        stage.container().style.cursor = 'pointer'
      } else {
        stage.container().style.cursor = ''
      }
    })

    stage.on('mouseup', () => {
      tr.nodes([])
      tr.remove()
      subscription.unsubscribe()
    })
  })
}
