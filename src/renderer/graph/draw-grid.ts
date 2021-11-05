import { Direction, gridClickLocation, gridHoverLocation, SelectionState, Shape_Grid } from "../../data/typings";
import { basicType } from "../draw-grid_element/constants";
import { drawNumberCircle } from "../draw-grid_element/draw-numberCircle";
import { drawRotateAngle } from "../draw-grid_element/draw-rotateAngle";
import { renderGraph, renderLine, renderRectangle, renderText, renderTick } from "../render";
import { drawLine } from "./draw-line";

export function drawGrid(context: CanvasRenderingContext2D, grid: Shape_Grid) {


}


drawGrid.shape = (context: CanvasRenderingContext2D, grid: Shape_Grid) => {

    const { angle, radius, centerX, centerY } = basicType(grid);
    const { group1, rec1, rec2, rec3, rec4, text, line1, group2, rec5, tick1, rec6, tick2, circleGroup } = basicType(grid);

    //终点数字圆
    drawNumberCircle.shape(context, grid, grid.end.x + 20 * Math.cos(angle), grid.end.y + 20 * Math.sin(angle));

    //判断是否勾选起点
    if (grid.startTickSelection == SelectionState.selected) {
        drawNumberCircle.shape(context, grid, grid.start.x - 20 * Math.cos(angle), grid.start.y - 20 * Math.sin(angle));
    }

    if (grid.globalSelection == SelectionState.selected) {

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'black',
            start: { x: centerX - radius - 100, y: centerY },
            end: { x: centerX + radius + 100, y: centerY }
        })

        if (grid.end.y - grid.start.y > 0) {
            drawRotateAngle.shape(context, centerX, centerY, radius + 105, angle, Direction.RIGHT);

        } else {
            group1[0].start.x = centerX + (radius + 100) * Math.cos(-178 / 180 * Math.PI);
            group1[0].start.y = centerY + (radius + 100) * Math.sin(-178 / 180 * Math.PI);
            group1[0].end.x = centerX + (radius + 90) * Math.cos(178 / 180 * Math.PI);
            group1[0].end.y = centerY + (radius + 90) * Math.sin(178 / 180 * Math.PI);
            group1[1].property.sAngle = 180;

            drawRotateAngle.shape(context, centerX, centerY, radius + 105, angle, Direction.LEFT);
        }
        renderGraph(context, group1);

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: centerX + (radius + 90) * Math.cos(-2 / 180 * Math.PI + angle), y: centerY + (radius + 90) * Math.sin(-2 / 180 * Math.PI + angle) },
            end: { x: centerX + (radius + 100) * Math.cos(2 / 180 * Math.PI + angle), y: centerY + (radius + 100) * Math.sin(2 / 180 * Math.PI + angle) }
        })
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) },
            end: { x: centerX + (radius + 100) * Math.cos(angle), y: centerY + (radius + 100) * Math.sin(angle) }
        })

        if (grid.mouseHoverLocation == gridHoverLocation.tickEnd) {
            rec5.property.strokeStyle = 'purple';
            tick1.strokeStyle = 'purple';

        }
        renderRectangle(context, rec5);
        renderTick(context, tick1);

        if (grid.mouseHoverLocation == gridHoverLocation.tickStart) {
            rec6.property.strokeStyle = 'purple';

            if (grid.startTickSelection == SelectionState.selected) {
                tick2.strokeStyle = 'purple';
                renderTick(context, tick2);
            }

        } else {
            if (grid.startTickSelection == SelectionState.selected) {
                renderTick(context, tick2);

            }
        }
        renderRectangle(context, rec6);

        //鼠标悬浮位置
        switch (grid.mouseHoverLocation) {
            case gridHoverLocation.grid:
                circleGroup[0].property.strokeStyle = 'purple';
                circleGroup[1].property.strokeStyle = 'purple';
                break;

            case gridHoverLocation.endPointStart:
                circleGroup[1].property.strokeStyle = 'purple';
                break;

            case gridHoverLocation.endPointEnd:
                circleGroup[0].property.strokeStyle = 'purple';
                break;

            case gridHoverLocation.parameterStart:
                if (grid.startTickSelection == SelectionState.selected) {
                    renderRectangle(context, rec1);
                }
                break;

            case gridHoverLocation.parameterEnd:
                rec1.center.x = centerX + (radius + 20) * Math.cos(angle);
                rec1.center.y = centerY + (radius + 20) * Math.sin(angle);
                renderRectangle(context, rec1);
                break;

            case gridHoverLocation.rotation:
                if (grid.end.y - grid.start.y < 0) {
                    rec2.center.x = centerX + (radius + 105) * Math.cos(angle / 2 - Math.PI / 2);
                    rec2.center.y = centerY + (radius + 105) * Math.sin(angle / 2 - Math.PI / 2);
                    rec2.property.rotation = angle / 2 / Math.PI * 180;
                }
                renderRectangle(context, rec2);
                break;

            default:
                break;

        }
        renderGraph(context, circleGroup);

        //鼠标点击位置
        switch (grid.click) {
            case gridClickLocation.endPointStart:
                renderRectangle(context, rec3);
                break;

            case gridClickLocation.endPointEnd:
                rec3.center.x = centerX + radius * Math.cos(angle);
                rec3.center.y = centerY + radius * Math.sin(angle);
                renderRectangle(context, rec3);
                break;

            case gridClickLocation.parameterStart:
                if (grid.startTickSelection == SelectionState.selected) {
                    renderRectangle(context, rec4);
                    context.fillStyle = 'white';
                    context.fill();
                    renderText(context, text);

                }
                break;

            case gridClickLocation.parameterEnd:
                rec4.center.x = centerX + (radius + 20) * Math.cos(angle);
                rec4.center.y = centerY + (radius + 20) * Math.sin(angle);
                renderRectangle(context, rec4);
                context.fillStyle = 'white';
                context.fill();

                text.position.x = centerX + (radius + 20) * Math.cos(angle) - 30;
                text.position.y = centerY + (radius + 20) * Math.sin(angle) + 2;
                renderText(context, text);

                break;

            case gridClickLocation.rotation:

                const rotationAngleRight = Math.round(Math.abs(angle / Math.PI * 180));
                const rotationAngleLeft = Math.round(Math.abs((angle / Math.PI) * 180 + 180));

                if (grid.end.y - grid.start.y > 0) {
                    rec4.center.x = centerX + (radius + 100) * Math.cos(angle / 2);
                    rec4.center.y = centerY + (radius + 100) * Math.sin(angle / 2);
                    renderRectangle(context, rec4);
                    context.fillStyle = 'white';
                    context.fill();

                    text.content = rotationAngleRight.toString() + "°";
                    text.position.x = centerX + (radius + 100) * Math.cos(angle / 2) - 30;
                    text.position.y = centerY + (radius + 100) * Math.sin(angle / 2) + 2;

                } else {
                    rec4.center.x = centerX + (radius + 100) * Math.cos(angle / 2 - Math.PI / 2);
                    rec4.center.y = centerY + (radius + 100) * Math.sin(angle / 2 - Math.PI / 2);
                    renderRectangle(context, rec4);
                    context.fillStyle = 'white';
                    context.fill();

                    text.content = rotationAngleLeft.toString() + "°";
                    text.position.x = centerX + (radius + 100) * Math.cos(angle / 2 - Math.PI / 2) - 30;
                    text.position.y = centerY + (radius + 100) * Math.sin(angle / 2 - Math.PI / 2) + 2;

                }
                renderText(context, text);

                break;

            default:
                break;
        }
    }

    if (grid.mouseHoverLocation == gridHoverLocation.grid) {
        line1.strokeStyle = 'blue';
        renderGraph(context, group2);

        if (grid.startTickSelection == SelectionState.selected) {
            group2[0].center.x = grid.start.x - 20 * Math.cos(angle);
            group2[0].center.y = grid.start.y - 20 * Math.sin(angle);
            group2[1].center.x = grid.start.x - 20 * Math.cos(angle);
            group2[1].center.y = grid.start.y - 20 * Math.sin(angle);

        }
        renderGraph(context, group2);

    }
    context.setLineDash([20, 5, 5, 5]);
    renderLine(context, line1);
    context.setLineDash([]);

}


