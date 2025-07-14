"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
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
import { ExtraOptions } from "./extra-options"

const queryClient = new QueryClient()

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
    <QueryClientProvider client={queryClient}>
      <div className="md:hidden w-full flex flex-col items-center gap-y-4 mb-4">
        <DataTableSearchFilter table={table} columnName={filterColumnName} className="w-sm" />
        <DataTableTagFilter table={table} tagOptions={tagOptions} className="w-sm" maxCount={1}/>
        <div className="flex gap-x-4 w-full justify-center">
          <DataTableViewOptions table={table} />
          <ExtraOptions size="options" tags={tags} type={type} />
        </div>
      </div>
      <div className="max-md:hidden lg:hidden w-full flex items-center gap-x-4 mb-4">
        <DataTableSearchFilter table={table} columnName={filterColumnName} className="w-xs" />
        <DataTableTagFilter table={table} tagOptions={tagOptions} className="w-85" maxCount={1}/>
        <DataTableViewOptions table={table} />
        <ExtraOptions tags={tags} type={type} className="ml-auto" />
      </div>
      <div className="max-lg:hidden xl:hidden w-full flex items-center gap-x-4 mb-4">
        <DataTableSearchFilter table={table} columnName={filterColumnName} />
        <DataTableViewOptions table={table} />
        <DataTableTagFilter table={table} tagOptions={tagOptions} />
        <AddEntityButton type={type} tags={tags} />
        <ExtraOptions tags={tags} type={type} options={["add tag", "delete tag"]} />
      </div>
      <div className="max-xl:hidden w-full">
        <div className="flex items-center flex-wrap gap-x-4 gap-y-4 pb-4">
          <DataTableSearchFilter table={table} columnName={filterColumnName} />
          <DataTableViewOptions table={table} />
          <DataTableTagFilter table={table} tagOptions={tagOptions} />
          <div className="flex items-center ml-auto flex">
            <AddTagButton type={type} className="mr-4" />
            <AddEntityButton type={type} tags={tags} />
            <ExtraOptions options={["delete tag"]} tags={tags} type={type} />
          </div>
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
    </QueryClientProvider>
    </>
  )
}