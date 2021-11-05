import Konva from 'konva'
import Store from '../data/store'
import { isShape } from './helper'

export const select = (store: Store) => {
  const { stageLayer, stage, selectionSubject } = store

  let transformer = stageLayer.findOne('transformer') as Konva.Transformer
  if (!transformer) {
    transformer = new Konva.Transformer({
      rotateEnabled: false,
      resizeEnabled: false,
      borderStrokeWidth: 0,
    })
    stageLayer.add(transformer)
  }

  stage.on('mousedown', event => {
    const selection = selectionSubject.getValue()
    const { target } = event
    const keys = Array.from(selection.keys())
    // const values = Array.from(selection.values())

    // clear before select
    // 这里加个 !event.evt.shiftKey 条件判断可做多选
    keys.forEach(id => {
      const selected = stage.findOne(`#${id}`)
      if (selected) {
        transformer.nodes(transformer.nodes().filter(n => n !== selected))
        // const value = values[index]
        // selected.setAttrs({ fill: value.fill, stroke: value.stroke })
        // store.requestUpdate(selected)
      }
    })
    store.clearSelection()

    if (isShape(target)) {
      // 只做单选
      // addSelection 可做多选
      // store.setSelection([target])
      transformer.nodes([target])
      target.setAttrs({ fill: '#cccccc33', stroke: '#0099ff' })
      // store.requestUpdate(target)
    }
  })
}
