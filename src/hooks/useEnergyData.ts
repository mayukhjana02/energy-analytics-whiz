
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnergyMetric, EnergyIncident, MachineOptimization } from '@/types/energyData';
import { toast } from 'sonner';

export function useEnergyData() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['energy-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_latest_metrics');
      
      if (error) {
        toast.error('Error fetching energy metrics');
        throw error;
      }
      
      return data as EnergyMetric[];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: incidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['energy-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Error fetching incidents');
        throw error;
      }
      
      return data as EnergyIncident[];
    },
    refetchInterval: 30000
  });

  const { data: optimizations, isLoading: optimizationsLoading } = useQuery({
    queryKey: ['machine-optimizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machine_optimizations')
        .select('*')
        .order('potential_savings', { ascending: false });
      
      if (error) {
        toast.error('Error fetching optimizations');
        throw error;
      }
      
      return data as MachineOptimization[];
    }
  });

  return {
    metrics,
    incidents,
    optimizations,
    isLoading: metricsLoading || incidentsLoading || optimizationsLoading
  };
}
