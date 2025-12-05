import { StrokeStyle } from "@/types/canvas-types";
import { PropertySection } from "../shared/property-section";
import { PropertyButton } from "../shared/property-button";
import { Minus, MoreHorizontal, Circle } from "lucide-react";

interface StrokeStyleInputProps {
    value: StrokeStyle;
    onChange: (style: StrokeStyle) => void;
}

export function StrokeStyleInput({ value, onChange }: StrokeStyleInputProps) {
    const styles = [
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
    ] as const;

    return (
        <PropertySection label="Stroke style">
            {styles.map((style) => (
                <PropertyButton
                    key={style.id}
                    isActive={value === style.id}
                    onClick={() => onChange(style.id)}
                >
                    {style.icon}
                </PropertyButton>
            ))}
        </PropertySection>
    );
}
