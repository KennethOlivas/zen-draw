import { GRID_SIZE } from "@/constant/canvas-constants"
import { GridMode } from "@/types/canvas-types"

interface CanvasGridProps {
    zoom: number
    panOffset: { x: number; y: number }
    mode: GridMode
}

export function CanvasGrid({ zoom, panOffset, mode }: CanvasGridProps) {
    if (mode === "none") return null

    const gridSize = GRID_SIZE * zoom
    const gridOffsetX = panOffset.x % gridSize
    const gridOffsetY = panOffset.y % gridSize

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
            <defs>
                <pattern
                    id="grid-pattern"
                    width={gridSize}
                    height={gridSize}
                    patternUnits="userSpaceOnUse"
                    x={gridOffsetX}
                    y={gridOffsetY}
                >
                    {mode === "dots" ? (
                        <circle cx={gridSize / 2} cy={gridSize / 2} r={1} fill="var(--canvas-grid)" />
                    ) : mode === "grid" ? (
                        <path
                            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                            fill="none"
                            stroke="var(--canvas-grid)"
                            strokeWidth={1}
                        />
                    ) : (
                        // Mesh mode - dense grid
                        <>
                            <path
                                d={`M ${gridSize / 4} 0 V ${gridSize} M ${gridSize / 2} 0 V ${gridSize} M ${gridSize * 3 / 4} 0 V ${gridSize} M 0 ${gridSize / 4} H ${gridSize} M 0 ${gridSize / 2} H ${gridSize} M 0 ${gridSize * 3 / 4} H ${gridSize}`}
                                fill="none"
                                stroke="var(--canvas-grid)"
                                strokeWidth={0.5}
                                opacity={0.5}
                            />
                            <path
                                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                                fill="none"
                                stroke="var(--canvas-grid)"
                                strokeWidth={1}
                            />
                        </>
                    )}
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
    )
}
