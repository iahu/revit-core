import { applyMove } from '@api/index'
import Assistor from '@shapes/assistor'
import Bluebird from 'bluebird'
import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'
import { Vector2d } from 'konva/lib/types'
import { SelectOptions } from './select'
import { getBackgroundLayer } from '../helpers/background'
import { getTransformer } from '../helpers/transfomer'
import {
  findSelected,
  listenOn,
  stopImmediatePropagation,
  useEventTarget,
  usePoinerPosition,
  vector2Point,
  WithType,
} from './helper'
import { kadInput, mouseInput } from './input'
import { select } from './select'
import { ShapeOrGroup } from 'index'

export interface MoveOptions extends SelectOptions {
  snapAngle?: number
  lockX?: boolean // 锁定 `x` 方向
  lockY?: boolean // 锁定 `y` 方向
  showCompass?: boolean // 是否显示量角器
  /** 移动距离 */
  dist?: Vector2d
  pixelRatio?: number
}

export const move = (layer: Konva.Layer, options = {} as MoveOptions) => {
  const stage = layer.getStage() as Stage
  const { snapAngle = 3, showCompass = true, lockY = false, lockX = false, dist, useSelectedNode, pixelRatio } = options
  const bgLayer = getBackgroundLayer(stage)
  const transformer = getTransformer(stage)
  const padding = transformer.padding()
  // use transformer.nodes() or find by name

  const $nodes = Bluebird.resolve(useSelectedNode ? findSelected(stage) : ([] as ShapeOrGroup[]))
    // or from select
    .then(nodes => {
      if (nodes?.length) return nodes
      const { useDrag, useHighlight } = options
      const $select = select(layer, { useDrag, useSelectedNode: false, useHighlight })
      return $select.tap(nodes => {
        transformer.nodes(nodes)
        $select.cancel()
      })
    })

  const fromMouse = () =>
    $nodes
      // get startPoint
      .then(nodes => {
        return mouseInput(stage, 'click')
          .then(stopImmediatePropagation)
          .then(useEventTarget)
          .then(usePoinerPosition)
          .then(startPoint => ({ nodes, startPoint }))
      })

      // create assistor and pupperty
      .then(({ nodes, startPoint }) => {
        const assistor = new Assistor({
          id: 'global-assistor',
          name: 'global unselectable',
          stroke: '#0099ff',
          zindex: 999,
          snapAngle,
          startPoint: vector2Point(startPoint),
          endPoint: vector2Point(startPoint),
          showCompass,
          pixelRatio,
        })
        bgLayer.add(assistor)
        bgLayer.addName('unselectable')

        const pupperty = new Konva.Rect({
          ...startPoint,
          x: transformer.getX(),
          y: transformer.getY(),
          name: 'unselectable',
          dash: [3, 3],
          stroke: '#0099ff',
          strokeWidth: 1,
          offset: { x: padding, y: padding },
          width: transformer.getWidth() + padding * 2,
          height: transformer.getHeight() + padding * 2,
        })
        pupperty.listening(false)
        bgLayer.add(pupperty)

        return { nodes, startPoint, assistor, pupperty }
      })

      // update putterty position on mousemove
      .then(({ nodes, startPoint, assistor, pupperty }) => {
        const stopListenMousemove = listenOn(stage, 'mousemove', e => {
          const { x = 0, y = 0 } = e.target.getStage()?.getPointerPosition() ?? {}
          assistor.endPoint = [lockX ? startPoint.x : x, lockY ? startPoint.y : y]
          // update endPoint to pupperty position
          pupperty.setPosition({
            x: lockX ? transformer.x() : transformer.x() + assistor.endPoint[0] - startPoint.x,
            y: lockY ? transformer.y() : transformer.y() + assistor.endPoint[1] - startPoint.y,
          })
        })

        return { nodes, startPoint, assistor, pupperty, stopListenMousemove }
      })

      // stop listen mousemove on next click event
      .then(({ nodes, assistor, startPoint, pupperty, stopListenMousemove }) =>
        mouseInput(stage, 'click')
          .then(stopImmediatePropagation)
          .then(stopListenMousemove)
          .return({ nodes, assistor, startPoint, pupperty }),
      )

      // ready to apply move
      .then(({ nodes, assistor, startPoint, pupperty }) => {
        const dist = {
          x: assistor.endPoint[0] - startPoint.x,
          y: assistor.endPoint[1] - startPoint.y,
        }

        // and then clearup
        assistor.destroy()
        pupperty.destroy()
        bgLayer.removeName('unselectable')

        return { dist, nodes }
      })

  const fromKadInput = (nodes: Konva.Node[]) =>
    kadInput<WithType<Vector2d>>().then(dist => {
      if (dist?.type === 'move') {
        return { dist: { x: lockX ? 0 : dist.x, y: lockY ? 0 : dist.y }, nodes }
      }
      return Bluebird.reject('not matching')
    })

  return $nodes.then(nodes => {
    if (dist) {
      // has user config
      applyMove(nodes, dist)

      return Bluebird.resolve({ ...dist, nodes })
    } else {
      // user interaction
      return Bluebird.any([fromKadInput(nodes), fromMouse()]).then(({ dist, nodes }) => {
        applyMove(nodes, dist)

        return { ...dist, nodes }
      })
    }
  })
}
