import { DrawingApp } from "@/components/canvas/core/drawing-app"
import type { Viewport, Metadata } from 'next'
import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { BoardSkeleton } from "@/components/skeletons/board-skeleton"
import { type UserData } from "@/components/settings/settings-modal"
import { type UserSettings } from "@/actions/settings/user-settings"

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

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  let userData: UserData | undefined;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        image: true,
        settings: true
      }
    });

    if (user) {
      userData = {
        name: user.name,
        image: user.image,
        settings: user.settings as unknown as UserSettings
      };
    }
  }

  return (
    <Suspense fallback={<BoardSkeleton />}>
      <DrawingApp user={userData} />
    </Suspense>
  )
}
