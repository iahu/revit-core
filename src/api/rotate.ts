import { DEG_TO_RAD } from '@shapes/helper'
import Konva from 'konva'

export const applyRotate = (node: Konva.Node, rotate: number) => {
  const t = new Konva.Transform()
  t.rotate(rotate * DEG_TO_RAD)
  node.getTransform().multiply(t)
}
