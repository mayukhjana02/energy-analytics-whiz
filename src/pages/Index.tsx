
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EnergyOverview from '@/components/dashboard/EnergyOverview';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';
import ParameterComparison from '@/components/dashboard/ParameterComparison';
import TechnicalLosses from '@/components/dashboard/TechnicalLosses';
import EnergyIncidents from '@/components/dashboard/EnergyIncidents';
import { mockData, summaryMetrics, generateMockData } from '@/utils/mockData';
import { toast } from 'sonner';

const Index = () => {
  const [data, setData] = useState(mockData);
  const [metrics, setMetrics] = useState(summaryMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
      toast.success('Energy data loaded successfully');
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Simulate a data refresh every minute
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const refreshedData = generateMockData();
      setData(refreshedData);
      toast.info('Energy data refreshed');
    }, 60000); // 1 minute

    return () => clearInterval(refreshInterval);
  }, []);

  // Select data for the main consumption point (Production Line A)
  const mainConsumptionPoint = data.consumptionPoints.find(cp => cp.id === 'cp-1');

  if (!mainConsumptionPoint) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold mb-2 tracking-tight section-fade">Energy Analytics Dashboard</h1>
              <p className="text-muted-foreground section-fade" style={{ animationDelay: '100ms' }}>
                Monitor energy consumption, identify optimization opportunities, and track system performance.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Energy Overview */}
              <div className="section-fade" style={{ animationDelay: '200ms' }}>
                <EnergyOverview data={metrics} />
              </div>
              
              {/* Main charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '300ms' }}>
                <ConsumptionChart data={mainConsumptionPoint.measurements} />
                <ParameterComparison data={mainConsumptionPoint.measurements} />
              </div>
              
              {/* Technical Losses & Energy Incidents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '400ms' }}>
                <TechnicalLosses
                  data={mainConsumptionPoint.measurements}
                  totalActivePower={metrics.avgActivePower}
                />
                <EnergyIncidents incidents={data.incidents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
