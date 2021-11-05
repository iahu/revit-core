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
