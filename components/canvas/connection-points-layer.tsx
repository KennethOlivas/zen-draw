import { CanvasElement, Tool, ConnectionPoint } from "@/types/canvas-types"
import { getConnectionPoints } from "@/lib/rough-renderer"

interface ConnectionPointsLayerProps {
    elements: CanvasElement[]
    tool: Tool
    zoom: number
    panOffset: { x: number; y: number }
    hoveredConnection: { elementId: string; point: ConnectionPoint } | null
    startConnection: { elementId: string; point: ConnectionPoint } | null
}

export function ConnectionPointsLayer({
    elements,
    tool,
    zoom,
    panOffset,
    hoveredConnection,
    startConnection,
}: ConnectionPointsLayerProps) {
    if (tool !== "arrow" && tool !== "line") return null

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
            }}
        >
            {elements
                .filter((el) => el.type !== "line" && el.type !== "arrow" && el.type !== "freehand" && el.type !== "text")
                .map((element) => {
                    const points = getConnectionPoints(element)
                    return Object.entries(points).map(([name, pos]) => {
                        const isHovered = hoveredConnection?.elementId === element.id && hoveredConnection?.point === name
                        const isStartPoint = startConnection?.elementId === element.id && startConnection?.point === name

                        return (
                            <g key={`${element.id}-${name}`}>
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={8 / zoom}
                                    fill="transparent"
                                    stroke={isHovered || isStartPoint ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                                    strokeWidth={2 / zoom}
                                    opacity={isHovered || isStartPoint ? 1 : 0.3}
                                />
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={4 / zoom}
                                    fill={isHovered || isStartPoint ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                                    opacity={isHovered || isStartPoint ? 1 : 0.5}
                                />
                            </g>
                        )
                    })
                })}
        </svg>
    )
}
