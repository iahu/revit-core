import { fromMouseEvent, useMouseTarget } from '@actions/input/mouse'
import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'
import { filter, map, switchMapTo, tap } from 'rxjs'
import { isShape } from '../helper'
import { SelectionSubject } from './'

export interface PickOptions {
  multiSelect?: boolean
}

export const usePick = (subject: SelectionSubject, container: Stage | Layer, options = {} as PickOptions) => {
  const { multiSelect = false } = options
  const picked = subject.getValue()

  const stage = container.getStage()

  return fromMouseEvent(stage, 'click.pickFrom')
    .pipe(map(useMouseTarget), filter(isShape))
    .pipe(
      tap(target => {
        picked.add(target)
        if (multiSelect) {
          subject.next(picked)
        } else {
          subject.next(new Set([target]))
        }
      }),
    )
    .pipe(switchMapTo(subject))
}
