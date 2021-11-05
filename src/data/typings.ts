export type Data = {
  settings: {
    width: number;
    height: number;
  };

  cursor: {
    x: number;
    y: number;
  };

  graph: Graph[];

  draft: Graph | null;
};

export type Point = {
  x: number;
  y: number;
};

export enum SelectionState {
  unselected,
  selected,
}

export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

//鼠标是否悬浮
export enum HoverState {
  unhovered,
  hovered,
}

//鼠标在立面上的位置
export enum elevationLocation {
  elevation,
  upArrow,
  rightArrow,
  downArrow,
  leftArrow,
  upTick,
  rightTick,
  downTick,
  leftTick,
  centerLine,
  dashedLine,
  undefinedside,
}

//鼠标悬浮在网格上的位置
export enum gridHoverLocation {
  grid,
  parameterStart,
  parameterEnd,
  rotation,
  tickStart,
  tickEnd,
  endPointStart,
  endPointEnd,
  undefinedside,
}

//鼠标点击网格的位置
export enum gridClickLocation {
  parameterStart,
  parameterEnd,
  rotation,
  endPointStart,
  endPointEnd,
  undefinedside,
}

export type CircleProperty = {
  strokeStyle: string;
  radius: number;
  sAngle: number;
  eAngle: number;
};

export type RectangleProperty = {
  strokeStyle: string;
  width: number;
  height: number;
  rotation: number;
};

//线
export type Line = {
  type: "line";
  strokeStyle: string;
  start: Point;
  end: Point;
};

//矩形
export type Rectangle = {
  type: "rectangle";
  center: Point;
  property: RectangleProperty;
};

//三角形
export type Triangle = {
  type: "triangle";
  start: Point;
  halfway: Point;
  end: Point;
};

//圆
export type Circle = {
  type: "circle";
  center: Point;
  property: CircleProperty;
};

//文字
export type Text = {
  type: "text";
  textStyle:
    | "16px Arial_black_left_middle"
    | "16px Arial_blue_center_middle"
    | "14px Arial_blue_center_middle"
    | "20px Arial_black_center_middle"
    | "24px Arial_black_center_middle";
  content: string;
  position: Point;
};

//立面
export type Shape_Elevation = {
  type: "elevation";
  position: Point;
  arrowUp: SelectionState;
  arrowRight: SelectionState;
  arrowDown: SelectionState;
  arrowLeft: SelectionState;
  mouseHoverLocation: elevationLocation;
  click: elevationLocation;
  centerLineUpPosition: Point;
  distanceUp: number;
  centerLineRightPosition: Point;
  distanceRight: number;
  centerLineDownPosition: Point;
  distanceDown: number;
  centerLineLeftPosition: Point;
  distanceLeft: number;
};

//基点
export type Shape_BasePoint = {
  type: "basePoint";
  position: Point;
  selectionState: SelectionState;
  hoverState: HoverState;
};

//对勾
export type Shape_Tick = {
  type: "tick";
  strokeStyle: string;
  position: Point;
};

//网格
export type Shape_Grid = {
  type: "grid";
  start: Point;
  end: Point;
  mouseHoverLocation: gridHoverLocation;
  globalSelection: SelectionState;
  click: gridClickLocation;
  startTickSelection: SelectionState;
  ID: string;
};

//结构柱
export type Shape_StructuralColumns = {
  type: "structuralColumns";
  rectanglePoint: Point;
  rectangleProperty: {
    width: number;
    height: number;
    rotation: number;
  };
  structuralColumnsSelection: SelectionState;
  textSelection: SelectionState;
  textPoint: Point;
  textcontent: string;
};

//墙:建筑
export type Shape_wallArchitectural = {
  type: "wallArchitectural";
  Point: Point;
  Property: {
    width: number;
    height: number;
    rotation: number;
  };
  wallArchitecturalSelection: SelectionState;
};

//楼板:建筑
export type Shape_floorArchitectural = {
  type: "floorArchitectural";
  Point: Point;
  Property: {
    width: number;
    height: number;
    rotation: number;
  };
};

//窗
export type Shape_window = {
  type: "window";
  Point: Point;
  Property: {
    width: number;
    height: number;
    rotation: number;
  };
  windowSelection: SelectionState;
  textPoint: Point;
  textcontent: string;
};

export type Graph =
  | Shape_Elevation
  | Line
  | Shape_BasePoint
  | Shape_Grid
  | Shape_Tick
  | Rectangle
  | Circle
  | Text
  | Shape_StructuralColumns
  | Shape_wallArchitectural
  | Shape_floorArchitectural
  | Shape_window
  | Triangle;

export type Camera = {
  center: Point;
  zoom: number;
  width: number;
  height: number;
};
