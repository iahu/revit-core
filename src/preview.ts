import Kad, { ActionTypes } from './index'
import logo from './assets/logo.png'
import { InitStore } from './data/store'

const layers: InitStore['layers'] = [
  {
    id: 'background',
    name: 'background',
    entities: [
      // {
      //   id: 'ent-1',
      //   x: 200,
      //   y: 100,
      //   width: 200,
      //   height: 200,
      //   type: 'svgPath' as const,
      //   stroke: '#ff3300',
      //   data: 'M 0 0 L 200 100 L 170 200 z',
      // },
      // {
      //   id: 'ent-2',
      //   x: 100,
      //   y: 100,
      //   type: 'imgUrl' as const,
      //   imgUrl: logo,
      //   visible: false,
      // },
      // {
      //   id: 'ent-3',
      //   x: 500,
      //   y: 100,
      //   type: 'text' as const,
      //   text: 'revit editor',
      // },
      // {
      //   id: 'ent-4',
      //   x: 30,
      //   y: 30,
      //   width: 400,
      //   // dash: [40, 10],
      //   // direction: 'vertical',
      //   type: 'level' as const,
      // },
      // {
      //   id: 'ent-5',
      //   x: 30,
      //   y: 120,
      //   openAngle: 90,
      //   // panelWidth: 100,
      //   openDirection: 'left',
      //   type: 'door' as const,
      //   // rotation: 90,
      // },
      // {
      //   id: 'ent-5',
      //   x: 30,
      //   y: 32,
      //   stroke: 'red',
      //   type: 'flagLabel' as const,
      // },
      // {
      //   id: 'ent-6',
      //   x: 30,
      //   y: 50,
      //   stroke: 'red',
      //   type: 'flag' as const,
      // },
      // {
      //   id: 'elevation',
      //   x: 30,
      //   y: 220,
      //   width: 600,
      //   stroke: 'red',
      //   draggable: false,
      //   type: 'elevation' as const,
      // },
      {
        id: 'floor-levels',
        x: 30,
        y: 400,
        width: 600,
        stroke: 'red',
        floorLevels: [
          { y: 0, width: 600, title: 'F1' },
          { y: 80, width: 600 },
          { y: 120, width: 600 },
          { y: 180, width: 600 },
        ],
        type: 'floorLevels' as const,
      },
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
    options: { type: 'elevation', lockY: true, attributes: { stroke: 'red' } },
  },
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

window.addEventListener('resize', () => kad.layout())

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.kad = kad
