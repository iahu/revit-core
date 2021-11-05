import { Direction } from "../../data/typings";
import { drawText } from "../graph/draw-text";
import { Matrix } from "../math";

export function drawRotateAngle(context: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, angle: number, direction: Direction) {


}


drawRotateAngle.shape = (context: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, angle: number, direction: Direction) => {

    const localMatrix = new Matrix();
    let rotationAngle = 0;

    if (direction === Direction.RIGHT) {
        localMatrix.updateFromTransform(centerX + radius * Math.cos(angle / 2), centerY + radius * Math.sin(angle / 2), 1, 1, 90 + angle / 2 / Math.PI * 180);
        context.setTransform(localMatrix.a, localMatrix.b, localMatrix.c, localMatrix.d, localMatrix.tx, localMatrix.ty);
        rotationAngle = Math.round(Math.abs(angle / Math.PI * 180));

    } else if (direction === Direction.LEFT) {
        localMatrix.updateFromTransform(centerX + radius * Math.cos(angle / 2 - Math.PI / 2), centerY + radius * Math.sin(angle / 2 - Math.PI / 2), 1, 1, angle / 2 / Math.PI * 180);
        context.setTransform(localMatrix.a, localMatrix.b, localMatrix.c, localMatrix.d, localMatrix.tx, localMatrix.ty);
        rotationAngle = Math.round(Math.abs(angle / Math.PI * 180 + 180));

    }

    drawText.shape(context, {
        type: 'text',
        textStyle: '16px Arial_blue_center_middle',
        content: rotationAngle.toString() + "°",
        position: { x: 0, y: 0 },
    })

    context.setTransform(1, 0, 0, 1, 0, 0);

}