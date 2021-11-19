import { applyMove } from '@api/move'
import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Shape, ShapeConfig } from 'konva/lib/Shape'
import { Stage } from 'konva/lib/Stage'
import { pick } from '.'
import { getDraftLayer } from '../helpers/draft'
type IAlignTarget = Stage | Shape<ShapeConfig> | null
let AlignStage: Konva.Stage
let t1: IAlignTarget
let t2: IAlignTarget
let helpLines: Shape[] = []

export const align = async (layer: Layer) => {
  const stage = layer.getStage() as Stage
  AlignStage = stage
  const draftLayer = getDraftLayer(AlignStage)
  draftLayer.visible(true)
  clearLines()

  t1 = await pick(layer)
  t1.opacity(1)
  t1.name('unselectable')
  drawHelpLine(t1)
  t2 = await pick(layer)
  t2.opacity(1)
  t2.name('unselectable')
  const tx = t1.getClientRect().x - t2.getClientRect().x
  applyMove([t2], { x: tx, y: 0 })

  clearLines()
  draftLayer.visible(false)
}
function clearLines() {
  helpLines.forEach(line => {
    line.visible(false)
  })
  helpLines = []
}
function drawHelpLine(target: IAlignTarget) {
  //画辅助线
  if (!target?.attrs) return
  const draftLayer = getDraftLayer(AlignStage)
  const { id, x, y } = target.attrs
  const config: any = {
    id: 'help' + id,
    x: x,
    y: y,
    strokeWidth: 1,
    points: [],
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
