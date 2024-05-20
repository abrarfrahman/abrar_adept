"use client"

import * as React from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { workflowRunMetadata, workflowRuns, workflows } from "@/data/workflowsData"
import { Columns } from "./Columns"
import { CardWithFails } from "./CardWithFails"
import { Heading1 } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<string>('all')
  const selectedWorkflowName = workflows.find(workflow => workflow.workflowId === selectedWorkflow)?.name ?? 'All Workflows';
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [searchText, setSearchText] = React.useState<string>('')

  const filteredData = React.useMemo(() => {
    return workflowRuns.filter(run => {
      const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === run.workflowRunId)
      return (
        (selectedWorkflow === 'all' || run.workflowId === selectedWorkflow) &&
        (!searchText || 
          run.workflowRunId.toLowerCase().includes(searchText.toLowerCase()) ||
          (metadata && metadata.error && metadata.error.toLowerCase().includes(searchText.toLowerCase()))
        )
      )
    })
  }, [searchText, selectedWorkflow])

  const table = useReactTable({
    data: filteredData,
    columns: Columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    }
  })

  return (
    <div>
      <h1 style={{
        fontSize: '2em',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5em'
      }}>
        🏃 Workflow Runs: {selectedWorkflowName}
      </h1>
      <CardWithFails></CardWithFails>
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto">
              Workflows
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setSelectedWorkflow('all')}
            >
              All Workflows
            </DropdownMenuItem>
            {workflows.map(workflow => (
              <DropdownMenuItem
                key={workflow.workflowId}
                onClick={() => setSelectedWorkflow(workflow.workflowId)}
              >
                {workflow.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Filter workflow run IDs..."
          value={(table.getColumn("workflowRunId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("workflowRunId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}