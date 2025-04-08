// Mock data for rice plant energy analytics with CBAM integration
export interface EnergyMeasurement {
  timestamp: string;
  voltage: number;
  current: number;
  activePower: number;
  reactivePower: number;
  apparentPower: number;
  powerFactor: number;
  frequency: number;
  energy: number;
  temperature: number;
  // New CBAM-related properties
  carbonEmissions?: number;
  cbamFactor?: number;
  humidity?: number;
}

export interface ConsumptionPoint {
  id: string;
  name: string;
  location: string;
  category: 'production' | 'office' | 'utility' | 'hvac';
  measurements: EnergyMeasurement[];
}

export interface EnergyIncident {
  id: string;
  timestamp: string;
  consumptionPointId: string;
  type: 'voltage_sag' | 'voltage_swell' | 'harmonic_distortion' | 'power_factor' | 'overload';
  severity: 'low' | 'medium' | 'high';
  description: string;
  value: number;
  threshold: number;
  resolved: boolean;
}

export interface OptimizationRecommendation {
  id: string;
  consumptionPointId: string;
  category: 'efficiency' | 'maintenance' | 'scheduling' | 'replacement';
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
}

// Generate random value within a range
const randomValue = (min: number, max: number): number => {
  return +(Math.random() * (max - min) + min).toFixed(2);
};

// Generate time series data with natural variations
const generateTimeSeries = (
  hours: number,
  baseValue: number,
  variance: number,
  trend: 'flat' | 'increasing' | 'decreasing' | 'fluctuating' = 'flat'
): number[] => {
  const dataPoints = hours * 12; // 5-minute intervals
  const result: number[] = [];
  
  for (let i = 0; i < dataPoints; i++) {
    let trendFactor = 0;
    
    if (trend === 'increasing') {
      trendFactor = (i / dataPoints) * variance;
    } else if (trend === 'decreasing') {
      trendFactor = -((i / dataPoints) * variance);
    } else if (trend === 'fluctuating') {
      trendFactor = Math.sin((i / dataPoints) * Math.PI * 4) * (variance / 2);
    }
    
    const randomVariance = randomValue(-variance, variance);
    result.push(+(baseValue + randomVariance + trendFactor).toFixed(2));
  }
  
  return result;
};

// Generate timestamps for the past N hours, at 5-minute intervals
const generateTimestamps = (hours: number): string[] => {
  const now = new Date();
  const timestamps: string[] = [];
  
  for (let i = hours - 1; i >= 0; i--) {
    for (let j = 0; j < 12; j++) { // 12 x 5-minute intervals per hour
      const timestamp = new Date(now.getTime() - ((i * 60) + (j * 5)) * 60000);
      timestamps.push(timestamp.toISOString());
    }
  }
  
  return timestamps;
};

// Generate mock energy measurements for a consumption point
const generateMeasurements = (hours: number, type: 'production' | 'office' | 'utility' | 'hvac'): EnergyMeasurement[] => {
  const timestamps = generateTimestamps(hours);
  
  // Base values and variance differ by consumption point type
  let voltageBase = 220;
  let currentBase = type === 'production' ? 80 : type === 'hvac' ? 40 : 20;
  let powerFactorBase = type === 'production' ? 0.88 : 0.92;
  
  // Generate time series for different metrics
  const voltageSeries = generateTimeSeries(hours, voltageBase, 5, 'fluctuating');
  const currentSeries = generateTimeSeries(hours, currentBase, currentBase * 0.2, 'fluctuating');
  const powerFactorSeries = generateTimeSeries(hours, powerFactorBase, 0.05, 'fluctuating');
  const frequencySeries = generateTimeSeries(hours, 50, 0.5, 'fluctuating');
  const temperatureSeries = generateTimeSeries(hours, 25, 3, 'fluctuating');
  
  // New CBAM-related time series
  const carbonEmissionsSeries = generateTimeSeries(hours, 42.5, 8, 'fluctuating');
  const cbamFactorSeries = generateTimeSeries(hours, 75.2, 5, 'increasing');
  const humiditySeries = generateTimeSeries(hours, 68, 7, 'fluctuating');
  
  return timestamps.map((timestamp, index) => {
    const voltage = voltageSeries[index];
    const current = currentSeries[index];
    const powerFactor = powerFactorSeries[index];
    const apparentPower = +(voltage * current).toFixed(2);
    const activePower = +(apparentPower * powerFactor).toFixed(2);
    const reactivePower = +(Math.sqrt(apparentPower ** 2 - activePower ** 2)).toFixed(2);
    
    return {
      timestamp,
      voltage,
      current,
      activePower,
      reactivePower,
      apparentPower,
      powerFactor,
      frequency: frequencySeries[index],
      energy: +(activePower * (5 / 60) / 1000).toFixed(3), // kWh for 5 minutes
      temperature: temperatureSeries[index],
      // Add new CBAM-related properties
      carbonEmissions: carbonEmissionsSeries[index],
      cbamFactor: cbamFactorSeries[index],
      humidity: humiditySeries[index]
    };
  });
};

