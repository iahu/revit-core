import { Circle, Line, Rectangle, Shape_Grid, Shape_Tick, Text } from "../../data/typings";

export function basicType(grid: Shape_Grid) {
    let angle = Math.atan((grid.end.y - grid.start.y) / (grid.end.x - grid.start.x));
    const radius = Math.abs((grid.end.y - grid.start.y) / Math.sin(angle)) / 2;
    const centerX = (grid.start.x + grid.end.x) / 2;
    const centerY = (grid.start.y + grid.end.y) / 2;

    //始终指向终点方向
    if (grid.end.y - grid.start.y > 0) {
        if (angle < 0) {
            angle += Math.PI;
        }
    }
    else if (grid.end.y - grid.start.y < 0) {
        if (angle > 0) {
            angle -= Math.PI;
        }
    }
    else if (grid.end.y - grid.start.y == 0) {
        if (grid.end.x - grid.start.x < 0) {
            angle = Math.PI;
        }
    }

    const group1: [Line, Circle] = [{
        type: 'line',
        strokeStyle: 'blue',
        start: { x: centerX + (radius + 90) * Math.cos(-2 / 180 * Math.PI), y: centerY + (radius + 90) * Math.sin(-2 / 180 * Math.PI) },
        end: { x: centerX + (radius + 100) * Math.cos(2 / 180 * Math.PI), y: centerY + (radius + 100) * Math.sin(2 / 180 * Math.PI) }
    },
    {
        type: 'circle',
        center: { x: centerX, y: centerY },
        property: { strokeStyle: 'blue', radius: radius + 95, sAngle: 0, eAngle: angle / Math.PI * 180 }
    }]
    const rec1: Rectangle = {
        type: 'rectangle',
        center: { x: centerX - (radius + 20) * Math.cos(angle), y: centerY - (radius + 20) * Math.sin(angle) },
        property: { strokeStyle: 'blue', height: 20 * Math.sqrt(3), width: 20, rotation: 0 }
    }
    const rec2: Rectangle = {
        type: 'rectangle',
        center: { x: centerX + (radius + 105) * Math.cos(angle / 2), y: centerY + (radius + 105) * Math.sin(angle / 2) },
        property: { strokeStyle: 'blue', height: 16, width: 36, rotation: 90 + angle / 2 / Math.PI * 180 }
    }
    const rec3: Rectangle = {
        type: 'rectangle',
        center: { x: centerX - radius * Math.cos(angle), y: centerY - radius * Math.sin(angle) },
        property: { strokeStyle: 'purple', height: 14, width: 14, rotation: 0 }
    }
    const rec4: Rectangle = {
        type: 'rectangle',
        center: { x: centerX - (radius + 20) * Math.cos(angle), y: centerY - (radius + 20) * Math.sin(angle) },
        property: { strokeStyle: 'black', height: 20, width: 60, rotation: 0 }
    }
    const text: Text = {
        type: 'text',
        textStyle: '16px Arial_black_left_middle',
        content: grid.ID,
        position: { x: centerX - (radius + 20) * Math.cos(angle) - 30, y: centerY - (radius + 20) * Math.sin(angle) + 2 },
    }
    const line1: Line = {
        type: 'line',
        strokeStyle: 'black',
        start: { x: grid.start.x, y: grid.start.y },
        end: { x: grid.end.x, y: grid.end.y }
    }
    const group2: [Circle, Rectangle] = [{
        type: 'circle',
        center: { x: grid.end.x + 20 * Math.cos(angle), y: grid.end.y + 20 * Math.sin(angle) },
        property: { strokeStyle: 'blue', radius: 20, sAngle: 0, eAngle: 360 }
    }, {
        type: 'rectangle',
        center: { x: grid.end.x + 20 * Math.cos(angle), y: grid.end.y + 20 * Math.sin(angle) },
        property: { strokeStyle: 'blue', height: 20 * Math.sqrt(3), width: 20, rotation: 0 }
    }]
    const line2: Line = {
        type: 'line',
        strokeStyle: 'green',
        start: { x: grid.start.x - 50, y: grid.start.y },
        end: { x: grid.end.x + 50, y: grid.end.y }
    }
    const rec5: Rectangle = {
        type: 'rectangle',
        center: { x: centerX + (radius + 110) * Math.cos(angle), y: centerY + (radius + 110) * Math.sin(angle) },
        property: { strokeStyle: 'blue', height: 12, width: 12, rotation: 0 }
    }
    const tick1: Shape_Tick = {
        type: 'tick',
        strokeStyle: 'blue',
        position: { x: centerX + (radius + 110) * Math.cos(angle), y: centerY + (radius + 110) * Math.sin(angle) }
    }

    const rec6: Rectangle = JSON.parse(JSON.stringify(rec5));
    const tick2: Shape_Tick = JSON.parse(JSON.stringify(tick1));
    rec6.center.x = centerX - (radius + 110) * Math.cos(angle);
    rec6.center.y = centerY - (radius + 110) * Math.sin(angle);
    tick2.position.x = centerX - (radius + 110) * Math.cos(angle);
    tick2.position.y = centerY - (radius + 110) * Math.sin(angle);

    const circleGroup: Circle[] = [{
        type: 'circle',
        center: { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) },
        property: { strokeStyle: 'blue', radius: 5, sAngle: 0, eAngle: 360 }
    }, {
        type: 'circle',
        center: { x: centerX - radius * Math.cos(angle), y: centerY - radius * Math.sin(angle) },
        property: { strokeStyle: 'blue', radius: 5, sAngle: 0, eAngle: 360 }
    }]

    return {
        angle, radius, centerX, centerY,

        group1, rec1, rec2, rec3, rec4, text, line1, group2, line2,

        rec5, tick1, rec6, tick2, circleGroup
    }
}