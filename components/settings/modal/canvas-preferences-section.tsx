
"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CanvasPreferencesSectionProps {
    gridSize: number;
    setGridSize: (value: number) => void;
    snapThreshold: number;
    setSnapThreshold: (value: number) => void;
}

export function CanvasPreferencesSection({
    gridSize,
    setGridSize,
    snapThreshold,
    setSnapThreshold,
}: CanvasPreferencesSectionProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Canvas Preferences</h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Grid Size</Label>
                        <span className="text-sm text-muted-foreground">{gridSize}px</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Adjust the size of the background grid cells.
                    </p>
                    <Slider
                        value={[gridSize]}
                        onValueChange={(vals) => setGridSize(vals[0])}
                        min={10}
                        max={100}
                        step={5}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Snap Threshold</Label>
                        <span className="text-sm text-muted-foreground">{snapThreshold}px</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Distance inversely related to zoom at which elements snap to the grid or other points.
                    </p>
                    <Slider
                        value={[snapThreshold]}
                        onValueChange={(vals) => setSnapThreshold(vals[0])}
                        min={5}
                        max={50}
                        step={1}
                    />
                </div>
            </div>
        </div>
    );
}
