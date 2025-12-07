import { GridMode } from "@/types/canvas-types"

interface CanvasGridProps {
    zoom: number
    panOffset: { x: number; y: number }
    mode: GridMode
    gridSize?: number
}

export function CanvasGrid({ zoom, panOffset, mode, gridSize = 20 }: CanvasGridProps) {
    if (mode === "none") return null

    const effectiveGridSize = gridSize * zoom
    const gridOffsetX = panOffset.x % effectiveGridSize
    const gridOffsetY = panOffset.y % effectiveGridSize

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
            <defs>
                <pattern
                    id="grid-pattern"
                    width={effectiveGridSize}
                    height={effectiveGridSize}
                    patternUnits="userSpaceOnUse"
                    x={gridOffsetX}
                    y={gridOffsetY}
                >
                    {mode === "dots" ? (
                        <circle cx={effectiveGridSize / 2} cy={effectiveGridSize / 2} r={1} fill="var(--canvas-grid)" />
                    ) : mode === "grid" ? (
                        <path
                            d={`M ${effectiveGridSize} 0 L 0 0 0 ${effectiveGridSize}`}
                            fill="none"
                            stroke="var(--canvas-grid)"
                            strokeWidth={1}
                        />
                    ) : (
                        // Mesh mode - dense grid
                        <>
                            <path
                                d={`M ${effectiveGridSize / 4} 0 V ${effectiveGridSize} M ${effectiveGridSize / 2} 0 V ${effectiveGridSize} M ${effectiveGridSize * 3 / 4} 0 V ${effectiveGridSize} M 0 ${effectiveGridSize / 4} H ${effectiveGridSize} M 0 ${effectiveGridSize / 2} H ${effectiveGridSize} M 0 ${effectiveGridSize * 3 / 4} H ${effectiveGridSize}`}
                                fill="none"
                                stroke="var(--canvas-grid)"
                                strokeWidth={0.5}
                                opacity={0.5}
                            />
                            <path
                                d={`M ${effectiveGridSize} 0 L 0 0 0 ${effectiveGridSize}`}
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
