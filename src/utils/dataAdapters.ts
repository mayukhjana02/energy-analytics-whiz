
import { EnergyMeasurement, EnergyIncident as MockEnergyIncident } from '@/utils/mockData';
import { EnergyMetric, EnergyIncident } from '@/types/energyData';
import { RiceProductionMetric } from '@/types/riceData';

/**
 * Adapts energy metrics from Supabase to the EnergyMeasurement format expected by components
 */
export const adaptEnergyMetricsToMeasurements = (metrics: EnergyMetric[]): EnergyMeasurement[] => {
  return metrics.map(metric => {
    // Create a standardized timestamp string
    const timestamp = new Date(metric.measurement_time).toISOString();
    
    // Default values for required fields
    const defaultValues = {
      voltage: 0,
      current: 0,
      activePower: 0,
      reactivePower: 0,
      apparentPower: 0,
      powerFactor: 0,
      frequency: 50,
      energy: 0,
      temperature: 0,
    };
    
    // Map specific tag_ids to their corresponding fields
    const measurement: EnergyMeasurement = {
      ...defaultValues,
      timestamp,
    };
    
    // Update specific fields based on tag_id
    switch (metric.tag_id) {
      case 'ENERGY_KWH':
        measurement.energy = Number(metric.value);
        break;
      case 'ENERGY_AMPS':
        measurement.current = Number(metric.value);
        break;
      case 'TEMPERATURE':
        measurement.temperature = Number(metric.value);
        break;
      case 'VOLTAGE':
        measurement.voltage = Number(metric.value);
        break;
      // Add more mappings as needed
    }
    
    return measurement;
  });
};

/**
 * Adapts energy metrics to the RiceProductionMetric format
 */
export const adaptEnergyMetricsToRiceMetrics = (metrics: EnergyMetric[]): RiceProductionMetric[] => {
  return metrics.map(metric => {
    const timestamp = new Date(metric.measurement_time).getTime();
    const createdAt = new Date(metric.created_at).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      id: parseInt(Math.random().toString().substring(2, 10)), // Generate a numeric ID
      tagId: metric.tag_id,
      value: Number(metric.value),
      timestamp,
      machineId: metric.machine_id,
      createdAt
    };
  });
};

/**
 * Adapts energy incidents from Supabase to the format expected by components
 */
export const adaptEnergyIncidents = (incidents: EnergyIncident[]): MockEnergyIncident[] => {
  return incidents.map(incident => {
    // Create a standardized timestamp string from created_at
    const timestamp = new Date(incident.created_at).toISOString();
    
    // Map severity values
    let severityLevel: 'low' | 'medium' | 'high' = 'medium';
    if (incident.severity === 'LOW') severityLevel = 'low';
    else if (incident.severity === 'HIGH') severityLevel = 'high';
    
    return {
      id: incident.id,
      timestamp,
      consumptionPointId: incident.machine_id,
      type: 'power_factor', // Default type
      severity: severityLevel,
      description: incident.description,
      value: 0, // Default value
      threshold: 0, // Default threshold
      resolved: incident.status === 'RESOLVED'
    };
  });
};
