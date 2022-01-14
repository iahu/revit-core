import Bluebird from 'bluebird'
import { ShapeOrGroup } from 'index'
import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { closestSelectable, isSelectable, isShape, listenOn, useEventTarget, usePoinerPosition } from './helper'
import { mouseInput } from './input'

export const dragSelect = (layer: Layer) => {
  const $dragSelect = new Bluebird<ShapeOrGroup[]>(async (resolve, reject, onCancel) => {
    const stage = layer.getStage()
    if (!stage) {
      return reject('no stage found')
    }

    const startPoint = await mouseInput(stage, 'mousedown').then(useEventTarget).then(usePoinerPosition)

    const selectionRect = new Konva.Rect({
      ...startPoint,
      name: 'unselectable',
      fill: '#0099ff33',
      stroke: '#0099ff',
      visible: false,
    })
    layer.add(selectionRect)

    let delayId: NodeJS.Timeout
    const stopMove = listenOn(stage, 'mousemove', e => {
      // delay to display selection rectangle.
      delayId = setTimeout(() => selectionRect.visible(true), 100)

      const endPoint = usePoinerPosition(e.target)
      selectionRect.width(endPoint.x - startPoint.x)
      selectionRect.height(endPoint.y - startPoint.y)
    })

    // cancel if drag move event happens on stage.
    mouseInput(stage, 'dragmove').then(() => {
      stopMove()
      selectionRect.destroy()
      clearTimeout(delayId)
      reject(new Error('dragmove'))
    })

    onCancel?.(() => {
      stopMove()
      selectionRect.destroy()
      clearTimeout(delayId)
      $dragSelect.cancel()
    })

    const mouseupEvent = await mouseInput(stage, 'mouseup').then(stopMove)

    const shapes = layer.children ?? []
    const rectConfig = { skipShadow: true, skipStroke: true }
    const box = selectionRect.getClientRect(rectConfig)
    selectionRect.destroy()

    // fallback to click
    if (!box.width && !box.height) {
      const target = useEventTarget(mouseupEvent)
      const closestTarget = isShape(target) ? closestSelectable(target) : null
      if (closestTarget) {
        return [closestTarget]
      }
      return []
    }

    const result = shapes
      .filter(isSelectable)
      .filter(shape => Konva.Util.haveIntersection(box, shape.getClientRect(rectConfig)))

    resolve(result as ShapeOrGroup[])
  })

  return $dragSelect
}
