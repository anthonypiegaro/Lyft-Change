"use client"

import { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DataTableSearchFilterProps<TData> {
  columnName: string
  table: Table<TData>
  className?: string
}

export function DataTableSearchFilter<TData>({ 
  columnName,
  table,
  className
}: DataTableSearchFilterProps<TData>) {
  return (
    <Input
      placeholder={`Filter by ${columnName}...`}
      value={(table.getColumn(columnName)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(columnName)?.setFilterValue(event.target.value)
      }
      className={cn("max-w-sm", className)}
    />
  )
}