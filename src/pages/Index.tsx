
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EnergyOverview from '@/components/dashboard/EnergyOverview';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';
import ParameterComparison from '@/components/dashboard/ParameterComparison';
import TechnicalLosses from '@/components/dashboard/TechnicalLosses';
import EnergyIncidents from '@/components/dashboard/EnergyIncidents';
import RiceProductionTable from '@/components/dashboard/RiceProductionTable';
import EnergySankeyDiagram from '@/components/dashboard/EnergySankeyDiagram';
import CircuitEnergyFlow from '@/components/dashboard/CircuitEnergyFlow';
import MaintenanceAlerts from '@/components/dashboard/MaintenanceAlerts';
import { mockData, summaryMetrics, generateMockData } from '@/utils/mockData';
import { initialRiceProductionData, generateUpdatedRiceData, createRiceMetricsData } from '@/utils/riceProductionData';
import { generateSankeyData, generateCircuitModels, generateMaintenanceAlerts } from '@/utils/energyFlowData';
import { RiceProductionMetric } from '@/types/riceData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { adaptEnergyMetricsToMeasurements, adaptEnergyMetricsToRiceMetrics, adaptEnergyIncidents } from '@/utils/dataAdapters';
import { EnergyMetric, EnergyIncident } from '@/types/energyData';
import { balanceEnergyReadings } from '@/utils/energyBalancer';

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
  
  // State for new visualization components
  const [sankeyData, setSankeyData] = useState(generateSankeyData());
  const [circuitModels, setCircuitModels] = useState(generateCircuitModels());
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(generateMaintenanceAlerts());

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
      
      // Update Sankey diagram with slight variations
      setSankeyData(prevData => {
        const newData = { ...prevData };
        newData.links = newData.links.map(link => ({
          ...link, 
          value: link.value * (0.98 + Math.random() * 0.04) // +/- 2% random variation
        }));
        return newData;
      });
      
      // Update circuit models with new values
      setCircuitModels(prevModels => {
        return prevModels.map(model => ({
          ...model,
          nodes: model.nodes.map(node => ({
            ...node,
            power: node.power * (0.95 + Math.random() * 0.1),
            voltage: node.voltage * (0.99 + Math.random() * 0.02),
            current: node.current * (0.95 + Math.random() * 0.1),
          }))
        }));
      });
      
      // Occasionally add a new maintenance alert (10% chance)
      if (Math.random() < 0.1) {
        const newAlert = {
          id: `alert-${Date.now()}`,
          machineId: 'machine-5',
          machineName: 'Dryer Control Panel',
          title: 'Voltage Fluctuation',
          description: 'Unexpected voltage fluctuations detected in the dryer control circuit.',
          severity: Math.random() < 0.3 ? 'high' : Math.random() < 0.7 ? 'medium' : 'low' as any,
          detectedAt: new Date().toISOString(),
          metrics: [
            {
              name: 'Voltage Stability',
              value: 85.3,
              unit: '%',
              deviation: -12.7
            },
            {
              name: 'Voltage',
              value: 412.7 * (0.9 + Math.random() * 0.2),
              unit: 'V',
              deviation: Math.random() < 0.5 ? 8.3 : -8.3
            }
          ],
          recommendation: 'Check power supply quality and verify surge protection devices.',
          status: 'new' as const
        };
        
        setMaintenanceAlerts(prev => [newAlert, ...prev.slice(0, 7)]);
        
        // Show a notification for critical alerts
        if (newAlert.severity === 'high') {
          toast.error(`CRITICAL ALERT: ${newAlert.title}`, {
            description: newAlert.description
          });
        } else if (newAlert.severity === 'medium') {
          toast.warning(`ALERT: ${newAlert.title}`, {
            description: newAlert.description
          });
        }
      }
      
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
  
  // Apply energy balancing to measurements
  const balancedMeasurements = balanceEnergyReadings(
    adaptedMeasurements.map(m => ({ 
      id: m.timestamp, 
      value: m.activePower || 0 
    }))
  ).map(node => {
    const original = adaptedMeasurements.find(m => m.timestamp === node.id);
    return original ? { ...original, activePower: node.value } : original;
  }).filter(Boolean);
  
  // If we have Supabase data, use it; otherwise, fall back to mock data
  const measurements = adaptedMeasurements.length > 0 
    ? balancedMeasurements 
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
              
              {/* NEW: Sankey Diagram */}
              <div className="section-fade" style={{ animationDelay: '350ms' }}>
                <EnergySankeyDiagram data={sankeyData} />
              </div>
              
              {/* Rice Production Data Table */}
              <div className="section-fade" style={{ animationDelay: '400ms' }}>
                <RiceProductionTable data={currentRiceData} />
              </div>
              
              {/* NEW: Circuit Energy Flow & Maintenance Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '450ms' }}>
                <CircuitEnergyFlow diagrams={circuitModels} />
                <MaintenanceAlerts alerts={maintenanceAlerts} />
              </div>
              
              {/* Technical Losses & Energy Incidents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '500ms' }}>
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
