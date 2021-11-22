import Konva from 'konva'
import { Container } from 'konva/lib/Container'
import { Group } from 'konva/lib/Group'
import { isSelectable, isStage } from './helper'
import { setHightlight } from './select'

export const highlight = (layer: Konva.Layer) => {
  const stage = layer.getStage()

  stage.on('mouseover', event => {
    const { target } = event
    if (isStage(target)) return
    const closestTarget = isSelectable(target)
      ? target
      : target.parent instanceof Group && isSelectable(target.parent as Container)
      ? target.parent
      : null

    if (closestTarget) {
      setHightlight([closestTarget])
    }
  })
}
