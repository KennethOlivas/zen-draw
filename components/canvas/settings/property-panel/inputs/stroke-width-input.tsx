import { STROKE_WIDTHS } from "@/constant/settings";
import { PropertySection } from "../shared/property-section";
import { PropertyButton } from "../shared/property-button";

interface StrokeWidthInputProps {
    value: number;
    onChange: (width: number) => void;
}

export function StrokeWidthInput({ value, onChange }: StrokeWidthInputProps) {
    return (
        <PropertySection label="Stroke width">
            {STROKE_WIDTHS.map((width) => (
                <PropertyButton
                    key={width}
                    isActive={value === width}
                    onClick={() => onChange(width)}
                    className="flex items-center justify-center p-0"
                >
                    <div
                        className="rounded-full bg-foreground"
                        style={{
                            width: width * 2 + 2,
                            height: width * 2 + 2,
                        }}
                    />
                </PropertyButton>
            ))}
        </PropertySection>
    );
}
