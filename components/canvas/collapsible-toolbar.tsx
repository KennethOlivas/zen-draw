"use client"

import { useState, useRef, useEffect, useEffectEvent } from "react"
import {
  MousePointer2,
  Hand,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pencil,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Moon,
  Sun,
  ImageIcon,
  FileDown,
  Diamond,
  ChevronUp,
  Grid3X3,
  Grip,
  Maximize,
  LayoutGrid,
  Magnet,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import type { Tool, GridMode } from "@/types/canvas-types"
import { cn } from "@/lib/utils"
import { BackgroundPicker } from "./background-picker"

interface CollapsibleToolbarProps {
  currentTool: Tool
  onToolChange: (tool: Tool) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onExportPNG: () => void
  onExportSVG: () => void
  isDark: boolean
  onToggleDark: () => void
  backgroundColor: string
  onBackgroundChange: (color: string) => void
  gridMode: GridMode
  onGridModeChange: (mode: GridMode) => void
  snapToGrid: boolean
  onSnapToGridChange: (snap: boolean) => void
}

const tools: { id: Tool; icon: typeof MousePointer2; label: string; shortcut?: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pan", icon: Hand, label: "Pan", shortcut: "H" },
  { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
  { id: "diamond", icon: Diamond, label: "Diamond", shortcut: "D" },
  { id: "ellipse", icon: Circle, label: "Ellipse", shortcut: "O" },
  { id: "line", icon: Minus, label: "Line", shortcut: "L" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
  { id: "freehand", icon: Pencil, label: "Freehand", shortcut: "P" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
]

const getItemStyle = (isExpanded: boolean, delayMs: number) => ({
  transitionProperty: "opacity, transform",
  transitionDuration: "200ms",
  transitionTimingFunction: "ease-out",
  transitionDelay: isExpanded ? `${delayMs}ms` : "0ms",
  opacity: isExpanded ? 1 : 0,
  transform: isExpanded ? "scale(1)" : "scale(0.8)",
})

const getSeparatorStyle = (isExpanded: boolean, delayMs: number) => ({
  transitionProperty: "opacity",
  transitionDuration: "200ms",
  transitionTimingFunction: "ease-out",
  transitionDelay: isExpanded ? `${delayMs}ms` : "0ms",
  opacity: isExpanded ? 1 : 0,
})

export function CollapsibleToolbar({
  currentTool,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onExportPNG,
  onExportSVG,
  isDark,
  onToggleDark,
  backgroundColor,
  onBackgroundChange,
  gridMode,
  onGridModeChange,
  snapToGrid,
  onSnapToGridChange,
}: CollapsibleToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [itemsVisible, setItemsVisible] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  const onSetItemsVisible = useEffectEvent((visible: boolean) => {
    setItemsVisible(visible)
  })

  useEffect(() => {
    if (isExpanded) {
      onSetItemsVisible(true)
    } else {
      const timer = setTimeout(() => setItemsVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isExpanded])
  const currentToolData = tools.find((t) => t.id === currentTool)
  const CurrentIcon = currentToolData?.icon || MousePointer2

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed bottom-6 md:top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
        <div className="bg-card p-2 rounded-xl border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex items-center gap-2 pointer-events-auto">
          <div className={cn("flex items-center ", isExpanded ? "gap-1" : "gap-0")}>
            {/* Collapse/Expand button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-lg shrink-0", isExpanded ? "h-9 w-9" : "h-8 w-8")}
                  style={{
                    transitionProperty: "height, width",
                    transitionDuration: "200ms",
                    transitionTimingFunction: "ease-out",
                  }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <CurrentIcon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isExpanded ? "Collapse toolbar" : `${currentToolData?.label || "Expand"} - Click to expand`}
              </TooltipContent>
            </Tooltip>

            {/* Animated content wrapper */}
            <div
              ref={contentRef}
              className={cn(
                "flex items-center gap-1 overflow-hidden",
                isExpanded ? "max-w-[85vw] md:max-w-[1000px] opacity-100 overflow-x-auto no-scrollbar" : "max-w-0 opacity-0",
              )}
              style={{
                transitionProperty: "max-width, opacity",
                transitionDuration: "300ms",
                transitionTimingFunction: "ease-out",
              }}
            >
              {itemsVisible && (
                <>
                  {/* Drawing tools */}
                  {tools.map((tool, index) => (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-9 w-9 rounded-lg",
                            currentTool === tool.id && "bg-accent text-accent-foreground",
                          )}
                          style={getItemStyle(isExpanded, index * 20)}
                          onClick={() => onToolChange(tool.id)}
                        >
                          <tool.icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {tool.label} {tool.shortcut && <kbd className="ml-1 text-xs opacity-60">{tool.shortcut}</kbd>}
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  <Separator orientation="vertical" className="h-6 mx-1" style={getSeparatorStyle(isExpanded, 200)} />

                  {/* Undo/Redo */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={onUndo}
                        style={getItemStyle(isExpanded, 220)}
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Undo <kbd className="ml-1 text-xs opacity-60">Ctrl+Z</kbd>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={onRedo}
                        style={getItemStyle(isExpanded, 240)}
                      >
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Redo <kbd className="ml-1 text-xs opacity-60">Ctrl+Shift+Z</kbd>
                    </TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6 mx-1" style={getSeparatorStyle(isExpanded, 260)} />

                  {/* Export */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={onExportPNG}
                        style={getItemStyle(isExpanded, 340)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Export PNG</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={onExportSVG}
                        style={getItemStyle(isExpanded, 360)}
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Export SVG</TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6 mx-1" style={getSeparatorStyle(isExpanded, 380)} />

                  {/* Grid Controls */}
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-9 w-9 rounded-lg",
                              gridMode !== "none" && "bg-accent text-accent-foreground",
                            )}
                            style={getItemStyle(isExpanded, 380)}
                          >
                            <Grid3X3 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Grid Layout</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent side="top" className="min-w-[150px]">
                      <DropdownMenuCheckboxItem
                        checked={snapToGrid}
                        onCheckedChange={onSnapToGridChange}
                      >
                        <Magnet className="h-4 w-4 mr-2" />
                        Snap onto Grid
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={gridMode}
                        onValueChange={(value) => {
                          const mode = value as GridMode
                          onGridModeChange(mode)
                          if (mode === "none") {
                            onSnapToGridChange(false)
                          }
                        }}
                      >
                        <DropdownMenuRadioItem value="none">
                          <Maximize className="h-4 w-4 mr-2" />
                          None
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dots">
                          <Grip className="h-4 w-4 mr-2" />
                          Dots
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="grid">
                          <Grid3X3 className="h-4 w-4 mr-2" />
                          Grid
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="mesh">
                          <LayoutGrid className="h-4 w-4 mr-2" />
                          Mesh
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Separator orientation="vertical" className="h-6 mx-1" style={getSeparatorStyle(isExpanded, 380)} />

                  {/* Dark Mode Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={onToggleDark}
                        style={getItemStyle(isExpanded, 390)}
                      >
                        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Toggle Theme</TooltipContent>
                  </Tooltip>

                  <div style={getItemStyle(isExpanded, 400)}>
                    <BackgroundPicker backgroundColor={backgroundColor} onBackgroundChange={onBackgroundChange} />
                  </div>

                  {/* Clear Canvas */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg text-destructive"
                        onClick={onClear}
                        style={getItemStyle(isExpanded, 420)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Clear Canvas</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
