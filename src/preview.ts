import Kad, { Actions } from '.'
import { InitStore } from './data/store'
import logo from './assets/logo.png'

const layers: InitStore['layers'] = [
  {
    id: 'background',
    name: 'background',
    entities: [
      {
        id: 'ent-1',
        x: 200,
        y: 100,
        width: 200,
        height: 200,
        type: 'svgPath' as const,
        stroke: '#ff3300',
        data: 'M 0 0 L 200 100 L 170 200 z',
      },
      {
        id: 'ent-2',
        x: 100,
        y: 100,
        type: 'imgUrl' as const,
        imgUrl: logo,
        visible: false,
      },
      {
        id: 'ent-3',
        x: 100,
        y: 100,
        type: 'text' as const,
        text: 'revit editor',
      },
      {
        id: 'ent-4',
        x: 50,
        y: 50,
        type: 'door' as const,
      },
      // {
      //   id: 'ent-5',
      //   x: 30,
      //   y: 30,
      //   width: 100,
      //   height: 20,
      //   fill: 'red',
      //   type: 'rect' as const,
      // },
    ],
  },
]

const core = new Kad(document.getElementById('app') as HTMLDivElement, { layers })

const $action = document.querySelector('.action-bar') as HTMLButtonElement

$action.addEventListener('click', e => {
  const action = (e.target as HTMLElement).dataset.action
  core.execute(action as Actions)
})
