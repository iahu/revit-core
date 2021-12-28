import Konva from 'konva'
import Bluebird from 'bluebird'
import { Stage } from 'konva/lib/Stage'
import { listenOn } from '../actions/helper'
import { getBackgroundLayer } from '../helpers/background'
export interface InsertImageOptions {
  insertImage_follow?: string
  insertImage_down?: string
}
//插入图片，图片follow跟随鼠标移动，点击后，停止移动，显示图片down
export const insertImage = (layer: Konva.Layer, options = {} as InsertImageOptions) => {
  const { insertImage_follow = '', insertImage_down = '' } = options
  console.log('options---', options)
  const stage = layer.getStage() as Stage
  const bgLayer = getBackgroundLayer(stage)
  return new Bluebird((resolve, reject, onCancel) => {
    const _image_follow = new Image()
    _image_follow.src = insertImage_follow
    const imgFlollow = new Konva.Image({ name: 'InsertImage-follow', image: _image_follow })
    imgFlollow.listening(false)
    layer.add(imgFlollow)
    setImagePosition(imgFlollow)

    function setImagePosition(image: Konva.Image) {
      const { x = 0, y = 0 } = stage.getPointerPosition() ?? {}
      image.x(x - image.width() / 2)
      image.y(y - image.height() / 2)
    }

    const stopListenMousemove = listenOn(stage, 'mousemove', e => {
      setImagePosition(imgFlollow)
    })

    const stopListenMouseDown = listenOn(stage, 'click', e => {
      stopListenMousemove()
      stopListenMouseDown()

      imgFlollow.visible(false)

      const _image_down = new Image()
      _image_down.src = insertImage_down
      const imgDown = new Konva.Image({ name: 'InsertImage', image: _image_down })
      imgDown.listening(false)
      layer.add(imgDown)
      setImagePosition(imgDown)

      resolve()
    })

    onCancel?.(() => {
      stopListenMousemove()
      stopListenMouseDown()
    })
  })
}
