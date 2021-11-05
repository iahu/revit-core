import { Rectangle } from "../../data/typings";
import { Matrix } from "../math";

export function drawRectangle(context: CanvasRenderingContext2D, rectangle: Rectangle) {


}


drawRectangle.shape = (context: CanvasRenderingContext2D, rectangle: Rectangle) => {

    context.lineWidth = 1;
    context.strokeStyle = rectangle.property.strokeStyle;

    const localMatrix = new Matrix();

    localMatrix.updateFromTransform(rectangle.center.x, rectangle.center.y, 1, 1, rectangle.property.rotation);

    context.setTransform(localMatrix.a, localMatrix.b, localMatrix.c, localMatrix.d, localMatrix.tx, localMatrix.ty);
    context.beginPath();
    context.rect(- rectangle.property.width / 2, - rectangle.property.height / 2, rectangle.property.width, rectangle.property.height);
    context.stroke();
    context.setTransform(1, 0, 0, 1, 0, 0);
}