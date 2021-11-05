import Konva from 'konva'
import Assistor from '../shapes/assistor'
import { getDraftLayer } from './draft'

export const getAssistor = (stage: Konva.Stage) => {
  const draftLayer = getDraftLayer(stage)

  let assistor = draftLayer.findOne('#global-assistor') as Assistor
  if (assistor) {
    return assistor
  }

  assistor = new Assistor({
    id: 'global-assistor',
    name: 'global unselectable',
    stroke: '#0099ff',
    visible: false,
    zindex: 999,
  })

  draftLayer.add(assistor)
  return assistor
}
