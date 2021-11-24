import Konva from 'konva'
import { GetMultiType, onceOn } from './helper'

export const input = <T extends string = 'click'>(container: Konva.Node, type = 'click' as T) => {
  return new Promise<GetMultiType<T>>(resolve => {
    onceOn(container, type, resolve)
  })
}
