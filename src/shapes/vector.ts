export type Vector2d = {
  x: number
  y: number
}

export const isVector2d = (o: any): o is Vector2d => o && typeof o.x === 'number' && typeof o.y === 'number'

export class Vector {
  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /* INSTANCE METHODS */
  negative() {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  add(v: Vector2d | number) {
    if (isVector2d(v)) {
      this.x += v.x
      this.y += v.y
    } else {
      this.x += v
      this.y += v
    }
    return this
  }

  subtract(v: Vector2d | number) {
    if (isVector2d(v)) {
      this.x -= v.x
      this.y -= v.y
    } else {
      this.x -= v
      this.y -= v
    }
    return this
  }

  multiply(v: Vector2d | number) {
    if (isVector2d(v)) {
      this.x *= v.x
      this.y *= v.y
    } else {
      this.x *= v
      this.y *= v
    }
    return this
  }

  divide(v: Vector2d | number) {
    if (isVector2d(v)) {
      if (v.x !== 0) this.x /= v.x
      if (v.y !== 0) this.y /= v.y
    } else {
      if (v !== 0) {
        this.x /= v
        this.y /= v
      }
    }
    return this
  }

  equals(v: Vector2d) {
    return this.x === v.x && this.y === v.y
  }

  dot(v: Vector2d) {
    return this.x * v.x + this.y * v.y
  }

  cross(v: Vector2d) {
    return this.x * v.y - this.y * v.x
  }

  norm() {
    return Math.sqrt(this.dot(this))
  }

  normalize() {
    return this.divide(this.norm())
  }

  min() {
    return Math.min(this.x, this.y)
  }

  max() {
    return Math.max(this.x, this.y)
  }

  toAngles() {
    return -Math.atan2(-this.y, this.x)
  }

  angleTo(a: Vector2d) {
    return Math.acos(this.dot(a) / (this.norm() * new Vector(a.x, a.y).norm()))
  }

  toArray(n: number) {
    return [this.x, this.y].slice(0, n || 2)
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  set(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  /* STATIC METHODS */
  static negative(a: Vector2d) {
    return new Vector(-a.x, -a.y)
  }

  static add(a: Vector2d, b: Vector2d | number) {
    if (isVector2d(b)) return new Vector(a.x + b.x, a.y + b.y)
    else return new Vector(a.x + b, a.y + b)
  }

  static subtract(a: Vector2d, b: Vector2d | number) {
    if (isVector2d(b)) return new Vector(a.x - b.x, a.y - b.y)
    else return new Vector(a.x - b, a.y - b)
  }

  static multiply(a: Vector2d, b: Vector2d | number) {
    if (isVector2d(b)) return new Vector(a.x * b.x, a.y * b.y)
    else return new Vector(a.x * b, a.y * b)
  }

  static divide(a: Vector2d, b: Vector2d | number) {
    if (isVector2d(b)) return new Vector(a.x / b.x, a.y / b.y)
    else return new Vector(a.x / b, a.y / b)
  }

  static equals(a: Vector2d, b: Vector2d) {
    return a.x === b.x && a.y === b.y
  }

  static dot(a: Vector2d, b: Vector2d) {
    return a.x * b.x + a.y * b.y
  }

  static cross(a: Vector2d, b: Vector2d) {
    return a.x * b.y - a.y * b.x
  }
}

type Point2d = number[]
export const isPoint2d = (o: any): o is Point2d =>
  Array.isArray(o) && typeof o[0] === 'number' && typeof o[1] === 'number'

export class ArrayVector {
  x: number
  y: number;

  [Symbol.iterator] = function* (this: ArrayVector) {
    yield this.x
    yield this.y
  }

  get value() {
    return [this.x, this.y]
  }
  set value(p: Point2d) {
    this.x = p[0]
    this.y = p[1]
  }

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /* INSTANCE METHODS */
  negative() {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  add(v: Point2d | number) {
    if (isPoint2d(v)) {
      this.x += v[0]
      this.y += v[1]
    } else {
      this.x += v
      this.y += v
    }
    return this
  }

  subtract(v: Point2d | number) {
    if (isPoint2d(v)) {
      this.x -= v[0]
      this.y -= v[1]
    } else {
      this.x -= v
      this.y -= v
    }
    return this
  }

  multiply(v: Point2d | number) {
    if (isPoint2d(v)) {
      this.x *= v[0]
      this.y *= v[1]
    } else {
      this.x *= v
      this.y *= v
    }
    return this
  }

  divide(v: Point2d | number) {
    if (isPoint2d(v)) {
      if (v[0] !== 0) this.x /= v[0]
      if (v[1] !== 0) this.y /= v[1]
    } else {
      if (v !== 0) {
        this.x /= v
        this.y /= v
      }
    }
    return this
  }

  equals(v: Point2d) {
    return this.x === v[0] && this.y === v[1]
  }

  dot(v: Point2d) {
    return this.x * v[0] + this.y * v[1]
  }

  cross(v: Point2d) {
    return this.x * v[1] - this.y * v[0]
  }

  norm() {
    return Math.sqrt(this.dot(this.value))
  }

  normalize() {
    return this.divide(this.norm())
  }

  min() {
    return Math.min(this.x, this.y)
  }

  max() {
    return Math.max(this.x, this.y)
  }

  toAngles() {
    return -Math.atan2(-this.y, this.x)
  }

  angleTo(a: Point2d) {
    return Math.acos(this.dot(a) / (this.norm() * new ArrayVector(a[0], a[1]).norm()))
  }

  toArray(n: number) {
    return [this.x, this.y].slice(0, n || 2)
  }

  clone() {
    return new ArrayVector(this.x, this.y)
  }

  set(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  /* STATIC METHODS */
  static negative(a: Point2d) {
    return new ArrayVector(-a[0], -a[1])
  }

  static add(a: Point2d, b: Point2d | number) {
    if (isPoint2d(b)) return new ArrayVector(a[0] + b[0], a[1] + b[1])
    else return new ArrayVector(a[0] + b, a[1] + b)
  }

  static subtract(a: Point2d, b: Point2d | number) {
    if (isPoint2d(b)) return new ArrayVector(a[0] - b[0], a[1] - b[1])
    else return new ArrayVector(a[0] - b, a[1] - b)
  }

  static multiply(a: Point2d, b: Point2d | number) {
    if (isPoint2d(b)) return new ArrayVector(a[0] * b[0], a[1] * b[1])
    else return new ArrayVector(a[0] * b, a[1] * b)
  }

  static divide(a: Point2d, b: Point2d | number) {
    if (isPoint2d(b)) return new ArrayVector(a[0] / b[0], a[1] / b[1])
    else return new ArrayVector(a[0] / b, a[1] / b)
  }

  static equals(a: Point2d, b: Point2d) {
    return a[0] === b[0] && a[1] === b[1]
  }

  static dot(a: Point2d, b: Point2d) {
    return a[0] * b[0] + a[1] * b[1]
  }

  static cross(a: Point2d, b: Point2d) {
    return a[0] * b[1] - a[1] * b[0]
  }
}

export const p2ToV2 = (p: number[]): Vector2d => ({ x: p[0], y: p[1] })
export const v2ToP2 = (v: Vector2d): number[] => [v.x, v.y]
