import Konva from 'konva'

type FunctionWithCallback = (...args: any[]) => any

export const bindCallback = <T extends FunctionWithCallback>(fn: T) => {
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      fn(...args, (...result: any[]) => {
        resolve(result)
      })
    })
}

export const isShape = <T>(target: Konva.Node): target is Konva.Shape => target instanceof Konva.Shape
export const isTextShape = (shape: Konva.Shape): shape is Konva.Text => shape instanceof Konva.Text
export const toTarget = <T>(event: Konva.KonvaEventObject<T>) => event.target
export const filter = <T>(fn: (value: T) => boolean, value: T) => (fn(value) ? value : new Error('unexpected'))
