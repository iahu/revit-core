import Konva from 'konva'
import Kroup from './kroup'
import { Observed, attr } from './observer'
import { getTransformer } from '../helpers/transfomer'
import { ContainerConfig } from 'konva/lib/Container'
export interface SelectBoxOption {
  selector?: string //框的目标
  stroke?: string | CanvasGradient
  strokeWidth?: number
  data?: string
  /**虚线间距 */
  dash?: number[]
  group?: boolean //是否是群组，群组没有中间那一条线
}
/**按 enter 键后，物体周围显示的边框 */
export class SelectBox extends Kroup implements Observed, SelectBoxOption {
  @attr<SelectBox, 'selector'>() selector = ''
  @attr<SelectBox, 'stroke'>() stroke = '#0099ff'
  @attr<SelectBox, 'strokeWidth'>() strokeWidth = 1
  @attr<SelectBox, 'data'>() data = ''
  @attr<SelectBox, 'dash'>() dash = [10, 10]
  constructor(options: SelectBoxOption & ContainerConfig) {
    super(options)
    this.name('unselectable')
    this.draggable(false)
    this.setAttrs(options)
    // if (options.selector) {
    //   console.log(options.selector)
    // }
  }
  $box = new Konva.Rect({
    name: 'unselectable',
    draggable: false,
  })
  $line = new Konva.Line({
    name: 'unselectable',
    draggable: false,
  })
  update() {
    const { $box, stroke, strokeWidth, dash, selector } = this

    const shape = this.getStage()?.find(selector)[0]
    if (shape) {
      const stage = shape?.getStage()
      const transformer = getTransformer(stage!)
      const padding = transformer.padding()
      const { x, y, width, height } = shape.getClientRect()
      $box.setAttrs({
        x,
        y,
        stroke,
        strokeWidth,
        dash,
        offset: { x: padding, y: padding },
        width: width + padding * 2,
        height: height + padding * 2,
      })
      this.$line.setAttrs({
        stroke,
        strokeWidth,
        dash,
        points: [x + padding + width / 2, y + padding, x + padding + width / 2, y + padding + height],
      })
    }
  }
  render() {
    this.$box.listening(false)
    this.$line.listening(false)
    this.update()
    return [this.$box, this.$line]
  }
}
