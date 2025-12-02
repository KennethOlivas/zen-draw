import { DrawingApp } from "@/components/canvas/drawing-app"
import type { Viewport, Metadata } from 'next'
import { Suspense } from "react"
import { BoardSkeleton } from "@/components/skeletons/board-skeleton"

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
    <Suspense fallback={<BoardSkeleton />}>
      <DrawingApp />
    </Suspense>
  )
}
