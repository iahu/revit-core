import { fromEventPattern, map } from 'rxjs'

type InputHandler = (event: Event) => void
const onKeydown = (handler: InputHandler) => {
  window.addEventListener('keydown', handler)
}
const offKeydown = (handler: InputHandler) => {
  window.removeEventListener('keydown', handler)
}

export const fromKeyboard = () => fromEventPattern<KeyboardEvent>(onKeydown, offKeydown)

export const useKeyboardEventKey = () => fromKeyboard().pipe(map(e => e.key))
