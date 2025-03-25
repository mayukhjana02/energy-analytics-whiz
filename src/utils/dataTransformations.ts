
import { ConsumptionPoint, EnergyMeasurement } from './mockData';

// Format timestamp for display
export const formatTimestamp = (timestamp: string, format: 'time' | 'date' | 'datetime' = 'time'): string => {
  const date = new Date(timestamp);
  
  if (format === 'time') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (format === 'date') {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

// Filter measurements for a specific time range
export const filterMeasurementsByTimeRange = (
  measurements: EnergyMeasurement[],
  timeRange: 'hour' | '12hours' | 'day' | 'week' | 'month'
): EnergyMeasurement[] => {
  const now = new Date();
  let cutoff: Date;
  
  switch (timeRange) {
    case 'hour':
      cutoff = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '12hours':
      cutoff = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      break;
    case 'day':
      cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }
  
  return measurements.filter(m => new Date(m.timestamp) >= cutoff);
};

// Aggregate measurements for charting (e.g., hourly or daily)
export const aggregateMeasurements = (
  measurements: EnergyMeasurement[],
  aggregation: 'none' | '15min' | 'hourly' | 'daily'
): EnergyMeasurement[] => {
  if (aggregation === 'none' || measurements.length === 0) {
    return measurements;
  }
  
  const aggregated: EnergyMeasurement[] = [];
  const timeToGroup = new Map<string, EnergyMeasurement[]>();
  
  // Group measurements by time bucket
  measurements.forEach(m => {
    const date = new Date(m.timestamp);
    let key: string;
    
    if (aggregation === '15min') {
      // Round to nearest 15 minutes
      const minutes = Math.floor(date.getMinutes() / 15) * 15;
      date.setMinutes(minutes, 0, 0);
      key = date.toISOString();
    } else if (aggregation === 'hourly') {
      // Set minutes to 0
      date.setMinutes(0, 0, 0);
      key = date.toISOString();
    } else if (aggregation === 'daily') {
      // Set hours, minutes to 0
      date.setHours(0, 0, 0, 0);
      key = date.toISOString();
    }
    
    if (!timeToGroup.has(key)) {
      timeToGroup.set(key, []);
    }
    timeToGroup.get(key)?.push(m);
  });
  
  // Calculate averages for each time bucket
  timeToGroup.forEach((group, timestamp) => {
    const count = group.length;
    
    if (count === 0) return;
    
    const avg: EnergyMeasurement = {
      timestamp,
      voltage: 0,
      current: 0,
      activePower: 0,
      reactivePower: 0,
      apparentPower: 0,
      powerFactor: 0,
      frequency: 0,
      energy: 0,
      temperature: 0
    };
    
    // Calculate sums
    group.forEach(m => {
      avg.voltage += m.voltage;
      avg.current += m.current;
      avg.activePower += m.activePower;
      avg.reactivePower += m.reactivePower;
      avg.apparentPower += m.apparentPower;
      avg.powerFactor += m.powerFactor;
      avg.frequency += m.frequency;
      avg.energy += m.energy;
      avg.temperature += m.temperature;
    });
    
    // Calculate averages
    avg.voltage = +(avg.voltage / count).toFixed(2);
    avg.current = +(avg.current / count).toFixed(2);
    avg.activePower = +(avg.activePower / count).toFixed(2);
    avg.reactivePower = +(avg.reactivePower / count).toFixed(2);
    avg.apparentPower = +(avg.apparentPower / count).toFixed(2);
    avg.powerFactor = +(avg.powerFactor / count).toFixed(2);
    avg.frequency = +(avg.frequency / count).toFixed(2);
    avg.energy = +(avg.energy).toFixed(3); // Sum energy, not average
    avg.temperature = +(avg.temperature / count).toFixed(2);
    
    aggregated.push(avg);
  });
  
  // Sort by timestamp
  return aggregated.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// Prepare data for the recharts library
export const prepareChartData = (
  measurements: EnergyMeasurement[],
  metrics: Array<keyof EnergyMeasurement>
) => {
  return measurements.map(m => {
    const chartPoint: any = {
      timestamp: m.timestamp,
      formattedTime: formatTimestamp(m.timestamp)
    };
    
    metrics.forEach(metric => {
      chartPoint[metric] = m[metric];
    });
    
    return chartPoint;
  });
};

// Calculate technical losses
export const calculateLosses = (measurements: EnergyMeasurement[]) => {
  // This is a simplified model
  // In real systems, losses would be measured directly or calculated from specific formulas
  // Here, we'll estimate as a percentage of active power
  const totalActivePower = measurements.reduce((sum, m) => sum + m.activePower, 0);
  const avgActivePower = totalActivePower / measurements.length;
  
  // Assuming different loss factors for different components:
  const transformerLosses = avgActivePower * 0.03; // 3% in transformers
  const lineLosses = avgActivePower * 0.05; // 5% in lines
  const connectionLosses = avgActivePower * 0.02; // 2% in connections
  const otherLosses = avgActivePower * 0.02; // 2% other sources
  
  const totalLosses = transformerLosses + lineLosses + connectionLosses + otherLosses;
  
  return {
    transformerLosses: +transformerLosses.toFixed(2),
    lineLosses: +lineLosses.toFixed(2),
    connectionLosses: +connectionLosses.toFixed(2),
    otherLosses: +otherLosses.toFixed(2),
    totalLosses: +totalLosses.toFixed(2),
    lossPercentage: +((totalLosses / avgActivePower) * 100).toFixed(1)
  };
};

// Find optimal operating conditions (simplified example)
export const findOptimalOperatingConditions = (consumptionPoint: ConsumptionPoint) => {
  const measurements = consumptionPoint.measurements;
  
  // Find measurement with best power factor
  const bestPowerFactor = measurements.reduce((best, m) => 
    m.powerFactor > best.powerFactor ? m : best, measurements[0]);
  
  // Find measurement with lowest energy usage while maintaining good production
  // (here simplified as lowest current for illustration)
  const lowestCurrent = measurements.reduce((lowest, m) => 
    m.current < lowest.current ? m : lowest, measurements[0]);
  
  return {
    idealVoltage: +bestPowerFactor.voltage.toFixed(1),
    idealCurrent: +lowestCurrent.current.toFixed(1),
    idealPowerFactor: +bestPowerFactor.powerFactor.toFixed(2),
    idealTemperature: 25.0, // Example optimal temperature
    estimatedSavings: +(Math.random() * 15 + 5).toFixed(1), // Random value between 5-20%
    recommendations: [
      'Adjust power factor correction capacitors',
      'Optimize load scheduling during peak hours',
      'Maintain system voltage at nominal levels',
      'Ensure balanced loading across phases'
    ]
  };
};
