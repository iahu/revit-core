import { isString } from '@actions/helper'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Vector2d } from 'konva/lib/types'
import { snap } from './helper'
import Komponent, { KomponentOptions } from './komponent'
import { attr } from './observer'

type ResizeData<Value = any> = {
  originalValue?: Value
  /** 起始点 x 坐标 */
  startX: number
  startY: number
  /** 起始点与目标元素坐标在 x 轴上的偏移量 */
  offsetX: number
  offsetY: number
  /** x 轴改变的尺寸大小 */
  movementX: number
  movementY: number
  pointerX: number
  pointerY: number
}

export type ResizeEvent<Value = any> =
  | (KonvaEventObject<UIEvent> & ResizeData<Value>)
  | ({ target: Komponent } & ResizeData<Value>)

export interface ResizableOptions extends KomponentOptions {
  resizable?: boolean
  resizeAttrs?: string | string[]
  /**
   * 距离捕捉
   * @TODO 自定义捕捉目标
   */
  snapDistance?: number
}

const getValue = (target: Komponent, key: string) => {
  if (Reflect.has(target, key)) {
    const value = Reflect.get(target, key)
    if (typeof value === 'function') {
      return Reflect.apply(value, target, [])
    }
    return value
  } else if (Reflect.has(target.attrs, key)) {
    return target.attrs[key]
  }
}

export class Resizable extends Komponent implements ResizableOptions {
  @attr() resizable = true
  /**
   * resizeStart 时记录当前元素 resizeAttrs 属性[列表]的值(或字典)
   */
  @attr() resizeAttrs = 'absolutePosition' as string[] | string | undefined
  @attr() snapDistance = 5

  #resizeData: ResizeData | undefined

  constructor(options?: ResizableOptions & ContainerConfig) {
    super(options)

    this.on('dragstart', e => {
      const { target } = e
      const stage = target.getStage()
      if (stage && this.resizable) {
        const start = stage.getPointerPosition() as Vector2d
        const pos = target.getAbsolutePosition()
        const resizeAttrs = target.attrs.resizeAttrs as string[] | string
        const originalValue = [resizeAttrs]
          .flatMap(r => r)
          .filter(r => r)
          .reduce((o, key) => {
            const value = getValue(this, key)
            o[key] = value === undefined ? value : JSON.parse(JSON.stringify(value))
            return o
          }, {} as Record<string, any>)

        this.#resizeData = {
          originalValue: isString(resizeAttrs) ? originalValue[resizeAttrs] : originalValue,
          startX: start.x,
          startY: start.y,
          offsetX: start.x - pos.x,
          offsetY: start.y - pos.y,
          movementX: 0,
          movementY: 0,
          pointerX: start.x,
          pointerY: start.y,
        }

        this.fire('resizeStart', { ...e, type: 'resizeStart' })
      }
    })

    this.on('dragmove', e => {
      const stage = e.target.getStage()
      const resizeData = this.#resizeData
      if (stage && this.resizable && resizeData) {
        const end = stage.getPointerPosition() as Vector2d
        const { snapDistance: dist } = this
        /**
         * @TODO 除了 startX/Y 之外，可从外部传入数据进行捕捉匹配
         */
        end.x = snap(resizeData.startX, end.x, dist)
        end.y = snap(resizeData.startY, end.y, dist)

        this.fire('resize', {
          ...e,
          type: 'resize',
          ...resizeData,
          pointerX: end.x,
          pointerY: end.y,
          movementX: end.x - resizeData.startX,
          movementY: end.y - resizeData.startY,
        } as ResizeEvent)
      }
    })

    this.on('dragend', e => {
      if (this.resizable) {
        this.#resizeData = undefined
        this.fire('resizeEnd', { ...e, type: 'resizeEnd' })
      }
    })
  }
}
