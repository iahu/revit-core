import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'
import { dragSelect } from './drag-select'
import { logger, onceOn } from './helper'
import { pick } from './pick'

export const HIGHLIGHT_COLOR = '#0096FF'
export const HIGHLIGHT_CLASSNAME = 'highlight-node-clone'

const clearup = (stage: Stage) => {
  stage.find('.selected').forEach(node => node.removeName('selected'))
  stage.find('.highlight-node-clone').forEach(clone => clone.destroy())
}

export const setHightlight = (nodes: (Konva.Shape | Konva.Group)[]) => {
  nodes.forEach(node => {
    // set node className to `highlight`
    node.addName('highlight')

    const attrs = node.getAttrs()
    const clone = node.clone({
      ...attrs,
      name: `${HIGHLIGHT_CLASSNAME} unselectable`,
      stroke: attrs.stroke && HIGHLIGHT_COLOR,
      fill: attrs.fill && HIGHLIGHT_COLOR,
      shadowColor: attrs.shadowColor ?? HIGHLIGHT_COLOR,
      shadowBlur: 2,
      opacity: 0.7,
    }) as typeof node

    if (!attrs.stroke && !attrs.fill) {
      clone.setAttr('stroke', HIGHLIGHT_COLOR)
    }
    // 不响应事件
    clone.listening(false)
    // add clone to layer
    node.getLayer()?.add(clone)
    clone.zIndex(4)

    onceOn(node, 'mouseout mousedown', () => {
      clone.destroy()
      node.removeName('highlight')
    })
  })
}

export const select = (layer: Layer) => {
  const stage = layer.getStage()

  return Promise.race([pick(layer), dragSelect(layer)])
    .then(nodes => [nodes].flatMap(node => node))
    .then(logger)
    .then(nodes => {
      clearup(stage)
      setHightlight(nodes)
      select(layer)
      return nodes
    })
}
