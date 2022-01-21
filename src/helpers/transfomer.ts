import { DEBUG } from '@actions/debug'
import Konva from 'konva'
import { getBackgroundLayer } from './background'

export const getTransformer = (stage: Konva.Stage) => {
  const stageLayer = getBackgroundLayer(stage)
  let transformer = stage.findOne('#global-transformer') as Konva.Transformer

  if (transformer) {
    return transformer
  }

  transformer = new Konva.Transformer({
    id: 'global-transformer',
    name: 'global unselectable',
    rotateEnabled: false,
    resizeEnabled: false,
    borderDash: [3, 3],
    padding: 3,
    draggable: true,
    useSingleNodeRotation: false,
    // borderStroke: 'blue',
    visible: DEBUG && !!localStorage.getItem('KAD_TRANSFORMER'),
  })

  stageLayer.add(transformer)

  return transformer
}
