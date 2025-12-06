import type { RefObject } from "react"
import type { Point } from "@/types/canvas-types"

interface UseZoomPanProps {
    containerRef: RefObject<HTMLDivElement | null>
    zoom: number
    panOffset: Point
    onZoomChange: (zoom: number) => void
    onPanChange: (offset: Point) => void
}

export function useZoomPan({
    containerRef,
    zoom,
    panOffset,
    onZoomChange,
    onPanChange,
}: UseZoomPanProps) {
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault()

        if (e.ctrlKey || e.metaKey) {
            // Zoom with Ctrl+scroll
            const delta = -e.deltaY * 0.001
            const newZoom = Math.max(0.1, Math.min(5, zoom + delta * zoom))

            // Zoom towards cursor
            const rect = containerRef.current?.getBoundingClientRect()
            if (rect) {
                const cursorX = e.clientX - rect.left
                const cursorY = e.clientY - rect.top

                const scale = newZoom / zoom
                const newPanX = cursorX - (cursorX - panOffset.x) * scale
                const newPanY = cursorY - (cursorY - panOffset.y) * scale

                onPanChange({ x: newPanX, y: newPanY })
            }

            onZoomChange(newZoom)
        } else {
            // Pan
            onPanChange({
                x: panOffset.x - e.deltaX,
                y: panOffset.y - e.deltaY,
            })
        }
    }

    return { handleWheel }
}
