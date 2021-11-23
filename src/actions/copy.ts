import { Layer } from 'konva/lib/Layer'
import { pick } from './pick'
import { listenOn } from './helper'
import Konva from 'konva'
import { move } from './move'
import { Stage } from 'konva/lib/Stage'
import { getTransformer } from '@helpers/transfomer'
import { Shadow } from 'fabric/fabric-impl'
import { getDraftLayer } from '@helpers/draft'
import { Shape } from 'konva/lib/Shape'

export const copy = async (layer: Layer, args: any) => {
  const stage = layer.getStage() as Stage
  const transformer = getTransformer(stage)
  let x, y
  const stopLinten = listenOn(stage, 'beforeMove', (e: any) => {
    x = e.nodes[0].x()
    y = e.nodes[0].y()
  })
  await move(layer)
  stopLinten()

  const draftLayer = getDraftLayer(stage)
  const shape = transformer.nodes()[0].clone()
  shape.x(x)
  shape.y(y)
  transformer.setAttrs({ borderStroke: '' })
  draftLayer.add(shape)
  draftLayer.visible(true)
}

