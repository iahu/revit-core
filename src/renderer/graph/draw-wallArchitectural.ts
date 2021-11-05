import { SelectionState, Shape_wallArchitectural } from "../../data/typings";
import { drawLine } from "./draw-line";
import { drawRectangle } from "./draw-rectangle";

export function drawWallArchitectural(context: CanvasRenderingContext2D, wallArchitectural: Shape_wallArchitectural) {

}


drawWallArchitectural.shape = (context: CanvasRenderingContext2D, wallArchitectural: Shape_wallArchitectural) => {

    drawRectangle.shape(context, {
        type: 'rectangle',
        center: { x: wallArchitectural.Point.x + wallArchitectural.Property.width / 2, y: wallArchitectural.Point.y },
        property: { strokeStyle: 'black', width: wallArchitectural.Property.width, height: wallArchitectural.Property.height, rotation: wallArchitectural.Property.rotation }
    })

    if (wallArchitectural.wallArchitecturalSelection == SelectionState.selected) {
        context.fillStyle = '#4e72b8';
        context.fill();

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: wallArchitectural.Point.x - 50, y: wallArchitectural.Point.y },
            end: { x: wallArchitectural.Point.x - 50, y: wallArchitectural.Point.y - 60 }
        })
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: wallArchitectural.Point.x, y: wallArchitectural.Point.y - 45 },
            end: { x: wallArchitectural.Point.x + wallArchitectural.Property.width, y: wallArchitectural.Point.y - 45 }
        })
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: wallArchitectural.Point.x + wallArchitectural.Property.width, y: wallArchitectural.Point.y + 40 },
            end: { x: wallArchitectural.Point.x + wallArchitectural.Property.width + 120, y: wallArchitectural.Point.y + 40 }
        })
    }
}