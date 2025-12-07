"use client";

import { useState, useEffect, useEffectEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ColorPaletteManager } from "@/components/settings/color-palette-manager";
import { AppearanceSection } from "./appearance-section";
import { CanvasPreferencesSection } from "./canvas-preferences-section";
import { updateAppSettings, type UserSettings } from "@/actions/settings/user-settings";
import { type ColorPalette } from "@/constant/palettes";

interface AppSettingsTabProps {
    settings?: UserSettings | null;
}

export function AppSettingsTab({ settings }: AppSettingsTabProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // App Settings State
    const [defaultBackgroundColor, setDefaultBackgroundColor] = useState("#ffffff");
    const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
    const [disableDefaultColors, setDisableDefaultColors] = useState(false);
    const [gridSize, setGridSize] = useState(20);
    const [snapThreshold, setSnapThreshold] = useState(25);

    const onSetDefaultBackgroundColor = useEffectEvent((color: string) => {
        setDefaultBackgroundColor(color);
    });

    const onSetColorPalettes = useEffectEvent((palettes: ColorPalette[]) => {
        setColorPalettes(palettes);
    });

    const onSetDisableDefaultColors = useEffectEvent((disable: boolean) => {
        setDisableDefaultColors(disable);
    });

    const onSetGridSize = useEffectEvent((size: number) => {
        setGridSize(size);
    });

    const onSetSnapThreshold = useEffectEvent((threshold: number) => {
        setSnapThreshold(threshold);
    });

    useEffect(() => {
        if (settings?.defaultBackgroundColor) {
            onSetDefaultBackgroundColor(settings.defaultBackgroundColor);
        }
        if (settings?.colorPalettes) {
            onSetColorPalettes(settings.colorPalettes);
        }
        if (settings?.disableDefaultColors) {
            onSetDisableDefaultColors(settings.disableDefaultColors);
        }
        if (settings?.gridSize) {
            onSetGridSize(settings.gridSize);
        }
        if (settings?.snapThreshold) {
            onSetSnapThreshold(settings.snapThreshold);
        }
    }, [settings]);

    const handleUpdateAppSettings = async () => {
        setIsLoading(true);
        const res = await updateAppSettings({
            defaultBackgroundColor,
            colorPalettes,
            disableDefaultColors,
            gridSize,
            snapThreshold
        });
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("App settings updated");
            if (typeof window !== "undefined") {
                router.refresh();
            }
        }
        setIsLoading(false);
    };

    return (
        <TabsContent value="app" className="space-y-6 mt-0">
            <AppearanceSection
                defaultBackgroundColor={defaultBackgroundColor}
                setDefaultBackgroundColor={setDefaultBackgroundColor}
                disableDefaultColors={disableDefaultColors}
                setDisableDefaultColors={setDisableDefaultColors}
            />

            <div className="border-t pt-6">
                <CanvasPreferencesSection
                    gridSize={gridSize}
                    setGridSize={setGridSize}
                    snapThreshold={snapThreshold}
                    setSnapThreshold={setSnapThreshold}
                />
            </div>

            <div className="border-t pt-6">
                <ColorPaletteManager
                    palettes={colorPalettes}
                    onPalettesChange={setColorPalettes}
                />
            </div>

            <div className="border-t pt-6 flex justify-end">
                <Button onClick={handleUpdateAppSettings} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Preferences
                </Button>
            </div>
        </TabsContent>
    );
}
