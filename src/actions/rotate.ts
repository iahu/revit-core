import { getTransformer } from '@helpers/transfomer'
import { Layer } from 'konva/lib/Layer'
import { Shape } from 'konva/lib/Shape'
import { from, fromEventPattern, map, mapTo, of, switchMap, takeUntil, tap } from 'rxjs'
import { applyRotate } from '../api/rotate'
import { Angler } from '../shapes/angler'
import {
  getCenterPoint,
  GetMultiType,
  handleOff,
  handleOn,
  preventDefault,
  stopImmediatePropagation,
  useEventTarget,
  usePoinerPosition,
} from './helper'
import { pick } from './pick'

export const rotate = async (layer: Layer) => {
  const stage = layer.getStage()
  const tr = getTransformer(stage)
  const nodes = tr.nodes() as Shape[]

  const $pickNodes = from(pick(layer)).pipe(map(node => [node]))
  const $startMousedown = fromEventPattern<GetMultiType<'click'>>(handleOn(stage, 'click'), handleOff(stage, 'click'))
    .pipe(tap(preventDefault))
    .pipe(tap(stopImmediatePropagation))
  const $endMousedown = fromEventPattern<GetMultiType<'click'>>(handleOn(stage, 'click'), handleOff(stage, 'click'))
    .pipe(tap(preventDefault))
    .pipe(tap(stopImmediatePropagation))
  const $mousemove = fromEventPattern<GetMultiType<'mousemove'>>(
    handleOn(stage, 'mousemove'),
    handleOff(stage, 'mousemove'),
  )

  const $nodes = nodes.length ? of(nodes) : $pickNodes

  return $nodes
    .pipe(
      map(nodes => {
        const [node] = nodes
        const centerPoint = getCenterPoint(node)
        const angler = new Angler({ name: 'rotate-angler unselectable', centerPoint })
        layer.add(angler)
        return { node, angler }
      }),
    )
    .pipe(
      switchMap(data => {
        return $mousemove
          .pipe(map(useEventTarget))
          .pipe(map(usePoinerPosition))
          .pipe(
            tap(startPoint => {
              data.angler.startPoint = startPoint
            }),
          )
          .pipe(takeUntil($startMousedown))
          .pipe(mapTo(data))
      }),
    )
    .pipe(
      switchMap(data =>
        $mousemove
          .pipe(map(useEventTarget))
          .pipe(map(usePoinerPosition))
          .pipe(
            tap(endPoint => {
              data.angler.endPoint = endPoint
            }),
          )
          .pipe(
            takeUntil(
              $endMousedown.pipe(
                tap(() => {
                  const { node, angler } = data
                  // apply action
                  applyRotate(node, angler.labelArc.$arc.angle())
                  // clearup
                  angler.destroy()
                  angler.remove()
                }),
              ),
            ),
          ),
      ),
    )
    .subscribe()
}
