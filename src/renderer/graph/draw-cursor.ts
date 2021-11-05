import { Point } from "../../data/typings";
import { drawCircle } from "./draw-circle";

export function drawCursor(context: CanvasRenderingContext2D, point: Point) {
    context.save();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    const LENGTH = 10;
    context.beginPath();
    context.moveTo(point.x + 2, point.y);
    context.lineTo(point.x + LENGTH, point.y);
    context.moveTo(point.x, point.y + 2);
    context.lineTo(point.x, point.y + LENGTH);
    context.moveTo(point.x - 2, point.y);
    context.lineTo(point.x - LENGTH, point.y);
    context.moveTo(point.x, point.y - 2);
    context.lineTo(point.x, point.y - LENGTH);
    context.stroke();

    drawCircle.shape(context, {
        type: 'circle',
        center: { x: point.x, y: point.y },
        property: { strokeStyle: 'black', radius: 0.5, sAngle: 0, eAngle: 360 }
    })

    context.restore();


}