import { Layer } from 'konva/lib/Layer'
import { pick } from './pick'
import { listenOn } from './helper'
import Konva from 'konva'
import { move } from './move'

export const copy = async (layer: Layer, args: any) => {
  console.log('args', args)
  const stage = layer.getStage()
  const pointerX = new Konva.Path({
    id: 'pointerX',
    data: 'M-5 -5 L5 5 M-5 5 L5 -5',
    stroke: 'red'
  })
  const pointerBox = new Konva.Path({
    id: 'pointerBox',
    data: 'M-5 -5 h10 v10 h-10 v-10',
    stroke: 'red'
  })
  layer.add(pointerX)
  layer.add(pointerBox)
  pointerX.visible(false)
  pointerBox.visible(false)

  // const t1 = await pick(layer)
  // t1.opacity(1)
  // t1.name('unselectable')

  await move(layer)
  // console.log('stage', stage)
  const reivtCanvas = document.querySelector('#revit-canvas') as HTMLElement
  const cx = reivtCanvas.getBoundingClientRect().left
  const cy = reivtCanvas.getBoundingClientRect().top
  // const canvas = 
  // const stopSelectPointer = listenOn(stage, 'mousemove', e => {
  //   pointerBox.visible(false)
  //   pointerX.visible(false)
  //   if (e.target != t1) {
  //     const tx = e.evt.clientX - cx
  //     const ty = e.evt.clientY - cy
  //     const data = layer.canvas.getContext().getImageData(tx, ty, 1, 1).data

  //     if (data[0] != 255 || data[1] != 255 || data[2] != 255) {//不是白色
  //       console.log('white')
  //       setTimeout(() => {
  //         pointerX.x(tx)
  //         pointerX.y(ty)
  //         pointerX.visible(true)
  //         pointerBox.visible(false)
  //       }, 1)
  //     }
  //   }
  // })

  // console.log('t1', t1)
  return () => {
    // stopSelectPointer()
    // stopMousedown()
    // stopMousemove()
    // stopMouseup()
    // stopClick()
  }
}

