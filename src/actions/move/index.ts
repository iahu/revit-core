import Konva from 'konva'
import { Vector2d } from 'konva/lib/types'
import { BehaviorSubject, filter, map, mapTo, switchMapTo, tap } from 'rxjs'
import { fromMouseEvent, useMouseTarget } from '../input/mouse'
import { select, ShapeOrGroup } from '@actions/select'
import { Shape } from 'konva/lib/Shape'
import { isNull, isStage, notNull } from '@actions/helper'

type MoveConfig = {
  snapAngle?: number
}

export const move = (container: Konva.Stage, config = {} as MoveConfig) => {
  const $move = new BehaviorSubject({} as { nodes: Set<ShapeOrGroup>; startPoint?: Vector2d; endPoint?: Vector2d })

  const selectAndMove$ = select(container, { selectEmpty: false })
    .pipe(filter(n => n.size > 0))
    // 拿到 nodes
    .pipe(tap(nodes => $move.next({ nodes })))
    // 转到 move 上下文，开始监听 click 事件
    .pipe(switchMapTo(fromMouseEvent(container, 'click')))
    // fromMouseEvent(container, 'click')
    .pipe(map(useMouseTarget))
    .pipe(map(target => target.getStage()))
    .pipe(filter(isStage))
    .pipe(map(stage => stage.getPointerPosition()))
    .pipe(filter(notNull))
    .subscribe(point => {
      const { nodes, startPoint, endPoint } = $move.getValue()
      if (!startPoint) {
        $move.next({ nodes, startPoint: point })
      } else if (!endPoint) {
        $move.next({ nodes, startPoint, endPoint: point })
      } else {
        console.log('got all parameters')
        selectAndMove$.unsubscribe()
      }
    })

  return $move.pipe(
    tap(values => {
      if (values.nodes?.size && values.startPoint && values.endPoint) {
        console.log('tap')
        selectAndMove$.unsubscribe()
      }
    }),
  )
}
