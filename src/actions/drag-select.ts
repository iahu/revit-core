import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import {
  closestSelectable,
  isSelectable,
  isShape,
  listenOn,
  ShapeOrGroup,
  useEventTarget,
  usePoinerPosition,
} from './helper'
import { mouseInput } from './input'

export const dragSelect = async (layer: Layer) => {
  const stage = layer.getStage()
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
    delayId = setTimeout(() => selectionRect.visible(true), 50)

    const endPoint = usePoinerPosition(e.target)
    selectionRect.width(endPoint.x - startPoint.x)
    selectionRect.height(endPoint.y - startPoint.y)
  })

  // cancel if drag move event happens on stage.
  mouseInput(stage, 'dragmove').then(() => {
    stopMove()
    selectionRect.destroy()
    clearTimeout(delayId)
  })

  const mouseupEvent = await mouseInput(stage, 'mouseup').then(stopMove)

  const shapes = layer.children ?? []
  const clientConfig = { skipShadow: true, skipStroke: true }
  const box = selectionRect.getClientRect(clientConfig)
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
    .filter(shape => Konva.Util.haveIntersection(box, shape.getClientRect(clientConfig)))

  return result as ShapeOrGroup[]
}
