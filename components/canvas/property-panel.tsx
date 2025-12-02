"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  type StrokeStyle,
  type EdgeStyle,
  type TextAlign,
} from "@/types/canvas-types";
import { ColorPicker } from "./color-picker";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  MoreHorizontal,
  Square,
  Circle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  COLORS,
  FILL_COLORS,
  FONT_SIZES,
  STROKE_WIDTHS,
} from "@/constant/settings";

interface PropertyPanelProps {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  roughness: number;
  strokeStyle: StrokeStyle;
  edgeStyle: EdgeStyle;
  fontSize: number;
  textAlign: TextAlign;
  selectedType?: string;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onOpacityChange: (opacity: number) => void;
  onRoughnessChange: (roughness: number) => void;
  onStrokeStyleChange: (style: StrokeStyle) => void;
  onEdgeStyleChange: (style: EdgeStyle) => void;
  onFontSizeChange: (size: number) => void;
  onTextAlignChange: (align: TextAlign) => void;
}

export function PropertyPanel({
  strokeColor,
  fillColor,
  strokeWidth,
  opacity,
  roughness,
  strokeStyle,
  edgeStyle,
  fontSize,
  textAlign,
  selectedType,
  onStrokeColorChange,
  onFillColorChange,
  onStrokeWidthChange,
  onOpacityChange,
  onRoughnessChange,
  onStrokeStyleChange,
  onEdgeStyleChange,
  onFontSizeChange,
  onTextAlignChange,
}: PropertyPanelProps) {
  const isTextSelected = selectedType === "text";

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 bg-toolbar-bg border border-toolbar-border rounded-xl p-3 shadow-lg w-52">
      {/* Stroke Color */}
      <ColorPicker
        color={strokeColor}
        colors={COLORS}
        label="Stroke"
        onChange={onStrokeColorChange}
      />

      {/* Fill Color */}
      <ColorPicker
        color={fillColor}
        colors={FILL_COLORS}
        label="Fill"
        onChange={onFillColorChange}
      />

      <Separator />

      {/* Stroke Width */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Stroke width</Label>
        <div className="flex gap-1">
          {STROKE_WIDTHS.map((width) => (
            <button
              key={width}
              className={cn(
                "flex-1 h-7 rounded-md border flex items-center justify-center transition-colors",
                strokeWidth === width
                  ? "bg-accent border-primary text-accent-foreground"
                  : "border-border hover:bg-accent/50"
              )}
              onClick={() => onStrokeWidthChange(width)}
            >
              <div
                className="rounded-full bg-foreground"
                style={{ width: width * 2 + 2, height: width * 2 + 2 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Stroke Style */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Stroke style</Label>
        <div className="flex gap-1">
          {(
            [
              { id: "solid", icon: <Minus className="h-4 w-4" /> },
              { id: "dashed", icon: <MoreHorizontal className="h-4 w-4" /> },
              {
                id: "dotted",
                icon: (
                  <span className="flex gap-0.5">
                    <Circle className="h-1.5 w-1.5 fill-current" />
                    <Circle className="h-1.5 w-1.5 fill-current" />
                    <Circle className="h-1.5 w-1.5 fill-current" />
                  </span>
                ),
              },
            ] as const
          ).map((style) => (
            <button
              key={style.id}
              className={cn(
                "flex-1 h-7 rounded-md border flex items-center justify-center transition-colors",
                strokeStyle === style.id
                  ? "bg-accent border-primary text-accent-foreground"
                  : "border-border hover:bg-accent/50"
              )}
              onClick={() => onStrokeStyleChange(style.id)}
            >
              {style.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Edge Style */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Edges</Label>
        <div className="flex gap-1">
          {(
            [
              { id: "sharp", icon: <Square className="h-4 w-4" /> },
              { id: "round", icon: <Circle className="h-4 w-4" /> },
            ] as const
          ).map((style) => (
            <button
              key={style.id}
              className={cn(
                "flex-1 h-7 rounded-md border flex items-center justify-center transition-colors",
                edgeStyle === style.id
                  ? "bg-accent border-primary text-accent-foreground"
                  : "border-border hover:bg-accent/50"
              )}
              onClick={() => onEdgeStyleChange(style.id)}
            >
              {style.icon}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Roughness (Sloppiness) */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Sloppiness</Label>
        <div className="flex gap-1">
          {[0, 1, 2].map((level) => (
            <button
              key={level}
              className={cn(
                "flex-1 h-7 rounded-md border flex items-center justify-center text-xs transition-colors",
                roughness === level
                  ? "bg-accent border-primary text-accent-foreground"
                  : "border-border hover:bg-accent/50"
              )}
              onClick={() => onRoughnessChange(level)}
            >
              {level === 0 ? "None" : level === 1 ? "Low" : "High"}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Opacity</Label>
        <Slider
          value={[opacity * 100]}
          onValueChange={([value]) => onOpacityChange(value / 100)}
          min={10}
          max={100}
          step={10}
          className="w-full"
        />
      </div>

      {/* Text properties - only show when text is selected */}
      {isTextSelected && (
        <>
          <Separator />
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font size</Label>
            <div className="flex gap-1 flex-wrap">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  className={cn(
                    "px-2 h-7 rounded-md border flex items-center justify-center text-xs transition-colors",
                    fontSize === size
                      ? "bg-accent border-primary text-accent-foreground"
                      : "border-border hover:bg-accent/50"
                  )}
                  onClick={() => onFontSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Text align</Label>
            <div className="flex gap-1">
              {(
                [
                  { id: "left", icon: <AlignLeft className="h-4 w-4" /> },
                  { id: "center", icon: <AlignCenter className="h-4 w-4" /> },
                  { id: "right", icon: <AlignRight className="h-4 w-4" /> },
                ] as const
              ).map((align) => (
                <button
                  key={align.id}
                  className={cn(
                    "flex-1 h-7 rounded-md border flex items-center justify-center transition-colors",
                    textAlign === align.id
                      ? "bg-accent border-primary text-accent-foreground"
                      : "border-border hover:bg-accent/50"
                  )}
                  onClick={() => onTextAlignChange(align.id)}
                >
                  {align.icon}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
