"use client";

import { Tool, StrokeStyle, EdgeStyle, TextAlign } from "@/types/canvas-types";
import { ColorPalette } from "@/constant/palettes";
import { COLORS, FILL_COLORS } from "@/constant/settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ColorPicker } from "../color-picker";
import { usePropertyPanelLogic } from "./use-property-panel-logic";
import { AnimationWrapper } from "./shared/animation-wrapper";
import { StrokeWidthInput } from "./inputs/stroke-width-input";
import { StrokeStyleInput } from "./inputs/stroke-style-input";
import { CornerStyleInput } from "./inputs/corner-style-input";
import { RoughnessInput } from "./inputs/roughness-input";
import { OpacityInput } from "./inputs/opacity-input";
import { TextPropertiesInput } from "./inputs/text-properties-input";
import { LayeringInput } from "./inputs/layering-input";

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
    palettes?: ColorPalette[];
    onManagePresets?: () => void;
    onStrokeColorChange: (color: string) => void;
    onFillColorChange: (color: string) => void;
    onStrokeWidthChange: (width: number) => void;
    onOpacityChange: (opacity: number) => void;
    onRoughnessChange: (roughness: number) => void;
    onStrokeStyleChange: (style: StrokeStyle) => void;
    onEdgeStyleChange: (arg0: EdgeStyle) => void;
    onFontSizeChange: (size: number) => void;
    onTextAlignChange: (align: TextAlign) => void;
    onBringToFront: () => void;
    onBringForward: () => void;
    onSendBackward: () => void;
    onSendToBack: () => void;
}

export function CollapsiblePropertyPanel(props: CollapsiblePropertyPanelProps) {
    const {
        selectedType,
        currentTool,
        strokeColor,
        fillColor,
        strokeWidth,
        opacity,
        roughness,
        strokeStyle,
        edgeStyle,
        fontSize,
        textAlign,
        palettes,
        onManagePresets,
        onStrokeColorChange,
        onFillColorChange,
        onStrokeWidthChange,
        onOpacityChange,
        onRoughnessChange,
        onStrokeStyleChange,
        onEdgeStyleChange,
        onFontSizeChange,
        onTextAlignChange,
        onBringToFront,
        onBringForward,
        onSendBackward,
        onSendToBack,
    } = props;

    const activeType = selectedType || currentTool;
    const { isExpanded, setIsExpanded, contentVisible, properties, hasAnyProperty } = usePropertyPanelLogic(activeType);

    if (!hasAnyProperty) return null;

    const {
        showStroke,
        showFill,
        showStrokeWidth,
        showStrokeStyle,
        showEdges,
        showRoughness,
        showOpacity,
        showTextProps,
    } = properties;

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
                                    <AnimationWrapper delay={0} isExpanded={isExpanded}>
                                        <ColorPicker
                                            color={strokeColor}
                                            colors={COLORS}
                                            palettes={palettes}
                                            label="Stroke"
                                            onChange={onStrokeColorChange}
                                            onManagePresets={onManagePresets}
                                        />
                                    </AnimationWrapper>
                                )}

                                {/* Fill Color */}
                                {showFill && (
                                    <AnimationWrapper delay={50} isExpanded={isExpanded}>
                                        <ColorPicker
                                            color={fillColor}
                                            colors={FILL_COLORS}
                                            palettes={palettes}
                                            label="Fill"
                                            onChange={onFillColorChange}
                                            onManagePresets={onManagePresets}
                                        />
                                    </AnimationWrapper>
                                )}

                                {(showStroke || showFill) && (showStrokeWidth || showStrokeStyle || showEdges) && (
                                    <Separator style={getSeparatorStyle(75)} />
                                )}

                                {/* Stroke Width */}
                                {showStrokeWidth && (
                                    <AnimationWrapper delay={100} isExpanded={isExpanded}>
                                        <StrokeWidthInput
                                            value={strokeWidth}
                                            onChange={onStrokeWidthChange}
                                        />
                                    </AnimationWrapper>
                                )}

                                {/* Stroke Style */}
                                {showStrokeStyle && (
                                    <AnimationWrapper delay={150} isExpanded={isExpanded}>
                                        <StrokeStyleInput
                                            value={strokeStyle}
                                            onChange={onStrokeStyleChange}
                                        />
                                    </AnimationWrapper>
                                )}

                                {/* Edge Style - Border Radius */}
                                {showEdges && (
                                    <AnimationWrapper delay={200} isExpanded={isExpanded}>
                                        <CornerStyleInput
                                            value={edgeStyle}
                                            onChange={onEdgeStyleChange}
                                        />
                                    </AnimationWrapper>
                                )}

                                {(showStroke || showFill || showStrokeWidth || showStrokeStyle || showEdges) && (showRoughness || showOpacity) && (
                                    <Separator style={getSeparatorStyle(225)} />
                                )}

                                {/* Roughness */}
                                {showRoughness && (
                                    <AnimationWrapper delay={250} isExpanded={isExpanded}>
                                        <RoughnessInput
                                            value={roughness}
                                            onChange={onRoughnessChange}
                                        />
                                    </AnimationWrapper>
                                )}

                                {/* Opacity */}
                                {showOpacity && (
                                    <AnimationWrapper delay={300} isExpanded={isExpanded}>
                                        <OpacityInput
                                            value={opacity}
                                            onChange={onOpacityChange}
                                        />
                                    </AnimationWrapper>
                                )}

                                {/* Text properties */}
                                {showTextProps && (
                                    <>
                                        <Separator style={getSeparatorStyle(325)} />
                                        <AnimationWrapper delay={350} isExpanded={isExpanded}>
                                            <TextPropertiesInput
                                                fontSize={fontSize}
                                                textAlign={textAlign}
                                                onFontSizeChange={onFontSizeChange}
                                                onTextAlignChange={onTextAlignChange}
                                            />
                                        </AnimationWrapper>
                                    </>
                                )}

                                {/* Layering Controls */}
                                <Separator style={getSeparatorStyle(425)} />
                                <AnimationWrapper delay={450} isExpanded={isExpanded}>
                                    <LayeringInput
                                        onSendToBack={onSendToBack}
                                        onSendBackward={onSendBackward}
                                        onBringForward={onBringForward}
                                        onBringToFront={onBringToFront}
                                    />
                                </AnimationWrapper>
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
