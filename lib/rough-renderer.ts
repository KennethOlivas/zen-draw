import type { CanvasElement, Point, ConnectionPoint, EdgeStyle } from "@/types/canvas-types"

// Helper to get border radius value from EdgeStyle
function getBorderRadius(edgeStyle: EdgeStyle | undefined): number {
  switch (edgeStyle) {
    case "sm":
      return 4
    case "md":
      return 8
    case "lg":
      return 16
    case "none":
    default:
      return 0
  }
}

// Simple seeded random number generator for consistent roughness
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Generate rough/sketchy path for hand-drawn effect
function generateRoughLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughness: number,
  rand: () => number,
): string {
  if (roughness === 0) {
    return `M ${x1} ${y1} L ${x2} ${y2}`
  }

  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  const segments = Math.max(2, Math.floor(len / 20))
  const offset = roughness * 2

  let path = `M ${x1 + (rand() - 0.5) * offset} ${y1 + (rand() - 0.5) * offset}`

  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    const x = x1 + (x2 - x1) * t + (rand() - 0.5) * offset
    const y = y1 + (y2 - y1) * t + (rand() - 0.5) * offset
    path += ` L ${x} ${y}`
  }

  return path
}

// Generate rough rectangle path
function generateRoughRect(
  x: number,
  y: number,
  width: number,
  height: number,
  roughness: number,
  rand: () => number,
  borderRadius = 0,
): string {
  // If no border radius, use sharp corners
  if (borderRadius === 0) {
    const paths = [
      generateRoughLine(x, y, x + width, y, roughness, rand),
      generateRoughLine(x + width, y, x + width, y + height, roughness, rand),
      generateRoughLine(x + width, y + height, x, y + height, roughness, rand),
      generateRoughLine(x, y + height, x, y, roughness, rand),
    ]

    if (roughness > 0) {
      paths.push(
        generateRoughLine(x, y, x + width, y, roughness * 0.5, rand),
        generateRoughLine(x + width, y, x + width, y + height, roughness * 0.5, rand),
        generateRoughLine(x + width, y + height, x, y + height, roughness * 0.5, rand),
        generateRoughLine(x, y + height, x, y, roughness * 0.5, rand),
      )
    }

    return paths.join(" ")
  }

  // Clamp border radius to half the smaller dimension
  const maxRadius = Math.min(Math.abs(width), Math.abs(height)) / 2
  const r = Math.min(borderRadius, maxRadius)

  // Generate rounded rectangle with rough lines and smooth arcs for corners
  const paths = [
    // Top edge
    generateRoughLine(x + r, y, x + width - r, y, roughness, rand),
    // Top-right corner arc
    `M ${x + width - r} ${y} Q ${x + width} ${y} ${x + width} ${y + r}`,
    // Right edge
    generateRoughLine(x + width, y + r, x + width, y + height - r, roughness, rand),
    // Bottom-right corner arc
    `M ${x + width} ${y + height - r} Q ${x + width} ${y + height} ${x + width - r} ${y + height}`,
    // Bottom edge
    generateRoughLine(x + width - r, y + height, x + r, y + height, roughness, rand),
    // Bottom-left corner arc
    `M ${x + r} ${y + height} Q ${x} ${y + height} ${x} ${y + height - r}`,
    // Left edge
    generateRoughLine(x, y + height - r, x, y + r, roughness, rand),
    // Top-left corner arc
    `M ${x} ${y + r} Q ${x} ${y} ${x + r} ${y}`,
  ]

  if (roughness > 0) {
    // Add second pass for rougher appearance (only on straight edges)
    paths.push(
      generateRoughLine(x + r, y, x + width - r, y, roughness * 0.5, rand),
      generateRoughLine(x + width, y + r, x + width, y + height - r, roughness * 0.5, rand),
      generateRoughLine(x + width - r, y + height, x + r, y + height, roughness * 0.5, rand),
      generateRoughLine(x, y + height - r, x, y + r, roughness * 0.5, rand),
    )
  }

  return paths.join(" ")
}

// Generate rough ellipse path
function generateRoughEllipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  roughness: number,
  rand: () => number,
): string {
  const points = 32
  const offset = roughness * 2

  let path = ""

  for (let pass = 0; pass < (roughness > 0 ? 2 : 1); pass++) {
    const passOffset = pass * 0.5
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const wobble = roughness > 0 ? (rand() - 0.5) * offset : 0
      const x = cx + Math.cos(angle) * (rx + wobble) + (rand() - 0.5) * offset * passOffset
      const y = cy + Math.sin(angle) * (ry + wobble) + (rand() - 0.5) * offset * passOffset

      if (i === 0) {
        path += `M ${x} ${y}`
      } else {
        path += ` L ${x} ${y}`
      }
    }
  }

  return path
}

