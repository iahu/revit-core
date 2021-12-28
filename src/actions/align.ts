import { applyMove } from '@api/index'
import Konva from 'konva'
import { Group } from 'konva/lib/Group'
import { Layer } from 'konva/lib/Layer'
import { Shape, ShapeConfig } from 'konva/lib/Shape'
import { Stage } from 'konva/lib/Stage'
import { getDraftLayer } from '../helpers/draft'
import { ShapeOrGroup } from './helper'
import { select } from './select'
type IAlignTarget = Stage | Shape<ShapeConfig> | Group
const helpLines: Shape[] = []

export interface AlignOptions {
  firstNode?: ShapeOrGroup
  secondNode?: ShapeOrGroup
  lockX?: boolean
  lockY?: boolean
  alignTo?: 'wall' | 'wallCenter' | 'core' | 'coreCenter'
}

export const align = (layer: Layer, options = {} as AlignOptions) => {
  const { lockX, lockY = true } = options
  const stage = layer.getStage() as Stage
  const draftLayer = getDraftLayer(stage)
  draftLayer.visible(true)
  // clearLines()

  return select(layer, { useDrag: false })
    .then(nodes => {
      const node = nodes[0]
      node.opacity(1)
      const name = node.name()
      node.addName('unselectable')
      drawHelpLine(node)
      return { firstNode: node, firstNodeName: name }
    })
    .then(result => {
      return select(layer, { useDrag: false }).then(nodes => {
        const secondNode = nodes[0]
        const name = secondNode.name()
        secondNode.opacity(1)
        secondNode.addName('unselectable')
        return { ...result, secondNode, secondNodeName: name }
      })
    })
    .then(({ firstNode, firstNodeName, secondNode, secondNodeName }) => {
      const dest = {
        x: lockX ? 0 : firstNode.getClientRect().x - secondNode.getClientRect().x,
        y: lockY ? 0 : firstNode.getClientRect().y - secondNode.getClientRect().y,
      }
      applyMove([secondNode], dest)

      clearLines()
      draftLayer.visible(false)
      firstNode.name(firstNodeName)
      secondNode.name(secondNodeName)

      return dest
    })
}

function clearLines() {
  while (helpLines.length) {
    helpLines.pop()?.destroy()
  }
}
function drawHelpLine(target: IAlignTarget) {
  //画辅助线
  const stage = target.getStage()
  if (!target?.attrs || !stage) return
  const draftLayer = getDraftLayer(stage)
  const { id, x, y } = target.attrs
  const config = {
    id: 'help' + id,
    x: x,
    y: y,
    strokeWidth: 1,
    points: [] as number[],
    dash: [10, 10],
    stroke: 'rgba(0,81,255,0.5)',
  }
  if (target.width() > target.height()) {
    //横向
    config.x = 0
    config.points = [0, 3000, 0, 0]
  } else {
    //纵向
    config.y = 0
    config.points = [0, 0, 0, 3000]
  }
  const line: Konva.Shape = new Konva.Line(config)
  draftLayer.add(line)
  draftLayer.visible(true)
  helpLines.push(line)
}
