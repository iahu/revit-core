import { Data, elevationLocation, gridClickLocation, gridHoverLocation, HoverState, SelectionState } from './typings';

export function getTestData() {
  const data: Data = {
    settings: {
      width: 600,
      height: 600,
    },
    graph: [
      //例题1
      {
        type: 'elevation',
        position: { x: 500, y: 50 },
        arrowUp: SelectionState.unselected,
        arrowRight: SelectionState.unselected,
        arrowDown: SelectionState.selected,
        arrowLeft: SelectionState.unselected,
        mouseHoverLocation: elevationLocation.undefinedside,
        click: elevationLocation.undefinedside,
        centerLineUpPosition: { x: 400, y: 200 },
        distanceUp: 30,
        centerLineRightPosition: { x: 300, y: 100 },
        distanceRight: 600,
        centerLineDownPosition: { x: 300, y: 100 },
        distanceDown: 600,
        centerLineLeftPosition: { x: 300, y: 100 },
        distanceLeft: 600,
      },
      {
        type: 'elevation',
        position: { x: 900, y: 300 },
        arrowUp: SelectionState.unselected,
        arrowRight: SelectionState.unselected,
        arrowDown: SelectionState.unselected,
        arrowLeft: SelectionState.selected,
        mouseHoverLocation: elevationLocation.undefinedside,
        click: elevationLocation.undefinedside,
        centerLineUpPosition: { x: 500, y: 300 },
        distanceUp: 600,
        centerLineRightPosition: { x: 500, y: 300 },
        distanceRight: 600,
        centerLineDownPosition: { x: 500, y: 300 },
        distanceDown: 600,
        centerLineLeftPosition: { x: 500, y: 300 },
        distanceLeft: 600,
      },
      {
        type: 'elevation',
        position: { x: 500, y: 600 },
        arrowUp: SelectionState.selected,
        arrowRight: SelectionState.unselected,
        arrowDown: SelectionState.unselected,
        arrowLeft: SelectionState.unselected,
        mouseHoverLocation: elevationLocation.undefinedside,
        click: elevationLocation.undefinedside,
        centerLineUpPosition: { x: 300, y: 500 },
        distanceUp: 600,
        centerLineRightPosition: { x: 300, y: 500 },
        distanceRight: 600,
        centerLineDownPosition: { x: 300, y: 500 },
        distanceDown: 600,
        centerLineLeftPosition: { x: 300, y: 500 },
        distanceLeft: 600,
      },
      {
        type: 'elevation',
        position: { x: 100, y: 300 },
        arrowUp: SelectionState.unselected,
        arrowRight: SelectionState.selected,
        arrowDown: SelectionState.unselected,
        arrowLeft: SelectionState.unselected,
        mouseHoverLocation: elevationLocation.undefinedside,
        click: elevationLocation.undefinedside,
        centerLineUpPosition: { x: 100, y: 300 },
        distanceUp: 600,
        centerLineRightPosition: { x: 100, y: 300 },
        distanceRight: 600,
        centerLineDownPosition: { x: 100, y: 300 },
        distanceDown: 600,
        centerLineLeftPosition: { x: 100, y: 300 },
        distanceLeft: 600,
      },
      // {
      //     type: 'basePoint',
      //     position: { x: 300, y: 500 },
      //     selectionState: SelectionState.unselected,
      //     hoverState: HoverState.unhovered
      // },
      // {
      //     type: 'grid',
      //     start: { x: 300, y: 600 },
      //     end: { x: 300, y: 280 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "1"
      // },
      // {
      //     type: 'grid',
      //     start: { x: 380, y: 600 },
      //     end: { x: 380, y: 280 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "2"
      // },
      // {
      //     type: 'grid',
      //     start: { x: 460, y: 600 },
      //     end: { x: 460, y: 280 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "3"
      // },
      // {
      //     type: 'grid',
      //     start: { x: 580, y: 600 },
      //     end: { x: 580, y: 280 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "4"
      // },
      // {
      //     type: 'grid',
      //     start: { x: 200, y: 500 },
      //     end: { x: 700, y: 500 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "A"
      // },
      // {
      //     type: 'grid',
      //     start: { x: 200, y: 440 },
      //     end: { x: 700, y: 440 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "B"
      // },
      // {
      //     type: 'grid',
      //     start: { x: 200, y: 400 },
      //     end: { x: 700, y: 400 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "C"
      // },
      // {
      //     type: 'grid',
      //     start: { x: 200, y: 340 },
      //     end: { x: 700, y: 340 },
      //     mouseHoverLocation: gridHoverLocation.undefinedside,
      //     globalSelection: SelectionState.unselected,
      //     click: gridClickLocation.undefinedside,
      //     startTickSelection: SelectionState.selected,
      //     ID: "D"
      // },

      //例题2
      // {
      //     type: 'structuralColumns',
      //     rectanglePoint: { x: 380, y: 440 },
      //     rectangleProperty: { width: 10, height: 20, rotation: 0 },
      //     structuralColumnsSelection: SelectionState.selected,
      //     textSelection: SelectionState.selected,
      //     textPoint: { x: 380, y: 440 },
      //     textcontent: 'KZ1'
      // },

      //例题3
      // {
      //     type: 'wallArchitectural',
      //     Point: { x: 300, y: 500 },
      //     Property: { width: 160, height: 4, rotation: 0 },
      //     wallArchitecturalSelection: SelectionState.selected
      // },

      //例题4
      // {
      //     type: 'floorArchitectural',
      //     Point: { x: 300, y: 440 },
      //     Property: { width: 80, height: 60, rotation: 0 },
      // }

      //例题5（例题3基础上）
      // {
      //     type: 'window',
      //     Point: { x: 325, y: 500 },
      //     Property: { width: 100 / 6, height: 4, rotation: 0 },
      //     windowSelection: SelectionState.unselected,
      //     textPoint: { x: 325, y: 520 },
      //     textcontent: "C1020"
      // }
    ],
    cursor: {
      x: 0,
      y: 0,
    },
    draft: null,
  };
  return data;
}
