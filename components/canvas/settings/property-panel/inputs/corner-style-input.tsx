import { EdgeStyle } from "@/types/canvas-types";
import { PropertyLabel } from "../shared/property-label";
import { PropertyButton } from "../shared/property-button";

interface CornerStyleInputProps {
    value: EdgeStyle;
    onChange: (style: EdgeStyle) => void;
}

export function CornerStyleInput({ value, onChange }: CornerStyleInputProps) {
    const styles = [
        { id: "none", label: "None" },
        { id: "sm", label: "Small" },
        { id: "md", label: "Medium" },
        { id: "lg", label: "Large" },
    ] as const;

    return (
        <div className="space-y-1.5">
            <PropertyLabel>Corners</PropertyLabel>
            <div className="grid grid-cols-2 gap-1">
                {styles.map((style) => (
                    <PropertyButton
                        key={style.id}
                        isActive={value === style.id}
                        onClick={() => onChange(style.id)}
                        className="h-7 w-full text-xs"
                    >
                        {style.label}
                    </PropertyButton>
                ))}
            </div>
        </div>
    );
}
