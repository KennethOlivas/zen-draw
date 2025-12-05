"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BACKGROUND_COLORS } from "@/constant/settings";
import { cn } from "@/lib/utils";

interface AppearanceSectionProps {
    defaultBackgroundColor: string;
    setDefaultBackgroundColor: (color: string) => void;
    disableDefaultColors: boolean;
    setDisableDefaultColors: (disable: boolean) => void;
}

export function AppearanceSection({
    defaultBackgroundColor,
    setDefaultBackgroundColor,
    disableDefaultColors,
    setDisableDefaultColors,
}: AppearanceSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="space-y-2">
                <Label>Default Canvas Background</Label>
                <p className="text-sm text-muted-foreground">
                    Choose the default background color for new projects.
                </p>
                <div className="grid grid-cols-8 gap-4">
                    {BACKGROUND_COLORS.map((color) => (
                        <Button
                            key={color}
                            size="icon-lg"
                            className={cn(
                                defaultBackgroundColor === color ? "border-none ring-2 ring-yellow-500" : "border-border",
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setDefaultBackgroundColor(color)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Disable Default Colors</Label>
                        <div className="text-sm text-muted-foreground">
                            Hide default colors in the color picker and only show presets.
                        </div>
                    </div>
                    <Switch
                        checked={disableDefaultColors}
                        onCheckedChange={setDisableDefaultColors}
                    />
                </div>
            </div>
        </div>
    );
}
