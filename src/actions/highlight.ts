import Konva from 'konva'
import { isShape } from './helper'

export const highlight = (layer: Konva.Layer) => {
  const stage = layer.getStage()
  let shadowColor = ''
  let shadowBlur = 0

  stage.on('mouseover', event => {
    const { target } = event
    if (isShape(target) && target.id() !== 'selection-rect') {
      // highlight
      shadowColor = target.shadowColor()
      shadowBlur = target.shadowBlur()
      target.shadowColor('#3399ff')
      target.shadowBlur(2)
    }
  })

  stage.on('mouseout', event => {
    const { target } = event
    if (isShape(target)) {
      // recover
      target.shadowColor(shadowColor)
      target.shadowBlur(shadowBlur)
    }
  })
}
