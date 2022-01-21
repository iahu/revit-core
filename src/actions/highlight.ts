import Bluebird from 'bluebird'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { Stage } from 'konva/lib/Stage'
import { debug } from './debug'
import {
  closestSelectable,
  HIGHLIGHT_CLASSNAME,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_FILL,
  isStage,
  listenOn,
  SELECTED_CLASSNAME,
  ShapeOrGroup,
} from './helper'

export const BACKUP_ATTRS_KEY = '__KAD_BACKUP_ATTRS'

export const resetHighlight = (stage: Stage) => {
  stage.find(`.${HIGHLIGHT_CLASSNAME}`).forEach(n => {
    if (!n.hasName(SELECTED_CLASSNAME)) {
      n.removeName(HIGHLIGHT_CLASSNAME)
      n.setAttrs(n.getAttr(BACKUP_ATTRS_KEY))
      const { highlighted } = n.attrs
      n.setAttr('highlighted', false)
      n.fire('highlightedChange', { oldVal: highlighted, newVal: false }, true)
    }
  })
}

const getHighlightStyle = (node: Konva.Node) => {
  const attrs = node.getAttrs()
  const _backup = node.getAttr(BACKUP_ATTRS_KEY)
  const backupAttrs = _backup ? _backup : { fill: attrs.fill, stroke: attrs.stroke, opacity: attrs.opacity }
  const highlightStroke = attrs.highlightStroke ?? HIGHLIGHT_COLOR

  const clone = {
    [BACKUP_ATTRS_KEY]: { fill: '', stroke: '', opacity: '', ...backupAttrs },
    name: node.hasName(HIGHLIGHT_CLASSNAME) ? node.name() : `${node.name()} ${HIGHLIGHT_CLASSNAME}`,
    stroke: attrs.stroke && highlightStroke,
    fill: attrs.fill && HIGHLIGHT_FILL,
    // shadowColor: attrs.shadowColor ?? HIGHLIGHT_COLOR,
    // shadowBlur: 2,
    opacity: 0.9,
  }

  if (!attrs.stroke && !attrs.fill) {
    clone.stroke = highlightStroke
  }

  return clone
}

export const setHightlight = (nodes: ShapeOrGroup[]) => {
  nodes.forEach(n => {
    n.setAttrs(getHighlightStyle(n))
    const { highlighted } = n.attrs
    n.setAttr('highlighted', true)
    n.fire('highlightedChange', { oldVal: highlighted, newVal: true }, true)
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

    const $debug = debug(layer)
    const $over = listenOn(stage, 'mouseover', onMouseOver)
    const $out = listenOn(stage, 'mouseout', onMouseOut)
    onCancel?.(() => {
      $over()
      $out()
      $debug()
    })
  })
}
