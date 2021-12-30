import Bluebird from 'bluebird'
import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { move } from './move'
import { SelectOptions } from './select'

export interface CopyOptions extends SelectOptions {
  copyResult?: boolean //是否拷贝结果
  lockX?: boolean //纵向移动
  lockY?: boolean //横向移动
  showCompass?: boolean //是否显示角度
  pixelRatio?: number//尺子比例
}
export const copy = (layer: Layer, config = {} as CopyOptions) => {
  const { showCompass = true, lockY = false, lockX = false, copyResult = true, pixelRatio, useSelectedNode } = config

  return move(layer, { showCompass, lockY, lockX, pixelRatio, useSelectedNode })
    .then(result => {
      if (!copyResult) {
        return Bluebird.reject('pass')
      }
      return result
    })
    .then(result => {
      const { nodes, x, y } = result
      const node = nodes[0] as Konva.Shape
      const clone = node.clone()
      const layer = node.getLayer()
      if (!layer) {
        return Bluebird.reject('no layer')
      }
      clone.x(clone.x() - x)
      clone.y(clone.y() - y)
      clone.id(node.id() + '_clone')

      if (copyResult) {
        layer.add(clone)
      }

      return clone
    })
}
