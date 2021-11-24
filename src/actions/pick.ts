import { Group } from 'konva/lib/Group'
import { Layer } from 'konva/lib/Layer'
import { Shape } from 'konva/lib/Shape'
import { closestSelectable, isShape, listenOn } from './helper'

export const pick = (container: Layer) => {
  return new Promise<Shape | Group>(resolve => {
    const stop = listenOn(container, 'mousedown', event => {
      event.evt.preventDefault()
      const { target } = event
      const closestTarget = isShape(target) ? closestSelectable(target) : null

      if (closestTarget) {
        resolve(closestTarget)
        stop()
      }
    })
  })
}
