import { RefObject, useEffect } from "react"

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
    useEffect(() => {
        if (visible && textInputRef.current) {
            const el = textInputRef.current
            el.style.height = "auto"
            el.style.height = el.scrollHeight + "px"
            el.style.width = "auto"
            el.style.width = Math.max(100, el.scrollWidth) + "px"
        }
    }, [visible, textInputRef])

    const handleInput = () => {
        if (textInputRef.current) {
            const el = textInputRef.current
            el.style.height = "auto"
            el.style.height = el.scrollHeight + "px"
            el.style.width = "auto"
            el.style.width = Math.max(100, el.scrollWidth) + "px"
        }
    }

    if (!visible) return null

    return (
        <textarea
            ref={textInputRef}
            className="absolute bg-transparent border-2 border-primary rounded p-2 outline-none resize-none font-[Virgil] text-foreground overflow-hidden"
            style={{
                left: x * zoom + panOffset.x,
                top: y * zoom + panOffset.y,
                fontSize: fontSize * zoom,
                lineHeight: 1,
            }}
            placeholder="Type here..."
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onInput={handleInput}
        />
    )
}
