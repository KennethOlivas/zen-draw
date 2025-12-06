import { useEffect } from "react"

interface UseCanvasShortcutsProps {
    selectedIds: string[]
    isTextInputVisible: boolean
    onDeleteElements: (ids: string[]) => void
    onTextSubmit: () => void
    onCancelText: () => void
}

export function useCanvasShortcuts({
    selectedIds,
    isTextInputVisible,
    onDeleteElements,
    onTextSubmit,
    onCancelText,
}: UseCanvasShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTextInputVisible) {
                if (e.key === "Escape") {
                    onCancelText()
                } else if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    onTextSubmit()
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
    }, [selectedIds, isTextInputVisible, onDeleteElements, onTextSubmit, onCancelText])
}
