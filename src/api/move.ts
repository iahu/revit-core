import Konva from 'konva'
import { Vector2d } from 'konva/lib/types'

export const applyMove = (nodes: Konva.Node[], delta: Vector2d) => {
  nodes.forEach(node => {
    const rotation = node.getAbsoluteRotation()
    const { x, y } = node.getAbsolutePosition()

    node.rotate(-rotation)
    node.setAbsolutePosition({ x: x + delta.x, y: y + delta.y })
    node.rotate(rotation)

    return node
  })
}
