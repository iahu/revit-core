import { SelectionState, Shape_window } from "../../data/typings";
import { drawLine } from "./draw-line";
import { drawRectangle } from "./draw-rectangle";
import { drawText } from "./draw-text";

export function drawWindow(context: CanvasRenderingContext2D, window: Shape_window) {


}


drawWindow.shape = (context: CanvasRenderingContext2D, window: Shape_window) => {

    drawRectangle.shape(context, {
        type: 'rectangle',
        center: { x: window.Point.x, y: window.Point.y },
        property: { strokeStyle: 'black', width: window.Property.width, height: window.Property.height, rotation: window.Property.rotation }
    })

    if (window.windowSelection == SelectionState.selected) {
        context.fillStyle = '#4e72b8';
        context.fill();
    } else {
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'black',
            start: { x: window.Point.x - window.Property.width / 2, y: window.Point.y },
            end: { x: window.Point.x + window.Property.width / 2, y: window.Point.y }
        })
    }

    drawText.shape(context, {
        type: 'text',
        textStyle: '24px Arial_black_center_middle',
        content: window.textcontent,
        position: { x: window.textPoint.x, y: window.textPoint.y },
    })
}