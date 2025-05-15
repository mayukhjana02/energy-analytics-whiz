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

// Calculate technical losses in the energy system
export const calculateLosses = (data: any[]): { 
  transformerLosses: number;
  lineLosses: number;
  connectionLosses: number;
  otherLosses: number;
  totalLosses: number;
  lossPercentage: number;
} => {
  // Ensure we have valid data
  if (!Array.isArray(data) || data.length === 0) {
    return {
      transformerLosses: 0,
      lineLosses: 0,
      connectionLosses: 0,
      otherLosses: 0,
      totalLosses: 0,
      lossPercentage: 0
    };
  }

  // Get the latest data point for active power
  const latestData = [...data].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
  
  // Use the active power value for calculations, ensure it's a number and positive
  const activePower = typeof latestData?.activePower === 'number' && !isNaN(latestData.activePower) 
    ? Math.max(0, latestData.activePower) 
    : 0;
  
  // If we don't have valid active power data, return default values
  if (activePower === 0) {
    // Return default sample values
    return {
      transformerLosses: 2.5,
      lineLosses: 1.8,
      connectionLosses: 1.2,
      otherLosses: 0.8,
      totalLosses: 6.3,
      lossPercentage: 8.4
    };
  }
  
  // Calculate losses based on typical distribution
  const transformerLosses = activePower * 0.035;  // 3.5% transformer losses
  const lineLosses = activePower * 0.025;         // 2.5% line losses
  const connectionLosses = activePower * 0.018;   // 1.8% connection losses
  const otherLosses = activePower * 0.012;        // 1.2% other losses
  
  // Calculate total losses and loss percentage
  const totalLosses = transformerLosses + lineLosses + connectionLosses + otherLosses;
  const lossPercentage = activePower > 0 ? (totalLosses / activePower) * 100 : 0;
  
  return {
    transformerLosses,
    lineLosses,
    connectionLosses,
    otherLosses,
    totalLosses,
    lossPercentage
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