// Generate arrow head
function generateArrowHead(
  x: number,
  y: number,
  angle: number,
  size: number,
  roughness: number,
  rand: () => number,
): string {
  const arrowAngle = Math.PI / 6
  const x1 = x - size * Math.cos(angle - arrowAngle)
  const y1 = y - size * Math.sin(angle - arrowAngle)
  const x2 = x - size * Math.cos(angle + arrowAngle)
  const y2 = y - size * Math.sin(angle + arrowAngle)

  return [generateRoughLine(x, y, x1, y1, roughness, rand), generateRoughLine(x, y, x2, y2, roughness, rand)].join(" ")
}

// Generate curved line path
function generateCurvedLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  controlPoint: Point,
  roughness: number,
  rand: () => number,
): string {
  if (roughness === 0) {
    return `M ${x1} ${y1} Q ${controlPoint.x} ${controlPoint.y} ${x2} ${y2}`
  }

  const offset = roughness * 2
  const wobbleStart = { x: x1 + (rand() - 0.5) * offset, y: y1 + (rand() - 0.5) * offset }
  const wobbleEnd = { x: x2 + (rand() - 0.5) * offset, y: y2 + (rand() - 0.5) * offset }
  const wobbleControl = {
    x: controlPoint.x + (rand() - 0.5) * offset,
    y: controlPoint.y + (rand() - 0.5) * offset,
  }

  let path = `M ${wobbleStart.x} ${wobbleStart.y} Q ${wobbleControl.x} ${wobbleControl.y} ${wobbleEnd.x} ${wobbleEnd.y}`

  // Add second pass for rougher look
  if (roughness > 0.5) {
    const wobbleStart2 = { x: x1 + (rand() - 0.5) * offset * 0.5, y: y1 + (rand() - 0.5) * offset * 0.5 }
    const wobbleEnd2 = { x: x2 + (rand() - 0.5) * offset * 0.5, y: y2 + (rand() - 0.5) * offset * 0.5 }
    const wobbleControl2 = {
      x: controlPoint.x + (rand() - 0.5) * offset * 0.5,
      y: controlPoint.y + (rand() - 0.5) * offset * 0.5,
    }
    path += ` M ${wobbleStart2.x} ${wobbleStart2.y} Q ${wobbleControl2.x} ${wobbleControl2.y} ${wobbleEnd2.x} ${wobbleEnd2.y}`
  }

  return path
}

// Generate curved arrow head path
function generateCurvedArrowHead(
  endX: number,
  endY: number,
  controlPoint: Point,
  size: number,
  roughness: number,
  rand: () => number,
): string {
  // Calculate angle from control point to end point for proper arrow direction
  const angle = Math.atan2(endY - controlPoint.y, endX - controlPoint.x)
  const arrowAngle = Math.PI / 6
  const x1 = endX - size * Math.cos(angle - arrowAngle)
  const y1 = endY - size * Math.sin(angle - arrowAngle)
  const x2 = endX - size * Math.cos(angle + arrowAngle)
  const y2 = endY - size * Math.sin(angle + arrowAngle)

  return [
    generateRoughLine(endX, endY, x1, y1, roughness, rand),
    generateRoughLine(endX, endY, x2, y2, roughness, rand),
  ].join(" ")
}

// Generate rough diamond path
function generateRoughDiamond(
  x: number,
  y: number,
  width: number,
  height: number,
  roughness: number,
  rand: () => number,
): string {
  const cx = x + width / 2
  const cy = y + height / 2
  const top = { x: cx, y: y }
  const right = { x: x + width, y: cy }
  const bottom = { x: cx, y: y + height }
  const left = { x: x, y: cy }

  const paths = [
    generateRoughLine(top.x, top.y, right.x, right.y, roughness, rand),
    generateRoughLine(right.x, right.y, bottom.x, bottom.y, roughness, rand),
    generateRoughLine(bottom.x, bottom.y, left.x, left.y, roughness, rand),
    generateRoughLine(left.x, left.y, top.x, top.y, roughness, rand),
  ]

  if (roughness > 0) {
    paths.push(
      generateRoughLine(top.x, top.y, right.x, right.y, roughness * 0.5, rand),
      generateRoughLine(right.x, right.y, bottom.x, bottom.y, roughness * 0.5, rand),
      generateRoughLine(bottom.x, bottom.y, left.x, left.y, roughness * 0.5, rand),
      generateRoughLine(left.x, left.y, top.x, top.y, roughness * 0.5, rand),
    )
  }

  return paths.join(" ")
}

