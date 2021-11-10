import Konva from 'konva'
import { getBackgroundLayer } from './background'

export const getTransformer = (container: Konva.Stage | Konva.Layer) => {
  const stage = container.getStage()
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
    // borderStroke: '',
    // visible: false,
  })

  stageLayer.add(transformer)

  return transformer
}
