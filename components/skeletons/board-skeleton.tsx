import { Skeleton } from "@/components/ui/skeleton"

export function BoardSkeleton() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      {/* Top Bar Skeleton */}
      <div className="absolute top-4 left-4 right-16 md:right-4 z-50 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-card p-2 rounded-xl border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <Skeleton className="h-8 w-8 rounded-md mr-2" />
          <div className="flex items-center gap-2 px-2 border-l border-border">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="fixed bottom-6 md:top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-card p-2 rounded-xl border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex items-center gap-2 pointer-events-auto">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-lg" />
            ))}
            <div className="w-px h-6 bg-border mx-1" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="w-px h-6 bg-border mx-1" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Property Panel Skeleton */}
      <div className="fixed left-4 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50 w-52 pointer-events-none">
        <div className="bg-card border-2 border-foreground rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] p-4 pointer-events-auto flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="w-full h-px bg-border" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-1">
              <Skeleton className="flex-1 h-7 rounded-md" />
              <Skeleton className="flex-1 h-7 rounded-md" />
              <Skeleton className="flex-1 h-7 rounded-md" />
              <Skeleton className="flex-1 h-7 rounded-md" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <div className="grid grid-cols-2 gap-1">
              <Skeleton className="h-7 rounded-md" />
              <Skeleton className="h-7 rounded-md" />
              <Skeleton className="h-7 rounded-md" />
              <Skeleton className="h-7 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Settings Menu Skeleton */}
      <div className="fixed right-4 top-4 bottom-24 md:bottom-4 z-40 flex flex-col pointer-events-none">
        <div className="bg-card border-2 border-foreground rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-14 h-14 flex items-center justify-center pointer-events-auto">
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
      </div>

      {/* Zoom Controls Skeleton */}
      <div className="fixed bottom-24 md:bottom-4 right-4 z-50 flex items-center gap-1 bg-card border-2 border-foreground rounded-xl p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] pointer-events-auto">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-[52px] rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  )
}
