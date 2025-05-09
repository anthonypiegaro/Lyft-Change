"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ExerciseMutationFormSkeleton() {
    return (
        <form className="flex flex-col gap-y-4">
            <Skeleton className="w-48 h-12" />
            <Skeleton className="w-full h-12"/>
            <Skeleton className="w-48 h-12" />
            <Skeleton className="w-full h-36"/>
            <Skeleton className="w-24 h-8" />
        </form>
    )
}