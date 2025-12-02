"use client"

import type React from "react"
import { useRef, useState, useEffect, type RefObject } from "react"
import type { CanvasElement, Point, Tool, ConnectionPoint, StrokeStyle, EdgeStyle } from "@/types/canvas-types"
import {
  isPointInElement,
  getElementBounds,
  findNearestConnectionPoint,
  getResizeHandles,
  calculateControlPoint,
} from "@/lib/rough-renderer"
import { CanvasGrid } from "./canvas-grid"
import { CanvasElementLayer } from "./canvas-element-layer"
import { SelectionOverlay } from "./selection-overlay"
import { ConnectionPointsLayer } from "./connection-points-layer"
import { TextInputOverlay } from "./text-input-overlay"

interface InfiniteCanvasProps {
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
}

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | null

export function InfiniteCanvas({
  elements,
  selectedIds,
  zoom,
  panOffset,
  tool,
  strokeColor,
  fillColor,
  strokeWidth,
  opacity,
  roughness,
  backgroundColor,
  strokeStyle,
  edgeStyle,
  fontSize,
  onPanChange,
  onZoomChange,
  onSelectionChange,
  onAddElement,
  onUpdateElement,
  onDeleteElements,
  onFinishDrawing,
  readOnly = false,
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Point | null>(null)
  const [currentElementId, setCurrentElementId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 })
  const [isMoving, setIsMoving] = useState(false)
  const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  })
  const textInputRef = useRef<HTMLTextAreaElement>(null) as RefObject<HTMLTextAreaElement>

  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null)
  const [resizeStartBounds, setResizeStartBounds] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  const [hoveredConnection, setHoveredConnection] = useState<{
    elementId: string
    point: ConnectionPoint
    position: Point
  } | null>(null)

  const [startConnection, setStartConnection] = useState<{
    elementId: string
    point: ConnectionPoint
    position: Point
  } | null>(null)

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = (screenX: number, screenY: number): Point => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }

    return {
      x: (screenX - rect.left - panOffset.x) / zoom,
      y: (screenY - rect.top - panOffset.y) / zoom,
    }
  }

  // Handle wheel for zoom and pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()

    if (e.ctrlKey || e.metaKey) {
      // Zoom with Ctrl+scroll
      const delta = -e.deltaY * 0.001
      const newZoom = Math.max(0.1, Math.min(5, zoom + delta * zoom))

      // Zoom towards cursor
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const cursorX = e.clientX - rect.left
        const cursorY = e.clientY - rect.top

        const scale = newZoom / zoom
        const newPanX = cursorX - (cursorX - panOffset.x) * scale
        const newPanY = cursorY - (cursorY - panOffset.y) * scale

        onPanChange({ x: newPanX, y: newPanY })
      }

      onZoomChange(newZoom)
    } else {
      // Pan
      onPanChange({
        x: panOffset.x - e.deltaX,
        y: panOffset.y - e.deltaY,
      })
    }
  }

  // Find element at point
  const getElementAtPoint = (point: Point): CanvasElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      if (isPointInElement(point, elements[i])) {
        return elements[i]
      }
    }
    return null
  }

  const getResizeHandleAtPoint = (point: Point): ResizeHandle => {
    if (selectedIds.length !== 1) return null
    const element = elements.find((el) => el.id === selectedIds[0])
    if (!element || element.type === "freehand" || element.type === "text") return null

    const handles = getResizeHandles(element)
    const handleSize = 8 / zoom

    for (const handle of handles) {
      const dist = Math.sqrt((point.x - handle.x) ** 2 + (point.y - handle.y) ** 2)
      if (dist < handleSize) {
        return handle.position as ResizeHandle
      }
    }
    return null
  }

  const findNearestSnapPoint = (
    point: Point,
    excludeId?: string,
  ): { elementId: string; point: ConnectionPoint; position: Point } | null => {
    const snapThreshold = 25 / zoom

    for (const el of elements) {
      if (el.id === excludeId) continue
      if (el.type === "line" || el.type === "arrow" || el.type === "freehand" || el.type === "text") continue

      const nearest = findNearestConnectionPoint(point, el, snapThreshold)
      if (nearest) {
        return { elementId: el.id, point: nearest.point, position: nearest.position }
      }
    }
    return null
  }

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return

    const point = screenToCanvas(e.clientX, e.clientY)
    setDragStart(point)
    setIsDragging(true)

    if (tool === "pan") {
      return
    }

    if (readOnly) {
      if (tool === "select") {
        const element = getElementAtPoint(point)
        if (element) {
          if (!selectedIds.includes(element.id)) {
            onSelectionChange([element.id])
          }
        } else {
          onSelectionChange([])
        }
      }
      return
    }

    if (tool === "select") {
      const handle = getResizeHandleAtPoint(point)
      if (handle && selectedIds.length === 1) {
        setResizeHandle(handle)
        const element = elements.find((el) => el.id === selectedIds[0])
        if (element) {
          setResizeStartBounds(getElementBounds(element))
        }
        return
      }

      const element = getElementAtPoint(point)
      if (element) {
        if (!selectedIds.includes(element.id)) {
          onSelectionChange([element.id])
        }
        setIsMoving(true)
        setDragOffset({
          x: point.x - element.x,
          y: point.y - element.y,
        })
      } else {
        onSelectionChange([])
      }
      return
    }

    if (tool === "eraser") {
      const element = getElementAtPoint(point)
      if (element) {
        onDeleteElements([element.id])
      }
      return
    }

    if (tool === "text") {
      setTextInput({ x: point.x, y: point.y, visible: true })
      setTimeout(() => textInputRef.current?.focus(), 0)
      return
    }

    if (["rectangle", "ellipse", "diamond", "line", "arrow", "freehand"].includes(tool)) {
      let startBinding: { elementId: string; point: ConnectionPoint } | undefined
      let actualStartX = point.x
      let actualStartY = point.y

      // For arrow/line, check for snap point at start
      if (tool === "arrow" || tool === "line") {
        const snapPoint = findNearestSnapPoint(point)
        if (snapPoint) {
          startBinding = { elementId: snapPoint.elementId, point: snapPoint.point }
          actualStartX = snapPoint.position.x
          actualStartY = snapPoint.position.y
          setStartConnection(snapPoint)
        }
      }

      const newElement: Omit<CanvasElement, "id" | "seed"> = {
        type: tool as CanvasElement["type"],
        x: actualStartX,
        y: actualStartY,
        width: 0,
        height: 0,
        strokeColor,
        fillColor: tool === "freehand" || tool === "line" || tool === "arrow" ? "transparent" : fillColor,
        strokeWidth,
        opacity,
        rotation: 0,
        roughness,
        points: tool === "freehand" ? [{ x: actualStartX, y: actualStartY }] : undefined,
        startBinding,
        strokeStyle,
        edgeStyle,
      }

      const id = onAddElement(newElement)
      setCurrentElementId(id)
    }
  }

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    const point = screenToCanvas(e.clientX, e.clientY)

    if ((tool === "arrow" || tool === "line") && isDragging && currentElementId) {
      const snapPoint = findNearestSnapPoint(point, currentElementId)
      setHoveredConnection(snapPoint)
    }

    if (!isDragging || !dragStart) return

    if (tool === "pan") {
      onPanChange({
        x: panOffset.x + (e.clientX - containerRef.current!.getBoundingClientRect().left - panOffset.x - dragStart.x * zoom),
        y: panOffset.y + (e.clientY - containerRef.current!.getBoundingClientRect().top - panOffset.y - dragStart.y * zoom),
      })
      return
    }

    if (resizeHandle && selectedIds.length === 1 && resizeStartBounds) {
      const element = elements.find((el) => el.id === selectedIds[0])
      if (!element) return

      const dx = point.x - dragStart.x
      const dy = point.y - dragStart.y

      let newX = element.x
      let newY = element.y
      let newWidth = element.width
      let newHeight = element.height

      if (resizeHandle.includes("w")) {
        newX = resizeStartBounds.x + dx
        newWidth = resizeStartBounds.width - dx
      }
      if (resizeHandle.includes("e")) {
        newWidth = resizeStartBounds.width + dx
      }
      if (resizeHandle.includes("n")) {
        newY = resizeStartBounds.y + dy
        newHeight = resizeStartBounds.height - dy
      }
      if (resizeHandle.includes("s")) {
        newHeight = resizeStartBounds.height + dy
      }

      onUpdateElement(selectedIds[0], { x: newX, y: newY, width: newWidth, height: newHeight })
      return
    }

    if (tool === "select" && isMoving && selectedIds.length > 0) {
      selectedIds.forEach((id) => {
        const element = elements.find((el) => el.id === id)
        if (element) {
          onUpdateElement(id, {
            x: point.x - dragOffset.x,
            y: point.y - dragOffset.y,
          })
        }
      })

      setDragStart(point)
      return
    }

    if (tool === "eraser") {
      const element = getElementAtPoint(point)
      if (element) {
        onDeleteElements([element.id])
      }
      return
    }

    if (currentElementId) {
      const element = elements.find((el) => el.id === currentElementId)
      if (!element) return

      if (tool === "freehand" && element.points) {
        onUpdateElement(currentElementId, {
          points: [...element.points, { x: point.x, y: point.y }],
        })
      } else if (tool === "arrow" || tool === "line") {
        let endX = point.x
        let endY = point.y

        if (hoveredConnection) {
          endX = hoveredConnection.position.x
          endY = hoveredConnection.position.y
        }

        onUpdateElement(currentElementId, {
          width: endX - element.x,
          height: endY - element.y,
        })
      } else {
        onUpdateElement(currentElementId, {
          width: point.x - element.x,
          height: point.y - element.y,
        })
      }
    }
  }

  const handlePointerUp = () => {
    if (currentElementId && (tool === "arrow" || tool === "line")) {
      const element = elements.find((el) => el.id === currentElementId)

      if (element) {
        const updates: Partial<CanvasElement> = {}

        if (hoveredConnection) {
          updates.endBinding = { elementId: hoveredConnection.elementId, point: hoveredConnection.point }
          updates.width = hoveredConnection.position.x - element.x
          updates.height = hoveredConnection.position.y - element.y
        }

        const startX = element.x
        const startY = element.y
        const endX = element.x + (updates.width ?? element.width)
        const endY = element.y + (updates.height ?? element.height)

        const excludeIds = [currentElementId]
        if (element.startBinding) excludeIds.push(element.startBinding.elementId)
        if (updates.endBinding) excludeIds.push(updates.endBinding.elementId)
        if (hoveredConnection) excludeIds.push(hoveredConnection.elementId)

        const controlPoint = calculateControlPoint(startX, startY, endX, endY, elements, excludeIds)

        if (controlPoint) {
          updates.controlPoint = controlPoint
        }

        if (Object.keys(updates).length > 0) {
          onUpdateElement(currentElementId, updates)
        }
      }
    }

    if (currentElementId) {
      onFinishDrawing()
    }
    setIsDragging(false)
    setDragStart(null)
    setCurrentElementId(null)
    setIsMoving(false)
    setResizeHandle(null)
    setResizeStartBounds(null)
    setHoveredConnection(null)
    setStartConnection(null)
  }

  // Handle text input
  const handleTextSubmit = () => {
    const text = textInputRef.current?.value.trim()
    if (text) {
      onAddElement({
        type: "text",
        x: textInput.x,
        y: textInput.y,
        width: 200,
        height: 30,
        text,
        strokeColor,
        fillColor: "transparent",
        strokeWidth: 1,
        opacity,
        fontSize,
        rotation: 0,
        roughness: 0,
      })
      onFinishDrawing()
    }
    setTextInput({ ...textInput, visible: false })
    if (textInputRef.current) {
      textInputRef.current.value = ""
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (textInput.visible) {
        if (e.key === "Escape") {
          setTextInput({ ...textInput, visible: false })
        } else if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          handleTextSubmit()
        }
        return
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          onDeleteElements(selectedIds)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIds, textInput, onDeleteElements])

  const getCursor = () => {
    if (tool === "pan") return "grab"
    if (tool === "select") {
      return "default"
    }
    return "crosshair"
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor,
        cursor: getCursor(),
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <CanvasGrid zoom={zoom} panOffset={panOffset} />

      <CanvasElementLayer elements={elements} panOffset={panOffset} zoom={zoom} />

      <ConnectionPointsLayer
        elements={elements}
        tool={tool}
        zoom={zoom}
        panOffset={panOffset}
        hoveredConnection={hoveredConnection}
        startConnection={startConnection}
      />

      <SelectionOverlay selectedIds={selectedIds} elements={elements} zoom={zoom} panOffset={panOffset} />

      <TextInputOverlay
        visible={textInput.visible}
        x={textInput.x}
        y={textInput.y}
        zoom={zoom}
        panOffset={panOffset}
        fontSize={fontSize}
        textInputRef={textInputRef}
        onBlur={handleTextSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleTextSubmit()
          }
        }}
      />
    </div>
  )
}
