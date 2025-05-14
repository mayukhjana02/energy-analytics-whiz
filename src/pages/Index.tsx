
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EnergyOverview from '@/components/dashboard/EnergyOverview';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';
import ParameterComparison from '@/components/dashboard/ParameterComparison';
import TechnicalLosses from '@/components/dashboard/TechnicalLosses';
import EnergyIncidents from '@/components/dashboard/EnergyIncidents';
import RiceProductionTable from '@/components/dashboard/RiceProductionTable';
import { mockData, summaryMetrics, generateMockData } from '@/utils/mockData';
import { initialRiceProductionData, generateUpdatedRiceData, createRiceMetricsData } from '@/utils/riceProductionData';
import { RiceProductionMetric } from '@/types/riceData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { adaptEnergyMetricsToMeasurements, adaptEnergyMetricsToRiceMetrics, adaptEnergyIncidents } from '@/utils/dataAdapters';
import { EnergyMetric, EnergyIncident } from '@/types/energyData';

const Index = () => {
  const [data, setData] = useState(mockData);
  const [riceData, setRiceData] = useState<RiceProductionMetric[]>(initialRiceProductionData);
  const [metrics, setMetrics] = useState({
    ...summaryMetrics,
    // Add CBAM-specific metrics
    cbamFactor: 75.2, // €/ton
    carbonEmissions: 42.5, // kgCO2e/ton
    cbamCost: 3197, // € (monthly)
    humidityLevel: 68, // % optimal for rice processing
  });
  const [loading, setLoading] = useState(true);
  const [supabaseMetrics, setSupabaseMetrics] = useState<EnergyMetric[]>([]);
  const [supabaseIncidents, setSupabaseIncidents] = useState<EnergyIncident[]>([]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
      toast.success('Energy demo data loaded successfully');
    }, 800);

    // Fetch initial data from Supabase
    fetchSupabaseData();

    return () => clearTimeout(timer);
  }, []);

  const fetchSupabaseData = async () => {
    try {
      // Fetch energy metrics
      const { data: energyMetrics, error: metricsError } = await supabase
        .from('energy_metrics')
        .select('*');
      
      if (metricsError) {
        console.error('Error fetching energy metrics:', metricsError);
      } else if (energyMetrics) {
        setSupabaseMetrics(energyMetrics);
      }
      
      // Fetch energy incidents
      const { data: incidents, error: incidentsError } = await supabase
        .from('energy_incidents')
        .select('*');
        
      if (incidentsError) {
        console.error('Error fetching energy incidents:', incidentsError);
      } else if (incidents) {
        setSupabaseIncidents(incidents);
      }
    } catch (error) {
      console.error('Error in fetchSupabaseData:', error);
    }
  };

  // Simulate a data refresh every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Fetch fresh data from Supabase
      fetchSupabaseData();
      
      // Also update local mock data for parts that don't yet use Supabase
      const refreshedData = generateMockData();
      setData(refreshedData);
      
      // Update rice production data
      setRiceData(prevData => generateUpdatedRiceData(prevData));
      
      toast.info('Energy data refreshed');
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Select data for the main consumption point (Rice Processing Line)
  const mainConsumptionPoint = data.consumptionPoints.find(cp => cp.id === 'cp-1');

  if (!mainConsumptionPoint) {
    return <div>Error loading data</div>;
  }

  // Convert Supabase data to the formats expected by components
  const adaptedMeasurements = adaptEnergyMetricsToMeasurements(supabaseMetrics);
  const adaptedRiceMetrics = adaptEnergyMetricsToRiceMetrics(supabaseMetrics);
  const adaptedIncidents = adaptEnergyIncidents(supabaseIncidents);
  
  // If we have Supabase data, use it; otherwise, fall back to mock data
  const measurements = adaptedMeasurements.length > 0 
    ? adaptedMeasurements 
    : mainConsumptionPoint.measurements;
    
  const currentRiceData = adaptedRiceMetrics.length > 0
    ? adaptedRiceMetrics
    : riceData;
    
  const incidents = adaptedIncidents.length > 0
    ? adaptedIncidents
    : data.incidents;
    
  // Create rice metrics for display
  const riceMetrics = createRiceMetricsData(currentRiceData);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold mb-2 tracking-tight section-fade">Energy Demo</h1>
              <p className="text-muted-foreground section-fade" style={{ animationDelay: '100ms' }}>
                Monitor energy consumption, rice production metrics, and CBAM impact for rice processing operations.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Energy Overview with CBAM metrics */}
              <div className="section-fade" style={{ animationDelay: '200ms' }}>
                <EnergyOverview data={{
                  ...metrics,
                  additionalMetrics: riceMetrics
                }} />
              </div>
              
              {/* Main charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '300ms' }}>
                <ConsumptionChart data={measurements} />
                <ParameterComparison data={measurements} />
              </div>
              
              {/* Rice Production Data Table */}
              <div className="section-fade" style={{ animationDelay: '350ms' }}>
                <RiceProductionTable data={currentRiceData} />
              </div>
              
              {/* Technical Losses & Energy Incidents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '400ms' }}>
                <TechnicalLosses
                  data={measurements}
                  totalActivePower={metrics.avgActivePower}
                />
                <EnergyIncidents incidents={incidents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
