import React, { useState, useEffect } from 'react';
import { workflowRuns, workflowRunMetadata } from '@/data/workflowsData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CardOverallProps {
  getSelectedWorkflow: () => string; // Function to get the selected workflow
}

export const CardOverall: React.FC<CardOverallProps> = ({ getSelectedWorkflow }) => {
  const [mostHighUsageDate, setMostHighUsageDate] = useState<string | null>(null);
  const [slowestWorkflowRun, setSlowestWorkflowRun] = useState<number | null>(null);
  const [longestWorkflowRun, setLongestWorkflowRun] = useState<number | null>(null);
  const [overallCalls, setOverallCalls] = useState<number>(0);
  const selectedWorkflow = getSelectedWorkflow(); // Get the selected workflow using the provided function

  useEffect(() => {
    if (selectedWorkflow !== 'all') {
      // Filter workflow runs based on selectedWorkflow
      const filteredRuns = workflowRuns.filter(run => run.workflowId === selectedWorkflow);

      // Calculate most high-usage date
      const usageCounts: { [key: string]: number } = {};
      filteredRuns.forEach(run => {
        const date = new Date(run.createdAt).toDateString();
        if (usageCounts[date]) {
          usageCounts[date]++;
        } else {
          usageCounts[date] = 1;
        }
      });
      const sortedDates = Object.keys(usageCounts).sort((a, b) => usageCounts[b] - usageCounts[a]);
      setMostHighUsageDate(sortedDates[0]);

      // Calculate slowest and longest workflow run
      const durations = filteredRuns.map(run => {
        const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === run.workflowRunId);
        return metadata ? metadata.durationInMilliseconds : 0;
      });
      setSlowestWorkflowRun(Math.max(...durations));
      setLongestWorkflowRun(Math.min(...durations));

      // Calculate overall number of calls
      setOverallCalls(filteredRuns.length);
    }
  }, [getSelectedWorkflow]); // Include getSelectedWorkflow in the dependency array

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
        <CardDescription>View overall summary statistics for the selected workflow.</CardDescription>
      </CardHeader>
      {selectedWorkflow !== 'all' && (
        <CardContent>
          <p>Most High-Usage Date: {mostHighUsageDate}</p>
          <p>Slowest Workflow Run: {slowestWorkflowRun} ms</p>
          <p>Shortest Workflow Run: {longestWorkflowRun} ms</p>
          <p>Overall Number of Calls: {overallCalls}</p>
        </CardContent>
      )}
    </Card>
  );
}
