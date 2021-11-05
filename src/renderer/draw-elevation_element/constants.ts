import { Shape_Elevation, Line, Shape_Tick, Rectangle, Circle, Triangle } from "../../data/typings";


export const Color = {
    ORiGIN: 'black',

}

export const radius = 16;
export const edge = radius / Math.SQRT2;

export function defaultGraph(elevation: Shape_Elevation) {

    //边线 勾 勾选框 悬浮框 中心线 圆 
    const line: Line = {
        type: 'line',
        strokeStyle: 'black',
        start: { x: elevation.position.x - radius / 10, y: elevation.position.y - radius * 2.2 },
        end: { x: elevation.position.x + radius / 10, y: elevation.position.y - radius * 2.2 }
    }
    const tick: Shape_Tick = {
        type: 'tick',
        strokeStyle: 'blue',
        position: { x: elevation.position.x, y: elevation.position.y - radius * 2.4 }
    }
    const rec1: Rectangle = {
        type: 'rectangle',
        center: { x: elevation.position.x, y: elevation.position.y - radius * 2.4 },
        property: { strokeStyle: 'blue', width: 12, height: 12, rotation: 0 }
    }
    const rec2: Rectangle = {
        type: 'rectangle',
        center: { x: elevation.position.x, y: elevation.position.y - radius * 2.2 },
        property: { strokeStyle: 'blue', width: radius, height: radius * Math.sqrt(3), rotation: 0 }
    }
    const centerLine: Line = {
        type: 'line',
        strokeStyle: 'black',
        start: { x: elevation.position.x - radius / 10, y: elevation.position.y },
        end: { x: elevation.position.x + radius / 10, y: elevation.position.y }
    }
    const circle: Circle = {
        type: 'circle',
        center: { x: elevation.position.x, y: elevation.position.y },
        property: { strokeStyle: 'black', radius: radius, sAngle: 0, eAngle: 360 }
    }
    const solidLine: Line = {
        type: 'line',
        strokeStyle: 'blue',
        start: { x: elevation.position.x - radius / 10, y: elevation.position.y - radius * 2.2 },
        end: { x: elevation.position.x + radius / 10, y: elevation.position.y - radius * 2.2 }
    }
    const dashedLine: Line = {
        type: 'line',
        strokeStyle: 'green',
        start: { x: elevation.centerLineUpPosition.x - radius * 3, y: elevation.centerLineUpPosition.y - elevation.distanceUp },
        end: { x: elevation.centerLineUpPosition.x + radius * 3, y: elevation.centerLineUpPosition.y - elevation.distanceUp }
    }
    const lineGroup: Line[] = [{
        type: 'line',
        strokeStyle: 'blue',
        start: { x: elevation.centerLineUpPosition.x - radius * 3, y: elevation.centerLineUpPosition.y },
        end: { x: elevation.centerLineUpPosition.x + radius * 3, y: elevation.centerLineUpPosition.y }
    }, {
        type: 'line',
        strokeStyle: 'blue',
        start: { x: elevation.centerLineRightPosition.x, y: elevation.centerLineRightPosition.y - radius * 3 },
        end: { x: elevation.centerLineRightPosition.x, y: elevation.centerLineRightPosition.y + radius * 3 }
    }]
    const triangle1: Triangle = {
        type: 'triangle',
        start: { x: elevation.centerLineUpPosition.x - 6, y: elevation.centerLineUpPosition.y - elevation.distanceUp - 2 },
        halfway: { x: elevation.centerLineUpPosition.x, y: elevation.centerLineUpPosition.y - elevation.distanceUp - 6 * Math.sqrt(3) - 2 },
        end: { x: elevation.centerLineUpPosition.x + 6, y: elevation.centerLineUpPosition.y - elevation.distanceUp - 2 }
    }
    const triangle2: Triangle = {
        type: 'triangle',
        start: { x: elevation.centerLineUpPosition.x - 6, y: elevation.centerLineUpPosition.y - elevation.distanceUp + 2 },
        halfway: { x: elevation.centerLineUpPosition.x, y: elevation.centerLineUpPosition.y - elevation.distanceUp + 6 * Math.sqrt(3) + 2 },
        end: { x: elevation.centerLineUpPosition.x + 6, y: elevation.centerLineUpPosition.y - elevation.distanceUp + 2 }
    }
    const triangle3: Triangle = {
        type: 'triangle',
        start: { x: elevation.centerLineRightPosition.x + elevation.distanceRight - 2, y: elevation.centerLineRightPosition.y - 6 },
        halfway: { x: elevation.centerLineRightPosition.x + elevation.distanceRight - 6 * Math.sqrt(3) - 2, y: elevation.centerLineRightPosition.y },
        end: { x: elevation.centerLineRightPosition.x + elevation.distanceRight - 2, y: elevation.centerLineRightPosition.y + 6 }
    }
    const triangle4: Triangle = {
        type: 'triangle',
        start: { x: elevation.centerLineRightPosition.x + elevation.distanceRight + 2, y: elevation.centerLineRightPosition.y - 6 },
        halfway: { x: elevation.centerLineRightPosition.x + elevation.distanceRight + 6 * Math.sqrt(3) + 2, y: elevation.centerLineRightPosition.y },
        end: { x: elevation.centerLineRightPosition.x + elevation.distanceRight + 2, y: elevation.centerLineRightPosition.y + 6 }
    }


    const arrowUpLine: Line = JSON.parse(JSON.stringify(line));
    const arrowUpTick: Shape_Tick = JSON.parse(JSON.stringify(tick));
    const arrowUpRec1: Rectangle = JSON.parse(JSON.stringify(rec1));
    const arrowUpRec2: Rectangle = JSON.parse(JSON.stringify(rec2));

    line.start.y = elevation.position.y + radius * 2.2;
    line.end.y = elevation.position.y + radius * 2.2;
    tick.position.y = elevation.position.y + radius * 2.4;
    rec1.center.y = elevation.position.y + radius * 2.4;
    rec2.center.y = elevation.position.y + radius * 2.2;
    const arrowDownLine: Line = JSON.parse(JSON.stringify(line));
    const arrowDownTick: Shape_Tick = JSON.parse(JSON.stringify(tick));
    const arrowDownRec1: Rectangle = JSON.parse(JSON.stringify(rec1));
    const arrowDownRec2: Rectangle = JSON.parse(JSON.stringify(rec2));

    line.start.x = elevation.position.x - radius / 10 + radius * 2.2;
    line.start.y = elevation.position.y;
    line.end.x = elevation.position.x + radius / 10 + radius * 2.2;
    line.end.y = elevation.position.y;
    tick.position.x = elevation.position.x + radius * 2.4;
    tick.position.y = elevation.position.y;
    rec1.center.x = elevation.position.x + radius * 2.4;
    rec1.center.y = elevation.position.y;
    rec2.center.x = elevation.position.x + radius * 2.2;
    rec2.center.y = elevation.position.y;
    const arrowRightLine: Line = JSON.parse(JSON.stringify(line));
    const arrowRightTick: Shape_Tick = JSON.parse(JSON.stringify(tick));
    const arrowRightRec1: Rectangle = JSON.parse(JSON.stringify(rec1));
    const arrowRightRec2: Rectangle = JSON.parse(JSON.stringify(rec2));

    line.start.x = elevation.position.x - radius / 10 - radius * 2.2;
    line.end.x = elevation.position.x + radius / 10 - radius * 2.2;
    tick.position.x = elevation.position.x - radius * 2.4;
    rec1.center.x = elevation.position.x - radius * 2.4;
    rec2.center.x = elevation.position.x - radius * 2.2;
    const arrowLeftLine: Line = JSON.parse(JSON.stringify(line));
    const arrowLeftTick: Shape_Tick = JSON.parse(JSON.stringify(tick));
    const arrowLeftRec1: Rectangle = JSON.parse(JSON.stringify(rec1));
    const arrowLeftRec2: Rectangle = JSON.parse(JSON.stringify(rec2));

    return {
        arrowUpLine, arrowUpTick, arrowUpRec1, arrowUpRec2,
        arrowRightLine, arrowRightTick, arrowRightRec1, arrowRightRec2,
        arrowDownLine, arrowDownTick, arrowDownRec1, arrowDownRec2,
        arrowLeftLine, arrowLeftTick, arrowLeftRec1, arrowLeftRec2,

        centerLine, circle,

        solidLine, dashedLine, lineGroup, triangle1, triangle2, triangle3, triangle4

    }

}
