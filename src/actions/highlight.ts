import Konva from 'konva'
import { closestSelectable, isStage } from './helper'
import { setHightlight } from './select'

export const highlight = (layer: Konva.Layer) => {
  const stage = layer.getStage()

  stage.on('mouseover', event => {
    const { target } = event

    if (isStage(target)) return
    const closestTarget = closestSelectable(target)

    if (closestTarget) {
      setHightlight([closestTarget])
    }
  })
}
