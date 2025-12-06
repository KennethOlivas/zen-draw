import { useState, type RefObject } from "react"
import type { CanvasElement, Point, Tool, ConnectionPoint, StrokeStyle, EdgeStyle } from "@/types/canvas-types"
import {
    isPointInElement,
    getElementBounds,
    getResizeHandles,
    calculateControlPoint,
} from "@/lib/rough-renderer"
import type { ResizeHandle } from "../types"

interface UseCanvasInteractionProps {
    elements: CanvasElement[]
    selectedIds: string[]
    tool: Tool
    zoom: number
    panOffset: Point
    readOnly: boolean
    snapToGrid: boolean

    screenToCanvas: (x: number, y: number) => Point
    snapPoint: (point: Point) => Point
    findNearestSnapPoint: (point: Point, excludeId?: string) => { elementId: string; point: ConnectionPoint; position: Point } | null

    // Actions
    onSelectionChange: (ids: string[]) => void
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
    onAddElement: (element: Omit<CanvasElement, "id" | "seed">) => string
    onFinishDrawing: () => void
    onDeleteElements: (ids: string[]) => void

    // Prop values for new elements
    strokeColor: string
    fillColor: string
    strokeWidth: number
    opacity: number
    roughness: number
    strokeStyle: StrokeStyle
    edgeStyle: EdgeStyle

    textInputRef: RefObject<HTMLTextAreaElement>
}

