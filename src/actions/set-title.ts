import Konva from 'konva'
import { isLayer, isStage, listenOn } from './helper'

export const setTitle = (node: Konva.Node, title: string): void => {
  const stage = node.getStage()
  if (!stage) return

  const container = stage.container()
  const originalTitle = container.title
  if (isStage(node) || isLayer(node)) {
    return container.setAttribute('title', title)
  }

  listenOn(stage, 'mouseover', e => {
    if (e.target === node) {
      container.setAttribute('title', title)
    } else {
      container.setAttribute('title', originalTitle)
    }
  })
}
