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
  pixelRatio?: number //尺子比例
  useDrag?: boolean //是否使用框选功能
}
export const copy = (layer: Layer, config = {} as CopyOptions) => {
  const { showCompass = true, lockY = false, lockX = false, copyResult = true, pixelRatio, useSelectedNode, useDrag = false } = config
  if (copyResult) {
    return move(layer, { showCompass, lockY, lockX, pixelRatio, useSelectedNode, useDrag }).then(result => {
      const { nodes, x, y } = result
      const node = nodes[0] as Konva.Shape
      const layer = node.getLayer()
      if (!layer) {
        return Bluebird.reject('no layer')
      }
      const pos = node.getAbsolutePosition()
      const clone = node.clone({ id: `${node.id()}_clone`, x: pos.x - x, y: pos.y - y })
      layer.add(clone)

      return clone
    })
  } else {
    return move(layer, { showCompass, lockY, lockX, pixelRatio, useSelectedNode, useDrag }).then(result => {
      //不拷贝结果，坐标还原
      const { nodes, x, y } = result
      const node = nodes[0] as Konva.Shape
      const layer = node.getLayer()
      if (!layer) {
        return Bluebird.reject('no layer')
      }
      const pos = node.getAbsolutePosition()
      node.x(pos.x - x)
      node.y(pos.y - y)
      return result
    })
  }
}
