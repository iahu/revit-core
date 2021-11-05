import { Shape_Grid } from "../../data/typings";
import { drawCircle } from "../graph/draw-circle";
import { drawText } from "../graph/draw-text";

export function drawNumberCircle(context: CanvasRenderingContext2D, grid: Shape_Grid, centerX: number, centerY: number) {


}


drawNumberCircle.shape = (context: CanvasRenderingContext2D, grid: Shape_Grid, centerX: number, centerY: number) => {

    drawCircle.shape(context, {
        type: 'circle',
        center: { x: centerX, y: centerY },
        property: { strokeStyle: 'black', radius: 20, sAngle: 0, eAngle: 360 }
    })

    //数字角标
    drawText.shape(context, {
        type: 'text',
        textStyle: '20px Arial_black_center_middle',
        content: grid.ID,
        position: { x: centerX, y: centerY },
    });
}