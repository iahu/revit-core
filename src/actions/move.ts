import { applyMove } from '@api/move'
import Assistor from '@shapes/assistor'
import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'
import { select } from './select'
import { getBackgroundLayer } from '../helpers/background'
import { getTransformer } from '../helpers/transfomer'
import { listenOn, stopImmediatePropagation, useEventTarget, usePoinerPosition, vector2Point } from './helper'
import { input } from './input'

type MoveConfig = {
  snapAngle?: number
}

export const move = async (layer: Konva.Layer, config = {} as MoveConfig) => {
  const stage = layer.getStage() as Stage
  const { snapAngle = 3 } = config
  const bgLayer = getBackgroundLayer(stage)
  const transformer = getTransformer(stage)
  const padding = transformer.padding()
  let nodes = transformer.nodes()

  if (!nodes.length) {
    nodes = await select(layer)
    stage.fire('beforeMove', { nodes })
  }

  // get start point
  const startPoint = await input(stage, 'click')
    .then(stopImmediatePropagation)
    .then(useEventTarget)
    .then(usePoinerPosition)
  if (!transformer.nodes().length) {
    transformer.nodes(nodes)
  }

  // setup assistor
  const assistor = new Assistor({
    id: 'global-assistor',
    name: 'global unselectable',
    stroke: '#0099ff',
    zindex: 999,
    snapAngle,
    startPoint: vector2Point(startPoint),
    endPoint: vector2Point(startPoint),
  })
  bgLayer.add(assistor)
  bgLayer.addName('unselectable')

  // setup pupperty
  const pupperty = new Konva.Rect({
    ...startPoint,
    name: 'unselectable',
    dash: [3, 3],
    stroke: '#0099ff',
    strokeWidth: 1,
    offset: { x: padding, y: padding },
    width: transformer.getWidth() + padding * 2,
    height: transformer.getHeight() + padding * 2,
    visible: true,
  })
  pupperty.listening(false)
  bgLayer.add(pupperty)

  // listen on mouse move
  const stopListenMousemove = listenOn(stage, 'mousemove', e => {
    const { x = 0, y = 0 } = e.target.getStage()?.getPointerPosition() ?? {}

    assistor.endPoint = [x, y]
    // update endPoint to pupperty position
    pupperty.setPosition({
      x: transformer.getX() + assistor.endPoint[0] - startPoint.x,
      y: transformer.getY() + assistor.endPoint[1] - startPoint.y,
    })
  })

  // until get end point from click event
  // but here we use pupperty to catch the end point
  await input(stage, 'click').then(stopImmediatePropagation).then(stopListenMousemove)

  // apply move action
  const dest = {
    x: assistor.endPoint[0] - startPoint.x,
    y: assistor.endPoint[1] - startPoint.y,
  }
  applyMove(nodes, dest)

  // and then clearup
  assistor.destroy()
  pupperty.destroy()
  bgLayer.removeName('unselectable')

  return dest
}
