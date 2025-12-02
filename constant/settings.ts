import { EdgeStyle, StrokeStyle, TextAlign } from "@/types/canvas-types"

export const DEFAULT_STROKE_COLOR = "#1e1e1e"
export const DEFAULT_FILL_COLOR = "transparent"
export const DEFAULT_STROKE_WIDTH = 2
export const DEFAULT_OPACITY = 1
export const DEFAULT_FONT_SIZE = 20
export const DEFAULT_ROUGHNESS = 1
export const DEFAULT_BACKGROUND_COLOR = "#ffffff"
export const DEFAULT_STROKE_STYLE: StrokeStyle = "solid"
export const DEFAULT_EDGE_STYLE: EdgeStyle = "round"
export const DEFAULT_TEXT_ALIGN: TextAlign = "left"

export const COLORS = [
  "#1e1e1e", // Black
  "#343a40", // Dark gray
  "#495057", // Gray
  "#868e96", // Light gray
  "#e03131", // Red
  "#c92a2a", // Dark red
  "#f03e3e", // Light red
  "#2f9e44", // Green
  "#37b24d", // Light green
  "#1971c2", // Blue
  "#228be6", // Light blue
  "#1864ab", // Dark blue
  "#f08c00", // Orange
  "#fd7e14", // Light orange
  "#9c36b5", // Purple
  "#ae3ec9", // Light purple
  "#0c8599", // Cyan
  "#15aabf", // Light cyan
  "#e64980", // Pink
  "#f783ac", // Light pink
]

export const FILL_COLORS = [
  "transparent",
  "#ffc9c9", // Light red
  "#ffe3e3", // Lighter red
  "#b2f2bb", // Light green
  "#d3f9d8", // Lighter green
  "#a5d8ff", // Light blue
  "#d0ebff", // Lighter blue
  "#ffec99", // Light yellow
  "#fff3bf", // Lighter yellow
  "#eebefa", // Light purple
  "#f3d9fa", // Lighter purple
  "#99e9f2", // Light cyan
  "#c5f6fa", // Lighter cyan
  "#fcc2d7", // Light pink
  "#ffdeeb", // Lighter pink
  "#e9ecef", // Light gray
  "#f8f9fa", // Lighter gray
]

export const BACKGROUND_COLORS = [
  // Light backgrounds
  "#ffffff", // Pure white
  "#f8f9fa", // Off-white
  "#f1f3f5", // Light gray
  "#fffbeb", // Warm cream
  // Dark backgrounds
  "#121212", // Material dark
  "#161718", // Charcoal
  "#13171C", // Dark slate
  "#181605", // Dark olive
  "#1B1615", // Dark brown
]

export const STROKE_WIDTHS = [1, 2, 4, 6]

export const FONT_SIZES = [12, 16, 20, 24, 32, 48, 64]