export function useCanvasInteraction({
    elements,
    selectedIds,
    tool,
    zoom,
    readOnly,
    snapToGrid: snapEnabled, // rename for internal consistency if needed, but keeping prop name

    screenToCanvas,
    snapPoint,
    findNearestSnapPoint,
    onSelectionChange,
    onUpdateElement,
    onAddElement,
    onFinishDrawing,
    onDeleteElements,
    strokeColor,
    fillColor,
    strokeWidth,
    opacity,
    roughness,
    strokeStyle,
    edgeStyle,
    textInputRef,
}: UseCanvasInteractionProps) {
    // State
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState<Point | null>(null)
    const [currentElementId, setCurrentElementId] = useState<string | null>(null)
    const [isMoving, setIsMoving] = useState(false)
    const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({
        x: 0,
        y: 0,
        visible: false,
    })
    const [editingElementId, setEditingElementId] = useState<string | null>(null)
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
    const [selectionBox, setSelectionBox] = useState<{
        start: Point
        current: Point
        isVisible: boolean
    } | null>(null)

    // Helpers
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

    // Event Handlers
    const handleDoubleClick = (e: React.MouseEvent) => {
        if (readOnly) return

        const point = screenToCanvas(e.clientX, e.clientY)
        const element = getElementAtPoint(point)

        if (element && element.type === "text") {
            setEditingElementId(element.id)
            setTextInput({ x: element.x, y: element.y, visible: true })

            setTimeout(() => {
                if (textInputRef.current) {
                    textInputRef.current.value = element.text || ""
                    textInputRef.current.style.height = "auto"
                    textInputRef.current.style.height = textInputRef.current.scrollHeight + "px"
                    textInputRef.current.style.width = "auto"
                    textInputRef.current.style.width = Math.max(100, textInputRef.current.scrollWidth) + "px"
                    textInputRef.current.focus()
                    textInputRef.current.select()
                }
            }, 0)
        }
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0) return

        let point = screenToCanvas(e.clientX, e.clientY)
        const rawPoint = point

        // Apply snapping for tools that create new elements (except freehand)
        if (["rectangle", "ellipse", "diamond", "line", "arrow", "text"].includes(tool)) {
            point = snapPoint(point)
        }

        setDragStart(point)
        setIsDragging(true)
            ; (e.target as Element).setPointerCapture(e.pointerId)

        if (tool === "pan") {
            setDragStart(rawPoint) // Don't snap for panning
            return
        }

        if (readOnly) {
            if (tool === "select") {
                const element = getElementAtPoint(rawPoint)
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
            const handle = getResizeHandleAtPoint(rawPoint)
            if (handle && selectedIds.length === 1) {
                setResizeHandle(handle)
                const element = elements.find((el) => el.id === selectedIds[0])
                if (element) {
                    setResizeStartBounds(getElementBounds(element))
                }
                setDragStart(rawPoint)
                return
            }

            const element = getElementAtPoint(rawPoint)
            if (element) {
                if (!selectedIds.includes(element.id)) {
                    onSelectionChange([element.id]) // Clicked unselected element: select it (and deselect others)
                }
                // If clicked on already selected element, keep selection (to allow dragging group)

                setIsMoving(true)
                // For moving, we use delta from dragStart, so we capture the start point (snapped if needed)
                setDragStart(snapEnabled ? snapPoint(rawPoint) : rawPoint)
            } else {
                // Clicked on empty space
                onSelectionChange([])
                setSelectionBox({
                    start: rawPoint,
                    current: rawPoint,
                    isVisible: true,
                })
                setDragStart(rawPoint)
            }
            return
        }

        if (tool === "eraser") {
            const element = getElementAtPoint(rawPoint)
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

            // For arrow/line, check for snap point at start - this takes precedence over grid snapping
            if (tool === "arrow" || tool === "line") {
                const snapPoint = findNearestSnapPoint(rawPoint)
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

    const handlePointerMove = (e: React.PointerEvent) => {
        let point = screenToCanvas(e.clientX, e.clientY)
        const rawPoint = point

        // Snap for certain operations
        if (snapEnabled && !["freehand", "pan", "eraser"].includes(tool)) {
            point = snapPoint(point)
        }

        if ((tool === "arrow" || tool === "line") && isDragging && currentElementId) {
            const snapPoint = findNearestSnapPoint(rawPoint, currentElementId)
            setHoveredConnection(snapPoint)
        }

        if (resizeHandle && selectedIds.length === 1 && resizeStartBounds) {
            const element = elements.find((el) => el.id === selectedIds[0])
            if (!element) return

            let newX = element.x
            let newY = element.y
            let newWidth = element.width
            let newHeight = element.height

            if (resizeHandle === "start") {
                const snapPoint = findNearestSnapPoint(rawPoint, currentElementId || selectedIds[0])
                if (snapPoint) {
                    setHoveredConnection(snapPoint)
                    newX = snapPoint.position.x
                    newY = snapPoint.position.y
                } else {
                    setHoveredConnection(null)
                    newX = point.x
                    newY = point.y
                }

                const endX = element.x + element.width
                const endY = element.y + element.height
                newWidth = endX - newX
                newHeight = endY - newY
            } else if (resizeHandle === "end") {
                const snapPoint = findNearestSnapPoint(rawPoint, currentElementId || selectedIds[0])
                if (snapPoint) {
                    setHoveredConnection(snapPoint)
                    const endX = snapPoint.position.x
                    const endY = snapPoint.position.y
                    newWidth = endX - element.x
                    newHeight = endY - element.y
                } else {
                    setHoveredConnection(null)
                    newWidth = point.x - element.x
                    newHeight = point.y - element.y
                }
            } else {
                // Standard bounding box resizing
                const bounds = resizeStartBounds || { x: element.x, y: element.y, width: element.width, height: element.height }
                const right = bounds.x + bounds.width
                const bottom = bounds.y + bounds.height

                if (resizeHandle?.includes("w")) {
                    newX = point.x
                    newWidth = right - newX
                }
                if (resizeHandle?.includes("n")) {
                    newY = point.y
                    newHeight = bottom - newY
                }
                if (resizeHandle?.includes("e")) {
                    newWidth = point.x - bounds.x
                }
                if (resizeHandle?.includes("s")) {
                    newHeight = point.y - bounds.y
                }
            }

            if (newWidth !== element.width || newHeight !== element.height || newX !== element.x || newY !== element.y) {
                onUpdateElement(element.id, { x: newX, y: newY, width: newWidth, height: newHeight })
            }
            return
        }

        if (tool === "select") {
            if (selectionBox?.isVisible) {
                setSelectionBox((prev) => prev ? ({ ...prev, current: rawPoint }) : null)

                // Calculate intersection with elements
                const x1 = Math.min(selectionBox.start.x, rawPoint.x)
                const y1 = Math.min(selectionBox.start.y, rawPoint.y)
                const x2 = Math.max(selectionBox.start.x, rawPoint.x)
                const y2 = Math.max(selectionBox.start.y, rawPoint.y)

                const intersectingIds: string[] = []

                elements.forEach(element => {
                    const bounds = getElementBounds(element)
                    const elementRight = bounds.x + bounds.width
                    const elementBottom = bounds.y + bounds.height

                    // Check overlap
                    const isIntersecting = !(
                        elementRight < x1 ||
                        bounds.x > x2 ||
                        elementBottom < y1 ||
                        bounds.y > y2
                    )

                    if (isIntersecting) {
                        intersectingIds.push(element.id)
                    }
                })

                if (intersectingIds.length !== selectedIds.length || !intersectingIds.every(id => selectedIds.includes(id))) {
                    onSelectionChange(intersectingIds)
                }

                return
            }

            if (isMoving && selectedIds.length > 0 && dragStart) {
                const currentPoint = snapEnabled ? snapPoint(rawPoint) : rawPoint
                const dx = currentPoint.x - dragStart.x
                const dy = currentPoint.y - dragStart.y

                if (dx !== 0 || dy !== 0) {
                    selectedIds.forEach((id) => {
                        const element = elements.find((el) => el.id === id)
                        if (element) {
                            onUpdateElement(id, {
                                x: element.x + dx,
                                y: element.y + dy,
                            })
                        }
                    })
                    setDragStart(currentPoint)
                }
                return
            }
        }

        if (tool === "eraser") {
            const element = getElementAtPoint(rawPoint)
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
                    points: [...element.points, { x: rawPoint.x, y: rawPoint.y }],
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

    const handlePointerUp = (e: React.PointerEvent) => {
        ; (e.target as Element).releasePointerCapture(e.pointerId)

        if ((currentElementId && (tool === "arrow" || tool === "line")) || (resizeHandle && (resizeHandle === "start" || resizeHandle === "end"))) {
            const id = currentElementId || selectedIds[0]
            const element = elements.find((el) => el.id === id)

            if (element) {
                const updates: Partial<CanvasElement> = {}

                if (hoveredConnection) {
                    if (resizeHandle === "start") {
                        updates.startBinding = { elementId: hoveredConnection.elementId, point: hoveredConnection.point }
                        updates.x = hoveredConnection.position.x
                        updates.y = hoveredConnection.position.y
                        updates.width = (element.x + element.width) - hoveredConnection.position.x
                        updates.height = (element.y + element.height) - hoveredConnection.position.y
                    } else {
                        updates.endBinding = { elementId: hoveredConnection.elementId, point: hoveredConnection.point }
                        updates.width = hoveredConnection.position.x - element.x
                        updates.height = hoveredConnection.position.y - element.y
                    }
                } else {
                    // Clear binding if not hovering a connection
                    if (resizeHandle === "start") {
                        updates.startBinding = undefined
                    } else if (resizeHandle === "end") {
                        updates.endBinding = undefined
                    }
                }

                const startX = updates.x ?? element.x
                const startY = updates.y ?? element.y
                const endX = startX + (updates.width ?? element.width)
                const endY = startY + (updates.height ?? element.height)

                const excludeIds = [id]
                const startBinding = updates.startBinding ?? element.startBinding
                const endBinding = updates.endBinding ?? element.endBinding

                if (startBinding) excludeIds.push(startBinding.elementId)
                if (endBinding) excludeIds.push(endBinding.elementId)
                if (hoveredConnection) excludeIds.push(hoveredConnection.elementId)

                const controlPoint = calculateControlPoint(startX, startY, endX, endY, elements, excludeIds)

                if (controlPoint) {
                    updates.controlPoint = controlPoint
                } else {
                    updates.controlPoint = undefined
                }

                if (Object.keys(updates).length > 0) {
                    onUpdateElement(id, updates)
                }
            }
        }

        if (currentElementId) {
            onFinishDrawing()
        }

        if (selectionBox?.isVisible) {
            setSelectionBox(null)
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

    return {
        // State exposed to View
        isDragging,
        textInput,
        editingElementId,
        resizeHandle,
        selectionBox,
        hoveredConnection,
        startConnection,

        // Setters if needed (mostly internal, but textInput needs reset)
        setTextInput,
        setEditingElementId,

        // Handlers
        handleDoubleClick,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    }
}
