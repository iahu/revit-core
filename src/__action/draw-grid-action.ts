import { combineLatest, map, Observable, pairwise } from 'rxjs';
import Store from '../data/store';
import { gridClickLocation, gridHoverLocation, Point, SelectionState, Shape_Grid } from '../data/typings';
import { Input } from '../input';

export const drawGridAction = (input: Input, data: Store) =>
  new Observable(c => {
    console.log('准备绘制');
    const drawLine = input.mouseDown$.pipe(pairwise(), map(drawDraftLine)).subscribe(shape => {
      console.log(shape);
      // data.graph.push(shape);
      c.complete();
    });
    c.add(drawLine);
    const drawDraw$ = combineLatest([input.mouseDown$, input.mouseMove$])
      .pipe(map(drawDraftLine))
      .subscribe(draft => {
        // data.draft = draft;
      });
    c.add(drawDraw$);
    return () => {
      // data.draft = null;
      console.log('结束绘制');
    };
  });

function drawDraftLine([startPoint, endPoint]: [Point, Point]): Shape_Grid {
  return {
    type: 'grid',
    start: startPoint,
    end: endPoint,
    mouseHoverLocation: gridHoverLocation.undefinedside,
    globalSelection: SelectionState.unselected,
    click: gridClickLocation.undefinedside,
    startTickSelection: SelectionState.unselected,
    ID: 'uid',
  };
}
