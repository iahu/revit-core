import { fromEvent, map, Observable, tap } from 'rxjs';
import Store from '../data/store';
import { Camera, Point } from '../data/typings';

type MouseEventData = {
  type: 'mousedown';
} & Point;

function formatMouseEvent(camera: Camera) {
  return function (event: MouseEvent) {
    const x = event.offsetX; //- camera.width / 2;
    const y = event.offsetY; //- camera.height / 2;

    const data: MouseEventData = {
      x,
      y,
      type: event.type as MouseEventData['type'],
    };
    return data;
  };
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

export type Input = {
  mouseDown$: Observable<MouseEventData>;
  mouseUp$: Observable<MouseEventData>;
  mouseMove$: Observable<MouseEventData>;
};

export function createInput(canvas: HTMLCanvasElement, data: Store, camera: Camera) {
  const input: Input = {
    mouseDown$: fromEvent<MouseEvent>(canvas, 'mousedown').pipe(map(formatMouseEvent(camera))),
    mouseUp$: fromEvent<MouseEvent>(canvas, 'mouseup').pipe(map(formatMouseEvent(camera))),
    mouseMove$: fromEvent<MouseEvent>(canvas, 'mousemove').pipe(
      map(formatMouseEvent(camera)),
      tap(v => (data.cursor = { x: v.x, y: v.y })),
    ),
  };
  return input;
}
