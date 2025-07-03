import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSkeleton() {
  return (
    <div className="container mx-auto mt-5 md:py-15">
      <Skeleton className="flex flex-col h-[90%] border rounded-lg shadow-sm" />
    </div>
  )
}