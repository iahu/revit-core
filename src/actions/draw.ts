import { createShape, Entity, EntityType } from '@shapes/index'
import Komponent from '@shapes/komponent'
import Bluebird from 'bluebird'
import { Layer } from 'konva/lib/Layer'
import { Shape } from 'konva/lib/Shape'
import { Vector2d } from 'konva/lib/types'
import { delay, listenOn, useEventTarget, usePoinerPosition } from './helper'
import { mouseInput } from './input'
import { setCursor } from './set-cursor'
import { setTitle } from './set-title'

export interface DrawOptions {
  type: EntityType
  attributes?: Entity
  /** 自动开始，即默认就创建 */
  autoStart?: boolean
  /** 开始创建的事件名 */
  startEvent: keyof GlobalEventHandlersEventMap
  /** 更新参数的事件名 */
  updateEvent?: keyof GlobalEventHandlersEventMap
  /** 设置要更新的位置或尺寸，默认为尺寸 */
  updateAttribute?: 'position' | 'size'
  lockX?: boolean
  lockY?: boolean
  onUpdate?: (shape: Shape | Komponent, position: Vector2d) => void
  /** 确认事件名或自动确认延时时长 */
  confirmEvent?: keyof GlobalEventHandlersEventMap | number
}

export interface UpdateArgs {
  shape: Shape | Komponent
  startPosition: Vector2d
  endPosition: Vector2d
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
    attributes = {} as Entity,
    autoStart,
    startEvent,
    updateEvent = 'mousemove',
    updateAttribute = 'size',
    onUpdate: _onUpdate,
    confirmEvent = 'click',
    lockX,
    lockY,
  } = options
  const onUpdate = _onUpdate ?? updateAttribute === 'size' ? updateSize : updatePosition
  const stage = layer.getStage()

  const $create = new Bluebird<ReturnType<typeof createShape>>((resolve, reject, onCancel) => {
    if (!stage) {
      return reject('no stage found')
    }

    const shape = createShape({ ...attributes, type } as Entity)
    if (!shape) {
      return reject(`invalid shape typpe: "${type}"`)
    }

    const addShape = () => {
      layer.add(shape)
      return shape
    }
    if (autoStart) {
      addShape()
    }

    setTitle(layer, '点击以绘制图形')
    setCursor(layer, 'crosshair')
    return mouseInput(stage, startEvent)
      .then(useEventTarget)
      .then(usePoinerPosition)
      .then(startPosition => {
        updatePosition({ shape, startPosition, endPosition: startPosition })
        addShape()
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
          onUpdate({ shape, startPosition, endPosition })
        })

        onCancel?.($stopUpdate)

        if (typeof confirmEvent === 'number') {
          return delay(confirmEvent).then($stopUpdate).return(shape)
        } else {
          return mouseInput(stage, confirmEvent).then($stopUpdate).return(shape)
        }
      })
      .then(resolve)
      .finally(() => {
        setTitle(layer, '')
        setCursor(layer, '')
      })
  })

  return $create
}
