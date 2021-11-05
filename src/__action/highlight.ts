import Store from '../data/store'
import { isShape } from './helper'

export const highlight = (store: Store) => {
  const { stage } = store
  let shadowColor = ''
  let shadowBlur = 0

  stage.on('mouseover', event => {
    const { target } = event
    if (isShape(target)) {
      // highlight
      shadowColor = target.shadowColor()
      shadowBlur = target.shadowBlur()
      target.shadowColor('#0099ff')
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
