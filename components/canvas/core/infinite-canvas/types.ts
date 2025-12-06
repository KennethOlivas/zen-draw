import type { CanvasElement, Point, Tool, StrokeStyle, EdgeStyle } from "@/types/canvas-types"

export interface InfiniteCanvasProps {
    elements: CanvasElement[]
    selectedIds: string[]
    zoom: number
    panOffset: Point
    tool: Tool
    strokeColor: string
    fillColor: string
    strokeWidth: number
    opacity: number
    roughness: number
    backgroundColor: string
    strokeStyle: StrokeStyle
    edgeStyle: EdgeStyle
    fontSize: number
    onPanChange: (offset: Point) => void
    onZoomChange: (zoom: number) => void
    onSelectionChange: (ids: string[]) => void
    onAddElement: (element: Omit<CanvasElement, "id" | "seed">) => string
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
    onDeleteElements: (ids: string[]) => void
    onFinishDrawing: () => void
    readOnly?: boolean
    gridMode?: "none" | "dots" | "grid" | "mesh"
    snapToGrid?: boolean
}

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "start" | "end" | null
