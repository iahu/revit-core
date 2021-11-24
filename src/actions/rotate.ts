import { Layer } from 'konva/lib/Layer'
import { applyRotate } from '../api/rotate'
import { Angler } from '../shapes/angler'
import { getCenterPoint, listenOn, usePoinerPosition } from './helper'
import { input } from './input'
import { pick } from './pick'

export const rotate = async (layer: Layer) => {
  const stage = layer.getStage()

  // pick a node
  const node = await pick(layer)

  /**
   * get centerPoint
   */
  const centerPoint = getCenterPoint(node)
  const angler = new Angler({ name: 'rotate-angler unselectable', centerPoint })
  layer.add(angler)

  // update startPoint
  const stopUpdateStartPoint = listenOn(stage, 'mousemove', e => {
    const startPoint = usePoinerPosition(e.target)
    angler.startPoint = startPoint
    angler.endPoint = startPoint
  })
  // update until click
  await input(stage, 'click').then(stopUpdateStartPoint)

  // update end aux end point
  const stopUpdateEndAuxLine = listenOn(stage, 'mousemove', e => {
    const endPoint = usePoinerPosition(e.target)
    angler.endPoint = endPoint
  })
  // update until click
  await input(stage, 'click').then(stopUpdateEndAuxLine)

  // ready to action

  // apply action
  const { angle } = angler
  applyRotate(node, angle)
  // clearup
  angler.destroy()

  return  { node, angle }
}
