import { Direction, elevationLocation, Shape_Elevation } from "../../data/typings";
import { renderGraph, renderLine, renderTriangle } from "../render";
import { defaultGraph, radius } from "./constants";
import { drawArrow } from "./draw-arrow";

export function drawDrag(context: CanvasRenderingContext2D, elevation: Shape_Elevation, direction: number) {


}


drawDrag.shape = (context: CanvasRenderingContext2D, elevation: Shape_Elevation, direction: number) => {

    const { solidLine, dashedLine } = defaultGraph(elevation);

    switch (direction) {
        case Direction.UP:
            drawArrow.shape(context, elevation, 'blue', Direction.UP);

            context.setLineDash([5, 5]);
            renderLine(context, dashedLine);
            context.setLineDash([0]);

            context.strokeStyle = 'black';
            if (elevation.mouseHoverLocation == elevationLocation.dashedLine) {
                drawDragPoint(context, elevation, 'blue', Direction.UP);

            } else if (elevation.mouseHoverLocation == elevationLocation.centerLine) {
                drawDragPoint(context, elevation, '#4e72b8', Direction.UP);

                context.lineWidth = 4;
                context.strokeStyle = 'blue';
                context.beginPath();
                context.moveTo(elevation.centerLineUpPosition.x - radius * 3, elevation.centerLineUpPosition.y);
                context.lineTo(elevation.centerLineUpPosition.x + radius * 3, elevation.centerLineUpPosition.y);
                context.closePath();
                context.stroke();

            } else {
                drawDragPoint(context, elevation, '#4e72b8', Direction.UP);

            }
            break;

        case Direction.DOWN:
            solidLine.start.y = elevation.position.y + radius * 2.2;
            solidLine.end.y = elevation.position.y + radius * 2.2;
            drawArrow.shape(context, elevation, 'blue', Direction.DOWN);

            context.setLineDash([5, 5]);
            elevation.centerLineUpPosition.x = elevation.centerLineDownPosition.x;
            dashedLine.start.y = elevation.centerLineDownPosition.y + elevation.distanceDown;
            dashedLine.end.y = elevation.centerLineDownPosition.y + elevation.distanceDown;
            renderLine(context, dashedLine);
            context.setLineDash([]);

            context.strokeStyle = 'black';
            if (elevation.mouseHoverLocation == elevationLocation.dashedLine) {
                drawDragPoint(context, elevation, 'blue', Direction.DOWN);

            } else if (elevation.mouseHoverLocation == elevationLocation.centerLine) {
                drawDragPoint(context, elevation, '#4e72b8', Direction.DOWN);

                context.lineWidth = 4;
                context.strokeStyle = 'blue';
                context.beginPath();
                context.moveTo(elevation.centerLineDownPosition.x - radius * 3, elevation.centerLineDownPosition.y);
                context.lineTo(elevation.centerLineDownPosition.x + radius * 3, elevation.centerLineDownPosition.y);
                context.closePath();
                context.stroke();

            } else {
                drawDragPoint(context, elevation, '#4e72b8', Direction.DOWN);

            }
            break;

        case Direction.RIGHT:
            solidLine.start.x = elevation.position.x - radius / 10 + radius * 2.2;
            solidLine.start.y = elevation.position.y;
            solidLine.end.x = elevation.position.x + radius / 10 + radius * 2.2;
            solidLine.end.y = elevation.position.y;
            drawArrow.shape(context, elevation, 'blue', Direction.RIGHT);

            context.setLineDash([5, 5]);
            dashedLine.start.x = elevation.centerLineRightPosition.x + elevation.distanceRight;
            dashedLine.start.x = elevation.centerLineRightPosition.y - radius * 3;
            dashedLine.end.x = elevation.centerLineRightPosition.x + elevation.distanceRight;
            dashedLine.end.y = elevation.centerLineRightPosition.y + radius * 3;
            renderLine(context, dashedLine);
            context.setLineDash([0]);

            context.strokeStyle = 'black';
            if (elevation.mouseHoverLocation == elevationLocation.dashedLine) {
                drawDragPoint(context, elevation, 'blue', Direction.RIGHT);

            } else if (elevation.mouseHoverLocation == elevationLocation.centerLine) {
                drawDragPoint(context, elevation, '#4e72b8', Direction.RIGHT);

                context.lineWidth = 4;
                context.strokeStyle = 'blue';
                context.beginPath();
                context.moveTo(elevation.centerLineRightPosition.x, elevation.centerLineRightPosition.y - radius * 3);
                context.lineTo(elevation.centerLineRightPosition.x, elevation.centerLineRightPosition.y + radius * 3);
                context.closePath();
                context.stroke();

            } else {
                drawDragPoint(context, elevation, '#4e72b8', Direction.RIGHT);

            }
            break;

        case Direction.LEFT:
            solidLine.start.x = elevation.position.x - radius / 10 - radius * 2.2;
            solidLine.start.y = elevation.position.y;
            solidLine.end.x = elevation.position.x + radius / 10 - radius * 2.2;
            solidLine.end.y = elevation.position.y;
            drawArrow.shape(context, elevation, 'blue', Direction.LEFT);

            context.setLineDash([5, 5]);
            dashedLine.start.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft;
            dashedLine.start.y = elevation.centerLineLeftPosition.y - radius * 3;
            dashedLine.end.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft;
            dashedLine.end.y = elevation.centerLineLeftPosition.y + radius * 3;
            renderLine(context, dashedLine);
            context.setLineDash([0]);

            context.strokeStyle = 'black';
            if (elevation.mouseHoverLocation == elevationLocation.dashedLine) {
                drawDragPoint(context, elevation, 'blue', Direction.LEFT);

            } else if (elevation.mouseHoverLocation == elevationLocation.centerLine) {
                drawDragPoint(context, elevation, '#4e72b8', Direction.LEFT);

                context.lineWidth = 4;
                context.strokeStyle = 'blue';
                context.beginPath();
                context.moveTo(elevation.centerLineLeftPosition.x, elevation.centerLineLeftPosition.y - radius * 3);
                context.lineTo(elevation.centerLineLeftPosition.x, elevation.centerLineLeftPosition.y + radius * 3);
                context.closePath();
                context.stroke();

            } else {
                drawDragPoint(context, elevation, '#4e72b8', Direction.LEFT);

            }
            break;
    }

    renderLine(context, solidLine);

}


