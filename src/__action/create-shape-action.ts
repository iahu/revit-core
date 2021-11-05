import { Observable } from 'rxjs';
import Store from '../data/store';
import { HoverState, SelectionState } from '../data/typings';
import { Input } from '../input';

export const createShapeAction = (input: Input, data: Store) =>
  new Observable(subscriber => {
    // data.graph.push({
    //   type: 'basePoint',
    //   position: { x: 450, y: 300 },
    //   selectionState: SelectionState.unselected,
    //   hoverState: HoverState.unhovered,
    // });
    subscriber.complete();
    return () => {
      console.log('结束绘制');
    };
  });
