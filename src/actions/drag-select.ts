import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { draggable, isSelectable, listenOn, useEventTarget, usePoinerPosition } from './helper'
import { input } from './input'

export const dragSelect = async (layer: Layer) => {
  const stage = layer.getStage()
  const startPoint = await input(stage, 'mousedown').then(useEventTarget).then(draggable).then(usePoinerPosition)

  const selectionRect = new Konva.Rect({ ...startPoint, name: 'unselectable', fill: '#0099ff33', stroke: '#0099ff' })
  layer.add(selectionRect)

  const stopMove = listenOn(stage, 'mousemove', e => {
    const endPoint = usePoinerPosition(e.target)
    selectionRect.width(endPoint.x - startPoint.x)
    selectionRect.height(endPoint.y - startPoint.y)
  })

  await input(stage, 'mouseup').then(stopMove)

  const shapes = layer.children ?? []
  const box = selectionRect.getClientRect()

  selectionRect.destroy()

  return shapes.filter(isSelectable).filter(shape => Konva.Util.haveIntersection(box, shape.getClientRect()))
}
