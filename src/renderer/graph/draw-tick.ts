import { Shape_Tick } from "../../data/typings";

export function drawTick(context: CanvasRenderingContext2D, tick: Shape_Tick) {


}


drawTick.shape = (context: CanvasRenderingContext2D, tick: Shape_Tick) => {

    context.beginPath();
    context.moveTo(tick.position.x - 3, tick.position.y - 1);
    context.lineTo(tick.position.x - 3, tick.position.y + 3);
    context.lineTo(tick.position.x + 3, tick.position.y - 3);
    context.strokeStyle = tick.strokeStyle;
    context.lineWidth = 1;
    context.stroke();
    context.closePath();
}