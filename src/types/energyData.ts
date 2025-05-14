
// Types for energy metrics from Supabase
export interface EnergyMetric {
  id: string;
  measurement_time: string;
  machine_id: string;
  tag_id: string;
  value: number;
  unit: string;
  created_at: string;
}

// Define incident types
export type IncidentType = 'power_factor' | 'voltage_sag' | 'voltage_swell' | 'harmonic_distortion' | 'overload';

// Types for energy incidents from Supabase
export interface EnergyIncident {
  id: string;
  title: string;
  description: string;
  severity: string;
  machine_id: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  // Add a type field with the allowed values
  type?: IncidentType;
}

// Types for machine optimizations from Supabase
export interface MachineOptimization {
  id: string;
  machine_id: string;
  parameter_name: string;
  current_value: number;
  optimal_value: number;
  unit: string;
  potential_savings: number | null;
  created_at: string;
  applied_at: string | null;
}
