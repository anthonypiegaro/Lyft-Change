"use client"

import { Table } from "@tanstack/react-table"

import { MultiSelect } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"

interface DataTableTagFilterProps<TData> {
  table: Table<TData>
  tagOptions: {
    label: string
    value: string
  }[]
  className?: string
  maxCount?: number
}

export function DataTableTagFilter<TData>({ 
  table,
  tagOptions,
  className,
  maxCount=3
}: DataTableTagFilterProps<TData>) {

  return (
    <MultiSelect
      options={tagOptions}
      onValueChange={selectedTags => {
        table.getColumn("tags")?.setFilterValue(selectedTags)
      }}
      placeholder="Filter tags..."
      defaultValue={table.getColumn("tags")?.getFilterValue() as string[] || []}
      maxCount={maxCount}
      className={cn("max-w-sm dark:bg-input/30", className)}
    />
  )
}