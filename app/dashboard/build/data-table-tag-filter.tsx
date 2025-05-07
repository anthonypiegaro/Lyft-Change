"use client"

import { Table } from "@tanstack/react-table"

import { MultiSelect } from "@/components/ui/multi-select"

interface DataTableTagFilterProps<TData> {
  table: Table<TData>
  tagOptions: {
    label: string,
    value: string
  }[]
}

export function DataTableTagFilter<TData>({ 
  table,
  tagOptions
}: DataTableTagFilterProps<TData>) {

  return (
    <MultiSelect
      options={tagOptions}
      onValueChange={selectedTags => {
        table.getColumn("tags")?.setFilterValue(selectedTags)
      }}
      placeholder="Filter tags..."
      defaultValue={table.getColumn("tags")?.getFilterValue() as string[] || []}
      maxCount={3}
      className="max-w-sm dark:bg-input/30"
    />
  )
}