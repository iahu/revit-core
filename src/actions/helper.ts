import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'

type FunctionWithCallback = (...args: any[]) => any

export const bindCallback = <T extends FunctionWithCallback>(fn: T) => {
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      fn(...args, (...result: any[]) => {
        resolve(result)
      })
    })
}

export const isShape = (target: Konva.Node): target is Konva.Shape => target instanceof Konva.Shape
export const isStage = (target: any): target is Konva.Stage => target instanceof Konva.Stage
export const isTextShape = (shape: Konva.Shape): shape is Konva.Text => shape instanceof Konva.Text
export const toTarget = <T>(event: Konva.KonvaEventObject<T>) => event.target
export const filter = <T>(fn: (value: T) => boolean, value: T) => (fn(value) ? value : new Error('unexpected'))

export const isType =
  <T>(type: string) =>
  (value: any): value is T =>
    Object.prototype.toString.call(value) === `[object ${type}]`
export const isNumber = isType<number>('Number')
export const isString = isType<string>('String')
export const isNull = isType<null>('Null')

export const notNull = <T>(v: T): v is NonNullable<T> => v !== null

type GetMultiType<T extends string> = T extends `${infer A} ${infer B}`
  ? GetMultiType<A> | GetMultiType<B>
  : T extends keyof DocumentEventMap
  ? KonvaEventObject<DocumentEventMap[T]>
  : T extends 'tap'
  ? KonvaEventObject<TouchEvent>
  : KonvaEventObject<Event>

export const onceOn = <T extends string>(
  target: Konva.Stage | Konva.Layer,
  type: T,
  lisenter: (event: GetMultiType<T>) => void,
) => {
  const handler = (event: GetMultiType<T>) => {
    lisenter(event)
    target.off(type, handler)
  }

  return target.on(type, handler)
}

export const isUnselectable = (target: Konva.Shape | Konva.Stage) =>
  target.hasName('unselectable') || target.getLayer()?.hasName('unselectable')

export const isSelectable = (target: Konva.Shape | Konva.Stage) => !isUnselectable(target)
