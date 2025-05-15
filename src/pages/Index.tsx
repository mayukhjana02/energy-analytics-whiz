
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EnergyOverview from '@/components/dashboard/EnergyOverview';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';
import ParameterComparison from '@/components/dashboard/ParameterComparison';
import TechnicalLosses from '@/components/dashboard/TechnicalLosses';
import EnergyIncidents from '@/components/dashboard/EnergyIncidents';
import EnergySankeyDiagram from '@/components/dashboard/EnergySankeyDiagram';
import EnergyFlowBreakdown from '@/components/dashboard/EnergyFlowBreakdown';
import CircuitEnergyFlow from '@/components/dashboard/CircuitEnergyFlow';
import MaintenanceAlerts from '@/components/dashboard/MaintenanceAlerts';
import { summaryMetrics } from '@/utils/mockData';
import { generateSankeyData, generateCircuitModels, generateMaintenanceAlerts } from '@/utils/energyFlowData';
import { toast } from 'sonner';
import { useEnergyData } from '@/hooks/useEnergyData';
import { balanceEnergyReadings } from '@/utils/energyBalancer';

const Index = () => {
  // Use our hook for fetching energy data from Supabase
  const { 
    loading, 
    error, 
    measurements, 
    incidents,
    optimizations,
    refreshData
  } = useEnergyData({
    useFallbackData: true,
    pollingInterval: 30000,
    timeRange: 'day'
  });
  
  const [metrics, setMetrics] = useState({
    ...summaryMetrics,
    // Add CBAM-specific metrics
    cbamFactor: 75.2, // €/ton
    carbonEmissions: 42.5, // kgCO2e/ton
    cbamCost: 3197, // € (monthly)
    humidityLevel: 68, // % optimal for rice processing
  });
  
  // State for visualization components
  const [sankeyData, setSankeyData] = useState(generateSankeyData());
  const [circuitModels, setCircuitModels] = useState(generateCircuitModels());
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(generateMaintenanceAlerts());

  // Show error toast only if there's an error
  useEffect(() => {
    if (error) {
      toast.error('Error loading data from Supabase', {
        description: error.message
      });
    }
  }, [error]);

  // Update circuit models with new values every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
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
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Apply energy balancing to measurements
  const balancedMeasurements = balanceEnergyReadings(
    measurements.map(m => ({ 
      id: m.timestamp, 
      value: m.activePower || 0 
    }))
  ).map(node => {
    const original = measurements.find(m => m.timestamp === node.id);
    return original ? { ...original, activePower: node.value } : original;
  }).filter(Boolean);
  
  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <h2 className="text-xl font-medium">Loading energy data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-semibold mb-2 tracking-tight section-fade">Energy Demo</h1>
                  <p className="text-muted-foreground section-fade" style={{ animationDelay: '100ms' }}>
                    Monitor energy consumption, rice production metrics, and CBAM impact for rice processing operations.
                  </p>
                </div>
              </div>
              
              {error && (
                <div className="mt-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  Error connecting to Supabase. Showing fallback data. {error.message}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Energy Overview with CBAM metrics */}
              <div className="section-fade" style={{ animationDelay: '200ms' }}>
                <EnergyOverview data={{
                  ...metrics
                }} />
              </div>
              
              {/* Main charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '300ms' }}>
                <ConsumptionChart data={balancedMeasurements} />
                <ParameterComparison data={balancedMeasurements} />
              </div>
              
              {/* Enhanced Sankey Diagram */}
              <div className="section-fade" style={{ animationDelay: '350ms' }}>
                <EnergySankeyDiagram data={sankeyData} />
              </div>
              
              {/* New Energy Flow Breakdown */}
              <div className="section-fade" style={{ animationDelay: '375ms' }}>
                <EnergyFlowBreakdown data={balancedMeasurements} />
              </div>
              
              {/* Circuit Energy Flow & Maintenance Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '450ms' }}>
                <CircuitEnergyFlow diagrams={circuitModels} />
                <MaintenanceAlerts alerts={maintenanceAlerts} />
              </div>
              
              {/* Technical Losses & Energy Incidents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-fade" style={{ animationDelay: '500ms' }}>
                <TechnicalLosses
                  data={balancedMeasurements}
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
