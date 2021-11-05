import { SelectionState, Shape_StructuralColumns } from "../../data/typings";
import { drawLine } from "./draw-line";
import { drawRectangle } from "./draw-rectangle";
import { drawText } from "./draw-text";

export function drawStructuralColumns(context: CanvasRenderingContext2D, structuralColumns: Shape_StructuralColumns) {


}


drawStructuralColumns.shape = (context: CanvasRenderingContext2D, structuralColumns: Shape_StructuralColumns) => {

    drawRectangle.shape(context, {
        type: 'rectangle',
        center: { x: structuralColumns.rectanglePoint.x, y: structuralColumns.rectanglePoint.y },
        property: { strokeStyle: 'black', width: structuralColumns.rectangleProperty.width, height: structuralColumns.rectangleProperty.height, rotation: structuralColumns.rectangleProperty.rotation }
    })

    if (structuralColumns.textSelection == SelectionState.selected) {
        drawText.shape(context, {
            type: 'text',
            textStyle: '14px Arial_blue_center_middle',
            content: structuralColumns.textcontent,
            position: { x: structuralColumns.textPoint.x, y: structuralColumns.textPoint.y },
        })
    }

    if (structuralColumns.structuralColumnsSelection == SelectionState.selected) {
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: structuralColumns.rectanglePoint.x + 20, y: structuralColumns.rectanglePoint.y },
            end: { x: structuralColumns.rectanglePoint.x + 20, y: structuralColumns.rectanglePoint.y - 40 }
        })
        drawLine.shape(context, {
            type: 'line',
            strokeStyle: 'blue',
            start: { x: structuralColumns.rectanglePoint.x, y: structuralColumns.rectanglePoint.y - 20 },
            end: { x: structuralColumns.rectanglePoint.x + 80, y: structuralColumns.rectanglePoint.y - 20 }
        })
    }
}