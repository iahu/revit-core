import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import Kroup from './kroup'
import { Observed, observer, ChangedProp } from './observer'
import { listenOn } from '../actions/helper'

export interface ImageFollowOptions {
  img_follow?: string
  img_down?: string
}
//图片1跟随鼠标移动，点击后，停止移动，显示图片2
//type: imageFollow
export class ImageFollow extends Kroup implements Observed, ImageFollowOptions {
  @observer<ImageFollow, 'img_follow'>() img_follow = ''
  @observer<ImageFollow, 'img_down'>() img_down = ''
  _image_follow = new Image();
  _image_down = new Image();
  stopListenMousemove: any
  stopListenMousedown: any
  constructor(options = {} as ImageFollowOptions & ContainerConfig) {
    super(options)
    this.setAttrs(options)
  }

  $follow = new Konva.Image({ name: 'image-follow', image: this._image_follow })
  $down = new Konva.Image({ name: 'image-follow', image: this._image_down, visible: false })
  update() {
    if (!this.stopListenMousemove) {
      this.stopListenMousemove = listenOn(this.getStage()!, 'mousemove', e => {
        if (!this.visible()) return
        const { x = 0, y = 0 } = e.target.getStage()?.getPointerPosition() ?? {}
        this.$follow.x(x - this.$follow.width() / 2)
        this.$follow.y(y - this.$follow.height() / 2)
      })
      this.stopListenMousedown = listenOn(this.getStage()!, 'click', e => {
        if (!this.visible()) return
        this.$follow.visible(false)
        this.$down.setAttrs({
          visible: true,
          x: this.$follow.x(),
          y: this.$follow.y()
        })
        this.stopListenMousedown()
        this.stopListenMousemove()
      })
    }
    this._image_follow.src = this.img_follow
    this._image_down.src = this.img_down
  }
  render() {
    // 不响应事件
    this.$follow.listening(false)
    this.$down.listening(false)
    this.update()
    return [this.$follow, this.$down]
  }
}