function drawDragPoint(context: CanvasRenderingContext2D, elevation: Shape_Elevation, fillColor: string, direction: number) {

    const { lineGroup, triangle1, triangle2, triangle3, triangle4 } = defaultGraph(elevation);

    switch (direction) {
        case Direction.UP:
            lineGroup.pop();
            context.fillStyle = fillColor;
            renderTriangle(context, triangle1);
            context.fill();
            renderTriangle(context, triangle2);
            context.fill();
            break;

        case Direction.DOWN:
            lineGroup.pop();
            elevation.centerLineUpPosition = elevation.centerLineDownPosition;

            context.fillStyle = fillColor;
            triangle1.start.y = elevation.centerLineDownPosition.y + elevation.distanceDown - 2;
            triangle1.halfway.y = elevation.centerLineDownPosition.y + elevation.distanceDown - 6 * Math.sqrt(3) - 2;
            triangle1.end.y = elevation.centerLineDownPosition.y + elevation.distanceDown - 2;
            renderTriangle(context, triangle1);
            context.fill();
            triangle2.start.y = elevation.centerLineDownPosition.y + elevation.distanceDown + 2;
            triangle2.halfway.y = elevation.centerLineDownPosition.y + elevation.distanceDown + 6 * Math.sqrt(3) + 2;
            triangle2.end.y = elevation.centerLineDownPosition.y + elevation.distanceDown + 2;
            renderTriangle(context, triangle2);
            context.fill();
            break;

        case Direction.RIGHT:
            lineGroup.shift();
            context.fillStyle = fillColor;
            renderTriangle(context, triangle3);
            context.fill();
            renderTriangle(context, triangle4);
            context.fill();
            break;

        case Direction.LEFT:
            lineGroup.shift();
            elevation.centerLineRightPosition = elevation.centerLineLeftPosition;

            context.fillStyle = fillColor;
            triangle3.start.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft - 2;
            triangle3.halfway.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft - 6 * Math.sqrt(3) - 2;
            triangle3.end.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft - 2;
            renderTriangle(context, triangle3);
            context.fill();
            triangle4.start.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft + 2;
            triangle4.halfway.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft + 6 * Math.sqrt(3) + 2;
            triangle4.end.x = elevation.centerLineLeftPosition.x - elevation.distanceLeft + 2;
            renderTriangle(context, triangle4);
            context.fill();
            break;
    }

    renderGraph(context, lineGroup);

}
