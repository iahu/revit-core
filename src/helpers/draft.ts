import Konva from 'konva'

export const getDraftLayer = (stage: Konva.Stage | Konva.Layer) => {
  let stageLayer = stage.getStage().findOne('#draft-layer') as Konva.Layer

  if (stageLayer) {
    return stageLayer
  }

  stageLayer = new Konva.Layer({ id: 'draft-layer', name: 'draft-layer unselectable', visible: false })
  stage.add(stageLayer)
  return stageLayer
}
