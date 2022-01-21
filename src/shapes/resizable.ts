import { isString, SnapSides, useSnap } from '@actions/helper'
import { ContainerConfig } from 'konva/lib/Container'
import { KonvaEventObject } from 'konva/lib/Node'
import { Vector2d } from 'konva/lib/types'
import { deepClone, identity } from './helper'
import Komponent, { KomponentOptions } from './komponent'
import { attr } from './observer'
import { Vector } from './vector'

export type ResizeData<Value = any> = {
  originalValue?: Value
  /** mouseDown 坐标 */
  /** 起始点 坐标 */
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
  | ({ target: Komponent } & ResizeData<Value>)

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
  bubbles?: boolean
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
  @attr() bubbles = true

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

    this.on('mousedown', () => {
      const stage = this.getStage()
      if (stage) {
        const pos = stage.getPointerPosition() as Vector2d
        this.resizeData = { startX: pos.x, startY: pos.y } as ResizeData
      }
    })

    this.on('dragstart', e => {
      const { target } = e
      const stage = target.getStage()
      if (stage && this.resizable) {
        const { resizeData: { startX = 0, startY = 0 } = {} } = this
        const startPoint = stage.getPointerPosition() as Vector2d
        const rect = Vector.add(target.getClientRect({ skipStroke: true }), target.offset())
        const { resizeAttrs = 'absolutePosition' } = target.attrs
        const flatResizeAttrs = [resizeAttrs].flatMap(identity).filter(identity)
        const originalValue = flatResizeAttrs.reduce((o, key) => {
          o[key] = deepClone(getValue(this, key))
          return o
        }, {} as Record<string, any>)
        const startOffset = Vector.subtract(startPoint, { x: startX, y: startY })
        const start = Vector.subtract(startPoint, startOffset)
        const offset = Vector.subtract(start, rect)

        this.resizeData = {
          ...e,
          originalValue: isString(resizeAttrs) ? originalValue[resizeAttrs] : originalValue,
          startX: start.x,
          startY: start.y,
          offsetX: offset.x,
          offsetY: offset.y,
          movementX: 0,
          movementY: 0,
          pointerX: startPoint.x,
          pointerY: startPoint.y,
          snaped: false,
          timestamp: Date.now(),
        }

        this.fire('resizeStart', this.resizeData, this.bubbles)

        if (this.globalSnap) {
          this.globalPoints = stage
            .find('SnapButton')
            .filter(s => s !== e.target)
            .map(b => b.getAbsolutePosition())
        }
      }
    })

    this.on('dragmove', e => {
      const { target } = e
      const stage = target.getStage()
      const resizeData = this.resizeData
      if (stage && this.resizable && resizeData) {
        const { snapDistance: dist, snapSides } = this
        /**
         * 这里应该用图形“本身的坐标”，而不是光标坐标，去匹配捕捉点
         */
        const rect = Vector.add(target.getClientRect({ skipStroke: true }), target.offset())
        const snaped = useSnap(this.computedSnapPoints, dist, snapSides, rect)
        const end = {
          ...snaped,
          ...Vector.add(snaped, { x: resizeData.offsetX, y: resizeData.offsetY }),
        }
        this.resizeData = {
          ...e,
          ...resizeData,
          pointerX: end.x,
          pointerY: end.y,
          movementX: end.x - resizeData.startX,
          movementY: end.y - resizeData.startY,
          snaped: end.snapSides,
          timestamp: Date.now(),
        }

        this.fire('resize', this.resizeData, this.bubbles)
        if (end.snapSides) {
          this.fire('snap', this.resizeData, this.bubbles)
        }
      }
    })

    this.on('dragend', e => {
      if (this.resizable) {
        this.resizeData = undefined
        this.fire('resizeEnd', { ...e, type: 'resizeEnd' }, this.bubbles)
      }
    })
  }
}
