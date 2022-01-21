import Kad, { ActionTypes } from './index'
import { InitStore } from './data/store'
import demoImage from './assets/demo-img.png'

const layers: InitStore['layers'] = [
  {
    id: 'background',
    name: 'background',
    entities: [
      {
        id: 'pointer',
        x: 210,
        y: 105,
        radius: 10,
        innerRadius: 6,
        stroke: 'red',
        type: 'pointer' as const,
      },
      {
        type: 'nock',
        stroke: 'red',
        startPoint: [180, 130],
        nockPoint: [230, 120],
        endPoint: [180, 180],
      },
      {
        type: 'angler',
        startPoint: [215, 240],
        centerPoint: [215, 136],
        endPoint: [226.1, 166.13],
        stroke: 'red',
      },
      {
        x: 310,
        y: 100,
        width: 60,
        stroke: 'red',
        draggable: false,
        type: 'flag' as const,
        flipX: true,
        flipY: true,
      },
      {
        type: 'imgUrl',
        x: 255,
        y: 105,
        width: 60,
        height: 60,
        imgUrl: demoImage,
      },
      {
        type: 'basePoint',
        x: 285,
        y: 200,
        radius: 40,
        stroke: 'red',
        draggable: true,
      },

      {
        type: 'segment',
        stroke: 'blue',
        x: 300,
        y: 20,
        startPoint: [0, 0],
        endPoint: [200, 0],
      },

      {
        type: 'snapButton',
        x: 20,
        y: 20,
        width: 10,
        height: 10,
        stroke: '#ff000033',
      },
      {
        type: 'snapButton',
        x: 200,
        y: 20,
        width: 10,
        height: 10,
        stroke: '#ff000033',
      },
      {
        type: 'segment',
        x: 400,
        y: 20,
        startPoint: [0, 0],
        endPoint: [0, 100],
        stroke: 'red',
      },
      {
        type: 'segment',
        x: 400,
        y: 20,
        startPoint: [0, 0],
        endPoint: [100, 0],
        stroke: 'red',
      },
      {
        type: 'axis',
        x: 500,
        y: 100,
        startPoint: [0, 200],
        endPoint: [200, 200],
        stroke: 'red',
      },
      // {
      //   id: 'zhou-1',
      //   type: 'axis',
      //   startPoint: [400, 350 - 240],
      //   endPoint: [400, 350 + 240],
      //   startPointLabel: true,
      //   endPointLabel: 'A',
      // },
    ],
  },
]

const $action = document.querySelector('.action-bar') as HTMLDivElement
$action.className = 'action-bar'
const actions = [
  { action: 'select', options: {} },
  { action: 'move', options: {} },
  { action: 'rotate', options: {} },
  { action: 'copy', options: {} },
  {
    action: 'draw',
    options: {
      type: 'rect',
      // lockY: true,
      // autoStart: true,
      shapeAttrs: { stroke: 'red' },
    },
  },
  { action: 'offset', options: { value: 200 } },
]
actions.forEach(a => {
  const btn = document.createElement('button')
  btn.className = 'action'
  btn.innerText = a.action
  btn.dataset.action = a.action
  $action.appendChild(btn)
})

// creat kad
const kad = new Kad(document.getElementById('stage') as HTMLDivElement, {
  layers,
  // stageConfig: { draggable: true },
})
$action.addEventListener('click', e => {
  const action = (e.target as HTMLElement).dataset.action
  const options = actions.find(a => a.action === action)?.options

  kad.execute(action as ActionTypes, options)
  console.log('execute', action, options)
})

$action.querySelector<HTMLElement>('.action[data-action="select"]')?.click()

window.addEventListener('resize', () => kad.layout())

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.kad = kad
