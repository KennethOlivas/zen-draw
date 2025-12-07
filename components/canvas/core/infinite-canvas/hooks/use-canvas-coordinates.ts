import type { RefObject } from "react"
import type { Point, CanvasElement, ConnectionPoint } from "@/types/canvas-types"
import { findNearestConnectionPoint } from "@/lib/rough-renderer"

interface UseCanvasCoordinatesProps {
    containerRef: RefObject<HTMLDivElement | null>
    zoom: number
    panOffset: Point
    gridMode?: "none" | "dots" | "grid" | "mesh"
    snapToGrid?: boolean
    gridSize?: number
    snapThreshold?: number
    elements: CanvasElement[]
}

export function useCanvasCoordinates({
    containerRef,
    zoom,
    panOffset,
    gridMode = "none",
    snapToGrid = true,
    gridSize = 20,
    snapThreshold = 25,
    elements,
}: UseCanvasCoordinatesProps) {
    const snapToGridValue = (value: number) => {
        if (!snapToGrid) return value
        const currentGridSize = gridMode === "mesh" ? gridSize / 4 : gridSize
        return Math.round(value / currentGridSize) * currentGridSize
    }

    const snapPoint = (point: Point): Point => {
        if (!snapToGrid) return point
        return {
            x: snapToGridValue(point.x),
            y: snapToGridValue(point.y),
        }
    }

    const screenToCanvas = (screenX: number, screenY: number): Point => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return { x: 0, y: 0 }

        return {
            x: (screenX - rect.left - panOffset.x) / zoom,
            y: (screenY - rect.top - panOffset.y) / zoom,
        }
    }

    const findNearestSnapPoint = (
        point: Point,
        excludeId?: string,
    ): { elementId: string; point: ConnectionPoint; position: Point } | null => {
        const currentSnapThreshold = snapThreshold / zoom

        for (const el of elements) {
            if (el.id === excludeId) continue
            if (el.type === "line" || el.type === "arrow" || el.type === "freehand" || el.type === "text") continue

            const nearest = findNearestConnectionPoint(point, el, currentSnapThreshold)
            if (nearest) {
                return { elementId: el.id, point: nearest.point, position: nearest.position }
            }
        }
        return null
    }

    return {
        snapPoint,
        screenToCanvas,
        findNearestSnapPoint,
    }
}
