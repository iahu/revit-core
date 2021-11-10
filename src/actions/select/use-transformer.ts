import Konva from 'konva'
import { Group } from 'konva/lib/Group'
import { Shape } from 'konva/lib/Shape'
import { getTransformer } from '@helpers/transfomer'
import { ShapeOrGroup } from './'

export type UseTransformerOptions = {
  clearBefore: boolean
}

export const useTransformer = (layer: Konva.Layer, nodes: ShapeOrGroup[], options = {} as UseTransformerOptions) => {
  const transformer = getTransformer(layer)
  const { clearBefore = true } = options
  if (clearBefore) {
    transformer.nodes([])
  }
  const previousNodes = transformer.nodes() as (Shape | Group)[]
  const nextNodes = previousNodes.concat(nodes)
  transformer.nodes(nextNodes)

  return nextNodes
}
