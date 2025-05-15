
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
            {payload[0].value.toFixed(2)} kW ({((payload[0].value / payload[0].payload.totalValue) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    );
  }
  
  return null;
};

const TechnicalLosses: React.FC<TechnicalLossesProps> = ({ data, totalActivePower, className }) => {
  // Ensure we have valid data before calculating losses
  const validData = Array.isArray(data) && data.length > 0;
  const validTotalPower = typeof totalActivePower === 'number' && !isNaN(totalActivePower) && totalActivePower > 0;
  
  // Calculate losses only if we have valid data
  const losses = validData ? calculateLosses(data) : {
    transformerLosses: 0,
    lineLosses: 0,
    connectionLosses: 0,
    otherLosses: 0,
    totalLosses: 0,
    lossPercentage: 0
  };
  
  // Ensure we have valid loss values (prevent NaN)
  const totalLosses = isNaN(losses.totalLosses) ? 0 : losses.totalLosses;
  const lossPercentage = isNaN(losses.lossPercentage) ? 0 : losses.lossPercentage;
  
  const pieData = [
    { name: 'Transformer Losses', value: isNaN(losses.transformerLosses) ? 0 : losses.transformerLosses, totalValue: totalActivePower || 1 },
    { name: 'Line Losses', value: isNaN(losses.lineLosses) ? 0 : losses.lineLosses, totalValue: totalActivePower || 1 },
    { name: 'Connection Losses', value: isNaN(losses.connectionLosses) ? 0 : losses.connectionLosses, totalValue: totalActivePower || 1 },
    { name: 'Other Losses', value: isNaN(losses.otherLosses) ? 0 : losses.otherLosses, totalValue: totalActivePower || 1 },
  ];
  
  // Filter out zero values to prevent rendering issues
  const filteredPieData = pieData.filter(item => item.value > 0);
  
  // If we don't have any valid data, show placeholder data
  const displayPieData = filteredPieData.length > 0 ? filteredPieData : [
    { name: 'Transformer Losses', value: 5, totalValue: 100 },
    { name: 'Line Losses', value: 3, totalValue: 100 },
    { name: 'Connection Losses', value: 2, totalValue: 100 },
    { name: 'Other Losses', value: 1, totalValue: 100 },
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
              value={totalLosses}
              unit="kW"
              icon={<AlertTriangleIcon className="w-4 h-4" />}
              description="Sum of all technical losses in the system"
              valueClassName={lossPercentage > 15 ? "text-energy-red" : lossPercentage > 10 ? "text-energy-yellow" : "text-energy-green"}
            />
            
            <MetricCard
              title="Loss Percentage"
              value={lossPercentage}
              unit="%"
              description="Percentage of active power lost in transmission and distribution"
              valueClassName={lossPercentage > 15 ? "text-energy-red" : lossPercentage > 10 ? "text-energy-yellow" : "text-energy-green"}
            />
          </div>
          
          <div className="h-[300px] lg:h-auto lg:col-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
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
                  {displayPieData.map((entry, index) => (
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
