import Konva from 'konva'
import { getDraftLayer } from './draft'

export const getSelectionRect = (stage: Konva.Stage) => {
  const stageLayer = getDraftLayer(stage)
  let selectionRect = stage.findOne('#global-selection-rect') as Konva.Rect
  if (selectionRect) {
    return selectionRect
  }

  selectionRect = new Konva.Rect({
    id: 'global-selection-rect',
    name: 'global unselectable',
    fill: '#0099ff33',
    stroke: '#0099ff',
    visible: false,
    zindex: 999,
  })

  stageLayer.add(selectionRect)

  return selectionRect
}
