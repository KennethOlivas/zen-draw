import { FONT_SIZES } from "@/constant/settings";
import { TextAlign } from "@/types/canvas-types";
import { PropertySection } from "../shared/property-section";
import { PropertyButton } from "../shared/property-button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface TextPropertiesInputProps {
    fontSize: number;
    textAlign: TextAlign;
    onFontSizeChange: (size: number) => void;
    onTextAlignChange: (align: TextAlign) => void;
}

export function TextPropertiesInput({
    fontSize,
    textAlign,
    onFontSizeChange,
    onTextAlignChange
}: TextPropertiesInputProps) {
    const aligns = [
        { id: "left", icon: <AlignLeft className="h-4 w-4" /> },
        { id: "center", icon: <AlignCenter className="h-4 w-4" /> },
        { id: "right", icon: <AlignRight className="h-4 w-4" /> },
    ] as const;

    return (
        <>
            <PropertySection label="Font size">
                {FONT_SIZES.map((size) => (
                    <PropertyButton
                        key={size}
                        isActive={fontSize === size}
                        onClick={() => onFontSizeChange(size)}
                        className="px-2"
                    >
                        {size}
                    </PropertyButton>
                ))}
            </PropertySection>

            <PropertySection label="Text align" className="mt-3">
                {aligns.map((align) => (
                    <PropertyButton
                        key={align.id}
                        isActive={textAlign === align.id}
                        onClick={() => onTextAlignChange(align.id)}
                    >
                        {align.icon}
                    </PropertyButton>
                ))}
            </PropertySection>
        </>
    );
}
