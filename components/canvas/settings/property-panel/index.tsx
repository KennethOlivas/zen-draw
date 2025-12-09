"use client";

import { Tool, StrokeStyle, EdgeStyle, TextAlign } from "@/types/canvas-types";
import { ColorPalette } from "@/constant/palettes";
import { COLORS, FILL_COLORS } from "@/constant/settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ColorPicker } from "../color-picker";
import { usePropertyPanelLogic } from "./use-property-panel-logic";
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
    disableDefaultColors?: boolean;
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
        disableDefaultColors,
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

    return (
        <TooltipProvider delayDuration={300}>
            <div
                className={cn(
                    "fixed left-4 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none select-none",
                    isExpanded ? "w-64" : "w-auto" // Increased width for better mobile layout
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
                            "overflow-hidden bg-card",
                            isExpanded
                                ? "max-w-[300px] opacity-100" // Increased max-width
                                : "max-w-0 opacity-0"
                        )}
                        style={{
                            transitionProperty: "max-width, opacity",
                            transitionDuration: "300ms",
                            transitionTimingFunction: "ease-out",
                        }}
                    >
                        {contentVisible && (
                            <div className="flex flex-col w-60"> {/* Fixed width content container */}
                                <ScrollArea className="h-[min(400px,60vh)] w-full">
                                    <div className="p-4">
                                        <Accordion type="multiple" defaultValue={["stroke", "fill", "text"]} className="w-full space-y-2">

                                            {/* Stroke Section */}
                                            {(showStroke || showStrokeWidth || showStrokeStyle || showEdges) && (
                                                <AccordionItem value="stroke" className="border-b-0">
                                                    <AccordionTrigger className="py-2 hover:no-underline font-semibold text-sm">Stroke</AccordionTrigger>
                                                    <AccordionContent className="space-y-4 pt-2">
                                                        {showStroke && (
                                                            <ColorPicker
                                                                color={strokeColor}
                                                                colors={COLORS}
                                                                palettes={palettes}
                                                                disableDefaultColors={disableDefaultColors}
                                                                label="Color"
                                                                onChange={onStrokeColorChange}
                                                                onManagePresets={onManagePresets}
                                                            />
                                                        )}
                                                        {showStrokeWidth && (
                                                            <StrokeWidthInput
                                                                value={strokeWidth}
                                                                onChange={onStrokeWidthChange}
                                                            />
                                                        )}
                                                        {showStrokeStyle && (
                                                            <StrokeStyleInput
                                                                value={strokeStyle}
                                                                onChange={onStrokeStyleChange}
                                                            />
                                                        )}
                                                        {showEdges && (
                                                            <CornerStyleInput
                                                                value={edgeStyle}
                                                                onChange={onEdgeStyleChange}
                                                            />
                                                        )}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}

                                            {/* Fill Section */}
                                            {showFill && (
                                                <AccordionItem value="fill" className="border-b-0">
                                                    <AccordionTrigger className="py-2 hover:no-underline font-semibold text-sm">Fill</AccordionTrigger>
                                                    <AccordionContent className="pt-2">
                                                        <ColorPicker
                                                            color={fillColor}
                                                            colors={FILL_COLORS}
                                                            palettes={palettes}
                                                            disableDefaultColors={disableDefaultColors}
                                                            label="Color"
                                                            onChange={onFillColorChange}
                                                            onManagePresets={onManagePresets}
                                                        />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}

                                            {/* Text Section */}
                                            {showTextProps && (
                                                <AccordionItem value="text" className="border-b-0">
                                                    <AccordionTrigger className="py-2 hover:no-underline font-semibold text-sm">Text</AccordionTrigger>
                                                    <AccordionContent className="pt-2">
                                                        <TextPropertiesInput
                                                            fontSize={fontSize}
                                                            textAlign={textAlign}
                                                            onFontSizeChange={onFontSizeChange}
                                                            onTextAlignChange={onTextAlignChange}
                                                        />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}

                                            {/* Advanced Section */}
                                            {(showRoughness || showOpacity) && (
                                                <AccordionItem value="advanced" className="border-b-0">
                                                    <AccordionTrigger className="py-2 hover:no-underline font-semibold text-sm">Advanced</AccordionTrigger>
                                                    <AccordionContent className="space-y-4 pt-2">
                                                        {showRoughness && (
                                                            <RoughnessInput
                                                                value={roughness}
                                                                onChange={onRoughnessChange}
                                                            />
                                                        )}
                                                        {showOpacity && (
                                                            <OpacityInput
                                                                value={opacity}
                                                                onChange={onOpacityChange}
                                                            />
                                                        )}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}

                                            {/* Layers Section */}
                                            <AccordionItem value="layers" className="border-b-0">
                                                <AccordionTrigger className="py-2 hover:no-underline font-semibold text-sm">Layers</AccordionTrigger>
                                                <AccordionContent className="pt-2">
                                                    <LayeringInput
                                                        onSendToBack={onSendToBack}
                                                        onSendBackward={onSendBackward}
                                                        onBringForward={onBringForward}
                                                        onBringToFront={onBringToFront}
                                                    />
                                                </AccordionContent>
                                            </AccordionItem>

                                        </Accordion>
                                    </div>
                                </ScrollArea>
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
