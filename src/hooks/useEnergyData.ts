
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; // Use sonner toast directly
import { mockData, generateMockData } from '@/utils/mockData';
import { adaptEnergyMetricsToMeasurements, adaptEnergyIncidents } from '@/utils/dataAdapters';
import { EnergyMeasurement, EnergyIncident } from '@/utils/mockData';
import { supabase } from '@/integrations/supabase/client';

interface UseEnergyDataOptions {
  useFallbackData?: boolean;
  pollingInterval?: number;
  timeRange?: 'hour' | '12hours' | 'day' | 'week' | 'month';
}

export function useEnergyData(options: UseEnergyDataOptions = {}) {
  const { useFallbackData = true, pollingInterval = 30000, timeRange = 'day' } = options;
  
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

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const timeParams = getTimeRangeParams();
      
      // Fetch energy metrics from Supabase
      const { data: metricsData, error: metricsError } = await supabase
        .from('energy_metrics')
        .select('*')
        .gte('measurement_time', timeParams.fromTime)
        .lte('measurement_time', timeParams.toTime)
        .order('measurement_time', { ascending: true })
        .limit(1000);
      
      if (metricsError) throw metricsError;
      
      // Fetch incidents from Supabase
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('energy_incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (incidentsError) throw incidentsError;
      
      // Fetch optimizations from Supabase
      const { data: optimizationsData, error: optimizationsError } = await supabase
        .from('machine_optimizations')
        .select('*');
      
      if (optimizationsError) throw optimizationsError;
      
      // Process and adapt the data
      const adaptedMeasurements = adaptEnergyMetricsToMeasurements(metricsData || []);
      const adaptedIncidents = adaptEnergyIncidents(incidentsData || []);
      
      setMeasurements(adaptedMeasurements);
      setIncidents(adaptedIncidents);
      setOptimizations(optimizationsData || []);
      setError(null);

      // Log success
      console.log(`Successfully fetched ${adaptedMeasurements.length} measurements, ${adaptedIncidents.length} incidents from Supabase`);
    } catch (err) {
      console.error('Error fetching energy data from Supabase:', err);
      setError(err as Error);
      
      // Use fallback data if Supabase fails and fallback is enabled
      if (useFallbackData) {
        console.warn('Using fallback data due to Supabase error:', err);
        const fallbackData = generateMockData();
        setMeasurements(fallbackData.consumptionPoints[0].measurements);
        setIncidents(fallbackData.incidents);
        toast.error('Using offline data - Connection to Supabase failed');
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
