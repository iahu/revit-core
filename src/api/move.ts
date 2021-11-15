import Konva from 'konva'
import { Vector2d } from 'konva/lib/types'

export const applyMove = (nodes: Konva.Node[], dest: Vector2d) => {
  nodes.forEach(node => node.setAbsolutePosition(dest))
}
