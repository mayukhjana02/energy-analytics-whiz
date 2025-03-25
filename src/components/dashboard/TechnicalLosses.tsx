
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateLosses } from '@/utils/dataTransformations';
import { EnergyMeasurement } from '@/utils/mockData';
import MetricCard from '../ui/MetricCard';
import { AlertTriangleIcon } from 'lucide-react';

interface TechnicalLossesProps {
  data: EnergyMeasurement[];
  totalActivePower: number;
  className?: string;
}

const COLORS = ['#0A84FF', '#FF9F0A', '#FF453A', '#BF5AF2'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border shadow-sm text-xs">
        <p className="font-medium mb-1">{payload[0].name}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Loss:</span>
          <span className="font-medium">
            {payload[0].value} kW ({((payload[0].value / payload[0].payload.totalValue) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    );
  }
  
  return null;
};

const TechnicalLosses: React.FC<TechnicalLossesProps> = ({ data, totalActivePower, className }) => {
  const losses = calculateLosses(data);
  
  const pieData = [
    { name: 'Transformer Losses', value: losses.transformerLosses, totalValue: totalActivePower },
    { name: 'Line Losses', value: losses.lineLosses, totalValue: totalActivePower },
    { name: 'Connection Losses', value: losses.connectionLosses, totalValue: totalActivePower },
    { name: 'Other Losses', value: losses.otherLosses, totalValue: totalActivePower },
  ];
  
  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle>Technical Losses</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 flex flex-col gap-4 h-full justify-between">
            <MetricCard
              title="Total Losses"
              value={losses.totalLosses}
              unit="kW"
              icon={<AlertTriangleIcon className="w-4 h-4" />}
              description="Sum of all technical losses in the system"
              valueClassName={losses.lossPercentage > 15 ? "text-energy-red" : losses.lossPercentage > 10 ? "text-energy-yellow" : "text-energy-green"}
            />
            
            <MetricCard
              title="Loss Percentage"
              value={losses.lossPercentage}
              unit="%"
              description="Percentage of active power lost in transmission and distribution"
              valueClassName={losses.lossPercentage > 15 ? "text-energy-red" : losses.lossPercentage > 10 ? "text-energy-yellow" : "text-energy-green"}
            />
          </div>
          
          <div className="h-[300px] lg:h-auto lg:col-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  animationDuration={800}
                  animationBegin={200}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalLosses;