drawGrid.draft = (context: CanvasRenderingContext2D, grid: Shape_Grid) => {

    let angle = Math.atan((grid.end.y - grid.start.y) / (grid.end.x - grid.start.x));
    const radius = Math.abs((grid.end.y - grid.start.y) / Math.sin(angle));
    const { line1, line2 } = basicType(grid);
    grid.ID = '';

    context.setLineDash([20, 5, 5, 5])
    renderLine(context, line1);
    context.setLineDash([]);

    if ((angle == 0)) {
        context.setLineDash([10, 10]);
        if (grid.end.x - grid.start.x < 0) {
            line2.start.x = grid.start.x + 50;
            line2.end.x = grid.end.x - 50;

        }
        renderLine(context, line2);
        context.setLineDash([]);

    } else {

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'black',
            start: { x: grid.start.x, y: grid.start.y },
            end: { x: grid.start.x + 400, y: grid.start.y }
        })
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'green',
            start: { x: grid.start.x + 195 * Math.cos(- 2 / 180 * Math.PI), y: grid.start.y + 195 * Math.sin(- 2 / 180 * Math.PI) },
            end: { x: grid.start.x + 205 * Math.cos(2 / 180 * Math.PI), y: grid.start.y + 205 * Math.sin(2 / 180 * Math.PI) }
        })

        context.strokeStyle = 'blue';
        context.beginPath();
        if (grid.end.y - grid.start.y > 0) {
            if (angle < 0) {
                angle += Math.PI;
            }
            context.arc(grid.start.x, grid.start.y, 200, 0, angle)
        }
        else {
            if (angle > 0) {
                angle -= Math.PI;
            }
            context.arc(grid.start.x, grid.start.y, 200, angle, 0)
        }
        context.stroke();

        drawNumberCircle.shape(context, grid, grid.end.x + 20 * Math.cos(angle), grid.end.y + 20 * Math.sin(angle));

        if (radius <= 200) {
            drawLine.shape(context, {
                type: 'line',
                strokeStyle: 'blue',
                start: { x: grid.end.x, y: grid.end.y },
                end: { x: grid.start.x + 200 * Math.cos(angle), y: grid.start.y + 200 * Math.sin(angle) }
            })
        }

        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'green',
            start: { x: grid.start.x + 195 * Math.cos(angle - 2 / 180 * Math.PI), y: grid.start.y + 195 * Math.sin(angle - 2 / 180 * Math.PI) },
            end: { x: grid.start.x + 205 * Math.cos(angle + 2 / 180 * Math.PI), y: grid.start.y + 205 * Math.sin(angle + 2 / 180 * Math.PI) }
        })

        drawRotateAngle.shape(context, grid.start.x, grid.start.y, 210, angle, Direction.RIGHT);

    }

}
