import Konva from 'konva'
import { getDraftLayer } from './draft'

export const getTransformer = (stage: Konva.Stage) => {
  const stageLayer = getDraftLayer(stage)
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
    // borderStroke: '',
    // visible: false,
  })

  stageLayer.add(transformer)

  return transformer
}
