"use client"

import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DatePicker } from "./date-picker"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

type DateRange = { start?: Date; end?: Date }

function isDateRange(val: unknown): val is DateRange {
  return (
    typeof val === "object" &&
    val !== null &&
    ("start" in val || "end" in val)
  )
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    },
  })

  const dateFilterValue = table.getColumn("date")?.getFilterValue()
  const startDate = isDateRange(dateFilterValue) ? dateFilterValue.start : undefined
  const endDate = isDateRange(dateFilterValue) ? dateFilterValue.end : undefined

  return (
    <>
      <div className="flex items-center py-4 gap-4">
        <div className="flex gap-4 w-full max-md:flex-col max-md:items-center">
          <div className="flex flex-col gap-1">
            <Label>Workout filter</Label>
            <Input
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-sm max-w-full"
            />
          </div>
          <div className="flex gap-2">
            <DatePicker 
              date={startDate}
              setDate={(date: Date | undefined) => table.getColumn("date")?.setFilterValue({
                start: date,
                end: endDate
              })}
              label="Start date"
            />
            <DatePicker 
              date={endDate}
              setDate={(date: Date | undefined) => table.getColumn("date")?.setFilterValue({
                start: startDate,
                end: date
              })}
              label="End date"
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      }
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? ( 
              table.getRowModel().rows.map(row => (
                <TableRow 
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  )
}