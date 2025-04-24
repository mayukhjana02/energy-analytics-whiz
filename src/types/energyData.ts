
export interface EnergyMetric {
  id: string;
  machine_id: string;
  tag_id: string;
  value: number;
  unit: string;
  measurement_time: string;
  created_at: string;
}

export interface EnergyIncident {
  id: string;
  title: string;
  description: string;
  severity: string;
  machine_id: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

export interface MachineOptimization {
  id: string;
  machine_id: string;
  parameter_name: string;
  current_value: number;
  optimal_value: number;
  unit: string;
  potential_savings: number;
  created_at: string;
  applied_at: string | null;
}
