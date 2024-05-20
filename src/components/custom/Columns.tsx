"use client"

import { WorkflowRun, workflowRunMetadata } from "@/data/workflowsData";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

export const Columns: ColumnDef<WorkflowRun>[] = [
    {
        id: "select",
        header: ({ table }) => (
        <Checkbox
            checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
        ),
        cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "workflowId",
        header: "Workflow ID",
        cell: ({ row }) => <div>{row.getValue("workflowId")}</div>,
    },
    {
        accessorKey: "workflowRunId",
        header: "Run ID",
        cell: ({ row }) => <div>{row.getValue("workflowRunId")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    },
    {
        accessorKey: "version",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Version
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div className="text-right">{row.getValue("version")}</div>,
    },
    {
        accessorKey: "duration",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Duration
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {
            const runId = row.getValue("workflowRunId")
            const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === runId)
            return <div className="text-right">{metadata ? metadata.durationInMilliseconds : 'N/A'}</div>
        },
    },
    {
        accessorKey: "error",
        header: "Error Message",
        cell: ({ row }) => {
            const runId = row.getValue("workflowRunId")
            const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === runId)
            return <div>{metadata ? metadata.error : 'No Error'}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const workflowRun = row.original

            return (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(workflowRun.workflowRunId)}
                    >
                    Copy Run ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View run details</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]