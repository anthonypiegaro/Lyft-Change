import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto container flex flex-col gap-y-6 w-full max-h-screen p-4 pt-15">
      <div className="max-md:hidden flex justify-between gap-x-4 h-28">
        <Skeleton className="h-full flex-1 transition-all group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800" />
        <Skeleton className="h-full flex-1 transition-all group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800" />
        <Skeleton className="h-full flex-1 transition-all group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <Skeleton className="h-150 col-span-4 relative" />
        <Skeleton className="h-150 max-md:hidden col-span-3" />
      </div>
    </div>
  )
}