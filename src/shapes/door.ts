import Konva from 'konva'
import Kroup from './kroup'
import { Observed, observer } from './observer'

export interface DoorOptions {
  stroke?: string
  selectable?: boolean
  // name?: string
  // centerPoint?: Vector2d
  // startPoint?: Vector2d
  // endPoint?: Vector2d
}

/**门 */
export class Door extends Kroup implements Observed, DoorOptions {
  @observer<Door, 'selectable'>() selectable = false
  @observer<Door, 'stroke'>() stroke = '0x0000ff'
  readonly rectRight: Konva.Rect = new Konva.Rect({
    id: 'rectRight',
    x: 70,
    y: 0,
    width: 100,
    height: 100,
    fill: 'blue',
    cornerRadius: [0, 10, 20, 30],
    stroke: this.stroke
  })
  readonly rectLeft: Konva.Rect = new Konva.Rect({
    id: 'rectRight',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: 'red',
    cornerRadius: [0, 10, 20, 30],
    stroke: this.stroke
  })
  update() {
    console.log('---update---', this.stroke, this.name() + ';')
    this.rectRight.stroke(this.stroke)
    this.rectLeft.stroke(this.stroke)
  }
  render() {
    // this.update()
    return [this.rectLeft, this.rectRight]
  }
}