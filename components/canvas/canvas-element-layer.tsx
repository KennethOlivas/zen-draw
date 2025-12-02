import { CanvasElement } from "@/types/canvas-types"
import { renderElementToPath } from "@/lib/rough-renderer"

interface CanvasElementLayerProps {
    elements: CanvasElement[]
    panOffset: { x: number; y: number }
    zoom: number
}

function getStrokeDashArray(style: string | undefined, strokeWidth: number): string {
    switch (style) {
        case "dashed":
            return `${strokeWidth * 4} ${strokeWidth * 2}`
        case "dotted":
            return `${strokeWidth} ${strokeWidth * 2}`
        default:
            return "none"
    }
}

export function CanvasElementLayer({ elements, panOffset, zoom }: CanvasElementLayerProps) {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
            }}
        >
            {elements.map((element) => {
                if (element.type === "text") {
                    return (
                        <text
                            key={element.id}
                            x={element.x}
                            y={element.y + (element.fontSize || 20)}
                            fill={element.strokeColor}
                            opacity={element.opacity}
                            fontSize={element.fontSize || 20}
                            fontFamily="Virgil, cursive"
                            textAnchor={element.textAlign === "center" ? "middle" : element.textAlign === "right" ? "end" : "start"}
                        >
                            {element.text}
                        </text>
                    )
                }

                const { path, fill, fillPath } = renderElementToPath(element, elements)
                const dashArray = getStrokeDashArray(element.strokeStyle, element.strokeWidth)
                const lineCap = element.edgeStyle === "sharp" ? "square" : "round"
                const lineJoin = element.edgeStyle === "sharp" ? "miter" : "round"

                return (
                    <g key={element.id} opacity={element.opacity}>
                        {fill !== "transparent" && fill !== "none" && <path d={fillPath || path} fill={fill} stroke="none" />}
                        <path
                            d={path}
                            fill="none"
                            stroke={element.strokeColor}
                            strokeWidth={element.strokeWidth}
                            strokeLinecap={lineCap}
                            strokeLinejoin={lineJoin}
                            strokeDasharray={dashArray}
                        />
                    </g>
                )
            })}
        </svg>
    )
}
