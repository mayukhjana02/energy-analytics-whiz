
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import TimeRangeSelector from '../ui/TimeRangeSelector';
import { EnergyMeasurement } from '@/utils/mockData';
import { aggregateMeasurements, filterMeasurementsByTimeRange, formatTimestamp, prepareChartData } from '@/utils/dataTransformations';
import { AreaChartIcon, BarChart3Icon, LineChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type TimeRange = 'hour' | '12hours' | 'day' | 'week' | 'month';
type ChartType = 'area' | 'line';
type ChartMetric = 'activePower' | 'voltage' | 'current' | 'powerFactor';

interface ConsumptionChartProps {
  data: EnergyMeasurement[];
  className?: string;
}

const metricOptions: {
  value: ChartMetric;
  label: string;
  color: string;
  unit: string;
}[] = [
  { value: 'activePower', label: 'Active Power', color: '#0A84FF', unit: 'kW' },
  { value: 'voltage', label: 'Voltage', color: '#FFD60A', unit: 'V' },
  { value: 'current', label: 'Current', color: '#FF453A', unit: 'A' },
  { value: 'powerFactor', label: 'Power Factor', color: '#30D158', unit: '' },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border shadow-sm text-xs">
        <p className="mb-1 font-medium">{formatTimestamp(label, 'datetime')}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex justify-between items-center gap-4 my-1">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium">{entry.value} {entry.unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data, className }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [selectedMetrics, setSelectedMetrics] = useState<ChartMetric[]>(['activePower', 'voltage']);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    return filterMeasurementsByTimeRange(data, timeRange);
  }, [data, timeRange]);

  // Aggregate data based on time range
  const aggregatedData = useMemo(() => {
    const aggregation = 
      timeRange === 'hour' ? 'none' :
      timeRange === '12hours' ? '15min' :
      timeRange === 'day' ? '15min' :
      timeRange === 'week' ? 'hourly' : 'daily';
    
    return aggregateMeasurements(filteredData, aggregation);
  }, [filteredData, timeRange]);

  // Prepare data for charting
  const chartData = useMemo(() => {
    return prepareChartData(aggregatedData, ['timestamp', 'activePower', 'voltage', 'current', 'powerFactor']);
  }, [aggregatedData]);

  const handleMetricToggle = (metric: ChartMetric) => {
    if (selectedMetrics.includes(metric)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <CardTitle>Energy Consumption</CardTitle>
          
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup type="multiple" variant="outline" className="hidden md:flex">
              {metricOptions.map((metric) => (
                <ToggleGroupItem
                  key={metric.value}
                  value={metric.value}
                  aria-label={metric.label}
                  data-state={selectedMetrics.includes(metric.value as ChartMetric) ? "on" : "off"}
                  onClick={() => handleMetricToggle(metric.value as ChartMetric)}
                  className="text-xs px-2.5 py-1"
                >
                  {metric.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            
            <div className="flex gap-1">
              <Button
                variant={chartType === 'area' ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setChartType('area')}
              >
                <AreaChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <TimeRangeSelector
              selectedRange={timeRange}
              onChange={setTimeRange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-2 md:px-4 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {metricOptions.map((metric) => (
                  <linearGradient
                    key={`gradient-${metric.value}`}
                    id={`color-${metric.value}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={metric.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={metric.color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="formattedTime"
                tick={{ fontSize: 11 }}
                tickMargin={10}
                axisLine={{ strokeOpacity: 0.2 }}
                tickLine={{ strokeOpacity: 0.2 }}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              
              {metricOptions
                .filter((metric) => selectedMetrics.includes(metric.value as ChartMetric))
                .map((metric) => (
                  <Area
                    key={`area-${metric.value}`}
                    type="monotone"
                    dataKey={metric.value}
                    name={metric.label}
                    stroke={metric.color}
                    fill={`url(#color-${metric.value})`}
                    unit={metric.unit}
                    animationDuration={500}
                  />
                ))}
            </AreaChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="formattedTime"
                tick={{ fontSize: 11 }}
                tickMargin={10}
                axisLine={{ strokeOpacity: 0.2 }}
                tickLine={{ strokeOpacity: 0.2 }}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              
              {metricOptions
                .filter((metric) => selectedMetrics.includes(metric.value as ChartMetric))
                .map((metric) => (
                  <Line
                    key={`line-${metric.value}`}
                    type="monotone"
                    dataKey={metric.value}
                    name={metric.label}
                    stroke={metric.color}
                    unit={metric.unit}
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 5 }}
                    animationDuration={500}
                  />
                ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ConsumptionChart;
