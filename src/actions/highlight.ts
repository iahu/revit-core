import Bluebird from 'bluebird'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { Stage } from 'konva/lib/Stage'
import {
  closestSelectable,
  HIGHLIGHT_CLASSNAME,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_FILL,
  isStage,
  SELECTED_CLASSNAME,
  ShapeOrGroup,
} from './helper'

export const BACKUP_ATTRS_KEY = '__KAD_BACKUP_ATTRS'

export const resetHighlight = (stage: Stage) => {
  stage.find(`.${HIGHLIGHT_CLASSNAME}`).forEach(n => {
    if (!n.hasName(SELECTED_CLASSNAME)) {
      n.removeName(HIGHLIGHT_CLASSNAME)
      n.setAttrs(n.getAttr(BACKUP_ATTRS_KEY))
    }
  })
}

const $tips = document.createElement('div')
const DEBUG = location.host === 'localhost:3000' && localStorage.getItem('KAD_DEBUG')
if (DEBUG) {
  $tips.className = 'kad-debug'
  $tips.style.cssText =
    'position:fixed;z-index: 9999;max-width:200px;height:100vh;box-sizing:border-box;overflow:auto;right:0;top:0;background: #fff;color: #333;font-size: 12px;padding: 6px 12px;box-shadow:0 0 3px rgba(0,0,0,0.3)'
  document.body.appendChild($tips)
}

const getHighlightStyle = (node: Konva.Node) => {
  const attrs = node.getAttrs()
  const _backup = node.getAttr(BACKUP_ATTRS_KEY)
  const backupAttrs = _backup ? _backup : { fill: attrs.fill, stroke: attrs.stroke, opacity: attrs.opacity }

  const clone = {
    [BACKUP_ATTRS_KEY]: { fill: '', stroke: '', opacity: '', ...backupAttrs },
    name: node.hasName(HIGHLIGHT_CLASSNAME) ? node.name() : `${node.name()} ${HIGHLIGHT_CLASSNAME}`,
    stroke: attrs.stroke && HIGHLIGHT_COLOR,
    fill: attrs.fill && HIGHLIGHT_FILL,
    // shadowColor: attrs.shadowColor ?? HIGHLIGHT_COLOR,
    // shadowBlur: 2,
    opacity: 0.9,
  }

  if (!attrs.stroke && !attrs.fill) {
    clone.stroke = HIGHLIGHT_COLOR
  }

  return clone
}

export const setHightlight = (nodes: ShapeOrGroup[]) => {
  nodes.forEach(n => {
    n.setAttrs(getHighlightStyle(n))
  })
}

export const highlight = (layer: Konva.Layer | Konva.Stage) => {
  const stage = layer.getStage()

  return new Bluebird<ShapeOrGroup>((resolve, reject, onCancel) => {
    function onMouseOver(event: KonvaEventObject<MouseEvent>) {
      const { target } = event

      if (isStage(target)) return
      const closestTarget = closestSelectable(target)
      if (closestTarget) {
        setHightlight([closestTarget])
        resolve(closestTarget)
        if (DEBUG) {
          $tips.innerText = [target.constructor.name, JSON.stringify(target.getAttrs(), null, 2)].join('\n')
        }
      }
    }
    function onMouseOut(e: KonvaEventObject<MouseEvent>) {
      const target = e.target
      if (isStage(target)) return
      const closestTarget = closestSelectable(target)
      if (closestTarget && !closestTarget.hasName(SELECTED_CLASSNAME)) {
        resetHighlight(stage)
      }
    }
    stage.on('mouseover', onMouseOver)
    stage.on('mouseout', onMouseOut)
    onCancel?.(() => {
      stage.off('mouseover', onMouseOver)
      stage.off('mouseout', onMouseOut)
    })
  })
}
