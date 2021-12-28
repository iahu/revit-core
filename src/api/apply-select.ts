import { SELECTED_CLASSNAME, ShapeOrGroup } from '@actions/helper'
import { resetHighlight, setHightlight } from '@actions/highlight'
import { getTransformer } from '@helpers/transfomer'
import { Stage } from 'konva/lib/Stage'

export const unSelectAll = (stage: Stage) => {
  const transfomer = getTransformer(stage)
  stage.find(`.${SELECTED_CLASSNAME}`).forEach(n => {
    n.removeName(SELECTED_CLASSNAME)
  })
  resetHighlight(stage)
  transfomer.nodes([])
}

export const applySelect = (stage: Stage, nodes: ShapeOrGroup[], useHistory = false) => {
  const transfomer = getTransformer(stage)

  unSelectAll(stage)
  // add selected class name
  setHightlight(nodes)
  nodes.forEach(node => node.addName(SELECTED_CLASSNAME))

  if (useHistory) {
    transfomer.nodes(transfomer.nodes().concat(nodes))
  } else {
    transfomer.nodes(nodes)
  }
  stage.fire('select', undefined, true)
  return transfomer.nodes()
}
