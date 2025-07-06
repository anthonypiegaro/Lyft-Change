import { Skeleton } from "@/components/ui/skeleton"

export function DayPlanLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
      <Skeleton className="h-150 col-span-4 relative" />
      <Skeleton className="h-150 max-md:hidden col-span-3" />
    </div>
  )
}