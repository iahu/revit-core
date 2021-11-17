import Konva from 'konva'
import { isSelectable, isShape } from './helper'

export const highlight = (layer: Konva.Layer) => {
  const stage = layer.getStage()
  let shadowColor = ''
  let shadowBlur = 0
  let targetOpacity = 1

  stage.on('mouseover', event => {
    const { target } = event
    if (isShape(target) && target.id() !== 'selection-rect' && isSelectable(target)) {
      // highlight
      shadowColor = target.shadowColor()
      shadowBlur = target.shadowBlur()
      targetOpacity = target.opacity()
      target.shadowColor('#3399ff')
      target.shadowBlur(2)
      target.opacity(1)
    }
  })

  stage.on('mouseout', event => {
    const { target } = event
    if (isShape(target) && target.id() !== 'selection-rect' && isSelectable(target)) {
      // recover
      target.shadowColor(shadowColor)
      target.shadowBlur(shadowBlur)
      target.opacity(targetOpacity)
    }
  })
}
