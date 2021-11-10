import Konva from 'konva'
import { fromEventPattern, map } from 'rxjs'
import { KonvaMouseEvent } from './input-subject'

type InputHandler = (event: KonvaMouseEvent) => void

//
const onMouseEvent = (stage: Konva.Stage, type: string) => (handler: InputHandler) => {
  stage.on(type, handler)
}
const offMouseEvent = (stage: Konva.Stage, type: string) => (handler: InputHandler) => {
  stage.off(type, handler)
}

export type MouseEventType = 'mousedown' | 'mouseup' | 'mousemove' | 'mouseover' | 'mouseenter' | 'mouseleave' | 'click'
export type MouseEventTypeWithNS<T> = T extends MouseEventType ? T | `${T}.${string}` : never

export const fromMouseEvent = <T extends string>(stage: Konva.Stage, type: MouseEventTypeWithNS<T>) =>
  fromEventPattern<KonvaMouseEvent>(onMouseEvent(stage, type), offMouseEvent(stage, type))

export const useMouseTarget = (event: KonvaMouseEvent) => event.target
