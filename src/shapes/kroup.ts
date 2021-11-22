import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { ChangedProp, Observed, observer } from './observer'

const normalized = (result: (Konva.Group | Konva.Shape)[] | null) => {
  return result ? result.filter(v => !!v) : []
}

export interface KroupOptions extends ContainerConfig {
  stroke?: string | CanvasGradient
  strokeWidth?: number
  shadowColor?: string | CanvasGradient
  shadowBlur?: number
}

/**
 * Konva.Group 的封装，生命周期 render -> propWillUpdate -> update
 *
 * 如果有响应式参数请用 @observer() 装饰器添加。
 *
 * 如果有精确控制更新的需要可以在 `propWillUpdate(changedProp: ChangedProp)`
 * 回调中通过判断 `changedProp.key` 来实现
 */
export default class Kroup extends Konva.Group implements Observed {
  @observer<Kroup, 'stroke'>() stroke = '#333'
  @observer<Kroup, 'strokeWidth'>() strokeWidth = 1
  @observer<Kroup, 'shadowColor'>() shadowColor = ''
  @observer<Kroup, 'shadowBlur'>() shadowBlur = 0

  constructor(config: Konva.ContainerConfig) {
    super(config)
    // lazy init
    this.updated.then(() => {
      // this.setAttrs(config)
      this.__render()
    })
  }

  /**
   * 工具方法：批量复制 config 到当前对象
   * 通常用 this.setAttrs 方法就可以了
   */
  assignArgs<T, K extends keyof T>(config: T, keys: K[]) {
    keys.forEach(key => {
      const value = config[key]
      if (value !== undefined) {
        Reflect.set(this, key, value)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  propWillChange(prop: ChangedProp) {
    throw new Error('not implemented')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  propDidChange(prop: ChangedProp) {
    throw new Error('not implemented')
  }

  /**
   * 更新后的 Promise 回调
   */
  updated = Promise.resolve(false)

  private __didUpdate() {
    if (!this.__hasRendered) {
      this.updated = Promise.resolve(false)
      return
    }

    if (!this.children?.length) {
      this.forceUpdate(false)
      this.__hasRendered = true
      return
    }

    try {
      const updateCallback = Reflect.get(this, 'update')
      if (typeof updateCallback === 'function') {
        updateCallback.call(this)
      } else {
        console.warn(`force rerender '${this.constructor.name}', because updateCallback is missing`)
        // fore re-render
        this.forceUpdate()
      }
      this.updated = Promise.resolve(true)
    } catch (e) {
      console.error(e)
      this.updated = Promise.resolve(false)
    }
  }

  /**
   * 如果有更新需求，在这里实现
   * 注意更新是属性粒度的，不是批量更新
   */
  // update() {
  //   // update if need.
  // }

  /**
   * 依次执行 removeAll -> render -> update
   */
  forceUpdate(callback = true) {
    this.__hasRendered = false
    this.removeAll()
    this.remove()
    this.__render()
    if (!callback) {
      return
    }
    const updateCallback = Reflect.get(this, 'update')
    if (typeof updateCallback === 'function') {
      updateCallback.call(this)
    }
  }

  /**
   * 销毁所有子元素
   */
  removeAll() {
    this.children?.forEach(node => node.destroy())
  }

  /**
   * 如果返回一个 `(Konva.Group | Konva.Shape)[]`，
   * 数组里的元素将自动添加到当前 Group 里。
   * 注意：render 是一次性的，且数组里后一元素将渲染到前一个的上面
   */
  render(): (Konva.Group | Konva.Shape)[] | null {
    return [] as (Konva.Group | Konva.Shape)[]
  }

  private __hasRendered = false
  firstRender() {
    // first render callback
  }

  private __render() {
    if (this.__hasRendered) {
      return
    }

    const result = normalized(this.render())
    if (result?.length) {
      this.add(...result)
    }
    if (!this.__hasRendered) {
      this.__hasRendered = true
      this.firstRender()
    }
  }
}
