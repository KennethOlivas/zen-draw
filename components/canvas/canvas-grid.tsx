import { GRID_SIZE } from "@/constant/canvas-constants"

interface CanvasGridProps {
    zoom: number
    panOffset: { x: number; y: number }
}

export function CanvasGrid({ zoom, panOffset }: CanvasGridProps) {
    const gridSize = GRID_SIZE * zoom
    const gridOffsetX = panOffset.x % gridSize
    const gridOffsetY = panOffset.y % gridSize

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
                <pattern
                    id="grid"
                    width={gridSize}
                    height={gridSize}
                    patternUnits="userSpaceOnUse"
                    x={gridOffsetX}
                    y={gridOffsetY}
                >
                    <circle cx={gridSize / 2} cy={gridSize / 2} r={1} fill="var(--canvas-grid)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    )
}
