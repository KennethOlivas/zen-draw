import { ReactNode } from "react";
import { PropertyLabel } from "./property-label";

interface PropertySectionProps {
    label?: string;
    children: ReactNode;
    className?: string;
}

export function PropertySection({ label, children, className }: PropertySectionProps) {
    return (
        <div className={className}>
            {label && <PropertyLabel>{label}</PropertyLabel>}
            <div className="mt-1.5 flex gap-1 flex-wrap">
                {children}
            </div>
        </div>
    );
}
