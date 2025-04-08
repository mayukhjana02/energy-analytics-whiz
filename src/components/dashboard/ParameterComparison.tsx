
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ZAxis,
  Label
} from 'recharts';
import { EnergyMeasurement } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ParameterComparisonProps {
  data: EnergyMeasurement[];
  className?: string;
}

const parameters = [
  { id: 'activePower', name: 'Active Power', unit: 'kW' },
  { id: 'reactivePower', name: 'Reactive Power', unit: 'kVAR' },
  { id: 'voltage', name: 'Voltage', unit: 'V' },
  { id: 'current', name: 'Current', unit: 'A' },
  { id: 'powerFactor', name: 'Power Factor', unit: '' },
  { id: 'energy', name: 'Energy', unit: 'kWh' },
  { id: 'temperature', name: 'Temperature', unit: '°C' },
  { id: 'carbonEmissions', name: 'Carbon Emissions', unit: 'kgCO2e' },
  { id: 'cbamFactor', name: 'CBAM Factor', unit: '€/ton' },
  { id: 'humidity', name: 'Humidity', unit: '%' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border shadow-sm text-xs">
        <p className="font-medium mb-1">Correlation Data</p>
        <p>
          {payload[0]?.name}: {payload[0]?.value} {payload[0]?.unit}
        </p>
        <p>
          {payload[1]?.name}: {payload[1]?.value} {payload[1]?.unit}
        </p>
        <p className="text-muted-foreground mt-1">
          Time: {new Date(payload[0]?.payload.timestamp).toLocaleTimeString()}
        </p>
      </div>
    );
  }
  
  return null;
};

const ParameterComparison: React.FC<ParameterComparisonProps> = ({ data, className }) => {
  const [xParam, setXParam] = useState('powerFactor');
  const [yParam, setYParam] = useState('activePower');
  
  // Prepare data for the scatter plot
  const scatterData = data.map(item => ({
    timestamp: item.timestamp,
    [xParam]: item[xParam as keyof EnergyMeasurement],
    [yParam]: item[yParam as keyof EnergyMeasurement],
  }));
  
  const xParamInfo = parameters.find(p => p.id === xParam);
  const yParamInfo = parameters.find(p => p.id === yParam);
  
  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <CardTitle>Rice Plant Parameter Correlation</CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline text-muted-foreground">X:</span>
              <Select
                value={xParam}
                onValueChange={setXParam}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  {parameters.map(param => (
                    <SelectItem key={param.id} value={param.id} className="text-xs">
                      {param.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-sm hidden sm:inline text-muted-foreground">Y:</span>
              <Select
                value={yParam}
                onValueChange={setYParam}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  {parameters.map(param => (
                    <SelectItem key={param.id} value={param.id} className="text-xs">
                      {param.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-2 md:px-4 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 40, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis 
              type="number" 
              dataKey={xParam} 
              name={xParamInfo?.name}
              unit={xParamInfo?.unit}
              tick={{ fontSize: 11 }}
              tickMargin={10}
              axisLine={{ strokeOpacity: 0.2 }}
              tickLine={{ strokeOpacity: 0.2 }}
            >
              <Label 
                value={`${xParamInfo?.name} (${xParamInfo?.unit})`} 
                position="bottom" 
                offset={20}
                style={{ textAnchor: 'middle', fontSize: '12px', fill: '#64748b' }}
              />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey={yParam} 
              name={yParamInfo?.name}
              unit={yParamInfo?.unit}
              tick={{ fontSize: 11 }}
              tickMargin={10}
              axisLine={{ strokeOpacity: 0.2 }}
              tickLine={{ strokeOpacity: 0.2 }}
            >
              <Label 
                value={`${yParamInfo?.name} (${yParamInfo?.unit})`} 
                angle={-90} 
                position="left" 
                offset={0}
                style={{ textAnchor: 'middle', fontSize: '12px', fill: '#64748b' }}
              />
            </YAxis>
            <ZAxis range={[30, 30]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter 
              name="Parameters" 
              data={scatterData} 
              fill="#4CAF50" 
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ParameterComparison;
