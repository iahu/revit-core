import { Direction, elevationLocation, SelectionState, Shape_Elevation } from "../../data/typings";
import { drawRotateSymbol } from "../draw-elevation_element/draw-rotateSymbol";
import { renderCircle, renderLine, renderRectangle, renderTick } from "../render";
import { defaultGraph, radius } from "../draw-elevation_element/constants";
import { drawArrow } from "../draw-elevation_element/draw-arrow";
import { drawDrag } from "../draw-elevation_element/draw-drag";
import { drawRectangle } from "./draw-rectangle";


export function drawElevation(context: CanvasRenderingContext2D, elevation: Shape_Elevation) {


}


drawElevation.shape = (context: CanvasRenderingContext2D, elevation: Shape_Elevation) => {

    context.lineWidth = 1;

    const {
        arrowUpLine, arrowUpTick, arrowUpRec1, arrowUpRec2,
        arrowRightLine, arrowRightTick, arrowRightRec1, arrowRightRec2,
        arrowDownLine, arrowDownTick, arrowDownRec1, arrowDownRec2,
        arrowLeftLine, arrowLeftTick, arrowLeftRec1, arrowLeftRec2,
        centerLine, circle
    } = defaultGraph(elevation);

    if (elevation.click == elevationLocation.elevation) {

        centerLine.strokeStyle = 'blue';
        drawRectangle.shape(context, {
            type: 'rectangle',
            center: { x: elevation.position.x, y: elevation.position.y },
            property: { strokeStyle: 'black', width: radius * 2, height: radius * 2, rotation: 45 }
        })
        drawRotateSymbol.shape(context, elevation, 'blue');

        if (elevation.arrowUp == SelectionState.selected) {
            if (elevation.mouseHoverLocation == elevationLocation.upTick) {
                arrowUpTick.strokeStyle = 'purple';
                arrowUpRec1.property.strokeStyle = 'purple';

            } else if (elevation.mouseHoverLocation == elevationLocation.upArrow) {
                renderRectangle(context, arrowUpRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.UP);
            }
            renderLine(context, arrowUpLine);
            renderTick(context, arrowUpTick);

        } else if (elevation.arrowUp == SelectionState.unselected) {
            if (elevation.mouseHoverLocation == elevationLocation.upTick) {
                arrowUpRec1.property.strokeStyle = 'purple';
            }
        }
        renderRectangle(context, arrowUpRec1);


        if (elevation.arrowRight == SelectionState.selected) {
            if (elevation.mouseHoverLocation == elevationLocation.rightTick) {
                arrowRightTick.strokeStyle = 'purple';
                arrowRightRec1.property.strokeStyle = 'purple';

            } else if (elevation.mouseHoverLocation == elevationLocation.rightArrow) {
                renderRectangle(context, arrowRightRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.RIGHT);
            }
            renderLine(context, arrowRightLine);
            renderTick(context, arrowRightTick);

        } else if (elevation.arrowRight == SelectionState.unselected) {
            if (elevation.mouseHoverLocation == elevationLocation.rightTick) {
                arrowRightRec1.property.strokeStyle = 'purple';
            }
        }
        renderRectangle(context, arrowRightRec1);


        if (elevation.arrowDown == SelectionState.selected) {
            if (elevation.mouseHoverLocation == elevationLocation.downTick) {
                arrowDownTick.strokeStyle = 'purple';
                arrowDownRec1.property.strokeStyle = 'purple';

            } else if (elevation.mouseHoverLocation == elevationLocation.downArrow) {
                renderRectangle(context, arrowDownRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.DOWN);
            }
            renderLine(context, arrowDownLine);
            renderTick(context, arrowDownTick);

        } else if (elevation.arrowDown == SelectionState.unselected) {
            if (elevation.mouseHoverLocation == elevationLocation.downTick) {
                arrowDownRec1.property.strokeStyle = 'purple';
            }
        }
        renderRectangle(context, arrowDownRec1);


        if (elevation.arrowLeft == SelectionState.selected) {
            if (elevation.mouseHoverLocation == elevationLocation.leftTick) {
                arrowLeftTick.strokeStyle = 'purple';
                arrowLeftRec1.property.strokeStyle = 'purple';

            } else if (elevation.mouseHoverLocation == elevationLocation.leftArrow) {
                renderRectangle(context, arrowLeftRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.LEFT);
            }
            renderLine(context, arrowLeftLine);
            renderTick(context, arrowLeftTick);

        } else if (elevation.arrowLeft == SelectionState.unselected) {
            if (elevation.mouseHoverLocation == elevationLocation.leftTick) {
                arrowLeftRec1.property.strokeStyle = 'purple';
            }
        }
        renderRectangle(context, arrowLeftRec1);

    }

    else {

        if (elevation.arrowUp == SelectionState.selected) {
            renderLine(context, arrowUpLine);
            drawArrow.shape(context, elevation, 'black', Direction.UP);

            if (elevation.mouseHoverLocation == elevationLocation.upArrow) {
                renderRectangle(context, arrowUpRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.UP);
            }
            if (elevation.click == elevationLocation.upArrow) {
                drawDrag.shape(context, elevation, Direction.UP);
            }
        }


        if (elevation.arrowRight == SelectionState.selected) {
            renderLine(context, arrowRightLine);
            drawArrow.shape(context, elevation, 'black', Direction.RIGHT);

            if (elevation.mouseHoverLocation == elevationLocation.rightArrow) {
                renderRectangle(context, arrowUpRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.RIGHT);
            }
            if (elevation.click == elevationLocation.rightArrow) {
                drawDrag.shape(context, elevation, Direction.RIGHT);
            }
        }


        if (elevation.arrowDown == SelectionState.selected) {
            renderLine(context, arrowDownLine);
            drawArrow.shape(context, elevation, 'black', Direction.DOWN);

            if (elevation.mouseHoverLocation == elevationLocation.downArrow) {
                renderRectangle(context, arrowDownRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.DOWN);
            }
            if (elevation.click == elevationLocation.downArrow) {
                drawDrag.shape(context, elevation, Direction.DOWN);
            }
        }


        if (elevation.arrowLeft == SelectionState.selected) {
            renderLine(context, arrowLeftLine);
            drawArrow.shape(context, elevation, 'black', Direction.LEFT);

            if (elevation.mouseHoverLocation == elevationLocation.leftArrow) {
                renderRectangle(context, arrowLeftRec2);
                drawArrow.shape(context, elevation, 'blue', Direction.LEFT);
            }

            if (elevation.click == elevationLocation.leftArrow) {
                drawDrag.shape(context, elevation, Direction.LEFT);
            }
        }
    }

    if (elevation.mouseHoverLocation == elevationLocation.elevation) {
        circle.property.strokeStyle = 'blue';
        drawRectangle.shape(context, {
            type: 'rectangle',
            center: { x: elevation.position.x, y: elevation.position.y },
            property: { strokeStyle: 'blue', width: radius, height: radius * Math.sqrt(3), rotation: 0 }
        });

        if (elevation.click == elevationLocation.elevation) {
            drawRotateSymbol.shape(context, elevation, 'purple');
        }
    }

    renderLine(context, centerLine);
    renderCircle(context, circle);

}
