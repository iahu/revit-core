import { Shape_Elevation } from "../../data/typings"
import { drawCircle } from "../graph/draw-circle"
import { drawTriangle } from "../graph/draw-triangle"
import { radius } from "./constants"

export function drawRotateSymbol(context: CanvasRenderingContext2D, elevation: Shape_Elevation, color: string) {


}

drawRotateSymbol.shape = (context: CanvasRenderingContext2D, elevation: Shape_Elevation, color: string) => {

    drawCircle.shape(context, {
        type: 'circle',
        center: { x: elevation.position.x - radius * 2, y: elevation.position.y + radius * 2 },
        property: { strokeStyle: color, radius: 8, sAngle: -45, eAngle: 270 }
    })

    drawTriangle.shape(context, {
        type: 'triangle',
        start: { x: elevation.position.x - radius * 2, y: elevation.position.y + radius * 2 - 14 },
        halfway: { x: elevation.position.x - radius * 2 + 6, y: elevation.position.y + radius * 2 - 8 },
        end: { x: elevation.position.x - radius * 2, y: elevation.position.y + radius * 2 - 2 }
    })
    context.fillStyle = color;
    context.fill();
}