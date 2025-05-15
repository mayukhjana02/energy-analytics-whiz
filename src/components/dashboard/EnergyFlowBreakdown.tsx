
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { EnergyMeasurement } from '@/utils/mockData';

interface EnergyFlowBreakdownProps {
  data: EnergyMeasurement[];
  className?: string;
}

interface ProcessData {
  name: string;
  total: number;
  useful: number;
  losses: number;
}

const EnergyFlowBreakdown: React.FC<EnergyFlowBreakdownProps> = ({ data, className }) => {
  // Aggregate data by process type
  const processData: ProcessData[] = [
    {
      name: 'Rice Processing',
      total: 42.5,
      useful: 38.4,
      losses: 4.1
    },
    {
      name: 'Drying',
      total: 30.2,
      useful: 26.4,
      losses: 3.8
    },
    {
      name: 'Milling',
      total: 22.8,
      useful: 19.9,
      losses: 2.9
    },
    {
      name: 'Packaging',
      total: 15.5,
      useful: 14.1,
      losses: 1.4
    },
    {
      name: 'Utilities',
      total: 18.3,
      useful: 15.8,
      losses: 2.5
    }
  ];

  // Calculate total energy and losses
  const totalEnergy = processData.reduce((sum, process) => sum + process.total, 0);
  const totalLosses = processData.reduce((sum, process) => sum + process.losses, 0);
  const lossPercentage = ((totalLosses / totalEnergy) * 100).toFixed(1);

  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Process Energy Efficiency</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Breakdown of energy usage and losses by process
            </p>
          </div>
          <Badge variant={parseFloat(lossPercentage) > 10 ? "destructive" : "outline"}>
            {lossPercentage}% overall losses
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 py-4 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit=" kWh" />
            <Tooltip 
              formatter={(value: number | string, name: string) => {
                // Handle the value properly based on its type
                const formattedValue = typeof value === 'number' 
                  ? `${value.toFixed(1)} kWh` 
                  : `${value} kWh`;
                
                return [
                  formattedValue, 
                  name === 'useful' ? 'Useful Energy' : name === 'losses' ? 'Energy Losses' : 'Total Energy'
                ];
              }}
              labelFormatter={(label) => `${label} Process`}
            />
            <Legend 
              payload={[
                { value: 'Useful Energy', type: 'square', color: '#10B981' },
                { value: 'Energy Losses', type: 'square', color: '#EF4444' }
              ]}
            />
            <Bar dataKey="useful" stackId="a" name="Useful Energy" fill="#10B981" />
            <Bar dataKey="losses" stackId="a" name="Energy Losses" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EnergyFlowBreakdown;
