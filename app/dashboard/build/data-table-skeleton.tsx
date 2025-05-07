import { Skeleton } from "@/components/ui/skeleton"

export function DataTableSkeleton() {
  return (
    <div className="container mx-auto pb-4 px-1">
      <div className="flex items-center gap-x-4 pb-4">
        <Skeleton className="rouded-md border w-88 h-10" />
        <Skeleton className="rouded-md border w-18 h-8" />
        <Skeleton className="rouded-md border w-88 h-10" />
      </div>
      <Skeleton className="rounded-md border relative w-full min-h-[200px] h-[50vh] mb-4" />
      <div className="flex justify-end gap-x-4">
        <Skeleton className="rouded-md border w-18 h-8" />
        <Skeleton className="rouded-md border w-24 h-8" />
      </div>
    </div>
  )
}