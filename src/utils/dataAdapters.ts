
import { EnergyMeasurement, EnergyIncident as MockEnergyIncident } from '@/utils/mockData';
import { EnergyMetric, EnergyIncident } from '@/types/energyData';
import { RiceProductionMetric } from '@/types/riceData';

/**
 * Adapts energy metrics from API to the EnergyMeasurement format expected by components
 * This handles both Supabase and direct API data formats
 */
export const adaptEnergyMetricsToMeasurements = (metrics: any[]): EnergyMeasurement[] => {
  return metrics.map(metric => {
    // Handle different possible API response formats
    const timestamp = metric.measurement_time || metric.timestamp || metric.time || new Date().toISOString();
    const machineId = metric.machine_id || metric.machineId || '';
    const tagId = metric.tag_id || metric.tagId || '';
    const value = typeof metric.value === 'number' ? metric.value : 0;
    const unit = metric.unit || '';
    
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
      carbonEmissions: 0,
      cbamFactor: 0,
      humidity: 0,
    };
    
    // Map specific tag_ids to their corresponding fields
    const measurement: EnergyMeasurement = {
      ...defaultValues,
      timestamp,
    };
    
    // Update specific fields based on tag_id
    switch (tagId) {
      case 'ENERGY_KWH':
      case 'KWH':
      case 'energy':
        measurement.energy = Number(value);
        break;
      case 'ENERGY_AMPS':
      case 'AMPS':
      case 'current':
        measurement.current = Number(value);
        break;
      case 'TEMPERATURE':
      case 'temp':
        measurement.temperature = Number(value);
        break;
      case 'VOLTAGE':
      case 'volts':
        measurement.voltage = Number(value);
        break;
      case 'ACTIVE_POWER':
      case 'power':
      case 'kw':
        measurement.activePower = Number(value);
        break;
      case 'POWER_FACTOR':
      case 'pf':
        measurement.powerFactor = Number(value);
        break;
      case 'REACTIVE_POWER':
      case 'kvar':
        measurement.reactivePower = Number(value);
        break;
      case 'APPARENT_POWER':
      case 'kva':
        measurement.apparentPower = Number(value);
        break;
      case 'FREQUENCY':
      case 'freq':
      case 'hz':
        measurement.frequency = Number(value);
        break;
      case 'CARBON_EMISSIONS':
      case 'co2':
        measurement.carbonEmissions = Number(value);
        break;
      case 'CBAM_FACTOR':
        measurement.cbamFactor = Number(value);
        break;
      case 'HUMIDITY':
      case 'humid':
        measurement.humidity = Number(value);
        break;
      default:
        // For unknown tags, try to guess the field based on unit
        if (unit === 'V') measurement.voltage = Number(value);
        else if (unit === 'A') measurement.current = Number(value);
        else if (unit === 'kW') measurement.activePower = Number(value);
        else if (unit === 'kWh') measurement.energy = Number(value);
        else if (unit === '°C' || unit === 'C') measurement.temperature = Number(value);
    }
    
    // Calculate missing values if we have enough information
    if (measurement.voltage > 0 && measurement.current > 0 && !measurement.apparentPower) {
      measurement.apparentPower = measurement.voltage * measurement.current;
    }
    
    if (measurement.apparentPower > 0 && measurement.powerFactor > 0 && !measurement.activePower) {
      measurement.activePower = measurement.apparentPower * measurement.powerFactor;
    }
    
    if (measurement.apparentPower > 0 && measurement.activePower > 0 && !measurement.reactivePower) {
      measurement.reactivePower = Math.sqrt(Math.pow(measurement.apparentPower, 2) - Math.pow(measurement.activePower, 2));
    }
    
    return measurement;
  });
};

/**
 * Adapts energy metrics to the RiceProductionMetric format
 */
export const adaptEnergyMetricsToRiceMetrics = (metrics: any[]): RiceProductionMetric[] => {
  return metrics.map(metric => {
    // Handle different possible API response formats
    const timestamp = new Date(metric.measurement_time || metric.timestamp || metric.time || new Date()).getTime();
    const createdAt = new Date(metric.created_at || metric.createdAt || new Date()).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      id: parseInt(Math.random().toString().substring(2, 10)), // Generate a numeric ID
      tagId: metric.tag_id || metric.tagId || '',
      value: Number(metric.value || 0),
      timestamp,
      machineId: metric.machine_id || metric.machineId || '',
      createdAt
    };
  });
};

/**
 * Adapts energy incidents from API to the format expected by components
 */
export const adaptEnergyIncidents = (incidents: any[]): MockEnergyIncident[] => {
  return incidents.map(incident => {
    // Create a standardized timestamp string
    const timestamp = new Date(incident.created_at || incident.createdAt || incident.timestamp || new Date()).toISOString();
    
    // Map severity values
    let severityLevel: 'low' | 'medium' | 'high' = 'medium';
    const severity = (incident.severity || '').toUpperCase();
    if (severity === 'LOW') severityLevel = 'low';
    else if (severity === 'HIGH') severityLevel = 'high';
    
    // Try to determine incident type
    let incidentType = 'power_factor';
    const title = (incident.title || '').toLowerCase();
    if (title.includes('voltage') && (title.includes('sag') || title.includes('drop'))) {
      incidentType = 'voltage_sag';
    } else if (title.includes('voltage') && (title.includes('swell') || title.includes('spike'))) {
      incidentType = 'voltage_swell';
    } else if (title.includes('harmonic') || title.includes('distortion')) {
      incidentType = 'harmonic_distortion';
    } else if (title.includes('overload') || title.includes('capacity')) {
      incidentType = 'overload';
    }
    
    return {
      id: incident.id || `incident-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp,
      consumptionPointId: incident.machine_id || incident.machineId || 'cp-1',
      type: incidentType,
      severity: severityLevel,
      description: incident.description || incident.title || 'Incident detected',
      value: incident.value || 0,
      threshold: incident.threshold || 0,
      resolved: incident.status === 'RESOLVED' || incident.resolved === true
    };
  });
};
