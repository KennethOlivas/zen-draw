import type { Point } from "@/types/canvas-types"

interface SelectionBoxGeometryProps {
    selectionBox: {
        start: Point
        current: Point
        isVisible: boolean
    }
    zoom: number
    panOffset: Point
}

export function SelectionBoxGeometry({ selectionBox, zoom, panOffset }: SelectionBoxGeometryProps) {
    if (!selectionBox.isVisible) return null

    return (
        <div
            className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none z-50"
            style={{
                left: Math.min(selectionBox.start.x, selectionBox.current.x) * zoom + panOffset.x,
                top: Math.min(selectionBox.start.y, selectionBox.current.y) * zoom + panOffset.y,
                width: Math.abs(selectionBox.current.x - selectionBox.start.x) * zoom,
                height: Math.abs(selectionBox.current.y - selectionBox.start.y) * zoom,
            }}
        />
    )
}
