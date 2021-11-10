import Konva from 'konva'
import { Observed } from './observer'

/**
 * Konva.Group 的封装，生命周期 render -> propWillUpdate ->
 * 如果有响应式参数请用 @observer() 装饰器添加
 */
export default class Kroup extends Konva.Group implements Observed {
  constructor(config: Konva.ContainerConfig) {
    super(config)

    this.__render()
  }

  /**
   * 工具方法：批量复制 config 到当前对象
   */
  assignArgs<T, K extends keyof T>(config: T, keys: K[]) {
    keys.forEach(key => {
      const value = config[key]
      if (value !== undefined) {
        Reflect.set(this, key, value)
      }
    })
  }

  /**
   * 更新后的 Promise 回调
   */
  updated = Promise.resolve(false)

  __didUpdate() {
    try {
      this.update?.()
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
  update() {
    // update if need.
  }

  /**
   * 依次执行 removeAll -> render -> update
   */
  forceUpdate() {
    this.__firstRendered = false
    this.removeAll()
    this.remove()
    this.render()
    this.update()
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

  private __firstRendered = false
  firstRender() {
    // first render callback
  }

  private __render() {
    if (this.__firstRendered || this.children?.length) {
      return
    }

    const result = this.render()
    if (result?.length) {
      this.add(...result)
    }
    this.__firstRendered = true
    this.firstRender()
  }
}
