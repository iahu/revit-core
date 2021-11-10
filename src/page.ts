import Kad from '.'
import { InitStore } from './data/store'
import logo from './assets/logo.png'

const layers: InitStore['layers'] = [
  {
    id: 'background',
    name: 'background',
    entities: [
      {
        id: 'ent-1',
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        type: 'svgPath' as const,
        stroke: '#ff3300',
        data: 'M 0 0 L 200 100 L 170 200 z',
      },
      {
        id: 'ent-2',
        left: 0,
        top: 0,
        type: 'imgUrl' as const,
        imgUrl: logo,
      },
      {
        id: 'ent-3',
        left: 0,
        top: 0,
        type: 'text' as const,
        text: 'revit editor',
      },
    ],
  },
]

const core = new Kad(document.getElementById('app') as HTMLDivElement, layers)

const $move = document.querySelector('.action.move') as HTMLButtonElement
$move.addEventListener('click', () => {
  core.execute('move')
})
