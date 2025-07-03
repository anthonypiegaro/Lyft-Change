import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="w-[200px] mx-auto my-10" />
      <Skeleton className="container mx-auto h-100 lg:h-150" />
    </>
  )
}