"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { InfiniteCanvas } from "./infinite-canvas"
import { CollapsibleToolbar } from "./collapsible-toolbar"
import { CollapsiblePropertyPanel } from "./collapsible-property-panel"
import { ZoomControls } from "./zoom-controls"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { exportPNG, exportSVG } from "@/lib/file-utils"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

export function DrawingApp() {
  const {
    state,
    setTool,
    setZoom,
    setPanOffset,
    setSelectedIds,
    addElement,
    updateElement,
    deleteElements,
    duplicateElements,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    setOpacity,
    setRoughness,
    setBackgroundColor,
    setStrokeStyle,
    setEdgeStyle,
    setFontSize,
    setTextAlign,
    sendToBack,
    sendBackward,
    bringForward,
    bringToFront,
    saveToFile,
    loadFromFile,
    clearCanvas,
    undo,
    redo,
    pushHistory,
  } = useCanvasState()

  const [isDark, setIsDark] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Theme handling
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const dark = stored === "dark" || (!stored && prefersDark)
    setIsDark(dark)
    document.documentElement.classList.toggle("dark", dark)
  }, [])

  const toggleDark = () => {
    setIsDark((prev) => {
      const newValue = !prev
      localStorage.setItem("theme", newValue ? "dark" : "light")
      document.documentElement.classList.toggle("dark", newValue)
      return newValue
    })
  }

  const selectedElement =
    state.selectedIds.length === 1 ? state.elements.find((el) => el.id === state.selectedIds[0]) : undefined

  // Use extracted keyboard shortcuts hook
  useKeyboardShortcuts({
    setTool,
    undo,
    redo,
    setZoom,
    setPanOffset,
    zoom: state.zoom,
    selectedIds: state.selectedIds,
    sendToBack,
    sendBackward,
    bringForward,
    bringToFront,
    duplicateElements,
  })

  const handleLoad = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      loadFromFile(file)
    }
    e.target.value = ""
  }

  const handleExportPNG = () => {
    exportPNG(state.elements, state.backgroundColor)
  }

  const handleExportSVG = () => {
    exportSVG(state.elements, state.backgroundColor)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(5, state.zoom + 0.25))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(0.1, state.zoom - 0.25))
  }

  const handleZoomReset = () => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      <CollapsibleToolbar
        currentTool={state.tool}
        onToolChange={setTool}
        onUndo={undo}
        onRedo={redo}
        onSave={saveToFile}
        onLoad={handleLoad}
        onClear={clearCanvas}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        isDark={isDark}
        onToggleDark={toggleDark}
        backgroundColor={state.backgroundColor}
        onBackgroundChange={setBackgroundColor}
      />

      <CollapsiblePropertyPanel
        strokeColor={state.strokeColor}
        fillColor={state.fillColor}
        strokeWidth={state.strokeWidth}
        opacity={state.opacity}
        roughness={state.roughness}
        strokeStyle={state.strokeStyle}
        edgeStyle={state.edgeStyle}
        fontSize={state.fontSize}
        textAlign={state.textAlign}
        selectedType={selectedElement?.type}
        onStrokeColorChange={setStrokeColor}
        onFillColorChange={setFillColor}
        onStrokeWidthChange={setStrokeWidth}
        onOpacityChange={setOpacity}
        onRoughnessChange={setRoughness}
        onStrokeStyleChange={setStrokeStyle}
        onEdgeStyleChange={setEdgeStyle}
        onFontSizeChange={setFontSize}
        onTextAlignChange={setTextAlign}
      />

      <ZoomControls
        zoom={state.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />

      <InfiniteCanvas
        elements={state.elements}
        selectedIds={state.selectedIds}
        zoom={state.zoom}
        panOffset={state.panOffset}
        tool={state.tool}
        strokeColor={state.strokeColor}
        fillColor={state.fillColor}
        strokeWidth={state.strokeWidth}
        opacity={state.opacity}
        roughness={state.roughness}
        backgroundColor={state.backgroundColor}
        strokeStyle={state.strokeStyle}
        edgeStyle={state.edgeStyle}
        fontSize={state.fontSize}
        onPanChange={setPanOffset}
        onZoomChange={setZoom}
        onSelectionChange={setSelectedIds}
        onAddElement={addElement}
        onUpdateElement={updateElement}
        onDeleteElements={deleteElements}
        onFinishDrawing={pushHistory}
      />
    </div>
  )
}
