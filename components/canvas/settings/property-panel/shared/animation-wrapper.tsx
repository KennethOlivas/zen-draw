import { CSSProperties, ReactNode } from "react";

interface AnimationWrapperProps {
    children: ReactNode;
    delay: number;
    isExpanded: boolean;
}

export function AnimationWrapper({ children, delay, isExpanded }: AnimationWrapperProps) {
    const style: CSSProperties = {
        transitionProperty: "opacity, transform",
        transitionDuration: "200ms",
        transitionTimingFunction: "ease-out",
        transitionDelay: isExpanded ? `${delay}ms` : "0ms",
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
    };

    return <div style={style}>{children}</div>;
}
