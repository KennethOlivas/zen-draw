import { CanvasElement } from "@/types/canvas-types"
import { getElementBounds, getResizeHandles } from "@/lib/rough-renderer"

interface SelectionOverlayProps {
    selectedIds: string[]
    elements: CanvasElement[]
    zoom: number
    panOffset: { x: number; y: number }
}

export function SelectionOverlay({ selectedIds, elements, zoom, panOffset }: SelectionOverlayProps) {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
            }}
        >
            {selectedIds.map((id) => {
                const element = elements.find((el) => el.id === id)
                if (!element) return null

                const bounds = getElementBounds(element)
                const padding = 8
                const handles = element.type !== "freehand" && element.type !== "text" ? getResizeHandles(element) : []

                return (
                    <g key={`selection-${id}`}>
                        <rect
                            x={bounds.x - padding}
                            y={bounds.y - padding}
                            width={bounds.width + padding * 2}
                            height={bounds.height + padding * 2}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth={1 / zoom}
                            strokeDasharray={`${4 / zoom} ${4 / zoom}`}
                        />
                        {handles.map((handle) => (
                            <rect
                                key={handle.position}
                                x={handle.x - 4 / zoom}
                                y={handle.y - 4 / zoom}
                                width={8 / zoom}
                                height={8 / zoom}
                                fill="oklch(55.2% 0.016 285.938)"
                                stroke="hsl(var(--primary))"
                                strokeWidth={1 / zoom}
                                style={{ cursor: handle.cursor }}
                                className="pointer-events-auto"
                            />
                        ))}
                    </g>
                )
            })}
        </svg>
    )
}
