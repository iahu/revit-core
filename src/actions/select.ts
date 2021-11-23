import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Shape } from 'konva/lib/Shape'
import { Stage } from 'konva/lib/Stage'
import { dragSelect } from './drag-select'
import { listenOn, logger, notUndefined, onceOn } from './helper'
import { pick } from './pick'

export const HIGHLIGHT_COLOR = '#0096FF'
export const HIGHLIGHT_CLASSNAME = 'highlight-node-clone'
export const SELECTED_CLASSNAME = 'selected'

const clearup = (stage: Stage) => {
  stage.find(`.${SELECTED_CLASSNAME}`).forEach(node => node.removeName(`${SELECTED_CLASSNAME}`))
  stage.find(`.${HIGHLIGHT_CLASSNAME}`).forEach(clone => clone.destroy())
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

    const stopDragmove = listenOn(node, 'dragmove', () => {
      clone.setPosition(node.getPosition())
    })

    onceOn(node, 'mouseout', () => {
      stopDragmove()
      clone.destroy()
      node.removeName('highlight')
    })
  })
}

export const select = (layer: Layer) => {
  const stage = layer.getStage()

  return Promise.race([pick(layer), dragSelect(layer)])
    .then(nodes => [nodes].flatMap(node => node))
    .then(nodes => nodes.filter(notUndefined))
    .then(logger)
    .then(nodes => {
      clearup(stage)
      setHightlight(nodes)
      nodes.forEach(node => node.addName(SELECTED_CLASSNAME))
      select(layer)
      return nodes
    })
    .catch(e => {
      if (e instanceof Error) {
        console.log(e.message)
      } else {
        console.log(e.toString())
      }
      return Promise.resolve([])
    })
}
