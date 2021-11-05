import { Line } from "../../data/typings";

export function drawLine(context: CanvasRenderingContext2D, line: Line) {

}


drawLine.shape = (context: CanvasRenderingContext2D, line: Line) => {

    context.strokeStyle = line.strokeStyle;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(line.start.x, line.start.y);
    context.lineTo(line.end.x, line.end.y);
    context.stroke();
    context.closePath();

}