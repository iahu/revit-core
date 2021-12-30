import Konva from 'konva'
import Kroup from './kroup'
import { attr } from './observer'

export interface BricksConfig {
  width?: number
  height?: number
  side?: 'inner' | 'outer'
}

export class Bricks extends Kroup {
  wall = new Konva.Rect({ width: this.width(), height: this.height() })
  bricks = new Konva.Rect({ width: this.width(), height: this.height() })

  render() {
    return [this.wall]
  }
}
