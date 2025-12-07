"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { InfiniteCanvas } from "./infinite-canvas"
import { CollapsibleToolbar } from "../tools/collapsible-toolbar"
import { CollapsiblePropertyPanel } from "../settings/property-panel"
import { RightSettingsMenu } from "../settings/right-settings-menu"
import { ZoomControls } from "../controls/zoom-controls"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { exportPNG, exportSVG, generateThumbnail } from "@/lib/file-utils"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

import { createProject, saveProject, updateProjectShare, renameProject } from "@/actions/project"
import { TopBar } from "../controls/top-bar"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Data } from "@/types/canvas-types"
import { useTheme } from "next-themes"
import { SettingsModal, type UserData } from "@/components/settings/settings-modal"
import { DEFAULT_PALETTES } from "@/constant/palettes"
import { DEFAULT_BACKGROUND_COLOR } from "@/constant/settings"

const DARK_BACKGROUNDS = [
  "#121212",
  "#161718",
  "#13171C",
  "#181605",
  "#1B1615",
]

interface DrawingAppProps {
  projectId?: string
  initialData?: Data
  projectName?: string
  isOwner?: boolean
  canEdit?: boolean
  isPublic?: boolean
  publicPermission?: string
  user?: UserData
}

export function DrawingApp({
  projectId,
  initialData,
  projectName = "Untitled Project",
  isOwner = true,
  canEdit = true,
  isPublic = false,
  publicPermission = "VIEW",
  user,
}: DrawingAppProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"user" | "app">("user");

  // Combine user palettes with defaults, putting user palettes first
  const userPalettes = user?.settings?.colorPalettes || [];
  const disableDefaultColors = user?.settings?.disableDefaultColors || false;
  // Filter out any default palettes that might be duplicated in user settings by name (optional but good practice)
  const defaultPalettes = DEFAULT_PALETTES.filter(
    (dp) => !userPalettes.some((up) => up.name === dp.name)
  );
  const palettes = [...userPalettes, ...defaultPalettes];

  const defaultBg = user?.settings?.defaultBackgroundColor || DEFAULT_BACKGROUND_COLOR;
  const gridSize = user?.settings?.gridSize || 20;
  const snapThreshold = user?.settings?.snapThreshold || 25;

  const canvasInitialData = {
    ...initialData,
    backgroundColor: initialData?.backgroundColor || defaultBg
  };

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
    setGridMode,
    setSnapToGrid,
  } = useCanvasState(canvasInitialData, projectId, forceNew)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async (name: string, asNew: boolean = false) => {
    // If user is not authenticated, save to local storage and redirect to login
    if (!user) {
      const projectData = {
        name,
        elements: state.elements,
        zoom: state.zoom,
        panOffset: state.panOffset,
        backgroundColor: state.backgroundColor,
      }
      localStorage.setItem("zen-draw-pending-project", JSON.stringify(projectData))
      toast.info("Please login to save your project")
      router.push(`/login?callbackUrl=/board?action=restore_pending`)
      return
    }

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
    } catch {
      toast.error("Failed to save project")
    }
  }

  // Check for pending save on mount
  useEffect(() => {
    const checkPendingSave = async () => {
      const action = searchParams?.get("action")
      if (action === "restore_pending" && user) {
        const pendingDataStr = localStorage.getItem("zen-draw-pending-project")
        if (pendingDataStr) {
          try {
            const pendingData = JSON.parse(pendingDataStr)

            // Create the project immediately
            const thumbnail = await generateThumbnail(pendingData.elements, pendingData.backgroundColor)
            const newProject = await createProject(pendingData.name, {
              elements: pendingData.elements,
              zoom: pendingData.zoom,
              panOffset: pendingData.panOffset,
              backgroundColor: pendingData.backgroundColor
            }, thumbnail)

            // Cleanup
            localStorage.removeItem("zen-draw-pending-project")
            toast.success("Project restored and saved successfully")
            router.push(`/board/${newProject.id}`)
          } catch (error) {
            console.error("Failed to restore project", error)
            toast.error("Failed to restore pending project")
          }
        }
      }
    }

    checkPendingSave()
  }, [searchParams, user, router])

  const handleShare = async (isPublic: boolean, permission: "VIEW" | "EDIT") => {
    if (!projectId) return
    try {
      await updateProjectShare(projectId, isPublic, permission)
      toast.success("Share settings updated")
    } catch {
      toast.error("Failed to update share settings")
    }
  }

  const handleRename = async (newName: string) => {
    if (!projectId) return
    try {
      await renameProject(projectId, newName)
      toast.success("Project renamed")
    } catch {
      toast.error("Failed to rename project")
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

  const { setTheme } = useTheme()



  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color)
    if (DARK_BACKGROUNDS.includes(color)) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
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
    <div className="fixed inset-0 overflow-hidden touch-none bg-background overscroll-none font-['Virgil']">
      <TopBar
        projectId={projectId}
        projectName={projectName}
        isOwner={isOwner}
        onRename={handleRename}
      />

      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      {canEdit && (
        <>
          <CollapsibleToolbar
            currentTool={state.tool}
            onToolChange={setTool}
            onUndo={undo}
            onRedo={redo}
            onClear={clearCanvas}
            onExportPNG={handleExportPNG}
            onExportSVG={handleExportSVG}
            backgroundColor={state.backgroundColor}
            onBackgroundChange={handleBackgroundChange}
            gridMode={state.gridMode}
            onGridModeChange={setGridMode}
            snapToGrid={state.snapToGrid}
            onSnapToGridChange={setSnapToGrid}
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
            currentTool={state.tool}
            palettes={palettes}
            disableDefaultColors={disableDefaultColors}
            onManagePresets={() => {
              setSettingsTab("app");
              setIsSettingsOpen(true);
            }}
            onStrokeColorChange={setStrokeColor}
            onFillColorChange={setFillColor}
            onStrokeWidthChange={setStrokeWidth}
            onOpacityChange={setOpacity}
            onRoughnessChange={setRoughness}
            onStrokeStyleChange={setStrokeStyle}
            onEdgeStyleChange={setEdgeStyle}
            onFontSizeChange={setFontSize}
            onTextAlignChange={setTextAlign}
            onBringToFront={() => state.selectedIds.length > 0 && bringToFront(state.selectedIds)}
            onBringForward={() => state.selectedIds.length > 0 && bringForward(state.selectedIds)}
            onSendBackward={() => state.selectedIds.length > 0 && sendBackward(state.selectedIds)}
            onSendToBack={() => state.selectedIds.length > 0 && sendToBack(state.selectedIds)}
          />

          <RightSettingsMenu
            projectId={projectId}
            projectName={projectName}
            isOwner={isOwner}
            canEdit={canEdit}
            isPublic={isPublic}
            publicPermission={publicPermission}
            onSave={handleSave}
            onShare={handleShare}
            onSaveFile={saveToFile}
            onLoadFile={handleLoad}
            onOpenSettings={() => {
              setSettingsTab("user");
              setIsSettingsOpen(true);
            }}
          />

          <SettingsModal
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            user={user}
            defaultTab={settingsTab}
            onTabChange={setSettingsTab}
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
        gridMode={state.gridMode}
        snapToGrid={state.snapToGrid}
        gridSize={gridSize}
        snapThreshold={snapThreshold}
      />
    </div>
  )
}
