"use client"

import type React from "react"
import { useRef, type RefObject } from "react"
import { CanvasGrid } from "../canvas-grid"
import { CanvasElementLayer } from "../canvas-element-layer"
import { SelectionOverlay } from "../selection-overlay"
import { ConnectionPointsLayer } from "../connection-points-layer"
import { TextInputOverlay } from "../text-input-overlay"
import type { InfiniteCanvasProps } from "./types"
import { useCanvasCoordinates } from "./hooks/use-canvas-coordinates"
import { useZoomPan } from "./hooks/use-zoom-pan"
import { useCanvasInteraction } from "./hooks/use-canvas-interaction"
import { useCanvasShortcuts } from "./hooks/use-canvas-shortcuts"
import { SelectionBoxGeometry } from "./components/selection-box-geometry"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"

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
    gridMode = "none",
    snapToGrid: snapEnabled = true,
    gridSize = 20,
    snapThreshold = 25,
    onCopy,
    onPaste,
    onCut,
    onBringToFront,
    onBringForward,
    onSendBackward,
    onSendToBack,
}: InfiniteCanvasProps & { // Extend props locally for now, or update types.ts
    onCopy?: () => void
    onPaste?: () => void
    onCut?: () => void
    onBringToFront?: () => void
    onBringForward?: () => void
    onSendBackward?: () => void
    onSendToBack?: () => void
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textInputRef = useRef<HTMLTextAreaElement>(null) as RefObject<HTMLTextAreaElement>

    // 1. Coordinates & Snapping
    const { snapPoint, screenToCanvas, findNearestSnapPoint } = useCanvasCoordinates({
        containerRef,
        zoom,
        panOffset,
        gridMode,
        snapToGrid: snapEnabled,
        gridSize,
        snapThreshold,
        elements,
    })

    // 2. Zoom & Pan
    const { handleWheel } = useZoomPan({
        containerRef,
        zoom,
        panOffset,
        onZoomChange,
        onPanChange,
    })

    // 3. Interactions (Pointer, Dragging, etc.)
    const interaction = useCanvasInteraction({
        elements,
        selectedIds,
        tool,
        zoom,
        panOffset,
        readOnly,
        snapToGrid: snapEnabled,

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
    })

    // 4. Text Input Logic (Needs access to interaction state and refs)
    const handleTextSubmit = () => {
        const text = textInputRef.current?.value.trim()
        if (text) {
            if (interaction.editingElementId) {
                onUpdateElement(interaction.editingElementId, { text })
            } else {
                onAddElement({
                    type: "text",
                    x: interaction.textInput.x,
                    y: interaction.textInput.y,
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
            }
            onFinishDrawing()
        }
        interaction.setTextInput({ ...interaction.textInput, visible: false })
        interaction.setEditingElementId(null)
        if (textInputRef.current) {
            textInputRef.current.value = ""
        }
    }

    const handleCancelText = () => {
        interaction.setTextInput({ ...interaction.textInput, visible: false })
        interaction.setEditingElementId(null)
    }

    // 5. Shortcuts
    useCanvasShortcuts({
        selectedIds,
        isTextInputVisible: interaction.textInput.visible,
        onDeleteElements,
        onTextSubmit: handleTextSubmit,
        onCancelText: handleCancelText,
    })

    const getCursor = () => {
        if (tool === "pan") return "grab"
        if (tool === "select") {
            return "default"
        }
        return "crosshair"
    }

    const handleContextMenu = () => {
        // We generally want the native behavior for the menu to open,
        // but we might want to ensure the item under cursor is selected
        // if it isn't already part of the selection.

        // Note: interaction.handlePointerDown usually handles selection,
        // but context menu (right click) might fire before or instead of pointer down depending on browser.
        // Radix ContextMenuTrigger handles the event.

        // However, we need to know IF we clicked on an element to decide what menu items to show?
        // OR we just show all items and disable some if no selection?
        // Let's rely on `selectedIds` state. If the user right-clicks an unselected element,
        // we should probably select it first.

        // This is tricky with declarative ContextMenu.
        // Let's implement a "pre-check" if possible, or just let the user ensure selection.
        // A common pattern is: right click selects the item if not already selected.

        if (readOnly) return

        // Ideally we select the element under cursor if not selected.
        // Since we can't easily access the internal hit test from here without refactoring,
        // we'll rely on the user having selected the item(s) first, or implementing a simple check.
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger disabled={tool !== 'select'}>
                <div
                    ref={containerRef}
                    className="relative w-full h-full overflow-hidden"
                    style={{
                        backgroundColor,
                        cursor: getCursor(),
                    }}
                    onDoubleClick={interaction.handleDoubleClick}
                    onWheel={handleWheel}
                    onPointerDown={interaction.handlePointerDown}
                    onPointerMove={interaction.handlePointerMove}
                    onPointerUp={interaction.handlePointerUp}
                    onPointerLeave={interaction.handlePointerUp}
                    onContextMenu={handleContextMenu}
                >
                    <CanvasGrid zoom={zoom} panOffset={panOffset} mode={gridMode} gridSize={gridSize} />

                    <CanvasElementLayer
                        elements={elements}
                        panOffset={panOffset}
                        zoom={zoom}
                        editingElementId={interaction.editingElementId}
                    />

                    <ConnectionPointsLayer
                        elements={elements}
                        tool={tool}
                        zoom={zoom}
                        panOffset={panOffset}
                        hoveredConnection={interaction.hoveredConnection}
                        startConnection={interaction.startConnection}
                    />

                    <SelectionOverlay
                        selectedIds={selectedIds}
                        elements={elements}
                        zoom={zoom}
                        panOffset={panOffset}
                    />

                    {interaction.selectionBox && (
                        <SelectionBoxGeometry
                            selectionBox={interaction.selectionBox}
                            zoom={zoom}
                            panOffset={panOffset}
                        />
                    )}

                    <TextInputOverlay
                        visible={interaction.textInput.visible}
                        x={interaction.textInput.x}
                        y={interaction.textInput.y}
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
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuItem inset onClick={onCut} disabled={selectedIds.length === 0}>
                    Cut
                    <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset onClick={onCopy} disabled={selectedIds.length === 0}>
                    Copy
                    <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset onClick={onPaste}>
                    Paste
                    <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem inset onClick={onBringToFront} disabled={selectedIds.length === 0}>
                    Bring to Front
                    <ContextMenuShortcut>Ctrl+Shift+]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset onClick={onBringForward} disabled={selectedIds.length === 0}>
                    Bring Forward
                    <ContextMenuShortcut>Ctrl+]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset onClick={onSendBackward} disabled={selectedIds.length === 0}>
                    Send Backward
                    <ContextMenuShortcut>Ctrl+[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset onClick={onSendToBack} disabled={selectedIds.length === 0}>
                    Send to Back
                    <ContextMenuShortcut>Ctrl+Shift+[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem inset onClick={() => onDeleteElements(selectedIds)} disabled={selectedIds.length === 0}>
                    Delete
                    <ContextMenuShortcut>Del</ContextMenuShortcut>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
