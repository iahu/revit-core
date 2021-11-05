import { Shape_floorArchitectural } from "../../data/typings";
import { drawRectangle } from "./draw-rectangle";

export function drawFloorArchitectural(context: CanvasRenderingContext2D, floorArchitectural: Shape_floorArchitectural) {


}


drawFloorArchitectural.shape = (context: CanvasRenderingContext2D, floorArchitectural: Shape_floorArchitectural) => {

    drawRectangle.shape(context, {
        type: 'rectangle',
        center: { x: floorArchitectural.Point.x + floorArchitectural.Property.width / 2, y: floorArchitectural.Point.y + floorArchitectural.Property.height / 2 },
        property: { strokeStyle: 'black', width: floorArchitectural.Property.width, height: floorArchitectural.Property.height, rotation: floorArchitectural.Property.rotation }
    })
    context.fillStyle = '#4e72b8';
    context.fill();

    context.clearRect(floorArchitectural.Point.x + 190 / 6, floorArchitectural.Point.y + 130 / 6, 100 / 6, 100 / 6);
}