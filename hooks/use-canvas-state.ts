"use client"

import { useState, useCallback, useRef, useEffect, useEffectEvent } from "react"
import type {
  CanvasState,
  CanvasElement,
  Tool,
  Point,
  HistoryEntry,
  StrokeStyle,
  EdgeStyle,
  TextAlign,
  GridMode,
} from "@/types/canvas-types"
import {
  DEFAULT_STROKE_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_OPACITY,
  DEFAULT_FONT_SIZE,
  DEFAULT_ROUGHNESS,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_STROKE_STYLE,
  DEFAULT_EDGE_STYLE,
  DEFAULT_TEXT_ALIGN,
} from "@/constant/settings"

const MAX_HISTORY = 50
const AUTO_SAVE_KEY = "zen-draw-autosave"

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function generateSeed(): number {
  return Math.floor(Math.random() * 1000000)
}

export function useCanvasState(initialData?: any, projectId?: string, forceNew?: boolean) {
  const [state, setState] = useState<CanvasState>({
    elements: initialData?.elements || [],
    selectedIds: [],
    zoom: initialData?.zoom || 1,
    panOffset: initialData?.panOffset || { x: 0, y: 0 },
    tool: "select",
    strokeColor: initialData?.strokeColor || DEFAULT_STROKE_COLOR,
    fillColor: initialData?.fillColor || DEFAULT_FILL_COLOR,
    strokeWidth: initialData?.strokeWidth || DEFAULT_STROKE_WIDTH,
    opacity: initialData?.opacity || DEFAULT_OPACITY,
    fontSize: initialData?.fontSize || DEFAULT_FONT_SIZE,
    roughness: initialData?.roughness || DEFAULT_ROUGHNESS,
    backgroundColor: initialData?.backgroundColor || DEFAULT_BACKGROUND_COLOR,
    strokeStyle: initialData?.strokeStyle || DEFAULT_STROKE_STYLE,
    edgeStyle: initialData?.edgeStyle || DEFAULT_EDGE_STYLE,
    textAlign: initialData?.textAlign || DEFAULT_TEXT_ALIGN,
    gridMode: initialData?.gridMode || "none",
    snapToGrid: initialData?.snapToGrid ?? true,
  })

  const historyRef = useRef<HistoryEntry[]>([])
  const historyIndexRef = useRef(-1)
  const isUndoRedoRef = useRef(false)

  const onSetState = useEffectEvent((newState: CanvasState) => {
    setState((prev) => ({
      ...prev,
      elements: newState.elements || [],
      zoom: newState.zoom || 1,
      panOffset: newState.panOffset || { x: 0, y: 0 },
      backgroundColor: newState.backgroundColor || DEFAULT_BACKGROUND_COLOR,
    }))
  })

  // Auto-save to localStorage
  useEffect(() => {
    if (forceNew) {
      localStorage.removeItem(AUTO_SAVE_KEY)
      return
    }

    if (!projectId && !initialData) {
      const saved = localStorage.getItem(AUTO_SAVE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          onSetState(parsed)
        } catch (e) {
          console.error("Failed to load auto-save:", e)
        }
      }
    }
  }, [projectId, initialData, forceNew])

  useEffect(() => {
    if (!projectId) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(
          AUTO_SAVE_KEY,
          JSON.stringify({
            elements: state.elements,
            zoom: state.zoom,
            panOffset: state.panOffset,
            backgroundColor: state.backgroundColor,
          }),
        )
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [state.elements, state.zoom, state.panOffset, state.backgroundColor, projectId])

  // Push to history
  const pushHistory = useCallback(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false
      return
    }

    const entry: HistoryEntry = {
      elements: JSON.parse(JSON.stringify(state.elements)),
      selectedIds: [...state.selectedIds],
    }

    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
    historyRef.current.push(entry)

    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift()
    } else {
      historyIndexRef.current++
    }
  }, [state.elements, state.selectedIds])

  // Undo
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--
      isUndoRedoRef.current = true
      const entry = historyRef.current[historyIndexRef.current]
      setState((prev) => ({
        ...prev,
        elements: JSON.parse(JSON.stringify(entry.elements)),
        selectedIds: [...entry.selectedIds],
      }))
    }
  }, [])

  // Redo
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++
      isUndoRedoRef.current = true
      const entry = historyRef.current[historyIndexRef.current]
      setState((prev) => ({
        ...prev,
        elements: JSON.parse(JSON.stringify(entry.elements)),
        selectedIds: [...entry.selectedIds],
      }))
    }
  }, [])

  // Tool actions
  const setTool = useCallback((tool: Tool) => {
    setState((prev) => ({ ...prev, tool, selectedIds: tool === "select" ? prev.selectedIds : [] }))
  }, [])

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoom)) }))
  }, [])

  const setPanOffset = useCallback((panOffset: Point) => {
    setState((prev) => ({ ...prev, panOffset }))
  }, [])

  const setSelectedIds = useCallback((ids: string[]) => {
    setState((prev) => ({ ...prev, selectedIds: ids }))
  }, [])

  const setBackgroundColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, backgroundColor: color }))
  }, [])

  // Element actions
  const addElement = useCallback((element: Omit<CanvasElement, "id" | "seed">) => {
    const newElement: CanvasElement = {
      ...element,
      id: generateId(),
      seed: generateSeed(),
    }
    setState((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }))
    return newElement.id
  }, [])

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }))
  }, [])

  const deleteElements = useCallback(
    (ids: string[]) => {
      setState((prev) => ({
        ...prev,
        elements: prev.elements.filter((el) => !ids.includes(el.id)),
        selectedIds: prev.selectedIds.filter((id) => !ids.includes(id)),
      }))
      pushHistory()
    },
    [pushHistory],
  )

  const duplicateElements = useCallback(
    (ids: string[]) => {
      setState((prev) => {
        const toDuplicate = prev.elements.filter((el) => ids.includes(el.id))
        const duplicated = toDuplicate.map((el) => ({
          ...el,
          id: generateId(),
          seed: generateSeed(),
          x: el.x + 20,
          y: el.y + 20,
        }))
        return {
          ...prev,
          elements: [...prev.elements, ...duplicated],
          selectedIds: duplicated.map((el) => el.id),
        }
      })
      pushHistory()
    },
    [pushHistory],
  )

  const sendToBack = useCallback(
    (ids: string[]) => {
      setState((prev) => {
        const selected = prev.elements.filter((el) => ids.includes(el.id))
        const rest = prev.elements.filter((el) => !ids.includes(el.id))
        return { ...prev, elements: [...selected, ...rest] }
      })
      pushHistory()
    },
    [pushHistory],
  )

  const sendBackward = useCallback(
    (ids: string[]) => {
      setState((prev) => {
        const elements = [...prev.elements]
        for (const id of ids) {
          const index = elements.findIndex((el) => el.id === id)
          if (index > 0) {
            const temp = elements[index]
            elements[index] = elements[index - 1]
            elements[index - 1] = temp
          }
        }
        return { ...prev, elements }
      })
      pushHistory()
    },
    [pushHistory],
  )

  const bringForward = useCallback(
    (ids: string[]) => {
      setState((prev) => {
        const elements = [...prev.elements]
        for (let i = ids.length - 1; i >= 0; i--) {
          const id = ids[i]
          const index = elements.findIndex((el) => el.id === id)
          if (index < elements.length - 1) {
            const temp = elements[index]
            elements[index] = elements[index + 1]
            elements[index + 1] = temp
          }
        }
        return { ...prev, elements }
      })
      pushHistory()
    },
    [pushHistory],
  )

  const bringToFront = useCallback(
    (ids: string[]) => {
      setState((prev) => {
        const selected = prev.elements.filter((el) => ids.includes(el.id))
        const rest = prev.elements.filter((el) => !ids.includes(el.id))
        return { ...prev, elements: [...rest, ...selected] }
      })
      pushHistory()
    },
    [pushHistory],
  )

  // Style actions
  const setStrokeColor = useCallback((color: string) => {
    setState((prev) => {
      const newState = { ...prev, strokeColor: color }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) =>
          prev.selectedIds.includes(el.id) ? { ...el, strokeColor: color } : el,
        )
      }
      return newState
    })
  }, [])

  const setFillColor = useCallback((color: string) => {
    setState((prev) => {
      const newState = { ...prev, fillColor: color }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) =>
          prev.selectedIds.includes(el.id) ? { ...el, fillColor: color } : el,
        )
      }
      return newState
    })
  }, [])

  const setStrokeWidth = useCallback((width: number) => {
    setState((prev) => {
      const newState = { ...prev, strokeWidth: width }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) =>
          prev.selectedIds.includes(el.id) ? { ...el, strokeWidth: width } : el,
        )
      }
      return newState
    })
  }, [])

  const setOpacity = useCallback((opacity: number) => {
    setState((prev) => {
      const newState = { ...prev, opacity }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) => (prev.selectedIds.includes(el.id) ? { ...el, opacity } : el))
      }
      return newState
    })
  }, [])

  const setRoughness = useCallback((roughness: number) => {
    setState((prev) => {
      const newState = { ...prev, roughness }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) =>
          prev.selectedIds.includes(el.id) ? { ...el, roughness, seed: generateSeed() } : el,
        )
      }
      return newState
    })
  }, [])

  const setStrokeStyle = useCallback((strokeStyle: StrokeStyle) => {
    setState((prev) => {
      const newState = { ...prev, strokeStyle }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) => (prev.selectedIds.includes(el.id) ? { ...el, strokeStyle } : el))
      }
      return newState
    })
  }, [])

  const setEdgeStyle = useCallback((edgeStyle: EdgeStyle) => {
    setState((prev) => {
      const newState = { ...prev, edgeStyle }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) => (prev.selectedIds.includes(el.id) ? { ...el, edgeStyle } : el))
      }
      return newState
    })
  }, [])

  const setFontSize = useCallback((fontSize: number) => {
    setState((prev) => {
      const newState = { ...prev, fontSize }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) =>
          prev.selectedIds.includes(el.id) && el.type === "text" ? { ...el, fontSize } : el,
        )
      }
      return newState
    })
  }, [])

  const setTextAlign = useCallback((textAlign: TextAlign) => {
    setState((prev) => {
      const newState = { ...prev, textAlign }
      if (prev.selectedIds.length > 0) {
        newState.elements = prev.elements.map((el) =>
          prev.selectedIds.includes(el.id) && el.type === "text" ? { ...el, textAlign } : el,
        )
      }
      return newState
    })
  }, [])

  const setGridMode = useCallback((gridMode: GridMode) => {
    setState((prev) => ({ ...prev, gridMode }))
  }, [])

  const setSnapToGrid = useCallback((snapToGrid: boolean) => {
    setState((prev) => ({ ...prev, snapToGrid }))
  }, [])

  // Save/Load
  const saveToFile = useCallback(() => {
    const data = JSON.stringify(
      {
        version: 1,
        elements: state.elements,
        backgroundColor: state.backgroundColor,
      },
      null,
      2,
    )

    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `drawing-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state.elements, state.backgroundColor])

  const loadFromFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setState((prev) => ({
            ...prev,
            elements: data.elements || [],
            selectedIds: [],
            backgroundColor: data.backgroundColor || DEFAULT_BACKGROUND_COLOR,
          }))
          pushHistory()
        } catch (err) {
          console.error("Failed to load file:", err)
        }
      }
      reader.readAsText(file)
    },
    [pushHistory],
  )

  const clearCanvas = useCallback(() => {
    setState((prev) => ({
      ...prev,
      elements: [],
      selectedIds: [],
    }))
    pushHistory()
  }, [pushHistory])

  return {
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
    setGridMode,
    setSnapToGrid,
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
    copyElements: async () => {
      const selected = state.elements.filter((el) => state.selectedIds.includes(el.id))
      if (selected.length === 0) return

      const data = JSON.stringify({
        type: "zen-draw-clipboard",
        elements: selected,
      })

      try {
        await navigator.clipboard.writeText(data)
      } catch (err) {
        console.error("Failed to copy to clipboard:", err)
      }
    },
    cutElements: async () => {
      const selected = state.elements.filter((el) => state.selectedIds.includes(el.id))
      if (selected.length === 0) return

      const data = JSON.stringify({
        type: "zen-draw-clipboard",
        elements: selected,
      })

      try {
        await navigator.clipboard.writeText(data)
        deleteElements(state.selectedIds)
      } catch (err) {
        console.error("Failed to cut to clipboard:", err)
      }
    },
    pasteElements: async () => {
      try {
        const text = await navigator.clipboard.readText()
        const data = JSON.parse(text)

        if (data.type === "zen-draw-clipboard" && Array.isArray(data.elements)) {
          const newElements = data.elements.map((el: CanvasElement) => ({
            ...el,
            id: generateId(),
            seed: generateSeed(),
            x: el.x + 20, // Offset for visibility
            y: el.y + 20,
          }))

          setState((prev) => ({
            ...prev,
            elements: [...prev.elements, ...newElements],
            selectedIds: newElements.map((el: CanvasElement) => el.id),
          }))
          pushHistory()
        }
      } catch (err) {
        console.error("Failed to paste from clipboard:", err)
      }
    },
  }
}
