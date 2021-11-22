import Konva from 'konva'
import { Container } from 'konva/lib/Container'
import { Group } from 'konva/lib/Group'
import { Layer } from 'konva/lib/Layer'
import { KonvaEventObject } from 'konva/lib/Node'
import { Shape } from 'konva/lib/Shape'
import { Stage } from 'konva/lib/Stage'
import { Vector2d } from 'konva/lib/types'

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
export const isStage = (target: Konva.Node): target is Konva.Stage => target instanceof Konva.Stage
export const isTextShape = (shape: Konva.Shape): shape is Konva.Text => shape instanceof Konva.Text
export const toTarget = <T>(event: Konva.KonvaEventObject<T>) => event.target
// export const filter = <T>(fn: (value: T) => boolean, value: T) => (fn(value) ? value : new Error('unexpected'))

export const isType =
  <T>(type: string) =>
  (value: any): value is T =>
    Object.prototype.toString.call(value) === `[object ${type}]`
export const isNumber = isType<number>('Number')
export const isString = isType<string>('String')
export const isNull = isType<null>('Null')

export const notNull = <T>(v: T): v is NonNullable<T> => v !== null
export const notUndefined = <T>(v: T): v is NonNullable<T> => v !== undefined

export type GetMultiType<T extends string> = T extends `${infer A} ${infer B}`
  ? GetMultiType<A> | GetMultiType<B>
  : T extends `${infer C}.${string}`
  ? GetMultiType<C>
  : T extends keyof DocumentEventMap
  ? KonvaEventObject<DocumentEventMap[T]>
  : T extends 'tap'
  ? KonvaEventObject<TouchEvent>
  : KonvaEventObject<Event>

export const KAD_ACTION_NS = 'kadAction'
export const withKadActionNS = (s: string) => (s.includes('.') ? s : `${s}.${KAD_ACTION_NS}`)
export const ensureWithNS = (type: string) => type.split(' ').map(withKadActionNS).join(' ')

export const onceOn = <T extends string>(target: Konva.Node, type: T, lisenter: (event: GetMultiType<T>) => void) => {
  const typeWithNS = ensureWithNS(type)
  const handler = (event: GetMultiType<T>) => {
    lisenter(event)
    target.off(typeWithNS, handler)
  }

  return target.on(typeWithNS, handler)
}

type Unsubscribe = <T>(arg?: T) => T | undefined
export const listenOn = <T extends string>(
  target: Konva.Node,
  type: T,
  lisenter: (event: GetMultiType<T>) => void,
): Unsubscribe => {
  const typeWithNS = ensureWithNS(type)

  target.on(typeWithNS, lisenter)

  return <T>(arg?: T) => {
    target.off(typeWithNS, lisenter)
    return arg
  }
}

export type SelectableNodes = Shape | Stage | Group | Container

export const isUnselectable = (target: SelectableNodes) => {
  return (
    target.hasName('unselectable') ||
    target.parent?.hasName('unselectable') ||
    target.getLayer()?.hasName('unselectable')
  )
}

export const isSelectable = (target: SelectableNodes) => !isUnselectable(target)

export const preventDefault = (event: KonvaEventObject<Event>) => {
  event.evt.preventDefault()
  return event
}
export const stopImmediatePropagation = (event: KonvaEventObject<Event>) => {
  event.evt.stopImmediatePropagation()
  return event
}
export const useEventTarget = <T extends KonvaEventObject<Event>>(event: T) => event.target
export const usePoinerPosition = (stageOrLayer: Stage | Layer | Shape) =>
  stageOrLayer.getStage()?.getPointerPosition() ?? { x: 0, y: 0 }

export const vector2Point = (vector: Vector2d) => [vector?.x ?? 0, vector?.y ?? 0]

export const logger = <T>(v: T) => {
  console.log(v)
  return v
}

export const getCenterPoint = (node: Konva.Node): Vector2d => {
  const { x, y, width, height } = node.getClientRect()
  return { x: x + width / 2, y: y + height / 2 }
}

export const handleOn =
  <T extends string>(container: Stage | Layer, type: T) =>
  (handler: (e: GetMultiType<T>) => void) => {
    container.on(type, handler)
  }

export const handleOff =
  <T extends string>(container: Stage | Layer, type: T) =>
  (handler: (e: GetMultiType<T>) => void) => {
    container.off(type, handler)
  }

export const draggable = <T extends Konva.Node>(t: T) =>
  t.draggable() ? Promise.resolve(t) : Promise.reject(new Error('not draggable'))
