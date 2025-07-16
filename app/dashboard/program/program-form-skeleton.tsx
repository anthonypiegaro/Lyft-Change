import { Skeleton } from "@/components/ui/skeleton"

export function ProgramFormSkeleton() {
  return (
    <div className="flex flex-col grow gap-y-4 w-full h-full mx-auto max-w-7xl py-7 px-2 md:pl-0 md:pr-2">
      <Skeleton className="w-full h-64" />
      <Skeleton className="w-full h-25 lg:hidden" />
      <div className="flex w-full gap-x-4 grow">
        <Skeleton className="w-xs h-full max-lg:hidden" />
        <Skeleton className="grow h-full" />
      </div>
    </div>
  )
}