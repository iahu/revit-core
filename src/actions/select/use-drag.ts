import { fromMouseEvent, useMouseTarget } from '@actions/input/mouse'
import { getBackgroundLayer } from '@helpers/background'
import { getSelectionRect } from '@helpers/selection-rect'
import Konva from 'konva'
import { Vector2d } from 'konva/lib/types'
import { filter, map, mapTo, mergeWith, switchMap, switchMapTo, tap } from 'rxjs'
import { isSelectable, isStage } from '../helper'
import { SelectionSubject } from './'

type Points = { startPoint?: Vector2d; endPoint?: Vector2d }

export const useDrag = (subject: SelectionSubject, container: Konva.Stage | Konva.Layer) => {
  const selectedShapes = subject.getValue()

  const stage = container.getStage()
  const stageLayer = getBackgroundLayer(stage)
  const selectionRect = getSelectionRect(container)
  let dragstart = false

  const points = {} as Points

  const mousedown$ = fromMouseEvent(stage, 'mousedown.dragToSelect')
    .pipe(tap(e => e.evt.preventDefault()))
    .pipe(map(useMouseTarget))
    .pipe(filter(isSelectable))
    .pipe(filter(isStage))
    .pipe(
      map(stage => {
        const x = stage.getPointerPosition()?.x ?? 0
        const y = stage.getPointerPosition()?.y ?? 0
        return { startPoint: { x, y } } as Points
      }),
    )
    .pipe(
      tap(() => {
        const position = stage.getPointerPosition() ?? { x: 0, y: 0 }
        const x1 = position.x
        const y1 = position.y

        selectionRect.setAttrs({ x: x1, y: y1, width: 0, height: 0, visible: false })

        dragstart = true
      }),
    )

  const mousemove$ = fromMouseEvent(stage, 'mousemove.dragToSelect')
    .pipe(tap(e => e.evt.preventDefault()))
    .pipe(map(useMouseTarget))
    .pipe(filter(isStage))
    .pipe(
      map(stage => {
        const x = stage.getPointerPosition()?.x ?? 0
        const y = stage.getPointerPosition()?.y ?? 0
        points.endPoint = { x, y }
        return points
      }),
    )
    .pipe(
      tap(points => {
        const { x: x1, y: y1 } = points.startPoint as Vector2d
        const { x: x2, y: y2 } = points.endPoint as Vector2d
        selectionRect.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
          visible: true,
        })
      }),
    )

  const mouseup$ = fromMouseEvent(stage, 'mouseup.dragToSelect')
    .pipe(filter(() => dragstart))
    .pipe(tap(e => e.evt.preventDefault()))
    .pipe(map(useMouseTarget))
    .pipe(filter(isStage))
    .pipe(
      map(stage => {
        const x = stage.getPointerPosition()?.x ?? 0
        const y = stage.getPointerPosition()?.y ?? 0
        points.endPoint = { x, y }
        return points
      }),
    )

  return mousedown$
    .pipe(mergeWith(mouseup$))
    .pipe(
      tap(points => {
        console.log('x', points)
      }),
    )
    .pipe(
      mapTo(() => {
        selectionRect.visible(false)

        const shapes = stageLayer.children ?? []
        const box = selectionRect.getClientRect()
        const selected = shapes.filter(
          shape =>
            !shape.hasName('unselectable') &&
            !shape.getLayer()?.hasName('unselectable') &&
            Konva.Util.haveIntersection(box, shape.getClientRect()),
        )

        if (selected.length) {
          selected.forEach(node => selectedShapes.add(node))
          subject.next(selectedShapes)
        }

        dragstart = false
        return selected
      }),
    )

  // return subject.pipe(
  //   tap(nodes => {
  //     if (nodes.size) {
  //       mousedown$.unsubscribe()
  //       mousemove$.unsubscribe()
  //       mouseup$.unsubscribe()
  //     }
  //   }),
  // )
}
