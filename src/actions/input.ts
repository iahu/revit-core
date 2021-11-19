import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'
import { GetMultiType, onceOn } from './helper'

export const input = <T extends string = 'click'>(container: Stage | Layer, type = 'click' as T) => {
  return new Promise<GetMultiType<T>>(resolve => {
    onceOn(container, type, resolve)
  })
}
