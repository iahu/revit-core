import Konva from 'konva'
import { getBackgroundLayer } from './background'

export const getSelectionRect = (container: Konva.Stage | Konva.Layer) => {
  const stage = container.getStage()
  const stageLayer = getBackgroundLayer(stage)
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
