import Bluebird from 'bluebird'
import Konva from 'konva'
import { GetMultiType, Maybe, onceOn } from './helper'

export const mouseInput = <T extends string = 'click'>(container: Konva.Node, type = 'click' as T) => {
  const $input = new Bluebird<GetMultiType<T>>(resolve => {
    onceOn(container, type, event => {
      if (!$input.isCancelled()) return resolve(event)
    })
  })

  return $input
}

export const kadInput = <T = Maybe<Record<string | number, unknown>>>() => {
  return new Bluebird<T>((resolve, reject, onCancel) => {
    function onKadInput(e: Event) {
      if (e instanceof CustomEvent) {
        resolve(e.detail)
      }
    }
    window.addEventListener('kadInput', onKadInput, { once: true })

    onCancel?.(() => {
      window.removeEventListener('kadInput', onKadInput)
    })
  })
}
