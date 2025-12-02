import { Skeleton } from "@/components/ui/skeleton"

export function ProjectCardSkeleton() {
  return (
    <div className="group relative bg-card border-2 border-border rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      <div className="aspect-video bg-muted relative overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="p-4 flex justify-between items-start">
        <div className="w-full pr-2">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  )
}
