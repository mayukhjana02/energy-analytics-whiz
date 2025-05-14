
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { energyApi } from '@/integrations/api/client';
import { mockData, generateMockData } from '@/utils/mockData';
import { adaptEnergyMetricsToMeasurements, adaptEnergyIncidents } from '@/utils/dataAdapters';
import { EnergyMeasurement, EnergyIncident } from '@/utils/mockData';

interface UseEnergyDataOptions {
  useFallbackData?: boolean;
  pollingInterval?: number;
  timeRange?: 'hour' | '12hours' | 'day' | 'week' | 'month';
}

export function useEnergyData(options: UseEnergyDataOptions = {}) {
  const { useFallbackData = true, pollingInterval = 30000, timeRange = 'day' } = options;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [measurements, setMeasurements] = useState<EnergyMeasurement[]>([]);
  const [incidents, setIncidents] = useState<EnergyIncident[]>([]);
  const [optimizations, setOptimizations] = useState<any[]>([]);

  // Calculate time range for API requests
  const getTimeRangeParams = () => {
    const now = new Date();
    let fromTime: Date;
    
    switch (timeRange) {
      case 'hour':
        fromTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '12hours':
        fromTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        break;
      case 'day':
        fromTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        fromTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        fromTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        fromTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    return {
      fromTime: fromTime.toISOString(),
      toTime: now.toISOString()
    };
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const timeParams = getTimeRangeParams();
      
      // Fetch energy metrics
      const { data: metricsData, error: metricsError } = await energyApi.getEnergyMetrics({
        ...timeParams,
        limit: 1000
      });
      
      if (metricsError) throw metricsError;
      
      // Fetch incidents
      const { data: incidentsData, error: incidentsError } = await energyApi.getEnergyIncidents({
        limit: 20
      });
      
      if (incidentsError) throw incidentsError;
      
      // Fetch optimizations
      const { data: optimizationsData, error: optimizationsError } = await energyApi.getMachineOptimizations();
      
      if (optimizationsError) throw optimizationsError;
      
      // Process and adapt the data
      const adaptedMeasurements = adaptEnergyMetricsToMeasurements(metricsData || []);
      const adaptedIncidents = adaptEnergyIncidents(incidentsData || []);
      
      setMeasurements(adaptedMeasurements);
      setIncidents(adaptedIncidents);
      setOptimizations(optimizationsData || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      
      // Use fallback data if API fails and fallback is enabled
      if (useFallbackData) {
        console.warn('Using fallback data due to API error:', err);
        const fallbackData = generateMockData();
        setMeasurements(fallbackData.consumptionPoints[0].measurements);
        setIncidents(fallbackData.incidents);
        toast({
          title: 'Using offline data',
          description: 'Connection to data source failed. Using cached data.',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and polling setup
  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up polling
    const intervalId = setInterval(fetchData, pollingInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [timeRange, pollingInterval]);

  return {
    loading,
    error,
    measurements,
    incidents,
    optimizations,
    refreshData: fetchData
  };
}
