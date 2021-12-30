import Konva from 'konva'
import Komponent from './komponent'
import { Observed, attr } from './observer'
import { ContainerConfig } from 'konva/lib/Container'
export interface SvgButtonOptions {
  stroke?: string | CanvasGradient
  fill?: string
  strokeWidth?: number
  /**按钮样式-普通 */
  mouseData?: string
  /**按钮样式-滑过 */
  mouseOverData?: string
  /*按钮样式-按下 */
  mouseDownData?: string
  /**虚线间距 */
  dash?: number[]
  mouseType?: 'over' | 'down' | 'normal'
}
export class SvgButton extends Komponent implements Observed, SvgButtonOptions {
  @attr<SvgButton, 'stroke'>() stroke = 'rgb(255,48,48)'
  @attr<SvgButton, 'fill'>() fill = 'rgba(0,0,0,0.1)'
  @attr<SvgButton, 'strokeWidth'>() strokeWidth = 2
  @attr<SvgButton, 'mouseData'>() mouseData = ''
  @attr<SvgButton, 'mouseOverData'>() mouseOverData = ''
  @attr<SvgButton, 'mouseDownData'>() mouseDownData = ''
  _mouseType: SvgButtonOptions['mouseType'] = 'normal'
  @attr<SvgButton, 'mouseType'>() mouseType: SvgButtonOptions['mouseType'] = 'normal'
  @attr<SvgButton, 'dash'>() dash = []
  constructor(options = {} as SvgButtonOptions & ContainerConfig) {
    super(options)
    if (!options.mouseData) {
      // options.mouseData = 'M0 0 h10 v10 h-10 z'
    }
    this.setAttrs(options)
    // this.name('unselectable')
    this.draggable(false)
    this.$btttonArea.on('mouseover', () => {
      this.changeMouseType('over')
    })
    this.$btttonArea.on('mousedown', () => {
      this.changeMouseType('down')
    })
    this.$btttonArea.on('mouseout', () => {
      this.changeMouseType('normal')
    })
  }
  changeMouseType(type: SvgButtonOptions['mouseType']) {
    this._mouseType = type
    this.mouseType = type
  }
  $mouseDraw = new Konva.Path({
    name: 'unselectable',
    draggable: false,
    data: 'M70 0 Q8 8 0 72 h70 v-6 h-70 M70 0 v72 h17 v-72 h-17 z',
  })
  $btttonArea = new Konva.Rect({
    id: 'btttonArea',
    name: 'unselectable',
    draggable: false,
    width: this.width(),
    height: this.height(),
    fill: 'rgba(0,0,0,0.01)',
  })
  update() {
    const { $mouseDraw, stroke, fill, strokeWidth, dash, mouseData, mouseOverData, mouseDownData, _mouseType } = this
    let data = mouseData
    if (_mouseType == 'over' && mouseOverData) data = mouseOverData
    else if (_mouseType == 'down') data = mouseDownData ? mouseDownData : mouseOverData ? mouseOverData : mouseData
    $mouseDraw.setAttrs({
      stroke: stroke,
      fill: fill,
      strokeWidth: strokeWidth,
      dash: dash,
      data: data,
    })
  }
  render() {
    this.$mouseDraw.listening(false)
    this.update()
    return [this.$mouseDraw, this.$btttonArea]
  }
}
