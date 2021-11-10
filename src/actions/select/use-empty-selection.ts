import { fromMouseEvent, useMouseTarget } from '@actions/input/mouse'
import Konva from 'konva'
import { filter, map, switchMap } from 'rxjs'
import { isStage } from '../helper'
import { SelectionSubject } from './'

export const useEmptySelection = (subject: SelectionSubject, container: Konva.Stage | Konva.Layer) => {
  const stage = container.getStage()
  const selectedShapes = subject.getValue()

  return fromMouseEvent(stage, 'click')
    .pipe(map(useMouseTarget))
    .pipe(filter(isStage))
    .pipe(
      switchMap(() => {
        selectedShapes.clear()
        subject.next(selectedShapes)
        return subject
      }),
    )
}
