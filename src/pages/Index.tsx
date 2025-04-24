
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EnergyOverview from '@/components/dashboard/EnergyOverview';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';
import ParameterComparison from '@/components/dashboard/ParameterComparison';
import TechnicalLosses from '@/components/dashboard/TechnicalLosses';
import EnergyIncidents from '@/components/dashboard/EnergyIncidents';
import RiceProductionTable from '@/components/dashboard/RiceProductionTable';
import { useEnergyData } from '@/hooks/useEnergyData';

const Index = () => {
  const { metrics, incidents, optimizations, isLoading } = useEnergyData();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading energy data...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the latest metrics</p>
        </div>
      </div>
    );
  }

  // Find energy-related metrics
  const energyMetrics = metrics?.filter(m => 
    ['ENERGY_KWH', 'ENERGY_AMPS'].includes(m.tag_id)) || [];

  // Calculate summary metrics
  const avgActivePower = energyMetrics.find(m => m.tag_id === 'ENERGY_AMPS')?.value || 0;
  const hourlyEnergy = energyMetrics.find(m => m.tag_id === 'ENERGY_KWH')?.value || 0;

  const summaryMetrics = {
    hourlyEnergy,
    avgActivePower,
    avgReactivePower: avgActivePower * 0.4, // Estimated
    systemPowerFactor: 0.92,
    avgSystemVoltage: 220,
    technicalLosses: 5.2,
    cbamFactor: 75.2,
    carbonEmissions: 42.5,
    cbamCost: 3197,
    humidityLevel: 68,
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold mb-2 tracking-tight section-fade">KRBL Energy Demo</h1>
              <p className="text-muted-foreground section-fade">
                Real-time energy monitoring and optimization for rice processing operations
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="section-fade" style={{ animationDelay: '200ms' }}>
                <EnergyOverview data={summaryMetrics} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '300ms' }}>
                <ConsumptionChart data={energyMetrics} />
                <ParameterComparison data={metrics || []} />
              </div>
              
              <div className="section-fade" style={{ animationDelay: '350ms' }}>
                <RiceProductionTable data={metrics || []} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '400ms' }}>
                <TechnicalLosses
                  data={metrics || []}
                  totalActivePower={avgActivePower}
                />
                <EnergyIncidents incidents={incidents || []} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
