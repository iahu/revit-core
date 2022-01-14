import { isString, SnapSides, useSnap } from '@actions/helper'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Vector2d } from 'konva/lib/types'
import Komponent, { KomponentOptions } from './komponent'
import { attr } from './observer'

export type ResizeData<Value = any> = {
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
  snaped?: SnapSides | boolean
  timestamp?: number
}

export type ResizeEvent<Value = any> =
  | (KonvaEventObject<UIEvent> & ResizeData<Value>)
  | ({ target: Resizable } & ResizeData<Value>)

export interface ResizableOptions extends KomponentOptions {
  resizable?: boolean
  resizeAttrs?: string | string[]
  /**
   * 距离捕捉
   * @TODO 自定义捕捉目标
   */
  snapDistance?: number
  snapSides?: SnapSides
  snapPoints?: Vector2d[]
  /**
   * 全局捕捉 `SnapButton`
   */
  globalSnap?: boolean
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
   * 1. 传 string[] resizeEvent.originalValue 为对象的 key
   * 2. 传 string 则 resizeEvent.originalValue 为其对应的值
   */
  @attr() resizeAttrs = 'absolutePosition' as string[] | string | undefined
  @attr() snapDistance = 5
  @attr() snapSides = 'any' as SnapSides
  @attr() snapPoints: Vector2d[] | undefined
  @attr() globalSnap = true

  resizeData: ResizeData | undefined

  getSnapPoints(): Vector2d[] {
    return this.attrs.snapPoints ?? []
  }

  /**
   * 全局捕捉点
   */
  protected globalPoints = [] as Vector2d[]

  get computedSnapPoints(): Vector2d[] {
    const { globalSnap, snapPoints = [], globalPoints } = this
    if (globalSnap) {
      return [...snapPoints, ...globalPoints]
    }
    return snapPoints
  }

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

        this.resizeData = {
          originalValue: isString(resizeAttrs) ? originalValue[resizeAttrs] : originalValue,
          startX: start.x,
          startY: start.y,
          offsetX: start.x - pos.x,
          offsetY: start.y - pos.y,
          movementX: 0,
          movementY: 0,
          pointerX: start.x,
          pointerY: start.y,
          snaped: false,
          timestamp: Date.now(),
        }

        this.fire('resizeStart', { ...e, type: 'resizeStart' })

        if (this.globalSnap) {
          this.globalPoints = stage.find('SnapButton').map(b => b.getAbsolutePosition())
        }
      }
    })

    this.on('dragmove', e => {
      const stage = e.target.getStage()
      const resizeData = this.resizeData
      if (stage && this.resizable && resizeData) {
        const pos = stage.getPointerPosition() as Vector2d
        const { snapDistance: dist, snapSides } = this

        const end = useSnap(this.computedSnapPoints, dist, pos, snapSides)
        this.resizeData = {
          ...e,
          ...resizeData,
          pointerX: end.x,
          pointerY: end.y,
          movementX: end.x - resizeData.startX + resizeData.offsetX,
          movementY: end.y - resizeData.startY + resizeData.offsetY,
          snaped: end.snapSides,
          timestamp: Date.now(),
        }
        this.fire('resize', this.resizeData)
        if (end.snapSides) {
          this.fire('snap', this.resizeData)
        }
      }
    })

    this.on('dragend', e => {
      if (this.resizable) {
        this.resizeData = undefined
        this.fire('resizeEnd', { ...e, type: 'resizeEnd' })
      }
    })
  }
}
