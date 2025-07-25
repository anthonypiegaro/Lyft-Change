import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto container py-12 lg:py-10">
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold mb-4 lg:mb-15">History</h1>
      <div className="flex items-center py-4 gap-4">
        <div className="flex gap-4 w-full max-md:flex-col max-md:items-center">
          <Skeleton className="w-sm max-w-full h-10"/>
          <div className="flex gap-2">
            <Skeleton className="w-48 h-10" />
            <Skeleton className="w-48 h-10" />
          </div>
        </div>
      </div>
      <Skeleton className="rounded-md border mb-4 w-full min-h-[200px] h-[50vh]" />
      <div className="flex justify-end gap-x-4">
        <Skeleton className="rouded-md border w-28 h-8" />
        <Skeleton className="rouded-md border w-18 h-8" />
        <Skeleton className="rouded-md border w-28 h-8" />
      </div>
    </div>
  )
}