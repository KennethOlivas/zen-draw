import { Skeleton } from "@/components/ui/skeleton"

export function BoardSkeleton() {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-muted/10">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-background border-b border-border flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-background border border-border rounded-lg shadow-sm z-40">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-md" />
        ))}
      </div>

      {/* Property Panel Skeleton */}
      <div className="absolute top-20 left-4 w-60 bg-background border border-border rounded-lg shadow-sm p-4 z-40 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </div>

      {/* Zoom Controls Skeleton */}
      <div className="absolute bottom-4 left-4 flex gap-2 bg-background border border-border rounded-lg p-1 z-40">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-12 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  )
}
