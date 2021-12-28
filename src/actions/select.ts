import { applySelect } from '@api/apply-select'
import { getTransformer } from '@helpers/transfomer'
import Bluebird, { Promise } from 'bluebird'
import { Layer } from 'konva/lib/Layer'
import { dragSelect } from './drag-select'
import { findSelected, notUndefined, ShapeOrGroup } from './helper'
import { highlight } from './highlight'
import { pick } from './pick'

export const getNodes = (layer: Layer) => {
  const stage = layer.getStage()
  const transformer = getTransformer(stage)
  const nodes = findSelected(stage)

  if (nodes) {
    return Bluebird.resolve(nodes)
  }

  const $select = select(layer)
  return $select.tap(nodes => {
    transformer.nodes(nodes)
    $select.cancel()
  })
}

export interface SelectOptions {
  /** 使用已选内容 */
  useSelectedNode?: boolean
  /** 使用高亮效果 */
  useHighlight?: boolean
  useDrag?: boolean
}

export const select = (layer: Layer, options = {} as SelectOptions) => {
  const { useSelectedNode = false, useHighlight = true, useDrag = true } = options
  const stage = layer.getStage()
  const pickAsGroup = pick(layer).then(v => [v])
  const $highlight = useHighlight ? highlight(layer) : Bluebird.resolve()
  const actions = useDrag ? [pickAsGroup, dragSelect(layer)] : [pickAsGroup]

  return (
    Bluebird.any(actions)
      .then(nodes => nodes.filter(notUndefined))
      // .then(logger)
      .then(nodes => {
        applySelect(stage, nodes, useSelectedNode)
        return nodes
      })
      .catch(e => {
        console.error(e)
        applySelect(stage, [], useSelectedNode)
        return Promise.resolve([] as ShapeOrGroup[])
      })
      .finally(() => {
        $highlight.cancel()
      })
  )
}
