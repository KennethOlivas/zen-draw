export type Tool =
  | "select"
  | "pan"
  | "rectangle"
  | "ellipse"
  | "diamond"
  | "line"
  | "arrow"
  | "freehand"
  | "text"
  | "eraser"

export type ElementType = "rectangle" | "ellipse" | "diamond" | "line" | "arrow" | "freehand" | "text" | "curvedArrow"

export type ConnectionPoint = "top" | "right" | "bottom" | "left" | "center"

export type StrokeStyle = "solid" | "dashed" | "dotted"
export type EdgeStyle = "sharp" | "round"
export type TextAlign = "left" | "center" | "right"

export interface Point {
  x: number
  y: number
}

export interface Connection {
  elementId: string
  point: ConnectionPoint
}

export interface CanvasElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  points?: Point[]
  text?: string
  strokeColor: string
  fillColor: string
  strokeWidth: number
  opacity: number
  fontSize?: number
  rotation: number
  roughness: number
  seed: number
  startBinding?: Connection
  endBinding?: Connection
  controlPoint?: Point
  strokeStyle?: StrokeStyle
  edgeStyle?: EdgeStyle
  textAlign?: TextAlign
}

export interface CanvasState {
  elements: CanvasElement[]
  selectedIds: string[]
  zoom: number
  panOffset: Point
  tool: Tool
  strokeColor: string
  fillColor: string
  strokeWidth: number
  opacity: number
  fontSize: number
  roughness: number
  backgroundColor: string
  strokeStyle: StrokeStyle
  edgeStyle: EdgeStyle
  textAlign: TextAlign
}

export interface HistoryEntry {
  elements: CanvasElement[]
  selectedIds: string[]
}
