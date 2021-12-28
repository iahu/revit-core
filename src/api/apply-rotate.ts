import { DEG_TO_RAD } from '@shapes/helper'
import Konva from 'konva'
import { Group } from 'konva/lib/Group'
import { Vector2d } from 'konva/lib/types'

export interface ApplyRotateOptions {
  /** 旋转角度 */
  angle: number
  /** 旋转中心 */
  origin: Vector2d
}

export const applyRotate = (node: Konva.Shape | Group, options: ApplyRotateOptions) => {
  const { angle, origin } = options
  const position = node.getPosition()

  node.setAttrs({ x: origin.x, y: origin.y, offsetX: origin.x - position.x, offsetY: origin.y - position.y })
  node.rotate(angle)
  return node
}
