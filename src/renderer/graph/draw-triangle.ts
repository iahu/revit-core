import { Triangle } from "../../data/typings";

export function drawTriangle(context: CanvasRenderingContext2D, triangle: Triangle) {


}


drawTriangle.shape = (context: CanvasRenderingContext2D, triangle: Triangle) => {

    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(triangle.start.x, triangle.start.y);
    context.lineTo(triangle.halfway.x, triangle.halfway.y);
    context.lineTo(triangle.end.x, triangle.end.y);
    context.closePath();
    context.stroke();
}