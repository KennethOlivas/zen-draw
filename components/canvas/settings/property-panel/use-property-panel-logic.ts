import { Tool } from "@/types/canvas-types";
import { useState, useEffect } from "react";

// Use a ponyfill or check if available, but since this is Next.js with React 19 (likely), imports might be different.
// The original file used `import { useEffectEvent } from "react";` which might be experimental.
// For safety I will implement a basic version or rely on standard useEffect if that's unstable,
// but since the user had it, I'll try to keep it or use a stable alternative for the delay logic.
// Actually, looking at the previous file: `import { useState, useEffect, useEffectEvent } from "react";`
// I'll stick to standard hooks for now to ensure stability unless necessary.

export function usePropertyPanelLogic(activeType: string | Tool) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [contentVisible, setContentVisible] = useState(true);

    // Logic for what to show
    const showStroke = ["rectangle", "ellipse", "diamond", "line", "arrow", "freehand", "text"].includes(activeType);
    const showFill = ["rectangle", "ellipse", "diamond"].includes(activeType);
    const showStrokeWidth = ["rectangle", "ellipse", "diamond", "line", "arrow", "freehand"].includes(activeType);
    const showStrokeStyle = ["rectangle", "ellipse", "diamond", "line", "arrow"].includes(activeType);
    const showEdges = ["rectangle", "diamond"].includes(activeType);
    const showRoughness = ["rectangle", "ellipse", "diamond", "line", "arrow"].includes(activeType);
    const showOpacity = ["rectangle", "ellipse", "diamond", "line", "arrow", "freehand", "text"].includes(activeType);
    const showTextProps = activeType === "text";

    const hasAnyProperty = showStroke || showFill || showStrokeWidth || showStrokeStyle || showEdges || showRoughness || showOpacity || showTextProps;

    // Stagger effect for content visibility
    // Stagger effect for content visibility
    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => setContentVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setContentVisible(false), 0);
            return () => clearTimeout(timer);
        }
    }, [isExpanded]);

    return {
        isExpanded,
        setIsExpanded,
        contentVisible,
        properties: {
            showStroke,
            showFill,
            showStrokeWidth,
            showStrokeStyle,
            showEdges,
            showRoughness,
            showOpacity,
            showTextProps,
        },
        hasAnyProperty
    };
}
