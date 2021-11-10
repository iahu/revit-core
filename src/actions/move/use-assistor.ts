import Konva from 'konva'
import { getAssistor } from '@helpers/assistor'
import { getBackgroundLayer } from '@helpers/background'
import { getDraftLayer } from '@helpers/draft'
import { getTransformer } from '@helpers/transfomer'
import { moveTo } from './move-to'

type AssistorOptions = {
  snapAngle?: number
}

export const useAssistor = (stage: Konva.Stage, options = {} as AssistorOptions) => {
  const { snapAngle = 3 } = options
  const bgLayer = getBackgroundLayer(stage)
  const draftLayer = getDraftLayer(stage)
  const assistor = getAssistor(stage)
  const transformer = getTransformer(stage)
  const pupperty = new Konva.Rect({ dash: [3, 3], stroke: '#0099ff', strokeWidth: 1 })

  draftLayer.add(pupperty)
  assistor.visible(false)
  assistor.snapMaxAngle = snapAngle

  stage.off('mousedown.actionMove')
  stage.off('mousemove.actionMove')

  stage.on('mousedown.actionMove', event => {
    event.evt.preventDefault()
    const { x = 0, y = 0 } = stage.getPointerPosition() ?? {}

    if (event.target === stage) {
      event.evt.stopImmediatePropagation()
      draftLayer.visible(true)
    }

    const padding = transformer.padding()
    if (!assistor.visible()) {
      if (transformer.nodes().length === 0) {
        return
      }
      pupperty.setAttrs({
        x,
        y,
        offset: { x: padding, y: padding },
        width: transformer.getWidth() + padding * 2,
        height: transformer.getHeight() + padding * 2,
        visible: true,
      })
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

      moveTo(transformer.nodes(), { x: dest.x + padding, y: dest.y + padding })
    }
  })

  stage.on('mousemove.actionMove', event => {
    event.evt.preventDefault()
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
