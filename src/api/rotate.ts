import Konva from 'konva'

export const applyRotate = (node: Konva.Shape, rotate: number) => {
  node.rotation(node.getAbsoluteRotation() + rotate)
  return node
}
