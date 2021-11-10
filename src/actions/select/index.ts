import { getBackgroundLayer } from '@helpers/background'
import Konva from 'konva'
import { BehaviorSubject, mergeWith, raceWith, switchMapTo, tap } from 'rxjs'
import { useDrag } from './use-drag'
import { useEmptySelection } from './use-empty-selection'
import { usePick } from './use-pick'
import { useTransformer } from './use-transformer'

export type ShapeOrGroup = Konva.Group | Konva.Shape
export const selectionSubject = new BehaviorSubject<Set<ShapeOrGroup>>(new Set<ShapeOrGroup>())
export type SelectionSubject = typeof selectionSubject

export type SelectFromOptions = {
  multiSelect?: boolean
  dragSelect?: boolean
  selectEmpty?: boolean
  clearBefore?: boolean
  max?: number
}

export const select = (stage: Konva.Stage, options = {} as SelectFromOptions) => {
  const stageLayer = getBackgroundLayer(stage)
  const { multiSelect, dragSelect = true, selectEmpty = true } = options

  let $select = usePick(selectionSubject, stage, { multiSelect })
  if (dragSelect) {
    const $drag = useDrag(selectionSubject, stage)
    $select = $select.pipe(mergeWith($drag))
  }

  if (selectEmpty) {
    const $empty = useEmptySelection(selectionSubject, stage)
    $select = $select.pipe(mergeWith($empty))
  }

  return $select.pipe(
    tap(nodes => {
      useTransformer(stageLayer, Array.from(nodes.values()))
    }),
  )
}
