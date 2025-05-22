import { Skeleton } from "@/components/ui/skeleton"

export function WorkoutFormSkeleton() {
  return (
    <div className="flex flex-col w-full max-w-3xl gap-y-4 h-auto">
      <Skeleton className="py-10 h-8 w-86 mx-auto"/>
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-35 h-8" />
      <Skeleton className="w-full h-20"/>
      <Skeleton className="w-full h-48"/>
      <Skeleton className="w-full h-8"/>
    </div>
  )
}