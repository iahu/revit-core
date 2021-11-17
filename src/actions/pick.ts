import { Layer } from 'konva/lib/Layer'
import { Shape } from 'konva/lib/Shape'
import { isShape, onceOn } from './helper'

export const pick = (container: Layer) => {
  return new Promise<Shape>(resolve => {
    onceOn(container, 'click', event => {
      event.evt.preventDefault()

      if (isShape(event.target)) {
        resolve(event.target)
      }
    })
  })
}
