import { HoverState, SelectionState, Shape_BasePoint } from "../../data/typings";
import { drawLine } from "./draw-line";
import { drawTriangle } from "./draw-triangle";

export function drawBasePoint(context: CanvasRenderingContext2D, basePoint: Shape_BasePoint) {

}


drawBasePoint.shape = (context: CanvasRenderingContext2D, basePoint: Shape_BasePoint) => {

    const radius = 5;
    const edge = radius / Math.SQRT2;

    context.lineWidth = 1;

    //鼠标悬停
    if (basePoint.hoverState == HoverState.unhovered) {
        context.strokeStyle = 'blue';
    } else if (basePoint.hoverState == HoverState.hovered) {
        context.strokeStyle = 'purple';
    }

    //圆
    {
        context.beginPath();
        context.arc(basePoint.position.x, basePoint.position.y, radius, 0, 360);
        context.stroke();
        context.closePath();
    }

    //十字线
    {
        context.beginPath();
        context.moveTo(basePoint.position.x - edge, basePoint.position.y - edge);
        context.lineTo(basePoint.position.x + edge, basePoint.position.y + edge);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(basePoint.position.x + edge, basePoint.position.y - edge);
        context.lineTo(basePoint.position.x - edge, basePoint.position.y + edge);
        context.stroke();
        context.closePath();
    }

    //鼠标点击
    if (basePoint.selectionState == SelectionState.selected) {

        //连接线
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'green',
            start: { x: basePoint.position.x, y: basePoint.position.y - radius },
            end: { x: basePoint.position.x, y: basePoint.position.y - radius * 8 }
        })

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: basePoint.position.x, y: basePoint.position.y - radius * 8 },
            end: { x: basePoint.position.x, y: basePoint.position.y - radius * 9 }
        })

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'red',
            start: { x: basePoint.position.x + radius, y: basePoint.position.y },
            end: { x: basePoint.position.x + radius * 8, y: basePoint.position.y }
        })

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: basePoint.position.x + + radius * 8, y: basePoint.position.y },
            end: { x: basePoint.position.x + radius * 9, y: basePoint.position.y }
        })

        //箭头
        context.strokeStyle = 'blue';
        drawTriangle.shape(context, {
            type: 'triangle',
            start: { x: basePoint.position.x - radius / 2, y: basePoint.position.y - radius * 9 },
            halfway: { x: basePoint.position.x, y: basePoint.position.y - radius * 12 },
            end: { x: basePoint.position.x + radius / 2, y: basePoint.position.y - radius * 9 }
        })
        context.stroke();

        drawTriangle.shape(context, {
            type: 'triangle',
            start: { x: basePoint.position.x + radius * 9, y: basePoint.position.y - radius / 2 },
            halfway: { x: basePoint.position.x + radius * 12, y: basePoint.position.y },
            end: { x: basePoint.position.x + radius * 9, y: basePoint.position.y + radius / 2 }
        })
        context.stroke();

    }
}