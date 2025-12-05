import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PropertyButtonProps {
    isActive?: boolean;
    onClick: () => void;
    children?: ReactNode;
    icon?: ReactNode;
    className?: string;
    title?: string;
    disabled?: boolean;
}

export function PropertyButton({
    isActive,
    onClick,
    children,
    icon,
    className,
    title,
    disabled
}: PropertyButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            className={cn(
                "h-7 flex-1 px-2 transition-colors",
                isActive
                    ? "bg-accent border-primary text-accent-foreground"
                    : "border-border hover:bg-accent/50",
                className
            )}
            onClick={onClick}
            title={title}
            disabled={disabled}
        >
            {icon}
            {children}
        </Button>
    );
}
