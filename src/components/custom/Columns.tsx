"use client"

import { WorkflowRun, workflowRunMetadata } from "@/data/workflowsData";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react"

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
        header: "Created At",
        cell: ({ row }) => <div>{new Date(row.getValue("createdAt")).toLocaleString()}</div>,
    },
    {
        accessorKey: "version",
        header: () => <div className="text-right">Version</div>,
        cell: ({ row }) => <div className="text-right">{row.getValue("version")}</div>,
    },
    {
        accessorKey: "duration",
        header: () => <div className="text-right">Duration (ms)</div>,
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