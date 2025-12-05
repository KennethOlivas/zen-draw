import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PropertyLabelProps {
    children: React.ReactNode;
    className?: string;
}

export function PropertyLabel({ children, className }: PropertyLabelProps) {
    return (
        <Label className={cn("text-xs text-muted-foreground", className)}>
            {children}
        </Label>
    );
}
