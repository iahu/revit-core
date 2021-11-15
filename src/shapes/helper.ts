import { Vector2d } from 'konva/lib/types'

type Point = number[] // [number, number]
export const getDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2))
}

export const RAD_TO_DEG = 180 / Math.PI
export const DEG_TO_RAD = Math.PI / 180
export const getAngle = (p1: Point, p2: Point) => {
  const w = p2[0] - p1[0]
  const h = p2[1] - p1[1]
  const rad = Math.acos(w / Math.sqrt(w * w + h * h)) * RAD_TO_DEG
  if (h < 0) return rad * -1
  return rad
}

/**
 * 返回的是逆向的坐标信息：
 * [终点, 起点] 或者 [绝对坐标, 偏移坐标]
 */
export const getScalar = (p1: Vector2d, p2: Vector2d) => {
  return [p2.x - p1.x, p2.y - p1.y, p1.x, p1.y]
}
