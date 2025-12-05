"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
// import { type ColorPalette } from "@/actions/settings/user-settings"
import { type ColorPalette } from "@/constant/palettes"
import { Settings2, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
  color: string
  colors: string[]
  palettes?: ColorPalette[]
  label: string
  onChange: (color: string) => void
  onManagePresets?: () => void
}

export function ColorPicker({ color, colors, palettes, label, onChange, onManagePresets }: ColorPickerProps) {
  const [showPresets, setShowPresets] = useState(false)

  // Split palettes into defaults and custom (if needed logic in future, but for now treating all passed palettes as presets)
  // The prompt implies hiding specific ones like "High Contrast", "Minimal", which are typically passed in `palettes` if they are defaults.

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
        <PopoverContent className="w-64 p-3" side="right">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-muted-foreground">Default</div>
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
            </div>

            {palettes && palettes.length > 0 && (
              <div className="pt-2 border-t space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-between h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPresets(!showPresets)}
                >
                  <span>Presets</span>
                  {showPresets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>

                <AnimatePresence>
                  {showPresets && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-3"
                    >
                      {palettes.map(palette => (
                        <div key={palette.id} className="space-y-1.5">
                          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider pl-1">{palette.name}</div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {palette.colors.map((c, idx) => (
                              <button
                                key={`${palette.id}-${idx}`}
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
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex gap-2 items-center pt-2 border-t">
              <Input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 p-0 border-0"
              />
              <div className="flex-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                Hex: {color}
              </div>
              {onManagePresets && (
                <button
                  onClick={onManagePresets}
                  className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  title="Manage Presets"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
