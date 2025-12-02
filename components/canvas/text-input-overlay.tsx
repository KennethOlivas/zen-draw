import { RefObject } from "react"

interface TextInputOverlayProps {
    visible: boolean
    x: number
    y: number
    zoom: number
    panOffset: { x: number; y: number }
    fontSize: number
    textInputRef: RefObject<HTMLTextAreaElement>
    onBlur: () => void
    onKeyDown: (e: React.KeyboardEvent) => void
}

export function TextInputOverlay({
    visible,
    x,
    y,
    zoom,
    panOffset,
    fontSize,
    textInputRef,
    onBlur,
    onKeyDown,
}: TextInputOverlayProps) {
    if (!visible) return null

    return (
        <textarea
            ref={textInputRef}
            className="absolute bg-transparent border-2 border-primary rounded p-2 outline-none resize-none font-[Virgil] text-foreground"
            style={{
                left: x * zoom + panOffset.x,
                top: y * zoom + panOffset.y,
                minWidth: 200,
                minHeight: 40,
                fontSize: fontSize * zoom,
            }}
            placeholder="Type here..."
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    )
}
