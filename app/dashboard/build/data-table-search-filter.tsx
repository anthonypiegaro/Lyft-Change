"use client"

import { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"

interface DataTableSearchFilterProps<TData> {
  columnName: string,
  table: Table<TData>
}

export function DataTableSearchFilter<TData>({ 
  columnName,
  table
}: DataTableSearchFilterProps<TData>) {
  return (
    <Input
      placeholder={`Filter by ${columnName}...`}
      value={(table.getColumn(columnName)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(columnName)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  )
}