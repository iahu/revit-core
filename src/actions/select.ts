import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Shape } from 'konva/lib/Shape'
import { Stage } from 'konva/lib/Stage'
import { dragSelect } from './drag-select'
import { listenOn, logger, notUndefined, onceOn } from './helper'
import { pick } from './pick'

export const HIGHLIGHT_COLOR = '#0096FF'
export const SELECTED_CLASSNAME = 'selected'
export const HIGHLIGHT_CLASSNAME = 'highlight'
export const HIGHLIGHT_CLONE_NODE_CLASSNAME = 'highlight-clone-node'

const clearup = (stage: Stage) => {
  stage.find(`.${HIGHLIGHT_CLONE_NODE_CLASSNAME}`).forEach(clone => clone.destroy())
  stage.find(`.${HIGHLIGHT_CLASSNAME}`).forEach(n => n.removeName(HIGHLIGHT_CLASSNAME))
  stage.find(`.${SELECTED_CLASSNAME}`).forEach(n => n.removeName(SELECTED_CLASSNAME))
}

const getCloneAttrs = (node: Konva.Node) => {
  const attrs = node.getAttrs()
  const clone = {
    ...attrs,
    name: `${HIGHLIGHT_CLONE_NODE_CLASSNAME} ${HIGHLIGHT_CLASSNAME} unselectable`,
    stroke: attrs.stroke && HIGHLIGHT_COLOR,
    fill: attrs.fill && HIGHLIGHT_COLOR,
    shadowColor: attrs.shadowColor ?? HIGHLIGHT_COLOR,
    shadowBlur: 2,
    opacity: 0.8,
    cloneId: node._id,
  }

  if (!attrs.stroke && !attrs.fill) {
    clone.stroke = HIGHLIGHT_COLOR
  }

  return clone
}

export const setHightlight = (nodes: (Konva.Shape | Konva.Group)[]) => {
  nodes.forEach(node => {
    const layer = node.getLayer()
    if (!layer) return
    // set node className to `highlight`
    node.addName(HIGHLIGHT_CLASSNAME)

    const id = node._id
    const isClone = (n: Konva.Node) => n.getAttr('cloneId') === id
    let clone = layer.find(`.${HIGHLIGHT_CLONE_NODE_CLASSNAME}`).find(isClone) as Shape
    if (!clone) {
      clone = node.clone(getCloneAttrs(node))

      // 不响应事件
      clone.listening(false)
      // add clone to layer

      layer.add(clone)
      clone.zIndex(4)
    }

    const stopDragmove = listenOn(node, 'dragmove', () => {
      clone.setPosition(node.getPosition())
    })

    onceOn(node, 'mouseout', () => {
      stopDragmove()
      if (!node.hasName(SELECTED_CLASSNAME)) {
        clone.destroy()
        layer.find(`.${HIGHLIGHT_CLONE_NODE_CLASSNAME}`).find(isClone)?.destroy()
        node.removeName(HIGHLIGHT_CLASSNAME)
        node.removeName(SELECTED_CLASSNAME)
      }
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
