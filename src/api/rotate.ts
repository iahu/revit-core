import Konva from 'konva'
import { Group } from 'konva/lib/Group'

export const applyRotate = (node: Konva.Shape | Group, rotate: number) => {
  node.rotation(node.getAbsoluteRotation() + rotate)
  return node
}
