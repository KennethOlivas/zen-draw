import { Tool } from "@/types/canvas-types"

export const TOOL_SHORTCUTS: Record<string, Tool> = {
    v: "select",
    h: "pan",
    r: "rectangle",
    d: "diamond",
    o: "ellipse",
    l: "line",
    a: "arrow",
    p: "freehand",
    t: "text",
    e: "eraser",
}

export const GRID_SIZE = 20
export const RESIZE_HANDLE_SIZE = 8
export const SNAP_THRESHOLD = 25
export const CONNECTION_POINT_RADIUS = 4
export const CONNECTION_POINT_HIT_RADIUS = 8
