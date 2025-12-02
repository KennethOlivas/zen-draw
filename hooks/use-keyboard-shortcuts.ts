import { useEffect } from "react"
import { Tool } from "@/types/canvas-types"
import { TOOL_SHORTCUTS } from "@/constant/canvas-constants"

interface UseKeyboardShortcutsProps {
    setTool: (tool: Tool) => void
    undo: () => void
    redo: () => void
    setZoom: (zoom: number) => void
    setPanOffset: (offset: { x: number; y: number }) => void
    zoom: number
    selectedIds: string[]
    sendToBack: (ids: string[]) => void
    sendBackward: (ids: string[]) => void
    bringForward: (ids: string[]) => void
    bringToFront: (ids: string[]) => void
    duplicateElements: (ids: string[]) => void
}

export function useKeyboardShortcuts({
    setTool,
    undo,
    redo,
    setZoom,
    setPanOffset,
    zoom,
    selectedIds,
    sendToBack,
    sendBackward,
    bringForward,
    bringToFront,
    duplicateElements,
}: UseKeyboardShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return
            }

            const key = e.key.toLowerCase()

            if (TOOL_SHORTCUTS[key] && !e.metaKey && !e.ctrlKey) {
                setTool(TOOL_SHORTCUTS[key])
                return
            }

            if ((e.metaKey || e.ctrlKey) && e.shiftKey && key === "[") {
                e.preventDefault()
                if (selectedIds.length > 0) sendToBack(selectedIds)
                return
            }
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && key === "[") {
                e.preventDefault()
                if (selectedIds.length > 0) sendBackward(selectedIds)
                return
            }
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && key === "]") {
                e.preventDefault()
                if (selectedIds.length > 0) bringForward(selectedIds)
                return
            }
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && key === "]") {
                e.preventDefault()
                if (selectedIds.length > 0) bringToFront(selectedIds)
                return
            }

            if ((e.metaKey || e.ctrlKey) && key === "d") {
                e.preventDefault()
                if (selectedIds.length > 0) duplicateElements(selectedIds)
                return
            }

            if ((e.metaKey || e.ctrlKey) && key === "z") {
                e.preventDefault()
                if (e.shiftKey) {
                    redo()
                } else {
                    undo()
                }
                return
            }

            if ((e.metaKey || e.ctrlKey) && key === "0") {
                e.preventDefault()
                setZoom(1)
                setPanOffset({ x: 0, y: 0 })
            }

            if ((e.metaKey || e.ctrlKey) && (key === "=" || key === "+")) {
                e.preventDefault()
                setZoom(Math.min(5, zoom + 0.1))
            }
            if ((e.metaKey || e.ctrlKey) && key === "-") {
                e.preventDefault()
                setZoom(Math.max(0.1, zoom - 0.1))
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [
        setTool,
        undo,
        redo,
        setZoom,
        setPanOffset,
        zoom,
        selectedIds,
        sendToBack,
        sendBackward,
        bringForward,
        bringToFront,
        duplicateElements,
    ])
}
