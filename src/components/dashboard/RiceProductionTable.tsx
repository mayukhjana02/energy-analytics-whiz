
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RiceProductionMetric } from '@/types/riceData';
import { formatDistance } from 'date-fns';

interface RiceProductionTableProps {
  data: RiceProductionMetric[];
  className?: string;
}

const RiceProductionTable: React.FC<RiceProductionTableProps> = ({ data, className }) => {
  // Get the latest timestamp for each unique combination of tagId and timestamp
  const groupedData: Record<string, RiceProductionMetric[]> = {};
  
  data.forEach(metric => {
    const key = `${metric.timestamp}`;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(metric);
  });
  
  // Sort timestamps in descending order (newest first) and take the latest 5
  const latestTimestamps = Object.keys(groupedData)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .slice(0, 5);
  
  // Get the metrics for the latest timestamps
  const latestMetricsGroups = latestTimestamps.map(timestamp => groupedData[timestamp]);
  
  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle>Rice Production Data</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[130px]">Time</TableHead>
                <TableHead>Tag ID</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="hidden md:table-cell">Machine</TableHead>
                <TableHead className="hidden md:table-cell text-right">Ago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestMetricsGroups.flatMap((group, groupIndex) => 
                group.sort((a, b) => a.tagId.localeCompare(b.tagId)).map((metric, metricIndex) => (
                  <TableRow 
                    key={metric.id}
                    className={metricIndex === 0 && groupIndex > 0 ? "border-t-4" : ""}
                  >
                    <TableCell className="font-medium">
                      {metricIndex === 0 ? metric.createdAt.substring(11) : ""}
                    </TableCell>
                    <TableCell>{metric.tagId}</TableCell>
                    <TableCell className="text-right">
                      {metric.value.toFixed(2)}
                      {metric.tagId.includes('TPH') ? ' TPH' : 
                       metric.tagId.includes('TOT') ? ' tons' : 
                       metric.tagId.includes('AMPS') ? ' A' : 
                       metric.tagId.includes('KWH') ? ' kWh' : ''}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{metric.machineId}</TableCell>
                    <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                      {metricIndex === 0 ? 
                        formatDistance(new Date(metric.timestamp), new Date(), { addSuffix: true }) : 
                        ""}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiceProductionTable;
