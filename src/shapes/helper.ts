import Konva from 'konva'
import { Vector2d } from 'konva/lib/types'
import { KonvaChangeEvent } from './observer'

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

export const toDeg360 = (deg: number) => {
  return (360 + deg) % 360
}

export const toDeg180 = (deg: number) => {
  const fullDeg = toDeg360(deg)
  return fullDeg > 180 ? fullDeg - 360 : fullDeg
}

export const isIdSelector = (s: string) => s.startsWith('#')
export const isNameSelector = (s: string) => s.startsWith('.')
export const isNodeSelector = (s: string) => s.match(/^[_a-zA-Z]/)
export const match = <T extends Konva.Node>(node: T, selector: string) => {
  if (isNameSelector(selector)) {
    return node.hasName(selector.slice(1))
  }
  if (isIdSelector(selector)) {
    return node.id() === selector.slice(1)
  }
  if (isNodeSelector(selector)) {
    return node.constructor.name === selector
  }
  return false
}
export const closest = <T extends Konva.Node = Konva.Node>(node: Konva.Node, selector: string): T | null => {
  let current = node

  if (match(current, selector)) {
    return current as T
  }

  while (current.parent) {
    current = current.parent
    if (match(current, selector)) {
      return current as T
    }
  }
  return null
}

export const fireChangeEvent = <T extends Konva.Node, K extends string & keyof T>(
  target: T,
  key: K,
  data: Partial<KonvaChangeEvent<T, K>>,
  bubbles = true,
) => {
  const type = `${key}Change`
  const changeEvent = { ...data, ...new CustomEvent(type), target, currentTarget: target }
  target.fire(type, changeEvent, bubbles)
}

export const asc = (a: number, b: number) => a - b
export const clip = (min: number, max: number, n: number) => Math.min(max, Math.max(n, min))

export const snap = (oldValue: number, newValue: number, dist: number) =>
  Math.abs(newValue - oldValue) < Math.abs(dist) ? oldValue : newValue
