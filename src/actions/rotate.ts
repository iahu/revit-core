import { applyRotate } from '@api/index'
import Bluebird from 'bluebird'
import { Layer } from 'konva/lib/Layer'
import { Vector2d } from 'konva/lib/types'
import { select } from './select'
import { Angler } from '../shapes/angler'
import { findSelected, getCenterPoint, listenOn, ShapeOrGroup, usePoinerPosition, WithType } from './helper'
import { kadInput, mouseInput } from './input'
import { pointAt } from './pick'
import { setTitle } from './set-title'
import { ShapeOrKomponent } from '@shapes/index'
import { v2ToP2 } from '@shapes/vector'

export interface RotateOptions {
  name?: string
  /** 暂时只做一个元素 */
  node?: ShapeOrKomponent
  angle?: number
  origin?: 'center' | 'pick' | Vector2d
  /** 复制 */
  copy?: boolean
  /** 分离 */
  seprate?: boolean
}

export const rotate = (layer: Layer, rotateOptions = {} as RotateOptions) => {
  const stage = layer.getStage()
  const setTips = setTitle.bind(null, stage)

  /**
   * 从鼠标获取角度信息
   */
  const fromMouse = (options: RotateOptions) => {
    let _angler: Angler | undefined
    return new Bluebird<RotateOptions & { angler: Angler }>((resolve, reject, onCancel) => {
      // render angler helper
      const angler = new Angler({ name: 'rotate-angler unselectable', centerPoint: options.origin })
      layer.add(angler)
      _angler = angler

      // update startPoint
      const stopUpdateStartPoint = listenOn(stage, 'mousemove', e => {
        const startPoint = usePoinerPosition(e.target)
        angler.startPoint = v2ToP2(startPoint)
        angler.endPoint = v2ToP2(startPoint)
      })

      onCancel?.(stopUpdateStartPoint)

      return mouseInput(stage, 'click').then(() => {
        stopUpdateStartPoint()
        resolve({ ...options, angler })
      })
    })

      .then(data => {
        const { angler } = data
        // update end aux end point
        const stopUpdateEndAuxLine = listenOn(stage, 'mousemove', e => {
          const endPoint = usePoinerPosition(e.target)
          angler.endPoint = v2ToP2(endPoint)
        })

        return mouseInput(stage, 'click').then(stopUpdateEndAuxLine).return(data)
      })

      .then(data => {
        const { angle } = data.angler
        return { ...data, angle }
      })
      .finally(function (this: Bluebird<RotateOptions & { angler: Angler }>) {
        _angler?.destroy()
      })
  }

  /**
   * 从 kadInput 事件获取
   */
  const fromKadInput = (options: RotateOptions) =>
    kadInput<WithType<{ angle: number }>>().then(input => {
      if (input?.type === 'rotate') {
        return { ...options, angle: input.angle }
      }
      return Bluebird.reject(new Error('not matching'))
    })

  /**
   * 组织逻辑
   */
  return (
    Bluebird.resolve({ origin: 'center' as const, ...rotateOptions })
      // merge node
      .then(opts => {
        if (!opts.node) {
          // 使用已选元素
          const selected = findSelected(layer)
          if (selected) {
            return { ...opts, node: selected[0] }
          }
          // 调用选择操作获取
          setTips('请选择元素')
          return select(layer, { useDrag: false })
            .then(nodes => ({ ...opts, node: nodes[0] }))
            .tap(() => setTips(''))
        }
        return opts as typeof opts & { node: ShapeOrGroup }
      })

      // merge origin
      .then(opts => {
        const { origin } = opts
        // pick a origin
        if (!origin || origin === 'pick') {
          setTips('请选择旋转中心')
          return pointAt(layer)
            .then(origin => ({ ...opts, origin }))
            .tap(() => setTips(''))
        } else if (opts.origin === 'center') {
          return { ...opts, origin: getCenterPoint(opts.node) }
        }
        return { ...opts, origin: opts.origin as Vector2d }
      })

      // merge angle
      .then(opts => {
        const { angle } = opts
        if (!angle) {
          const $fromKadInput = fromKadInput(opts)
          const $fromMouse = fromMouse(opts)
          return Bluebird.any([$fromKadInput, $fromMouse]).then(nextOpts => {
            $fromMouse.cancel()
            return { ...opts, angle: nextOpts.angle }
          })
        }
        return { ...opts, angle }
      })
      // data ready
      .then(opts => {
        const { node, copy } = opts
        if (copy) {
          applyRotate(node.clone(), opts)
        } else {
          applyRotate(node, opts)
        }
        return opts
      })
  )
}
