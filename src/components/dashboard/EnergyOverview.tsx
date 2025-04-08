
import React from 'react';
import { BatteryIcon, BoltIcon, GaugeIcon, ZapIcon } from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import { Card } from '@/components/ui/card';

interface AdditionalMetric {
  title: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface EnergyOverviewProps {
  data: {
    hourlyEnergy: number;
    avgActivePower: number;
    avgReactivePower: number;
    systemPowerFactor: number;
    avgSystemVoltage: number;
    technicalLosses: number;
    additionalMetrics?: AdditionalMetric[];
  };
}

const EnergyOverview: React.FC<EnergyOverviewProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <MetricCard
        title="Active Power"
        value={data.avgActivePower}
        unit="kW"
        icon={<ZapIcon className="w-4 h-4" />}
        description="Average active power consumption over the selected period"
        trend={{ value: 3.5, direction: 'up' }}
      />
      
      <MetricCard
        title="Energy Consumption"
        value={data.hourlyEnergy}
        unit="kWh"
        icon={<BoltIcon className="w-4 h-4" />}
        description="Total energy consumed over the selected period"
        trend={{ value: 2.1, direction: 'down', label: 'vs. previous period' }}
      />
      
      <MetricCard
        title="Power Factor"
        value={data.systemPowerFactor}
        icon={<GaugeIcon className="w-4 h-4" />}
        description="System average power factor (higher is better)"
        valueClassName={data.systemPowerFactor < 0.9 ? "text-energy-yellow" : "text-energy-green"}
        trend={{ value: 0.8, direction: 'up' }}
      />
      
      <MetricCard
        title="System Voltage"
        value={data.avgSystemVoltage}
        unit="V"
        icon={<BatteryIcon className="w-4 h-4" />}
        description="Average voltage level across the system"
        trend={{ value: 0.2, direction: 'down' }}
      />

      {data.additionalMetrics && data.additionalMetrics.map((metric, index) => (
        <MetricCard
          key={`additional-metric-${index}`}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
          description=""
          trend={{ value: metric.change, direction: metric.trend }}
        />
      ))}
    </div>
  );
};

export default EnergyOverview;
