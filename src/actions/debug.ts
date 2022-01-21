import { Layer } from 'konva/lib/Layer'
import { Node } from 'konva/lib/Node'
import { Stage } from 'konva/lib/Stage'
import { closestSelectable, listenOn, Maybe } from './helper'

let paths: Node[]
const $attrs = document.createElement('pre')
const $paths = document.createElement('div')
export const DEBUG = process.env.NODE_ENV === 'development' && !!localStorage.getItem('KAD_DEBUG')

const renderAttrs = (node: Node) => {
  $attrs.innerText = [[node.constructor.name, node._id].join('#'), JSON.stringify(node.getAttrs(), null, 2)].join('\n')
}

const renderPaths = (paths: Node[]) => {
  $paths.innerHTML = [
    '<span>Paths: </span>',
    paths
      .map((path, idx) => {
        const shapeName = path.constructor.name
        const classNames = path
          .name()
          .split(' ')
          .filter(name => name.trim())
          .map(name => `.${name}`)
          .join('')
        return `<button class="path-item" data-i="${idx}">${`${shapeName}${classNames}`}</button>`
      })
      .reverse()
      .join(' > '),
  ].join('')
}

if (DEBUG) {
  $attrs.className = 'kad-debug attrs'
  $paths.className = 'kad-debug paths'
  const $style = document.createElement('style')
  $style.innerText = `
  .kad-debug.attrs {
    position:fixed;z-index: 9998;max-width:240px;height:100vh;box-sizing:border-box;
    overflow:auto;left:0;top:0;background: #fff;color: #333;font-size: 12px;
    padding: 6px 12px; box-shadow:0 0 3px rgba(0,0,0,0.3); margin: 0;
  }

  .kad-debug.paths {
    position:fixed; z-index:9999; display: flex; align-items: center; white-space: pre;
    width:100%; bottom: 0; left: 0; padding: 0 12px;
    background: #f2f2f2; font-size: 12px; color: #333;
  }

  .kad-debug.paths .path-item {
    padding: 2px 4px; margin: 0; cursor: pointer;
    border: none; background: none; font: inherit;
  }
  .kad-debug.paths :is(.path-item[data-i="0"], .path-item:hover) {
    background: #e3e3e3;
  }
  `
  document.body.appendChild($attrs)
  document.body.appendChild($paths)
  document.body.appendChild($style)

  $paths.addEventListener('click', function (e) {
    const target = e.target
    if (target instanceof HTMLElement && target.matches('.path-item')) {
      const idx = target.dataset.i as Maybe<number>
      if (idx) {
        const target = paths[idx]
        if (target) {
          renderAttrs(target)
          paths = paths.slice(idx)
          renderPaths(paths)
        }
      }
    }
  })
}

export const debug = (layer: Layer | Stage) => {
  const stage = layer.getStage()
  if (stage) {
    const stopListen = listenOn(stage, 'mouseup', e => {
      const { target } = e
      const selectableNode = e.evt.altKey ? target : closestSelectable(target)
      if (DEBUG && selectableNode) {
        renderAttrs(selectableNode)

        let parent = selectableNode as Maybe<Node>
        paths = []
        while (parent) {
          paths.push(parent)
          parent = parent.parent
        }
        renderPaths(paths)
      }
    })

    if (!DEBUG) {
      stopListen()
    }

    return stopListen
  }
  return () => ({})
}
