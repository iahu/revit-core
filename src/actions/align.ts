import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { KonvaEventObject } from 'konva/lib/Node'
import { Shape, ShapeConfig } from 'konva/lib/Shape'
import { Stage } from 'konva/lib/Stage'
import { getDraftLayer } from '../helpers/draft'

type IAlignTarget = Stage | Shape<ShapeConfig> | null
let AlignStage: Konva.Stage
let t1: IAlignTarget
let t2: IAlignTarget
let helpLines: Shape[]
export const align = async (layer: Layer) => {
  const stage = layer.getStage() as Stage
  AlignStage = stage
  helpLines = []
  stage.on('mouseover', onHover)
  stage.on('mouseout', onOut)
  t1 = t2 = null
  // console.log(777, getTarget())
  t1 = await getTarget()
  drawHelpLine(t1)
  t2 = await getTarget(t1)
  drawHelpLine(t2)
  stage.off('mouseover', onHover)
  stage.off('mouseout', onOut)
  const draftLayer = getDraftLayer(AlignStage)
  helpLines.forEach(line => {
    line.visible(false)
  })
  draftLayer.visible(false)
}
function onHover(event: KonvaEventObject<MouseEvent>) {
  setType(event, 'on') //划入
}
function onOut(event: KonvaEventObject<MouseEvent>) {
  setType(event, 'off') //划出
}
function setType(event: KonvaEventObject<MouseEvent>, type: 'on' | 'off') {
  const { target } = event
  if (!target.attrs) return
  const { alignTarget, strokeHoverColor, strokeOutColor } = target.attrs
  if (target instanceof Konva.Shape && alignTarget == true) {
    if (type == 'on' && strokeHoverColor) {
      target.stroke(strokeHoverColor)
    } else if (type == 'off' && strokeOutColor) {
      if (target == t1 || target == t2) return
      target.stroke(strokeOutColor)
    }
  }
}

function drawHelpLine(target: IAlignTarget) {
  //画辅助线
  if (!target?.attrs) return
  const draftLayer = getDraftLayer(AlignStage)
  // console.log('drawHelpLine', target)
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
/**
 * 获取对齐对象
 * @param lastTarget 上一次选择的对象，两次选择不能一样
 * @returns
 */
function getTarget(lastTarget?: IAlignTarget): Promise<Stage | Shape<ShapeConfig>> {
  return new Promise<Stage | Shape<ShapeConfig>>((resolve, reject) => {
    function _target(event: KonvaEventObject<MouseEvent>) {
      const { target } = event
      // console.log('getTarget--99', event)
      if (!target?.attrs?.alignTarget) return
      if (!lastTarget || target != lastTarget) {
        // console.log('succ', target.width(), target.height(), target.x(), target.y())
        setType(event, 'on') //显示高亮
        AlignStage.off('click', _target)
        resolve(target)
      }
    }
    AlignStage.on('click', _target)
  })
}
