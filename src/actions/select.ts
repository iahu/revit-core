import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'
import { dragSelect } from './drag-select'
import { pick } from './pick'

export const HIGHLIGHT_COLOR = '#0096FF'

const clearup = (stage: Stage) => {
  stage.find('.selected').forEach(node => node.removeName('selected'))
  stage.find('.highlight-node-clone').forEach(clone => clone.destroy())
}

const setHightlight = (nodes: (Konva.Shape | Konva.Group)[]) => {
  nodes.forEach(node => {
    const attrs = node.getAttrs()
    const clone = node.clone({
      ...attrs,
      name: 'highlight-node-clone unselectable',
      stroke: attrs.stroke && HIGHLIGHT_COLOR,
      fill: attrs.fill && HIGHLIGHT_COLOR,
      shadowBlur: 0,
      opacity: 0.8,
    }) as typeof node
    if (!attrs.stroke && !attrs.fill) {
      clone.setAttr('stroke', HIGHLIGHT_COLOR)
    }
    // 不响应事件
    clone.listening(false)
    // add clone to layer
    node.getLayer()?.add(clone)
    // set node className to `selected`
    node.addName('selected')
  })
}

export const select = (layer: Layer) => {
  const stage = layer.getStage()

  return Promise.race([pick(layer), dragSelect(layer)])
    .then(nodes => [nodes].flatMap(node => node))
    .then(nodes => {
      clearup(stage)
      setHightlight(nodes)
      select(layer)
      return nodes
    })
}
