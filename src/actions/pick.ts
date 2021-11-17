import { Layer } from 'konva/lib/Layer'
import { Shape } from 'konva/lib/Shape'
import { isSelectable, isShape, listenOn } from './helper'

export const pick = (container: Layer) => {
  return new Promise<Shape>(resolve => {
    const stop = listenOn(container, 'click', event => {
      event.evt.preventDefault()
      const { target } = event

      if (isShape(target) && isSelectable(target)) {
        resolve(target)
        stop()
      }
    })
  })
}
