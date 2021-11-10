import Konva from 'konva'
import { getBackgroundLayer } from '../helpers/background'
import { getDraftLayer } from '../helpers/draft'
import { getSelectionRect } from '../helpers/selection-rect'
import { getTransformer } from '../helpers/transfomer'

const selection = new Map<string, Konva.NodeConfig>()

export const select = (stage: Konva.Stage) => {
  const stageLayer = getBackgroundLayer(stage)
  const draftLayer = getDraftLayer(stage)

  let transformer = stageLayer.findOne('#global-transformer') as Konva.Transformer
  if (!transformer) {
    transformer = getTransformer(stage)
    stageLayer.add(transformer)
  }

  let selectionRect = stageLayer.findOne('#selection-rect') as Konva.Rect
  if (!selectionRect) {
    selectionRect = getSelectionRect(stage)
    stageLayer.add(selectionRect)
  }
  const setNodes = (nodes: (Konva.Shape | Konva.Group)[]) => {
    transformer.nodes().forEach(node => {
      const { stroke } = selection.get(node.id()) ?? {}
      node.setAttrs({ stroke })
    })
    nodes.forEach(node => {
      selection.set(node.id(), { ...node.getAttrs() })
      node.setAttrs({ stroke: '#0099ff' })
    })
    transformer.nodes(nodes)
  }

  let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0

  stageLayer.on('mousedown touchstart', e => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage || stageLayer.hasName('unselectable')) {
      return
    }

    e.evt.preventDefault()
    const position = stage.getPointerPosition() ?? { x: 0, y: 0 }
    x1 = position.x
    y1 = position.y
    x2 = position.x
    y2 = position.y

    selectionRect.x(x1)
    selectionRect.y(y1)
    selectionRect.visible(true)
    selectionRect.width(0)
    selectionRect.height(0)
  })

  stage.on('mousemove touchmove', e => {
    // do nothing if we didn't start selection
    if (!selectionRect.visible() || stageLayer.hasName('unselectable')) {
      return
    }
    e.evt.preventDefault()
    x2 = stage.getPointerPosition()?.x ?? 0
    y2 = stage.getPointerPosition()?.y ?? 0

    selectionRect.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    })
  })

  stage.on('mouseup touchend', e => {
    // do nothing if we didn't start selection
    if (!selectionRect.visible()) {
      return
    }
    e.evt.preventDefault()
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRect.visible(false)
    })

    if (stageLayer.hasName('unselectable')) {
      return
    }

    const shapes = stageLayer.children ?? []
    const box = selectionRect.getClientRect()
    const selected = shapes.filter(
      shape =>
        !shape.hasName('unselectable') &&
        !shape.getLayer()?.hasName('unselectable') &&
        Konva.Util.haveIntersection(box, shape.getClientRect()),
    )

    setNodes(selected)
  })

  // clicks should select/deselect shapes
  stage.on('click tap', function (e) {
    // if we are selecting with rect, do nothing
    if (selectionRect.visible()) {
      setNodes([])
      return
    }

    // if click on empty area - remove all selections
    const { target } = e

    if (target instanceof Konva.Stage) {
      if (!draftLayer.visible()) {
        setNodes([])
      }
      return
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey
    const isSelected = transformer.nodes().indexOf(e.target) >= 0
    if (target.hasName('unselectable')) {
      setNodes([])
    } else if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      setNodes([target])
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = transformer.nodes().slice() as Konva.Shape[] // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(target), 1)
      setNodes(nodes)
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = transformer.nodes().concat([target]) as Konva.Shape[]
      setNodes(nodes)
    }
  })
}
