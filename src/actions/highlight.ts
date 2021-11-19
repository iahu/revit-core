import Konva from 'konva'
import { isSelectable, isShape } from './helper'
import { HIGHLIGHT_COLOR } from './select'

export const highlight = (layer: Konva.Layer) => {
  const stage = layer.getStage()
  let shadowColor = ''
  let shadowBlur = 0
  let opacity = 1
  let stroke = ''

  stage.on('mouseover', event => {
    const { target } = event
    if (isShape(target) && target.id() !== 'selection-rect' && isSelectable(target)) {
      // highlight
      shadowColor = target.shadowColor()
      shadowBlur = target.shadowBlur()
      opacity = target.opacity()
      stroke = target.stroke()

      // backup
      target.setAttrs({ backupOpacity: opacity, backupStroke: stroke })
      /**
       * highlight style
       */
      // shadow
      target.shadowColor(HIGHLIGHT_COLOR)
      target.shadowBlur(1)
      // stroke
      target.stroke(HIGHLIGHT_COLOR)
      // opacity
      target.opacity(1)
    }
  })

  stage.on('mouseout', event => {
    const { target } = event
    if (isShape(target) && target.id() !== 'selection-rect' && isSelectable(target)) {
      // recover
      const attrs = target.getAttrs()
      if (attrs.stroke === HIGHLIGHT_COLOR) {
        target.stroke(stroke)
      }
      if (attrs.shadowColor === HIGHLIGHT_COLOR) {
        target.shadowColor(shadowColor)
        target.shadowBlur(shadowBlur)
      }
      if (attrs.opacity === 1) {
        target.opacity(opacity)
      }
    }
  })
}
