"use client"

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
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  ImageIcon,
  FileDown,
  Diamond,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import type { Tool } from "@/types/canvas-types"
import { cn } from "@/lib/utils"
import { BackgroundPicker } from "./background-picker"
import { HelpModal } from "../settings/help-modal"

interface ToolbarProps {
  currentTool: Tool
  onToolChange: (tool: Tool) => void
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onLoad: () => void
  onClear: () => void
  onExportPNG: () => void
  onExportSVG: () => void
  isDark: boolean
  onToggleDark: () => void
  backgroundColor: string
  onBackgroundChange: (color: string) => void
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

export function Toolbar({
  currentTool,
  onToolChange,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onClear,
  onExportPNG,
  onExportSVG,
  isDark,
  onToggleDark,
  backgroundColor,
  onBackgroundChange,
}: ToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-toolbar-bg border border-toolbar-border rounded-xl p-1.5 shadow-lg">
        {/* Drawing tools */}
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9 rounded-lg", currentTool === tool.id && "bg-accent text-accent-foreground")}
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

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo/Redo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onUndo}>
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Undo <kbd className="ml-1 text-xs opacity-60">Ctrl+Z</kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onRedo}>
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Redo <kbd className="ml-1 text-xs opacity-60">Ctrl+Shift+Z</kbd>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* File operations */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onSave}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Save to file</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onLoad}>
              <Upload className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Load from file</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Export */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onExportPNG}>
              <ImageIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Export PNG</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onExportSVG}>
              <FileDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Export SVG</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <BackgroundPicker backgroundColor={backgroundColor} onBackgroundChange={onBackgroundChange} />

        {/* Clear */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Clear canvas</TooltipContent>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onToggleDark}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle theme</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <HelpModal />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Help</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
