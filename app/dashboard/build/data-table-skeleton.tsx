import { Skeleton } from "@/components/ui/skeleton"

export function DataTableSkeleton() {
  return (
    <div className="container mx-auto pb-4 px-1">
      <div className="flex items-center gap-x-4 pb-4 max-md:hidden">
        <Skeleton className="rouded-md border w-88 h-10" />
        <Skeleton className="rouded-md border w-18 h-8 max-lg:hidden" />
        <Skeleton className="rouded-md border w-88 h-10" />
        <div className="ml-auto flex gap-x-4">
          <Skeleton className="rouded-md border w-18 h-8 max-xl:hidden" />
          <Skeleton className="rouded-md border w-18 h-8 lg:hidden" />
          <Skeleton className="rouded-md border w-24 h-8 max-lg:hidden" />
          <Skeleton className="rounded-md border w-8 h-8" />
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-y-4 pb-4 px-1 md:hidden">
        <Skeleton className="rouded-md border w-88 h-10" />
        <Skeleton className="rouded-md border w-88 h-10" />
        <div className="flex gap-x-4 w-full justify-center">
          <Skeleton className="rouded-md border w-18 h-8" />
          <Skeleton className="rounded-md border w-8 h-8" />
        </div>
      </div>
      <Skeleton className="rounded-md border relative w-full min-h-[200px] h-[50vh] mb-4" />
      <div className="flex justify-end gap-x-4">
        <Skeleton className="rouded-md border w-28 h-8" />
        <Skeleton className="rouded-md border w-18 h-8" />
        <Skeleton className="rouded-md border w-28 h-8" />
      </div>
    </div>
  )
}