// Generate incidents based on measurements
const generateIncidents = (consumptionPoints: ConsumptionPoint[]): EnergyIncident[] => {
  const incidents: EnergyIncident[] = [];
  
  consumptionPoints.forEach(point => {
    const measurements = point.measurements;
    
    // Check for voltage issues
    measurements.forEach((measurement, index) => {
      if (index % 20 === 0) { // Only check some measurements to avoid too many incidents
        // Voltage sag
        if (measurement.voltage < 210) {
          incidents.push({
            id: `incident-${incidents.length + 1}`,
            timestamp: measurement.timestamp,
            consumptionPointId: point.id,
            type: 'voltage_sag',
            severity: measurement.voltage < 200 ? 'high' : 'medium',
            description: 'Voltage below acceptable range',
            value: measurement.voltage,
            threshold: 210,
            resolved: true
          });
        }
        
        // Voltage swell
        if (measurement.voltage > 240) {
          incidents.push({
            id: `incident-${incidents.length + 1}`,
            timestamp: measurement.timestamp,
            consumptionPointId: point.id,
            type: 'voltage_swell',
            severity: measurement.voltage > 250 ? 'high' : 'medium',
            description: 'Voltage above acceptable range',
            value: measurement.voltage,
            threshold: 240,
            resolved: true
          });
        }
        
        // Poor power factor
        if (measurement.powerFactor < 0.85) {
          incidents.push({
            id: `incident-${incidents.length + 1}`,
            timestamp: measurement.timestamp,
            consumptionPointId: point.id,
            type: 'power_factor',
            severity: measurement.powerFactor < 0.8 ? 'high' : 'medium',
            description: 'Power factor below threshold',
            value: measurement.powerFactor,
            threshold: 0.85,
            resolved: Math.random() > 0.3
          });
        }
        
        // Overload condition
        if (point.category === 'production' && measurement.current > 90) {
          incidents.push({
            id: `incident-${incidents.length + 1}`,
            timestamp: measurement.timestamp,
            consumptionPointId: point.id,
            type: 'overload',
            severity: 'high',
            description: 'Current exceeded rated capacity',
            value: measurement.current,
            threshold: 90,
            resolved: Math.random() > 0.5
          });
        }
      }
    });
  });
  
  return incidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate optimization recommendations
const generateRecommendations = (consumptionPoints: ConsumptionPoint[]): OptimizationRecommendation[] => {
  const recommendations: OptimizationRecommendation[] = [
    {
      id: 'rec-1',
      consumptionPointId: 'cp-1',
      category: 'efficiency',
      title: 'Install Power Factor Correction',
      description: 'Add capacitor banks to improve power factor from 0.88 to 0.95',
      potentialSavings: 12500,
      implementationCost: 'medium',
      priority: 'high'
    },
    {
      id: 'rec-2',
      consumptionPointId: 'cp-2',
      category: 'scheduling',
      title: 'Optimize Rice Drying Schedule',
      description: 'Adjust drying times based on ambient humidity and temperature',
      potentialSavings: 8200,
      implementationCost: 'low',
      priority: 'medium'
    },
    {
      id: 'rec-3',
      consumptionPointId: 'cp-3',
      category: 'maintenance',
      title: 'Hulling Machine Optimization',
      description: 'Adjust and maintain hulling equipment for optimal performance',
      potentialSavings: 4300,
      implementationCost: 'low',
      priority: 'high'
    },
    {
      id: 'rec-4',
      consumptionPointId: 'cp-4',
      category: 'replacement',
      title: 'Upgrade Facility Lighting to LED',
      description: 'Replace fluorescent fixtures with LED panels with daylight sensors',
      potentialSavings: 5600,
      implementationCost: 'medium',
      priority: 'medium'
    },
    {
      id: 'rec-5',
      consumptionPointId: 'cp-1',
      category: 'efficiency',
      title: 'CBAM Cost Reduction Strategy',
      description: 'Implement carbon reduction measures to reduce CBAM fees',
      potentialSavings: 18900,
      implementationCost: 'high',
      priority: 'high'
    },
  ];
  
  return recommendations;
};

// Generate mock consumption points
export const generateConsumptionPoints = (hours: number = 24): ConsumptionPoint[] => {
  const consumptionPoints: ConsumptionPoint[] = [
    {
      id: 'cp-1',
      name: 'Rice Processing Line',
      location: 'Main Production Floor',
      category: 'production',
      measurements: generateMeasurements(hours, 'production')
    },
    {
      id: 'cp-2',
      name: 'Rice Drying Facility',
      location: 'Eastern Wing',
      category: 'production',
      measurements: generateMeasurements(hours, 'production')
    },
    {
      id: 'cp-3',
      name: 'Hulling and Polishing',
      location: 'Western Wing',
      category: 'production',
      measurements: generateMeasurements(hours, 'production')
    },
    {
      id: 'cp-4',
      name: 'Packaging Facility',
      location: 'Southern Wing',
      category: 'production',
      measurements: generateMeasurements(hours, 'production')
    }
  ];
  
  return consumptionPoints;
};

// Generate all mock data
export const generateMockData = (hours: number = 24) => {
  const consumptionPoints = generateConsumptionPoints(hours);
  const incidents = generateIncidents(consumptionPoints);
  const recommendations = generateRecommendations(consumptionPoints);
  
  return {
    consumptionPoints,
    incidents,
    recommendations
  };
};

// Summary metrics calculations
export const calculateSummaryMetrics = (consumptionPoints: ConsumptionPoint[]) => {
  // Total energy consumption
  let totalEnergy = 0;
  let totalActivePower = 0;
  let totalReactivePower = 0;
  let totalApparentPower = 0;
  let avgPowerFactor = 0;
  let avgVoltage = 0;
  let pointCount = consumptionPoints.length;
  let measurementCount = 0;
  
  consumptionPoints.forEach(point => {
    const latestMeasurements = point.measurements.slice(-12); // Last hour
    latestMeasurements.forEach(m => {
      totalEnergy += m.energy;
      totalActivePower += m.activePower;
      totalReactivePower += m.reactivePower;
      totalApparentPower += m.apparentPower;
      avgPowerFactor += m.powerFactor;
      avgVoltage += m.voltage;
      measurementCount++;
    });
  });
  
  // Calculate averages
  const hourlyEnergy = totalEnergy;
  const avgActivePower = measurementCount > 0 ? totalActivePower / measurementCount : 0;
  const avgReactivePower = measurementCount > 0 ? totalReactivePower / measurementCount : 0;
  const systemPowerFactor = measurementCount > 0 ? avgPowerFactor / measurementCount : 0;
  const avgSystemVoltage = measurementCount > 0 ? avgVoltage / measurementCount : 0;
  
  // Calculate losses (10-15% of active power as an estimate)
  const technicalLosses = avgActivePower * 0.12;
  
  // Calculate CBAM-related metrics
  let totalCarbonEmissions = 0;
  let totalCbamFactor = 0;
  let totalHumidity = 0;
  
  consumptionPoints.forEach(point => {
    const latestMeasurements = point.measurements.slice(-12); // Last hour
    latestMeasurements.forEach(m => {
      if (m.carbonEmissions) totalCarbonEmissions += m.carbonEmissions;
      if (m.cbamFactor) totalCbamFactor += m.cbamFactor;
      if (m.humidity) totalHumidity += m.humidity;
    });
  });
  
  const avgCarbonEmissions = measurementCount > 0 ? totalCarbonEmissions / measurementCount : 0;
  const avgCbamFactor = measurementCount > 0 ? totalCbamFactor / measurementCount : 0;
  const avgHumidity = measurementCount > 0 ? totalHumidity / measurementCount : 0;
  
  return {
    hourlyEnergy: +hourlyEnergy.toFixed(2),
    avgActivePower: +avgActivePower.toFixed(2),
    avgReactivePower: +avgReactivePower.toFixed(2),
    systemPowerFactor: +systemPowerFactor.toFixed(2),
    avgSystemVoltage: +avgSystemVoltage.toFixed(1),
    technicalLosses: +technicalLosses.toFixed(2),
    avgCarbonEmissions: +avgCarbonEmissions.toFixed(2),
    avgCbamFactor: +avgCbamFactor.toFixed(2),
    avgHumidity: +avgHumidity.toFixed(1),
    consumptionBreakdown: {
      processing: 45,
      drying: 25,
      hulling: 15,
      packaging: 10,
      other: 5
    }
  };
};

export const mockData = generateMockData();
export const summaryMetrics = calculateSummaryMetrics(mockData.consumptionPoints);
