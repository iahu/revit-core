import Konva from 'konva'
import { getAssistor } from '../helpers/assistor'
import { getBackgroundLayer } from '../helpers/background'
import { getDraftLayer } from '../helpers/draft'
import { getTransformer } from '../helpers/transfomer'

type MoveConfig = {
  snap: number
}
const defaultConfig = {
  snap: 10,
}

export const move = (stage: Konva.Stage, config = defaultConfig as MoveConfig) => {
  // const { snap } = config
  const bgLayer = getBackgroundLayer(stage)
  const draftLayer = getDraftLayer(stage)
  const assistor = getAssistor(stage)
  const transformer = getTransformer(stage)
  const { x, y, width, height } = transformer.getAttrs()
  const pupperty = new Konva.Rect({ x, y, width, height, dash: [3, 3], stroke: '#0099ff', strokeWidth: 1 })

  draftLayer.add(pupperty)
  assistor.visible(false)

  stage.off('mousedown.actionMove')
  stage.off('mousemove.actionMove')

  stage.on('mousedown.actionMove', () => {
    const { x = 0, y = 0 } = stage.getPointerPosition() ?? {}
    if (!assistor.visible()) {
      if (transformer.nodes().length === 0) {
        return
      }
      const width = transformer.getWidth()
      const height = transformer.getHeight()
      pupperty.setAttrs({ x, y, width, height, visible: true })
      assistor.startPoint = [x, y]
      assistor.endPoint = [x, y]
      assistor.visible(true)
      draftLayer.visible(true)
      bgLayer.addName('unselectable')
    } else {
      assistor.visible(false)
      pupperty.visible(false)
      draftLayer.visible(false)
      const dest = pupperty.getTransform().decompose()
      transformer.setPosition(dest)
      bgLayer.removeName('unselectable')
    }
  })

  stage.on('mousemove.actionMove', () => {
    const { x = 0, y = 0 } = stage.getPointerPosition() ?? {}
    if (assistor.visible()) {
      const [x1, y1] = assistor.startPoint
      assistor.endPoint = [x, y]
      // 取回更新后的 endPoint
      pupperty.setPosition({
        x: transformer.getX() + assistor.endPoint[0] - x1,
        y: transformer.getY() + assistor.endPoint[1] - y1,
      })
    }
  })
}
