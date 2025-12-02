"use client"

import type React from "react"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { InfiniteCanvas } from "./infinite-canvas"
import { CollapsibleToolbar } from "./collapsible-toolbar"
import { CollapsiblePropertyPanel } from "./collapsible-property-panel"
import { ZoomControls } from "./zoom-controls"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { exportPNG, exportSVG, generateThumbnail } from "@/lib/file-utils"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

import { createProject, saveProject, updateProjectShare } from "@/actions/project"
import { TopBar } from "./top-bar"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Data } from "@/types/canvas-types"

interface DrawingAppProps {
  projectId?: string
  initialData?: Data
  projectName?: string
  isOwner?: boolean
  canEdit?: boolean
  isPublic?: boolean
  publicPermission?: string
}

export function DrawingApp({
  projectId,
  initialData,
  projectName = "Untitled Project",
  isOwner = true,
  canEdit = true,
  isPublic = false,
  publicPermission = "VIEW",
}: DrawingAppProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const forceNew = searchParams?.get("new") === "true"
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
  } = useCanvasState(initialData, projectId, forceNew)

  const [isDark, setIsDark] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async (name: string, asNew: boolean = false) => {
    try {
      const thumbnail = await generateThumbnail(state.elements, state.backgroundColor)
      
      const projectData = {
        elements: state.elements,
        zoom: state.zoom,
        panOffset: state.panOffset,
        backgroundColor: state.backgroundColor,
      }

      if (projectId && !asNew) {
        await saveProject(projectId, projectData, thumbnail)
        toast.success("Project saved")
      } else {
        const newProject = await createProject(name, projectData, thumbnail)
        toast.success("Project created")
        router.push(`/board/${newProject.id}`)
      }
    } catch (error) {
      toast.error("Failed to save project")
      console.error(error)
    }
  }

  const handleShare = async (isPublic: boolean, permission: "VIEW" | "EDIT") => {
    if (!projectId) return
    try {
      await updateProjectShare(projectId, isPublic, permission)
      toast.success("Share settings updated")
    } catch (error) {
      toast.error("Failed to update share settings")
    }
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const onSetIsDark = useEffectEvent((dark: boolean) => {
    setIsDark(dark)
  })

  // Theme handling
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const dark = stored === "dark" || (!stored && prefersDark)
    onSetIsDark(dark)
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
    <div className="h-screen w-screen overflow-hidden relative">
      <TopBar
        projectId={projectId}
        projectName={projectName}
        isOwner={isOwner}
        canEdit={canEdit}
        isPublic={isPublic}
        publicPermission={publicPermission}
        onSave={handleSave}
        onShare={handleShare}
      />

      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      {canEdit && (
        <>
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
        </>
      )}

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
        tool={canEdit ? state.tool : "select"}
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
        readOnly={!canEdit}
      />
    </div>
  )
}
