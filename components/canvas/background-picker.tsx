"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BACKGROUND_COLORS } from "@/constant/settings"
import { cn } from "@/lib/utils"

interface BackgroundPickerProps {
  backgroundColor: string
  onBackgroundChange: (color: string) => void
}

export function BackgroundPicker({ backgroundColor, onBackgroundChange }: BackgroundPickerProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg relative">
                <Palette className="h-4 w-4" />
                <div
                  className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-border"
                  style={{ backgroundColor }}
                />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Canvas Background</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-40 p-3" side="bottom">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Background</p>
            <div className="grid grid-cols-4 gap-1.5">
              {BACKGROUND_COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-7 h-7 rounded-md border-2 transition-transform hover:scale-110",
                    backgroundColor === color ? "border-primary ring-2 ring-primary/30" : "border-border",
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => onBackgroundChange(color)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
