import { DrawingApp } from "@/components/canvas/drawing-app"
import type { Viewport, Metadata } from 'next'
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "New Board",
  description: "Start drawing on a new board.",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DrawingApp />
    </Suspense>
  )
}
