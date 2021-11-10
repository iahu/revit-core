import Konva from 'konva'
import { inputSubject } from './input-subject'
import { fromKeyboard } from './keyboard'
import { fromMouseEvent } from './mouse'

export type FromInputOption = {
  useKeyboard: boolean
  useMouse: boolean
}

export const useInputSubject = (stage: Konva.Stage, options = {} as FromInputOption) => {
  const { useKeyboard, useMouse } = options
  if (useKeyboard) {
    fromKeyboard().subscribe(inputSubject.next)
  } else if (useMouse) {
    fromMouseEvent(stage, 'mousedown').subscribe(inputSubject.next)
  } else {
    inputSubject.next(null)
  }

  return inputSubject
}
