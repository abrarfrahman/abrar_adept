import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { workflowRuns, workflowRunMetadata } from '@/data/workflowsData';

interface CardWithFailsProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
}

export const CardWithFails: React.FC<CardWithFailsProps> = ({ selectedDate, onDateSelect }) => {
  const [errorRunsCount, setErrorRunsCount] = useState<number>(0);
  const [errorFreeRunsCount, setErrorFreeRunsCount] = useState<number>(0);
  const [averageSuccessDuration, setAverageSuccessDuration] = useState<number>(0);
  const [averageFailedDuration, setAverageFailedDuration] = useState<number>(0);

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    // Calculate counts here
    const filteredRuns = workflowRuns.filter(run => {
      const runDate = new Date(run.createdAt);
      return runDate.toDateString() === (date ? date.toDateString() : "");
    });
    const errorRuns = filteredRuns.filter(run => {
      const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === run.workflowRunId);
      return metadata && metadata.error;
    });
    const errorFreeRuns = filteredRuns.filter(run => {
      const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === run.workflowRunId);
      return !metadata || !metadata.error;
    });
    setErrorRunsCount(errorRuns.length);
    setErrorFreeRunsCount(errorFreeRuns.length);

    // Calculate average success and failed durations
    const successDurations = errorFreeRuns.map(run => {
      const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === run.workflowRunId);
      return metadata ? metadata.durationInMilliseconds : 0;
    });
    const failedDurations = errorRuns.map(run => {
      const metadata = workflowRunMetadata.find(meta => meta.workflowRunId === run.workflowRunId);
      return metadata ? metadata.durationInMilliseconds : 0;
    });
    const averageSuccess = successDurations.length ? successDurations.reduce((acc, val) => acc + val, 0) / successDurations.length : 0;
    const averageFailed = failedDurations.length ? failedDurations.reduce((acc, val) => acc + val, 0) / failedDurations.length : 0;
    setAverageSuccessDuration(averageSuccess);
    setAverageFailedDuration(averageFailed);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Daily Analytics</CardTitle>
        <CardDescription>Find out the failed runs for a given date.</CardDescription>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[280px] justify-start text-left font-normal ${!selectedDate && 'text-muted-foreground'}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </CardContent> 
      {selectedDate && (
        <CardContent>
          {/* Display the error and error-free runs count */}
          <p>✅ Successful Runs: {errorFreeRunsCount}</p>
          <p>❌ Error Runs: {errorRunsCount}</p>
          {/* Display the average success and failed durations */}
          <p>Mean Success Duration: {averageSuccessDuration.toFixed(0)} ms</p>
          <p>Mean Failed Duration: {averageFailedDuration.toFixed(0)} ms</p>
        </CardContent>
      )}
    </Card>
  );
}
