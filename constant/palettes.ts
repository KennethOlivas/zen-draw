export interface ColorPalette {
    id: string
    name: string
    colors: string[]
}

export const DEFAULT_PALETTES: ColorPalette[] = [
    {
        id: "default-1",
        name: "High Contrast",
        colors: ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF"],
    },
    {
        id: "default-2",
        name: "Minimal",
        colors: ["#1A1A1A", "#4A4A4A", "#8A8A8A", "#CACACA", "#F0F0F0"],
    },
    {
        id: "default-3",
        name: "Elegant",
        colors: ["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#2980B9"],
    },
    {
        id: "default-4",
        name: "Nature",
        colors: ["#2ECC71", "#27AE60", "#F1C40F", "#E67E22", "#D35400"],
    },
    {
        id: "default-5",
        name: "Pastel",
        colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
    },
]
