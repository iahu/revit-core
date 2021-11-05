import { Circle, Graph, Line, Rectangle, Shape_Tick, Triangle, Text } from "../data/typings";
import { drawBasePoint } from "./graph/draw-basePoint";
import { drawCircle } from "./graph/draw-circle";
import { drawElevation } from "./graph/draw-elevation";
import { drawFloorArchitectural } from "./graph/draw-floorArchitectural";
import { drawGrid } from "./graph/draw-grid";
import { drawLine } from "./graph/draw-line";
import { drawRectangle } from "./graph/draw-rectangle";
import { drawStructuralColumns } from "./graph/draw-structuralColumns";
import { drawText } from "./graph/draw-text";
import { drawTick } from "./graph/draw-tick";
import { drawTriangle } from "./graph/draw-triangle";
import { drawWallArchitectural } from "./graph/draw-wallArchitectural";
import { drawWindow } from "./graph/draw-window";

const renderMethods = {
    line: drawLine,
    elevation: drawElevation,
    basePoint: drawBasePoint,
    rectangle: drawRectangle,
    circle: drawCircle,
    text: drawText,
    structuralColumns: drawStructuralColumns,
    wallArchitectural: drawWallArchitectural,
    floorArchitectural: drawFloorArchitectural,
    window: drawWindow,
    tick: drawTick,
    grid: drawGrid,
    triangle: drawTriangle
}

export function renderGraph(context: CanvasRenderingContext2D, graph: Graph[]) {
    for (const shape of graph) {
        renderMethods[shape.type].shape(context, shape as any);

    }
}

export function renderLine(context: CanvasRenderingContext2D, line: Line) {
    drawLine.shape(context, line);

}

export function renderTriangle(context: CanvasRenderingContext2D, triangle: Triangle) {
    drawTriangle.shape(context, triangle);

}

export function renderRectangle(context: CanvasRenderingContext2D, rectangle: Rectangle) {
    drawRectangle.shape(context, rectangle);

}

export function renderCircle(context: CanvasRenderingContext2D, circle: Circle) {
    drawCircle.shape(context, circle);

}

export function renderTick(context: CanvasRenderingContext2D, tick: Shape_Tick) {
    drawTick.shape(context, tick);

}

export function renderText(context: CanvasRenderingContext2D, text: Text) {
    drawText.shape(context, text);

}