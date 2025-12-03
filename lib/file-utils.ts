import { CanvasElement } from "@/types/canvas-types"
import { getElementBounds, renderElementToPath } from "@/lib/rough-renderer"

export async function generateThumbnail(elements: CanvasElement[], backgroundColor: string): Promise<string> {
    if (elements.length === 0) return ""

    return new Promise((resolve) => {
        let minX = Number.POSITIVE_INFINITY,
            minY = Number.POSITIVE_INFINITY,
            maxX = Number.NEGATIVE_INFINITY,
            maxY = Number.NEGATIVE_INFINITY
        elements.forEach((el) => {
            const bounds = getElementBounds(el)
            minX = Math.min(minX, bounds.x)
            minY = Math.min(minY, bounds.y)
            maxX = Math.max(maxX, bounds.x + bounds.width)
            maxY = Math.max(maxY, bounds.y + bounds.height)
        })

        const padding = 40
        const width = maxX - minX + padding * 2
        const height = maxY - minY + padding * 2

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("width", String(width))
        svg.setAttribute("height", String(height))
        svg.setAttribute("viewBox", `${minX - padding} ${minY - padding} ${width} ${height}`)

        const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        bg.setAttribute("x", String(minX - padding))
        bg.setAttribute("y", String(minY - padding))
        bg.setAttribute("width", String(width))
        bg.setAttribute("height", String(height))
        bg.setAttribute("fill", backgroundColor)
        svg.appendChild(bg)

        elements.forEach((element) => {
            if (element.type === "text") {
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
                text.setAttribute("x", String(element.x))
                text.setAttribute("y", String(element.y + (element.fontSize || 20)))
                text.setAttribute("fill", element.strokeColor)
                text.setAttribute("opacity", String(element.opacity))
                text.setAttribute("font-size", String(element.fontSize || 20))
                text.setAttribute("font-family", "Virgil, cursive")
                text.textContent = element.text || ""
                svg.appendChild(text)
            } else {
                const { path, fill, fillPath: renderFillPath } = renderElementToPath(element, elements)
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
                g.setAttribute("opacity", String(element.opacity))

                if (fill !== "transparent" && fill !== "none") {
                    const fillPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
                    fillPath.setAttribute("d", renderFillPath || path)
                    fillPath.setAttribute("fill", fill)
                    fillPath.setAttribute("stroke", "none")
                    g.appendChild(fillPath)
                }

                const strokePath = document.createElementNS("http://www.w3.org/2000/svg", "path")
                strokePath.setAttribute("d", path)
                strokePath.setAttribute("fill", "none")
                strokePath.setAttribute("stroke", element.strokeColor)
                strokePath.setAttribute("stroke-width", String(element.strokeWidth))
                strokePath.setAttribute("stroke-linecap", "round")
                strokePath.setAttribute("stroke-linejoin", "round")
                if (element.strokeStyle === "dashed") {
                    strokePath.setAttribute("stroke-dasharray", `${element.strokeWidth * 4} ${element.strokeWidth * 2}`)
                } else if (element.strokeStyle === "dotted") {
                    strokePath.setAttribute("stroke-dasharray", `${element.strokeWidth} ${element.strokeWidth * 2}`)
                }
                g.appendChild(strokePath)

                svg.appendChild(g)
            }
        })

        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
        })
        const url = URL.createObjectURL(svgBlob)

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            const canvas = document.createElement("canvas")
            // Create a small thumbnail
            const maxDim = 400
            const scale = Math.min(maxDim / width, maxDim / height)
            canvas.width = width * scale
            canvas.height = height * scale

            const ctx = canvas.getContext("2d")!
            ctx.scale(scale, scale)
            ctx.drawImage(img, 0, 0)

            const dataUrl = canvas.toDataURL("image/jpeg", 0.7)
            URL.revokeObjectURL(url)
            resolve(dataUrl)
        }
        img.onerror = () => {
            URL.revokeObjectURL(url)
            resolve("")
        }
        img.src = url
    })
}

