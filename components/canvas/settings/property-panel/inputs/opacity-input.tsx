import { Slider } from "@/components/ui/slider";
import { PropertyLabel } from "../shared/property-label";

interface OpacityInputProps {
    value: number;
    onChange: (value: number) => void;
}

export function OpacityInput({ value, onChange }: OpacityInputProps) {
    return (
        <div className="space-y-1.5">
            <PropertyLabel>Opacity</PropertyLabel>
            <Slider
                value={[value * 100]}
                onValueChange={([val]) => onChange(val / 100)}
                min={10}
                max={100}
                step={10}
                className="w-full"
            />
        </div>
    );
}
