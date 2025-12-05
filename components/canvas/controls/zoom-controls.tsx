"use client"

import { ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onZoomReset }: ZoomControlsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed bottom-24 md:bottom-4 right-4 z-50 flex items-center gap-1 bg-card border-2 border-foreground rounded-xl p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] pointer-events-auto select-none">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={onZoomOut}
              disabled={zoom <= 0.1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Zoom Out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 rounded-lg text-xs font-medium min-w-[52px]"
              onClick={onZoomReset}
            >
              {Math.round(zoom * 100)}%
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Reset Zoom (Ctrl+0)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onZoomIn} disabled={zoom >= 5}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Zoom In</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
