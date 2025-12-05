"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import { type ColorPalette } from "@/constant/palettes";
import { updateAppSettings } from "@/actions/settings/user-settings";
import { toast } from "sonner";
import { nanoid } from "nanoid";

interface ColorPaletteManagerProps {
    palettes: ColorPalette[];
    onPalettesChange: (palettes: ColorPalette[]) => void;
}

export function ColorPaletteManager({ palettes, onPalettesChange }: ColorPaletteManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newPaletteName, setNewPaletteName] = useState("");
    const [newPaletteColors, setNewPaletteColors] = useState<string[]>(["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff"]);

    const handleCreatePalette = async () => {
        if (!newPaletteName.trim()) {
            toast.error("Please enter a palette name");
            return;
        }

        const newPalette: ColorPalette = {
            id: nanoid(),
            name: newPaletteName,
            colors: newPaletteColors,
        };

        const updatedPalettes = [...palettes, newPalette];
        onPalettesChange(updatedPalettes);
        await updateAppSettings({ colorPalettes: updatedPalettes });

        setIsCreating(false);
        setNewPaletteName("");
        setNewPaletteColors(["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff"]);
        toast.success("Palette created");
    };

    const handleDeletePalette = async (id: string) => {
        const updatedPalettes = palettes.filter(p => p.id !== id);
        onPalettesChange(updatedPalettes);
        await updateAppSettings({ colorPalettes: updatedPalettes });
        toast.success("Palette deleted");
    };

    const handleColorChange = (index: number, color: string) => {
        const updatedColors = [...newPaletteColors];
        updatedColors[index] = color;
        setNewPaletteColors(updatedColors);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Custom Color Palettes</Label>
                <Button onClick={() => setIsCreating(true)} variant="outline" size="sm" disabled={isCreating}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Palette
                </Button>
            </div>

            {isCreating && (
                <div className="border rounded-lg p-4 bg-muted/20 space-y-4">
                    <div className="space-y-2">
                        <Label>Palette Name</Label>
                        <Input
                            value={newPaletteName}
                            onChange={(e) => setNewPaletteName(e.target.value)}
                            placeholder="e.g. Neon Vibes"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Colors (5 max)</Label>
                        <div className="flex gap-2">
                            {newPaletteColors.map((color, index) => (
                                <Input
                                    key={index}
                                    type="color"
                                    value={color}
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                    className="w-10 h-10 p-1 cursor-pointer"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                        <Button onClick={handleCreatePalette}>Save Palette</Button>
                    </div>
                </div>
            )}

            <div className="grid gap-3">
                {palettes.length === 0 && !isCreating && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No custom palettes yet. Create one to get started!
                    </p>
                )}
                {palettes.map((palette) => (
                    <div key={palette.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="space-y-1">
                            <span className="font-medium text-sm">{palette.name}</span>
                            <div className="flex gap-1.5">
                                {palette.colors.map((color, idx) => (
                                    <div
                                        key={`${palette.id}-${idx}`}
                                        className="w-5 h-5 rounded-md border border-border"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeletePalette(palette.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
