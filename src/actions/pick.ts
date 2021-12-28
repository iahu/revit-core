import Bluebird from 'bluebird'
import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'
import { Vector2d } from 'konva/lib/types'
import { closestSelectable, isKroup, isShape, listenOn, ShapeOrGroup } from './helper'

export interface PickOptions {
  onlySelectable?: boolean
  ignoreStage?: boolean
}

export const pick = (container: Layer, options?: PickOptions) => {
  const { ignoreStage = true, onlySelectable = true } = options ?? {}
  return new Bluebird<ShapeOrGroup | Stage>((resolve, reject, onCancel) => {
    const stage = container.getStage()
    if (!stage) {
      return reject('no stage')
    }

    const stop = listenOn(stage, 'click', event => {
      event.evt.preventDefault()
      const { target } = event
      const stageOrShape = ignoreStage ? (isShape(target) || isKroup(target) ? target : null) : target
      const selectableNode = stageOrShape && onlySelectable ? closestSelectable(stageOrShape) : stageOrShape
      // const closestTarget = isShape(target) || isKroup(target) ? closestSelectable(target) : null
      if (selectableNode) {
        resolve(selectableNode)
        stop()
      }
    })

    onCancel?.(stop)
  })
}

export const pointAt = (container: Layer) => {
  return new Bluebird<Vector2d>((resolve, reject) => {
    const stage = container.getStage()
    if (!stage) {
      return reject('no stage')
    }
    const stop = listenOn(stage, 'click', () => {
      const pointer = stage?.getPointerPosition()
      if (pointer) {
        resolve(pointer)
        stop()
      }
    })
  })
}
