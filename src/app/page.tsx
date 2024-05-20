"use client";
import { Columns } from "@/components/custom/Columns";
import { DataTable } from "@/components/custom/DataTable";
import { workflowRuns } from "@/data/workflowsData";

export default function Home() {
  const data = workflowRuns;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <DataTable columns={Columns} data={data} />
    </main>
  );
}
