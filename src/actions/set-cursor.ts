import Konva from 'konva'
import { isLayer, isStage, listenOn } from './helper'

export const setCursor = (node: Konva.Node, cursor: string): void => {
  const stage = node.getStage()
  if (!stage) return

  const container = stage.container()
  if (isStage(node) || isLayer(node)) {
    container.style.cursor = cursor
    return
  }

  listenOn(stage, 'mouseover', e => {
    if (e.target === node) {
      container.style.cursor = cursor
    } else {
      container.style.cursor = ''
    }
  })
}
