import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'

export interface KonvaChangeEvent<T extends Konva.Node, K extends string & keyof T> extends KonvaEventObject<Event> {
  currentTarget: T
  newVal: T[K]
  oldVal: T[K]
  type: `${K}Change`
}

type ObserverOptions<T, V> = {
  beforeSet?: (value: V, oldValue: V, target: T) => V
  afterSet?: (oldValue: V | undefined, newValue: V, target: T) => void
  /**
   * 开始后，会添加 `set{Key}` `get{Key}` 方法，
   * 并且可以通过 `setAttr` `setAttrs`` 更新属性
   */
  konvaSetterGetter?: boolean
  fireChangeEvent?: boolean
}
const toCapCase = (s: string, prefix = '') => prefix + s[0].toUpperCase() + s.slice(1)

export type Getter<T extends Record<string, any>, K extends keyof T> = () => T[K]
export type Setter<T extends Record<string, any>, K extends keyof T> = (value: T[K]) => void
const id = <T>(v: T) => v

const invok = (target: any, key: string, args: any[] | any) => {
  const method = Reflect.get(target, key)
  if (typeof method === 'function') {
    return Reflect.apply(method, target, Array.isArray(args) ? args : [args])
  }
}

const _fireChangeEvent = (target: Konva.Node, key: string, eventData: any) => {
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
export function observer<T extends Konva.Node, P extends string & keyof T>(
  target: T,
  propertyKey: P,
  options?: ObserverOptions<T, T[P]>,
): ObserverDecorator<T, P>
export function observer<T extends Konva.Node, P extends string & keyof T>(
  options?: ObserverOptions<T, T[P]>,
): ObserverDecorator<T, P>
export function observer<T extends Konva.Node, P extends string & keyof T>(
  target?: T,
  propertyKey?: P,
  options?: ObserverOptions<T, T[P]>,
): ObserverDecorator<T, P> {
  const { beforeSet = id, afterSet, konvaSetterGetter = true, fireChangeEvent } = options || {}

  // decorator
  return function <R extends T = T, S extends string & keyof T = P>(
    target: R,
    key: S,
  ): asserts target is WithKonvaGetterSetter<R, S, R[S]> {
    let dirty = false

    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      // writable: true,
      set(nextValue: T[P]) {
        let value = Reflect.get(this.attrs, key)
        if (nextValue === value) return

        const oldVal = Reflect.get(this, key)

        if (dirty) {
          // config callback
          // lifecycle callback
          const newVal = beforeSet.call(this, nextValue, oldVal, this)
          const changedProp = { key, oldVal, newVal }
          invok(this, 'propWillUpdate', changedProp)

          value = nextValue
          invok(this, '__didUpdate', changedProp)

          invok(this, 'propDidUpdate', changedProp)
          afterSet?.call(this, oldVal, newVal, this)
          fireChangeEvent && _fireChangeEvent(this, key, changedProp)
        } else {
          value = nextValue
        }

        // attrs map
        const attrs = Reflect.get(this, 'attrs') ?? {}
        Reflect.set(this, 'attrs', attrs)
        attrs[key] = value

        dirty = true
      },
      get() {
        return this.attrs?.[key]
      },
    })

    // if (konvaSetterGetter) {
    //   // Konva style setter getter
    //   Object.defineProperty(target, toCapCase(key, 'set'), {
    //     value(value: P) {
    //       Reflect.set(this, key, value)
    //       return this
    //     },
    //   })
    //   Object.defineProperty(target, toCapCase(key, 'get'), {
    //     value() {
    //       return Reflect.get(this, key)
    //     },
    //   })
    // }
  }
}

/**
 * sample observe
 */
export const observe = observer()

export type ChangedProp = { key: string; oldVal: any; newVal: any }
export type PropChangeCallback = (prop: ChangedProp) => void

export interface Observed {
  /**
   * Observer 更新属性前回调
   */
  propWillChange?: PropChangeCallback
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
  render(): void
}
