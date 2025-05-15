
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
import EnergyFlowBreakdown from '@/components/dashboard/EnergyFlowBreakdown';
import CircuitEnergyFlow from '@/components/dashboard/CircuitEnergyFlow';
import MaintenanceAlerts from '@/components/dashboard/MaintenanceAlerts';
import DataImportTool from '@/components/dashboard/DataImportTool';
import { summaryMetrics } from '@/utils/mockData';
import { initialRiceProductionData, generateUpdatedRiceData, createRiceMetricsData } from '@/utils/riceProductionData';
import { generateSankeyData, generateCircuitModels, generateMaintenanceAlerts } from '@/utils/energyFlowData';
import { RiceProductionMetric } from '@/types/riceData';
import { toast } from 'sonner';
import { useEnergyData } from '@/hooks/useEnergyData';
import { balanceEnergyReadings } from '@/utils/energyBalancer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Database } from 'lucide-react';

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
  
  const [riceData, setRiceData] = useState<RiceProductionMetric[]>(initialRiceProductionData);
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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Effect for showing loading/success toasts
  useEffect(() => {
    if (loading) {
      toast.loading('Loading energy data from Supabase...');
    } else {
      toast.success('Energy data loaded successfully');
      
      // If we loaded data successfully, also display database connection info
      if (!error) {
        toast.info('Successfully connected to Supabase database', {
          description: `Loaded ${measurements.length} measurements, ${incidents.length} incidents`
        });
      }
    }
  }, [loading, measurements.length, incidents.length]);
  
  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error('Error loading data from Supabase', {
        description: error.message
      });
    }
  }, [error]);

  // Update rice production data every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
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
  
  // Create rice metrics for display
  const riceMetrics = createRiceMetricsData(riceData);

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <h2 className="text-xl font-medium">Loading energy data from Supabase...</h2>
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
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshData}
                    className="flex items-center gap-1"
                  >
                    <Database className="h-4 w-4" />
                    Refresh Data
                  </Button>
                  
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Upload className="h-4 w-4" />
                        Import Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DataImportTool 
                        onImportComplete={() => {
                          setIsImportDialogOpen(false);
                          refreshData();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
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
                  ...metrics,
                  additionalMetrics: riceMetrics
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
              
              {/* Rice Production Data Table */}
              <div className="section-fade" style={{ animationDelay: '400ms' }}>
                <RiceProductionTable data={riceData} />
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
