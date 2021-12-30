import { EditableText } from './editable-text'
import { Flag } from './flag'
import Kroup from './kroup'
import { Observed, attr } from './observer'

export interface FlagLabelOptions {
  stroke?: string | CanvasGradient
  label?: string
  title?: string
}

export class FlagLabel extends Kroup implements Observed, FlagLabelOptions {
  @attr<FlagLabel, 'label'>() label = '±0.000'
  @attr<FlagLabel, 'title'>() title = '标高'

  $flag = new Flag({ name: 'flag-label-flag' })
  $label = new EditableText({ name: 'flag-label-label' })
  $title = new EditableText({ name: 'flag-label-title' })

  firstRender() {
    this.updated.then(() => this.update())
  }

  update() {
    const { stroke, strokeWidth, label, title, width = 80, height = 10 } = this.getAttrs()
    const padding = 4
    this.$flag.setAttrs({ stroke, strokeWidth, width, height })
    const flagHeight = this.$flag.height()

    this.$label.setAttrs({
      stroke,
      strokeWidth,
      text: label,
      padding,
      offsetX: this.$label.width() - width,
      offsetY: this.$title.height() + flagHeight,
    })
    this.$title.setAttrs({
      stroke,
      strokeWidth,
      text: title,
      offsetX: -width - padding,
      offsetY: this.$title.height() / 2 + flagHeight,
      padding,
    })
  }

  render() {
    this.update()
    return [this.$flag, this.$label, this.$title]
  }
}
