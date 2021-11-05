import { Text } from "../../data/typings";

export function drawText(context: CanvasRenderingContext2D, text: Text) {


}


drawText.shape = (context: CanvasRenderingContext2D, text: Text) => {

    if (text.textStyle === '16px Arial_black_left_middle') {
        context.font = '16px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
    }

    if (text.textStyle === '16px Arial_blue_center_middle') {
        context.font = '16px Arial';
        context.fillStyle = 'blue';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    }

    if (text.textStyle === '14px Arial_blue_center_middle') {
        context.font = '14px Arial';
        context.fillStyle = 'blue';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    }

    if (text.textStyle === '20px Arial_black_center_middle') {
        context.font = '20px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    }

    if (text.textStyle === '24px Arial_black_center_middle') {
        context.font = '24px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    }

    context.fillText(text.content, text.position.x, text.position.y);
}