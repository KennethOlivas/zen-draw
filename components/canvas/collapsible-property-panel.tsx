"use client";

import { useState, useEffect, useEffectEvent } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type StrokeStyle,
  type EdgeStyle,
  type TextAlign,
  type Tool,
} from "@/types/canvas-types";
import { ColorPicker } from "./color-picker";
import {
  COLORS,
  FILL_COLORS,
  FONT_SIZES,
  STROKE_WIDTHS,
} from "@/constant/settings";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  MoreHorizontal,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CollapsiblePropertyPanelProps {
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
  currentTool: Tool;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onOpacityChange: (opacity: number) => void;
  onRoughnessChange: (roughness: number) => void;
  onStrokeStyleChange: (style: StrokeStyle) => void;
  onEdgeStyleChange: (arg0: EdgeStyle) => void;
  onFontSizeChange: (size: number) => void;
  onTextAlignChange: (align: TextAlign) => void;
}

export function CollapsiblePropertyPanel({
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
  currentTool,
  onStrokeColorChange,
  onFillColorChange,
  onStrokeWidthChange,
  onOpacityChange,
  onRoughnessChange,
  onStrokeStyleChange,
  onEdgeStyleChange,
  onFontSizeChange,
  onTextAlignChange,
}: CollapsiblePropertyPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);

  const activeType = selectedType || currentTool;

  const showStroke = ["rectangle", "ellipse", "diamond", "line", "arrow", "freehand", "text"].includes(activeType);
  const showFill = ["rectangle", "ellipse", "diamond"].includes(activeType);
  const showStrokeWidth = ["rectangle", "ellipse", "diamond", "line", "arrow", "freehand"].includes(activeType);
  const showStrokeStyle = ["rectangle", "ellipse", "diamond", "line", "arrow"].includes(activeType);
  const showEdges = ["rectangle", "diamond"].includes(activeType);
  const showRoughness = ["rectangle", "ellipse", "diamond", "line", "arrow"].includes(activeType);
  const showOpacity = ["rectangle", "ellipse", "diamond", "line", "arrow", "freehand", "text"].includes(activeType);
  const showTextProps = activeType === "text";

  const hasAnyProperty = showStroke || showFill || showStrokeWidth || showStrokeStyle || showEdges || showRoughness || showOpacity || showTextProps;



  const onSetContentVisible = useEffectEvent((visible: boolean) => {
    setContentVisible(visible);
  });

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setContentVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      onSetContentVisible(false);
    }
  }, [isExpanded]);

  if (!hasAnyProperty) return null;

  const getAnimationStyle = (delay: number) => ({
    transitionProperty: "opacity, transform",
    transitionDuration: "200ms",
    transitionTimingFunction: "ease-out",
    transitionDelay: isExpanded ? `${delay}ms` : "0ms",
    opacity: isExpanded ? 1 : 0,
    transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
  });

  const getSeparatorStyle = (delay: number) => ({
    transitionProperty: "opacity",
    transitionDuration: "200ms",
    transitionTimingFunction: "ease-out",
    transitionDelay: isExpanded ? `${delay}ms` : "0ms",
    opacity: isExpanded ? 1 : 0,
  });

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "fixed left-4 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none select-none",
          isExpanded ? "w-52" : "w-auto"
        )}
        style={{
          transitionProperty: "width",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease-out",
        }}
      >
        <div className="bg-card border-2 border-foreground rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto">

          {/* Panel content */}
          <div
            className={cn(
              "overflow-hidden",
              isExpanded
                ? "max-w-[200px] opacity-100 p-4 "
                : "max-w-0 opacity-0 p-0"
            )}
            style={{
              transitionProperty: "max-width, opacity, padding",
              transitionDuration: "300ms",
              transitionTimingFunction: "ease-out",
            }}
          >
            {contentVisible && (
              <div className="flex flex-col gap-3 w-[168px]">
                {/* Stroke Color */}
                {showStroke && (
                  <div style={getAnimationStyle(0)}>
                    <ColorPicker
                      color={strokeColor}
                      colors={COLORS}
                      label="Stroke"
                      onChange={onStrokeColorChange}
                    />
                  </div>
                )}

                {/* Fill Color */}
                {showFill && (
                  <div style={getAnimationStyle(50)}>
                    <ColorPicker
                      color={fillColor}
                      colors={FILL_COLORS}
                      label="Fill"
                      onChange={onFillColorChange}
                    />
                  </div>
                )}

                {(showStroke || showFill) && (showStrokeWidth || showStrokeStyle || showEdges) && (
                  <Separator style={getSeparatorStyle(75)} />
                )}

                {/* Stroke Width */}
                {showStrokeWidth && (
                  <div className="space-y-1.5" style={getAnimationStyle(100)}>
                    <Label className="text-xs text-muted-foreground">
                      Stroke width
                    </Label>
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
                            style={{
                              width: width * 2 + 2,
                              height: width * 2 + 2,
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stroke Style */}
                {showStrokeStyle && (
                  <div className="space-y-1.5" style={getAnimationStyle(150)}>
                    <Label className="text-xs text-muted-foreground">
                      Stroke style
                    </Label>
                    <div className="flex gap-1">
                      {(
                        [
                          { id: "solid", icon: <Minus className="h-4 w-4" /> },
                          {
                            id: "dashed",
                            icon: <MoreHorizontal className="h-4 w-4" />,
                          },
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
                )}

                {/* Edge Style - Border Radius */}
                {showEdges && (
                  <div className="space-y-1.5" style={getAnimationStyle(200)}>
                    <Label className="text-xs text-muted-foreground">
                      Corners
                    </Label>
                    <div className="grid grid-cols-2 gap-1">
                      {(
                        [
                          { id: "none", label: "None" },
                          { id: "sm", label: "Small" },
                          { id: "md", label: "Medium" },
                          { id: "lg", label: "Large" },
                        ] as const
                      ).map((style) => (
                        <button
                          key={style.id}
                          className={cn(
                            "h-7 rounded-md border flex items-center justify-center text-xs transition-colors",
                            edgeStyle === style.id
                              ? "bg-accent border-primary text-accent-foreground"
                              : "border-border hover:bg-accent/50"
                          )}
                          onClick={() => onEdgeStyleChange(style.id)}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(showStroke || showFill || showStrokeWidth || showStrokeStyle || showEdges) && (showRoughness || showOpacity) && (
                  <Separator style={getSeparatorStyle(225)} />
                )}

                {/* Roughness (Sloppiness) */}
                {showRoughness && (
                  <div className="space-y-1.5" style={getAnimationStyle(250)}>
                    <Label className="text-xs text-muted-foreground">
                      Sloppiness
                    </Label>
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
                )}

                {/* Opacity */}
                {showOpacity && (
                  <div className="space-y-1.5" style={getAnimationStyle(300)}>
                    <Label className="text-xs text-muted-foreground">
                      Opacity
                    </Label>
                    <Slider
                      value={[opacity * 100]}
                      onValueChange={([value]) => onOpacityChange(value / 100)}
                      min={10}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Text properties - only show when text is selected */}
                {showTextProps && (
                  <>
                    <Separator style={getSeparatorStyle(325)} />
                    <div
                      className="space-y-1.5"
                      style={getAnimationStyle(350)}
                    >
                      <Label className="text-xs text-muted-foreground">
                        Font size
                      </Label>
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

                    <div
                      className="space-y-1.5"
                      style={getAnimationStyle(400)}
                    >
                      <Label className="text-xs text-muted-foreground">
                        Text align
                      </Label>
                      <div className="flex gap-1">
                        {(
                          [
                            {
                              id: "left",
                              icon: <AlignLeft className="h-4 w-4" />,
                            },
                            {
                              id: "center",
                              icon: <AlignCenter className="h-4 w-4" />,
                            },
                            {
                              id: "right",
                              icon: <AlignRight className="h-4 w-4" />,
                            },
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
            )}
          </div>

          {/* Collapse button */}
          <Tooltip>
            <TooltipTrigger asChild className={cn(
              isExpanded && "absolute right-0 -top-1"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-lg shrink-0",
                  isExpanded && "m-1.5"
                )}
                style={{
                  transitionProperty: "height, width, margin",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-out",
                }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isExpanded ? "Collapse panel" : "Expand panel"}
            </TooltipContent>
          </Tooltip>

        </div>
      </div>
    </TooltipProvider>
  );
}
