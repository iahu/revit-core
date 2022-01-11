import Konva from 'konva'
import { KonvaEventObject, Node } from 'konva/lib/Node'
import { Shape } from 'konva/lib/Shape'

export interface KonvaChangeEvent<T extends Konva.Node, K extends string & keyof T> extends KonvaEventObject<Event> {
  currentTarget: T
  newVal: T[K]
  oldVal: T[K]
  type: `${K}Change`
}

type ObserverOptions<T, V> = {
  beforeSet?: (value: V, oldValue: V, target: T) => V
  afterSet?: (oldValue: V | undefined, newValue: V, target: T) => void
  useGetterSetter?: boolean
  fireChangeEvent?: boolean
  /**
   * 请求 Konva 更新
   */
  requestDraw?: boolean
}
const toCapCase = (s: string, prefix = '') => prefix + s[0].toUpperCase() + s.slice(1)

export type Getter<T extends Record<string, any>, K extends keyof T> = () => T[K]
export type Setter<T extends Record<string, any>, K extends keyof T> = (value: T[K]) => void
const id = <T>(v: T) => v

export const invok = (target: any, key: string, args: any[] | any) => {
  const method = Reflect.get(target, key)
  if (typeof method === 'function') {
    return Reflect.apply(method, target, Array.isArray(args) ? args : [args])
  }
}

export const _fireChangeEvent = (target: Konva.Node, key: string, eventData: any) => {
  if (target instanceof Konva.Node) {
    target.fire(`${key}Change`, eventData)
  }
}

export type GetterName<T extends string> = `get${Capitalize<T>}`
export type SetterName<T extends string> = `set${Capitalize<T>}`

type KonvaGetterSetter<T extends string, V> = {
  [K in GetterName<T>]: () => V
} & {
  [K in SetterName<T>]: (value: V) => void
}

type WithKonvaGetterSetter<T, K extends string, V> = T & KonvaGetterSetter<K, V>

type ObserverDecorator<R extends Konva.Node, S extends string & keyof R> = (
  target: R,
  key: S,
) => asserts target is WithKonvaGetterSetter<R, S, R[S]>

/**
 * Konva style set/get observer decorator
 */
export function attr<T extends Konva.Node = any, P extends string & keyof T = any>(
  options?: ObserverOptions<T, T[P]>,
): ObserverDecorator<T, P> {
  // decorator
  const { beforeSet = id, afterSet, useGetterSetter, fireChangeEvent, requestDraw } = options ?? {}
  return function (target: T, key: P) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      // writable: true,
      set(this: T, nextValue: T[P]) {
        const oldVal = Reflect.get(this, key)
        if (Object.is(nextValue, oldVal)) return
        // attrs map
        const _attrs = Reflect.get(this, 'attrs')
        const attrs = _attrs ?? ({} as Record<string, unknown>)
        if (!_attrs) {
          Reflect.set(this, 'attrs', attrs)
        }

        const hasRendered = Reflect.get(this, '__hasRendered')
        if (Reflect.has(attrs, key) || hasRendered) {
          const newVal = beforeSet.call(this, nextValue, oldVal, this)
          const changedProp = { key, oldVal, newVal }
          attrs[key] = nextValue
          afterSet?.call(this, oldVal, newVal, this)
          fireChangeEvent && _fireChangeEvent(this, key, changedProp)
        } else {
          attrs[key] = nextValue
        }

        if (requestDraw || (!useGetterSetter && target instanceof Shape)) {
          this._requestDraw()
        }
      },
      get() {
        const getter = Reflect.get(this, toCapCase(key, 'get'))
        return getter ? Reflect.apply(getter, this, []) : this.attrs?.[key]
      },
    })

    if (useGetterSetter) {
      addGetterSetter(target, key)
    }
  }
}

export const addGetterSetter = <T, K extends string & keyof T>(target: T, key: K) => {
  // Konva style setter getter
  Object.defineProperty(target, toCapCase(key, 'set'), {
    value(value: K) {
      if (value !== Reflect.get(this, key)) {
        Reflect.set(this, key, value)
      }
      return this
    },
  })
  Object.defineProperty(target, toCapCase(key, 'get'), {
    value() {
      return Reflect.get(this, key)
    },
  })
}

/**
 * sample observe
 */
export type ChangedProp<T = any, K extends string = string> = { key: K; oldVal: T; newVal: T }
export type PropChangeCallback = (prop: ChangedProp) => void

export interface Observed {
  /**
   * Observer 更新属性前回调
   */
  propWillUpdate?: PropChangeCallback
  /**
   * Observer 更新属性后回调
   */
  propDidUpdate?: PropChangeCallback

  /**
   * 更新渲染结果
   */
  update?: () => void
  /**
   * 渲染到 Konva
   */
  render(): null | Node[]
}

interface Newable {
  new (...args: any[]): any
}

export const observe = <T extends Newable>(constructor: T) => {
  return class Observed extends constructor {
    constructor(...args: any[]) {
      super(...args)

      this.attrs = new Proxy({ ...this.attrs } as Record<string, any>, {
        set: (attrs, key: string, value) => {
          const oldVal = attrs[key]
          const hasRendered = this.__hasRendered
          if (oldVal === value) {
            return true
          }

          hasRendered && this.propWillUpdate({ key, oldVal, newVal: value })
          attrs[key] = value // set value
          this.__didUpdate()
          hasRendered && this.propDidUpdate({ key, oldVal, newVal: value })
          this._fireChangeEvent(key, oldVal, value)
          return true
        },
      })
    }
  }
}
