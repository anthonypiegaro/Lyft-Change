import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSkeleton() {
  return (
    <div className="w-full max-h-screen p-4 pt-10">
      <Skeleton className="flex flex-col h-full border rounded-lg shadow-sm" />
    </div>
  )
}