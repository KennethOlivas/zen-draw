"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  color: string
  colors: string[]
  label: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, colors, label, onChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color)

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="grid grid-cols-5 gap-1.5">
        {colors.slice(0, 10).map((c) => (
          <button
            key={c}
            className={cn(
              "w-6 h-6 rounded-md border-2 transition-transform hover:scale-110",
              c === "transparent" &&
                "bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-size-[8px_8px]",
              color === c ? "border-primary ring-2 ring-primary/30" : "border-transparent",
            )}
            style={{ backgroundColor: c === "transparent" ? undefined : c }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full h-7 rounded-md border border-border text-xs text-muted-foreground hover:bg-accent/50 transition-colors flex items-center justify-center gap-2">
            <div
              className="w-4 h-4 rounded border border-border"
              style={{ backgroundColor: color === "transparent" ? undefined : color }}
            />
            More colors
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" side="right">
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  className={cn(
                    "w-7 h-7 rounded-md border-2 transition-transform hover:scale-110",
                    c === "transparent" &&
                      "bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-size-[8px_8px]",
                    color === c ? "border-primary ring-2 ring-primary/30" : "border-border",
                  )}
                  style={{ backgroundColor: c === "transparent" ? undefined : c }}
                  onClick={() => onChange(c)}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={customColor.startsWith("#") ? customColor : "#000000"}
                onChange={(e) => {
                  setCustomColor(e.target.value)
                  onChange(e.target.value)
                }}
                className="w-10 h-8 p-0.5 cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
