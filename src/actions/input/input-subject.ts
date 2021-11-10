import Konva from 'konva'
import { BehaviorSubject } from 'rxjs'

export type KonvaMouseEvent = Konva.KonvaEventObject<MouseEvent>
export const inputSubject = new BehaviorSubject<KonvaMouseEvent | KeyboardEvent | null>(null)
export type InputSubject = typeof inputSubject
