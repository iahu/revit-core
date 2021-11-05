import { Circle, Direction, Shape_Elevation } from "../../data/typings";
import { renderCircle } from "../render";
import { defaultGraph, edge } from "./constants";

export function drawArrow(context: CanvasRenderingContext2D, elevation: Shape_Elevation, color: string, direction: number) {


}

drawArrow.shape = (context: CanvasRenderingContext2D, elevation: Shape_Elevation, color: string, direction: number) => {

    context.strokeStyle = color;
    context.lineWidth = 1;
    const { circle } = defaultGraph(elevation);
    const curve: Circle = JSON.parse(JSON.stringify(circle));
    curve.property.strokeStyle = color;

    switch (direction) {
        case Direction.UP:
            context.beginPath();
            context.moveTo(elevation.position.x - edge, elevation.position.y - edge);
            context.lineTo(elevation.position.x, elevation.position.y - edge * 2);
            context.lineTo(elevation.position.x + edge, elevation.position.y - edge);
            context.stroke();
            context.closePath();

            curve.property.sAngle = 225;
            curve.property.eAngle = 270;

            break;

        case Direction.RIGHT:
            context.beginPath();
            context.moveTo(elevation.position.x + edge, elevation.position.y - edge);
            context.lineTo(elevation.position.x + edge * 2, elevation.position.y);
            context.lineTo(elevation.position.x + edge, elevation.position.y + edge);
            context.stroke();
            context.closePath();

            curve.property.sAngle = -45;
            curve.property.eAngle = 45;

            break;

        case Direction.DOWN:
            context.beginPath();
            context.moveTo(elevation.position.x + edge, elevation.position.y + edge);
            context.lineTo(elevation.position.x, elevation.position.y + edge * 2);
            context.lineTo(elevation.position.x - edge, elevation.position.y + edge);
            context.stroke();
            context.closePath();

            curve.property.sAngle = 45;
            curve.property.eAngle = 135;

            break;

        case Direction.LEFT:
            context.beginPath();
            context.moveTo(elevation.position.x - edge, elevation.position.y + edge);
            context.lineTo(elevation.position.x - edge * 2, elevation.position.y);
            context.lineTo(elevation.position.x - edge, elevation.position.y - edge);
            context.stroke();
            context.closePath();

            curve.property.sAngle = 135;
            curve.property.eAngle = 225;

            break;
    }

    renderCircle(context, curve);
}