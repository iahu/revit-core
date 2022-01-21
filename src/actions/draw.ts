import { createShape, Entity, EntityType, ShapeOrKomponent } from '@shapes/index'
import Bluebird from 'bluebird'
import { stroke } from '../config'
import { Layer } from 'konva/lib/Layer'
import { Vector2d } from 'konva/lib/types'
import { delay, listenOn, noop, SnapSides, useEventTarget, usePoinerPosition, useSnap } from './helper'
import { mouseInput } from './input'
import { setCursor } from './set-cursor'
import { setTitle } from './set-title'
import { query } from '@api/query'
import { Shape } from 'konva/lib/Shape'

export interface UpdateArgs {
  shape: ShapeOrKomponent
  startPosition: Vector2d
  endPosition: Vector2d
  [key: string]: any
}

export const updatePosition = (args: UpdateArgs) => {
  const { shape, endPosition } = args
  shape.setAttrs(endPosition)
  return shape
}

export const updateSize = (args: UpdateArgs) => {
  const { shape, startPosition, endPosition } = args
  const width = Math.abs(endPosition.x - startPosition.x)
  const height = Math.abs(endPosition.y - startPosition.y)
  shape.setAttrs({
    x: Math.min(startPosition.x, endPosition.x),
    y: Math.min(startPosition.y, endPosition.y),
    width,
    height,
  })
  return shape
}

export const updatePoints = (args: UpdateArgs) => {
  const { shape, startPosition, endPosition, ...others } = args
  const points = shape.getAttr('points')
  const startPoint = shape.getAttr('startPoint')
  const endPoint = shape.getAttr('endPoint')
  const [x1, y1, x2, y2] = [startPosition.x, startPosition.y, endPosition.x, endPosition.y]

  if (points) {
    shape.setAttrs({ points: [x1, y1, x2, y2], ...others })
  } else if (startPoint && endPoint) {
    const { x, y } = shape.getAbsolutePosition()
    // 相对定位，也许可以支持绝对定位
    shape.setAttrs({ startPoint: args.startPoint ?? [x1 - x, y1 - y], endPoint: [x2 - x, y2 - y] })
  }
  return shape
}

const onUpdateMap = {
  position: updatePosition,
  size: updateSize,
  points: updatePoints,
}

export interface DrawOptions {
  type: EntityType
  /** 将绘制图形的属性 */
  shapeAttrs?: Entity
  /** 自动开始，即默认就创建 */
  autoStart?: boolean
  /** 开始创建的事件名 */
  startEvent: keyof GlobalEventHandlersEventMap
  /** 更新参数的事件名 */
  updateEvent?: keyof GlobalEventHandlersEventMap
  /** 设置要更新的位置或尺寸，默认为尺寸 */
  updateAttribute?: keyof typeof onUpdateMap
  lockX?: boolean
  lockY?: boolean
  beforeStart?: (updateArgs: UpdateArgs) => void
  onStart?: (updateArgs: UpdateArgs) => void
  afterStart?: (updateArgs: UpdateArgs) => void
  onUpdate?: (updateArgs: UpdateArgs) => void
  onEnd?: (shape: ShapeOrKomponent) => void
  /** 确认事件名或自动确认延时时长 */
  confirmEvent?: keyof GlobalEventHandlersEventMap | number
  /** 贪心模式 */
  greedy?: boolean

  /**
   * 开启自动捕捉
   */
  snap?: boolean
  snapSides?: SnapSides
  // 额外的捕捉点
  snapPoints?: Vector2d[]
  snapDistance?: number
}

/**
 * 画出操作
 *
 * 示例1：根据超始点在 X 轴方向动态绘制“标高”线，并以再次点击确认绘制
 *```ts
 * draw(layer, { type: 'elevation', lockY: true})
 * ```
 *
 * 示例2：以固定大小画红色“标高”线
 * ```ts
 * draw(layer, { type: 'elevation', updateAttribute: 'position', attributes: { stroke: 'red', width: 200 } })
 *```
 *
 */
export const draw = (layer: Layer, options = {} as DrawOptions) => {
  const {
    type,
    shapeAttrs = {} as Entity,
    autoStart,
    startEvent,
    updateEvent = 'mousemove',
    updateAttribute = 'size',
    beforeStart = noop,
    onStart: _onStart,
    afterStart = noop,
    onUpdate: _onUpdate,
    onEnd = noop,
    confirmEvent = 'click',
    lockX,
    lockY,
    snap = true,
    snapSides = 'any',
    snapPoints: _snapPoints,
    snapDistance = 5,
  } = options
  const onUpdate = _onUpdate ?? onUpdateMap[updateAttribute] ?? updateSize
  const onStart = _onStart ?? onUpdate
  const stage = layer.getStage()

  const $create = new Bluebird<ReturnType<typeof createShape>>((resolve, reject, onCancel) => {
    if (!stage) {
      return reject('no stage found')
    }

    const shape = createShape({ stroke, ...shapeAttrs, type } as Entity)
    if (!shape) {
      return reject(`invalid shape typpe: "${type}"`)
    }

    const addShape = () => {
      layer.add(shape)
      shape.zIndex((layer.children as Shape[]).length - 1 - snapButtons.length)
      return shape
    }

    const snapButtons = query(layer, '> SnapButton')
    const snapPoints = _snapPoints ?? snapButtons.map(btn => btn.getAbsolutePosition())
    const useSnapPoints = snap ? useSnap.bind(null, snapPoints, snapDistance, snapSides) : (p: Vector2d) => p

    let $start: Bluebird<{ shape: ShapeOrKomponent; startPosition: Vector2d }>
    if (autoStart) {
      $start = Bluebird.resolve(addShape()).then(shape => {
        return { shape, startPosition: shape.getAbsolutePosition() }
      })
    } else {
      setTitle(layer, '点击以绘制图形')
      setCursor(layer, 'crosshair')

      snapButtons.forEach(b => b.moveToTop())
      $start = mouseInput(stage, startEvent)
        .then(useEventTarget)
        .then(usePoinerPosition)
        .then(useSnapPoints)
        .then(startPosition => {
          return { shape, startPosition }
        })
    }

    return $start
      .then(({ shape, startPosition }) => {
        const updateArgs = { shape, startPosition, endPosition: startPosition, ...shapeAttrs }
        beforeStart(updateArgs)
        onStart(updateArgs)
        addShape()
        afterStart(updateArgs)
        onCancel?.(() => {
          if ($create.isPending()) {
            shape.destroy()
          }
        })
        return { shape, startPosition }
      })
      .then(({ shape, startPosition }) => {
        setTitle(layer, '再次点击以确认')
        const $stopUpdate = listenOn(stage, updateEvent, e => {
          const _endPosition = usePoinerPosition(e.target)
          const endPosition = {
            x: lockX ? startPosition.x : _endPosition.x,
            y: lockY ? startPosition.y : _endPosition.y,
          }
          onUpdate({ shape, startPosition, endPosition: useSnapPoints(endPosition) })
        })

        onCancel?.($stopUpdate)

        const $end = typeof confirmEvent === 'number' ? delay(confirmEvent) : mouseInput(stage, confirmEvent)
        return $end.then($stopUpdate).return(shape).tap(onEnd).return(shape)
      })
      .then(resolve)
      .finally(() => {
        setTitle(layer, '')
        setCursor(layer, '')
      })
  })

  return $create
}
