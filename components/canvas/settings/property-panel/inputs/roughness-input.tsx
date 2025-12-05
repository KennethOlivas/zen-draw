import { PropertySection } from "../shared/property-section";
import { PropertyButton } from "../shared/property-button";

interface RoughnessInputProps {
    value: number;
    onChange: (value: number) => void;
}

export function RoughnessInput({ value, onChange }: RoughnessInputProps) {
    return (
        <PropertySection label="Sloppiness">
            {[0, 1, 2].map((level) => (
                <PropertyButton
                    key={level}
                    isActive={value === level}
                    onClick={() => onChange(level)}
                    className="text-xs"
                >
                    {level === 0 ? "None" : level === 1 ? "Low" : "High"}
                </PropertyButton>
            ))}
        </PropertySection>
    );
}