// Generate simple rectangle path for filling
function generateRectPath(x: number, y: number, width: number, height: number, borderRadius = 0): string {
  if (borderRadius === 0) {
    return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`
  }

  // Clamp border radius
  const maxRadius = Math.min(Math.abs(width), Math.abs(height)) / 2
  const r = Math.min(borderRadius, maxRadius)

  return [
    `M ${x + r} ${y}`,
    `L ${x + width - r} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `L ${x + width} ${y + height - r}`,
    `Q ${x + width} ${y + height} ${x + width - r} ${y + height}`,
    `L ${x + r} ${y + height}`,
    `Q ${x} ${y + height} ${x} ${y + height - r}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `Z`,
  ].join(" ")
}

// Generate simple diamond path for filling
function generateDiamondPath(x: number, y: number, width: number, height: number): string {
  const cx = x + width / 2
  const cy = y + height / 2
  return `M ${cx} ${y} L ${x + width} ${cy} L ${cx} ${y + height} L ${x} ${cy} Z`
}

// Render element to SVG path
export function renderElementToPath(
  element: CanvasElement,
  allElements?: CanvasElement[],
): { path: string; fill: string; fillPath?: string } {
  const rand = seededRandom(element.seed)
  const { x, y, width, height, roughness } = element

  switch (element.type) {
    case "rectangle": {
      const radius = getBorderRadius(element.edgeStyle)
      return {
        path: generateRoughRect(x, y, width, height, roughness, rand, radius),
        fillPath: generateRectPath(x, y, width, height, radius),
        fill: element.fillColor,
      }
    }

    case "diamond":
      return {
        path: generateRoughDiamond(x, y, width, height, roughness, rand),
        fillPath: generateDiamondPath(x, y, width, height),
        fill: element.fillColor,
      }

    case "ellipse":
      return {
        path: generateRoughEllipse(
          x + width / 2,
          y + height / 2,
          Math.abs(width) / 2,
          Math.abs(height) / 2,
          roughness,
          rand,
        ),
        fill: element.fillColor,
      }

    case "line": {
      // Check if we have bindings and need to update positions
      let startX = x
      let startY = y
      let endX = x + width
      let endY = y + height

      if (element.startBinding && allElements) {
        const boundElement = allElements.find((el) => el.id === element.startBinding?.elementId)
        if (boundElement) {
          const points = getConnectionPoints(boundElement)
          const point = points[element.startBinding.point]
          if (point) {
            startX = point.x
            startY = point.y
          }
        }
      }

      if (element.endBinding && allElements) {
        const boundElement = allElements.find((el) => el.id === element.endBinding?.elementId)
        if (boundElement) {
          const points = getConnectionPoints(boundElement)
          const point = points[element.endBinding.point]
          if (point) {
            endX = point.x
            endY = point.y
          }
        }
      }

      // Check if line would intersect with any shapes and needs curving
      if (element.controlPoint) {
        return {
          path: generateCurvedLine(startX, startY, endX, endY, element.controlPoint, roughness, rand),
          fill: "none",
        }
      }

      return {
        path: generateRoughLine(startX, startY, endX, endY, roughness, rand),
        fill: "none",
      }
    }

    case "arrow": {
      // Get actual start and end positions from bindings
      let startX = x
      let startY = y
      let endX = x + width
      let endY = y + height

      if (element.startBinding && allElements) {
        const boundElement = allElements.find((el) => el.id === element.startBinding?.elementId)
        if (boundElement) {
          const points = getConnectionPoints(boundElement)
          const point = points[element.startBinding.point]
          if (point) {
            startX = point.x
            startY = point.y
          }
        }
      }

      if (element.endBinding && allElements) {
        const boundElement = allElements.find((el) => el.id === element.endBinding?.elementId)
        if (boundElement) {
          const points = getConnectionPoints(boundElement)
          const point = points[element.endBinding.point]
          if (point) {
            endX = point.x
            endY = point.y
          }
        }
      }

      const arrowSize = Math.min(20, Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) / 4)

      // Check if arrow needs curving (has control point or intersects shapes)
      if (element.controlPoint) {
        return {
          path: [
            generateCurvedLine(startX, startY, endX, endY, element.controlPoint, roughness, rand),
            generateCurvedArrowHead(endX, endY, element.controlPoint, arrowSize, roughness, rand),
          ].join(" "),
          fill: "none",
        }
      }

      const angle = Math.atan2(endY - startY, endX - startX)

      return {
        path: [
          generateRoughLine(startX, startY, endX, endY, roughness, rand),
          generateArrowHead(endX, endY, angle, arrowSize, roughness, rand),
        ].join(" "),
        fill: "none",
      }
    }

    case "freehand":
      if (!element.points || element.points.length < 2) {
        return { path: "", fill: "none" }
      }

      let path = `M ${element.points[0].x} ${element.points[0].y}`
      for (let i = 1; i < element.points.length; i++) {
        const p0 = element.points[i - 1]
        const p1 = element.points[i]
        const midX = (p0.x + p1.x) / 2
        const midY = (p0.y + p1.y) / 2
        path += ` Q ${p0.x} ${p0.y} ${midX} ${midY}`
      }
      const last = element.points[element.points.length - 1]
      path += ` L ${last.x} ${last.y}`

      return { path, fill: "none" }

    default:
      return { path: "", fill: "none" }
  }
}

// Get bounding box considering selection handles
export function getElementBounds(element: CanvasElement): {
  x: number
  y: number
  width: number
  height: number
} {
  if (element.type === "freehand" && element.points) {
    const xs = element.points.map((p) => p.x)
    const ys = element.points.map((p) => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
  }

  const { x, y, width, height } = element
  return {
    x: Math.min(x, x + width),
    y: Math.min(y, y + height),
    width: Math.abs(width),
    height: Math.abs(height),
  }
}

export function getConnectionPoints(element: CanvasElement): Record<ConnectionPoint, Point> {
  const bounds = getElementBounds(element)
  const centerX = bounds.x + bounds.width / 2
  const centerY = bounds.y + bounds.height / 2

  return {
    top: { x: centerX, y: bounds.y },
    right: { x: bounds.x + bounds.width, y: centerY },
    bottom: { x: centerX, y: bounds.y + bounds.height },
    left: { x: bounds.x, y: centerY },
    center: { x: centerX, y: centerY },
  }
}

export function findNearestConnectionPoint(
  point: Point,
  element: CanvasElement,
  threshold = 20,
): { point: ConnectionPoint; distance: number; position: Point } | null {
  const connectionPoints = getConnectionPoints(element)
  let nearest: { point: ConnectionPoint; distance: number; position: Point } | null = null

  for (const [name, pos] of Object.entries(connectionPoints)) {
    const distance = Math.sqrt((point.x - pos.x) ** 2 + (point.y - pos.y) ** 2)
    if (distance < threshold && (!nearest || distance < nearest.distance)) {
      nearest = { point: name as ConnectionPoint, distance, position: pos }
    }
  }

  return nearest
}

export function getResizeHandles(element: CanvasElement): { position: string; x: number; y: number; cursor: string }[] {
  if (element.type === "line" || element.type === "arrow") {
    return [
      { position: "start", x: element.x, y: element.y, cursor: "move" },
      { position: "end", x: element.x + element.width, y: element.y + element.height, cursor: "move" },
    ]
  }

  const bounds = getElementBounds(element)

  return [
    { position: "nw", x: bounds.x, y: bounds.y, cursor: "nwse-resize" },
    { position: "n", x: bounds.x + bounds.width / 2, y: bounds.y, cursor: "ns-resize" },
    { position: "ne", x: bounds.x + bounds.width, y: bounds.y, cursor: "nesw-resize" },
    { position: "e", x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2, cursor: "ew-resize" },
    { position: "se", x: bounds.x + bounds.width, y: bounds.y + bounds.height, cursor: "nwse-resize" },
    { position: "s", x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height, cursor: "ns-resize" },
    { position: "sw", x: bounds.x, y: bounds.y + bounds.height, cursor: "nesw-resize" },
    { position: "w", x: bounds.x, y: bounds.y + bounds.height / 2, cursor: "ew-resize" },
  ]
}

export function lineIntersectsElement(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  element: CanvasElement,
  padding = 10,
): boolean {
  const bounds = getElementBounds(element)
  const left = bounds.x - padding
  const right = bounds.x + bounds.width + padding
  const top = bounds.y - padding
  const bottom = bounds.y + bounds.height + padding

  // Check if line passes through bounding box
  // Using line-rectangle intersection algorithm
  const dx = x2 - x1
  const dy = y2 - y1

  let tmin = 0
  let tmax = 1

  // Check x bounds
  if (dx !== 0) {
    const t1 = (left - x1) / dx
    const t2 = (right - x1) / dx
    tmin = Math.max(tmin, Math.min(t1, t2))
    tmax = Math.min(tmax, Math.max(t1, t2))
  } else if (x1 < left || x1 > right) {
    return false
  }

  // Check y bounds
  if (dy !== 0) {
    const t1 = (top - y1) / dy
    const t2 = (bottom - y1) / dy
    tmin = Math.max(tmin, Math.min(t1, t2))
    tmax = Math.min(tmax, Math.max(t1, t2))
  } else if (y1 < top || y1 > bottom) {
    return false
  }

  return tmax >= tmin
}

export function calculateControlPoint(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  allElements: CanvasElement[],
  excludeIds: string[],
): Point | undefined {
  // Find elements that the line would pass through
  const intersectingElements = allElements.filter(
    (el) =>
      !excludeIds.includes(el.id) &&
      el.type !== "line" &&
      el.type !== "arrow" &&
      el.type !== "freehand" &&
      el.type !== "text" &&
      lineIntersectsElement(startX, startY, endX, endY, el),
  )

  if (intersectingElements.length === 0) {
    return undefined
  }

  // Calculate midpoint
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2

  // Calculate perpendicular offset direction
  const dx = endX - startX
  const dy = endY - startY
  const len = Math.sqrt(dx * dx + dy * dy)

  if (len === 0) return undefined

  // Perpendicular unit vector
  const perpX = -dy / len
  const perpY = dx / len

  // Find the best offset distance
  let bestOffset = 0
  let maxClearance = 0

  // Try offsets in both directions
  for (const sign of [1, -1]) {
    for (let offset = 50; offset <= 200; offset += 25) {
      const testX = midX + perpX * offset * sign
      const testY = midY + perpY * offset * sign

      // Check if this control point avoids all intersecting elements
      let minDist = Number.POSITIVE_INFINITY
      for (const el of intersectingElements) {
        const bounds = getElementBounds(el)
        const centerX = bounds.x + bounds.width / 2
        const centerY = bounds.y + bounds.height / 2
        const dist = Math.sqrt((testX - centerX) ** 2 + (testY - centerY) ** 2)
        minDist = Math.min(minDist, dist - Math.max(bounds.width, bounds.height) / 2)
      }

      if (minDist > maxClearance) {
        maxClearance = minDist
        bestOffset = offset * sign
      }
    }
  }

  if (bestOffset === 0) {
    bestOffset = 80 // Default offset
  }

  return {
    x: midX + perpX * bestOffset,
    y: midY + perpY * bestOffset,
  }
}

// Check if point is inside element
export function isPointInElement(point: Point, element: CanvasElement, padding = 5): boolean {
  const bounds = getElementBounds(element)

  if (element.type === "line" || element.type === "arrow") {
    const x1 = element.x
    const y1 = element.y
    const x2 = element.x + element.width
    const y2 = element.y + element.height

    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    if (len === 0) return false

    const t = Math.max(0, Math.min(1, ((point.x - x1) * (x2 - x1) + (point.y - y1) * (y2 - y1)) / len ** 2))
    const projX = x1 + t * (x2 - x1)
    const projY = y1 + t * (y2 - y1)

    const dist = Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2)
    return dist < padding + element.strokeWidth
  }

  if (element.type === "freehand" && element.points) {
    for (let i = 1; i < element.points.length; i++) {
      const p1 = element.points[i - 1]
      const p2 = element.points[i]
      const len = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
      if (len === 0) continue

      const t = Math.max(
        0,
        Math.min(1, ((point.x - p1.x) * (p2.x - p1.x) + (point.y - p1.y) * (p2.y - p1.y)) / len ** 2),
      )
      const projX = p1.x + t * (p2.x - p1.x)
      const projY = p1.y + t * (p2.y - p1.y)

      const dist = Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2)
      if (dist < padding + element.strokeWidth) return true
    }
    return false
  }

  return (
    point.x >= bounds.x - padding &&
    point.x <= bounds.x + bounds.width + padding &&
    point.y >= bounds.y - padding &&
    point.y <= bounds.y + bounds.height + padding
  )
}
