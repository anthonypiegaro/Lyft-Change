"use client"

import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { AddEntityButton } from "./add-entity-button"
import { AddTagButton } from "./add-tag-button"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableSearchFilter } from "./data-table-search-filter"
import { DataTableTagFilter } from "./data-table-tag-filter"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumnName: string
  type: "exercise" | "workout" | "program",
  tags: {
    id: string,
    name: string
  }[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumnName,
  type,
  tags
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      sorting
    }
  })

  const tagOptions = tags.map(tag => ({
    label: tag.name,
    value: tag.name
  }))

  return (
    <>
      <div className="flex items-center gap-x-4 pb-4">
        <DataTableSearchFilter table={table} columnName={filterColumnName} />
        <DataTableViewOptions table={table} />
        <DataTableTagFilter table={table} tagOptions={tagOptions} />
        <div className="ml-auto flex gap-x-4">
          <AddTagButton type={type} />
          <AddEntityButton type={type} tags={tags} />
        </div>
      </div>
      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {
                      header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                    }
                  </TableHead>
                ))}
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
                  No Results
                </TableCell>
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  )
}