export function exportPNG(elements: CanvasElement[], backgroundColor: string) {
    if (elements.length === 0) return

    let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY
    elements.forEach((el) => {
        const bounds = getElementBounds(el)
        minX = Math.min(minX, bounds.x)
        minY = Math.min(minY, bounds.y)
        maxX = Math.max(maxX, bounds.x + bounds.width)
        maxY = Math.max(maxY, bounds.y + bounds.height)
    })

    const padding = 40
    const width = maxX - minX + padding * 2
    const height = maxY - minY + padding * 2

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", String(width))
    svg.setAttribute("height", String(height))
    svg.setAttribute("viewBox", `${minX - padding} ${minY - padding} ${width} ${height}`)

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    bg.setAttribute("x", String(minX - padding))
    bg.setAttribute("y", String(minY - padding))
    bg.setAttribute("width", String(width))
    bg.setAttribute("height", String(height))
    bg.setAttribute("fill", backgroundColor)
    svg.appendChild(bg)

    elements.forEach((element) => {
        if (element.type === "text") {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
            text.setAttribute("x", String(element.x))
            text.setAttribute("y", String(element.y + (element.fontSize || 20)))
            text.setAttribute("fill", element.strokeColor)
            text.setAttribute("opacity", String(element.opacity))
            text.setAttribute("font-size", String(element.fontSize || 20))
            text.setAttribute("font-family", "Virgil, cursive")
            text.textContent = element.text || ""
            svg.appendChild(text)
        } else {
            const { path, fill, fillPath: renderFillPath } = renderElementToPath(element, elements)
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
            g.setAttribute("opacity", String(element.opacity))

            if (fill !== "transparent" && fill !== "none") {
                const fillPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
                fillPath.setAttribute("d", renderFillPath || path)
                fillPath.setAttribute("fill", fill)
                fillPath.setAttribute("stroke", "none")
                g.appendChild(fillPath)
            }

            const strokePath = document.createElementNS("http://www.w3.org/2000/svg", "path")
            strokePath.setAttribute("d", path)
            strokePath.setAttribute("fill", "none")
            strokePath.setAttribute("stroke", element.strokeColor)
            strokePath.setAttribute("stroke-width", String(element.strokeWidth))
            strokePath.setAttribute("stroke-linecap", "round")
            strokePath.setAttribute("stroke-linejoin", "round")
            if (element.strokeStyle === "dashed") {
                strokePath.setAttribute("stroke-dasharray", `${element.strokeWidth * 4} ${element.strokeWidth * 2}`)
            } else if (element.strokeStyle === "dotted") {
                strokePath.setAttribute("stroke-dasharray", `${element.strokeWidth} ${element.strokeWidth * 2}`)
            }
            g.appendChild(strokePath)

            svg.appendChild(g)
        }
    })

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
    })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = width * 2
        canvas.height = height * 2
        const ctx = canvas.getContext("2d")!
        ctx.scale(2, 2)
        ctx.drawImage(img, 0, 0)

        canvas.toBlob((blob) => {
            if (blob) {
                const a = document.createElement("a")
                a.href = URL.createObjectURL(blob)
                a.download = `drawing-${Date.now()}.png`
                a.click()
            }
        }, "image/png")

        URL.revokeObjectURL(url)
    }
    img.src = url
}

export function exportSVG(elements: CanvasElement[], backgroundColor: string) {
    if (elements.length === 0) return

    let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY
    elements.forEach((el) => {
        const bounds = getElementBounds(el)
        minX = Math.min(minX, bounds.x)
        minY = Math.min(minY, bounds.y)
        maxX = Math.max(maxX, bounds.x + bounds.width)
        maxY = Math.max(maxY, bounds.y + bounds.height)
    })

    const padding = 40
    const width = maxX - minX + padding * 2
    const height = maxY - minY + padding * 2

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX - padding
        } ${minY - padding} ${width} ${height}">\n`

    svgContent += `  <rect x="${minX - padding}" y="${minY - padding
        }" width="${width}" height="${height}" fill="${backgroundColor}"/>\n`

    elements.forEach((element) => {
        if (element.type === "text") {
            svgContent += `  <text x="${element.x}" y="${element.y + (element.fontSize || 20)}" fill="${element.strokeColor
                }" opacity="${element.opacity}" fontSize="${element.fontSize || 20}" fontFamily="Virgil, cursive">${element.text || ""
                }</text>\n`
        } else {
            const { path, fill, fillPath } = renderElementToPath(element, elements)
            svgContent += `  <g opacity="${element.opacity}">\n`
            if (fill !== "transparent" && fill !== "none") {
                svgContent += `    <path d="${fillPath || path}" fill="${fill}" stroke="none"/>\n`
            }
            const lineCap = "round"
            const lineJoin = "round"
            let dashArray = ""
            if (element.strokeStyle === "dashed")
                dashArray = ` strokeDasharray="${element.strokeWidth * 4} ${element.strokeWidth * 2}"`
            else if (element.strokeStyle === "dotted")
                dashArray = ` strokeDasharray="${element.strokeWidth} ${element.strokeWidth * 2}"`
            svgContent += `    <path d="${path}" fill="none" stroke="${element.strokeColor}" strokeWidth="${element.strokeWidth}" strokeLinecap="${lineCap}" strokeLinejoin="${lineJoin}"${dashArray}/>\n`
            svgContent += `  </g>\n`
        }
    })

    svgContent += `</svg>`

    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `drawing-${Date.now()}.svg`
    a.click()
}
