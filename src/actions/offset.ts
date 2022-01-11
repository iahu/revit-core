import { ShapeOrKomponent } from '@shapes/index'
import Bluebird from 'bluebird'
import { Layer } from 'konva/lib/Layer'
import { Line } from 'konva/lib/shapes/Line'
import { Vector2d } from 'konva/lib/types'
import { getKomponentOrShape, isShape, listenOn, Maybe } from './helper'

export interface OffsetOptions {
  node?: ShapeOrKomponent
  value?: number
  pixelRatio?: number
  /**
   * 复制当前元素，否则效果相当于移动
   */
  copy?: boolean
  /** 保持活跃直到取消，否则操作一次就结束 */
  keepAlive?: boolean
}

export const offset = (layer: Layer, options = {} as OffsetOptions) => {
  const stage = layer.getStage()
  const { value, pixelRatio = 1, keepAlive, copy = true } = options

  return new Bluebird((resolve, reject, onCancel) => {
    if (!stage) {
      return Bluebird.reject('no stage found')
    }
    console.log('what', value)
    // 数值方式
    if (value) {
      const dashedLine = new Line({ stroke: '#333', strokeWidth: 1, dash: [3, 3] })
      let offstTarget: Maybe<ShapeOrKomponent>
      // 提取要位移的目标元素
      const $mouseover = listenOn(stage, 'mouseover', e => {
        if (!offstTarget && isShape(e.target)) {
          const target = getKomponentOrShape(e.target) as ShapeOrKomponent
          if (!target) return
          if (copy) {
            offstTarget = target.clone()
          } else {
            offstTarget = target
          }

          const rect = target.getClientRect()
          const pos = target.getAbsolutePosition()
          dashedLine.setAttrs({ x: pos.x, y: pos.y, points: [0, 0, 0, rect.height] })
          layer.add(dashedLine)
        }
      })

      // 重置目标元素
      const $mouseout = listenOn(stage, 'mouseout', () => {
        dashedLine.remove()
        offstTarget = undefined
      })

      // 确定位移方位
      const $mousemove = listenOn(stage, 'mousemove', e => {
        if (!offstTarget || !getKomponentOrShape(e.target)) {
          return
        }
        const pos = offstTarget.getAbsolutePosition()
        const pointerPosition = stage.getPointerPosition() as Vector2d
        /**
         * @todo 取中心线
         */
        const offsetX = pointerPosition?.x < pos.x ? -value : value
        dashedLine.setAttrs({ x: pos.x + offsetX * pixelRatio })
      })

      // 确认操作
      const $click = listenOn(stage, 'click', () => {
        if (offstTarget) {
          layer.add(offstTarget.setAttrs({ x: dashedLine.x() }))
          if (!keepAlive) {
            dashedLine.destroy()
            resolve(offstTarget)
          } else {
            offstTarget = undefined
          }
        }
      })

      // 取消操作
      onCancel?.(() => {
        $mouseover()
        $mouseout()
        $mousemove()
        $click()
        dashedLine.destroy()
      })
    } else {
      /**
       * @TODO 图形方式
       */
      resolve()
    }
  })
}
