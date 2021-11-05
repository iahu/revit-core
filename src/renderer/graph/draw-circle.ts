import { Circle } from "../../data/typings";

export function drawCircle(context: CanvasRenderingContext2D, circle: Circle) {



}

drawCircle.shape = (context: CanvasRenderingContext2D, circle: Circle) => {

    const sAngle = circle.property.sAngle / 180 * Math.PI;
    const eAngle = circle.property.eAngle / 180 * Math.PI

    context.strokeStyle = circle.property.strokeStyle;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(circle.center.x, circle.center.y, circle.property.radius, sAngle, eAngle);
    context.stroke();
    context.closePath();
}