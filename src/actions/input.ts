import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'
import { GetMultiType, isSelectable, isShape, listenOn } from './helper'

export const input = <T extends string = 'click'>(container: Stage | Layer, type = 'click' as T) => {
  return new Promise<GetMultiType<T>>(resolve => {
    const stop = listenOn(container, type, event => {
      event.evt.preventDefault()
      const { target } = event
      if (!isShape(target)) {
        resolve(event)
        stop()
      } else if (isSelectable(target)) {
        resolve(event)
        stop()
      }
    })
  })
}
