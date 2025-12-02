import { DrawingApp } from "@/components/canvas/drawing-app"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function Page() {
  return <DrawingApp />
}
