import Konva from 'konva'
import Komponent from './komponent'
import { attr } from './observer'

export interface BricksConfig {
  width?: number
  height?: number
  side?: 'inner' | 'outer'
}

export class Bricks extends Komponent {
  wall = new Konva.Rect({ width: this.width(), height: this.height() })
  bricks = new Konva.Rect({ width: this.width(), height: this.height() })

  render() {
    return [this.wall]
  }
}
