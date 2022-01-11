import { SELECTED_CLASSNAME, ShapeOrGroup } from '@actions/helper'
import { resetHighlight, setHightlight } from '@actions/highlight'
import { getTransformer } from '@helpers/transfomer'
import { Node } from 'konva/lib/Node'
import { Stage } from 'konva/lib/Stage'

export const unSelectAll = (stage: Stage, nodes: Node[]) => {
  const transfomer = getTransformer(stage)
  const restNodes = [] as Node[]
  stage.find(`.${SELECTED_CLASSNAME}`).forEach(n => {
    if (nodes.includes(n)) {
      return restNodes.push(n)
    }
    n.removeName(SELECTED_CLASSNAME)
    n.setAttr('selected', false)
    n.fire('unselected', undefined, true)
    n.fire('selectedChange', { selected: false }, true)
  })
  resetHighlight(stage)
  transfomer.nodes(restNodes)
}

export const applySelect = (stage: Stage, nodes: ShapeOrGroup[], useHistory = false) => {
  const transfomer = getTransformer(stage)

  unSelectAll(stage, nodes)
  // add selected class name
  setHightlight(nodes)
  nodes.forEach(node => {
    node.addName(SELECTED_CLASSNAME)
    node.setAttr('selected', true)
    node.fire('selected', undefined, true)
    node.fire('selectedChange', { selected: true }, true)
  })

  if (useHistory) {
    transfomer.nodes(transfomer.nodes().concat(nodes))
  } else {
    transfomer.nodes(nodes)
  }
  return transfomer.nodes()
}
