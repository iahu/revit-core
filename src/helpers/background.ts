import Konva from 'konva'

export const getBackgroundLayer = (stage: Konva.Stage) => {
  let stageLayer = stage.findOne('#background') as Konva.Layer

  if (stageLayer) {
    return stageLayer
  }

  stageLayer = new Konva.Layer({ id: 'background', name: 'background' })
  stage.add(stageLayer)
  return stageLayer
}
