export const generateSankeyData = () => {
  // Define proper node names instead of "Unknown"
  const nodes = [
    { name: 'Power Supply' },
    { name: 'Distribution Grid' },
    { name: 'Rice Processing' },
    { name: 'Drying' },
    { name: 'Milling' },
    { name: 'Utilities' },
    { name: 'Packaging' },
    { name: 'Lighting' },
    { name: 'HVAC' },
    { name: 'Technical Losses' },
  ];
  
  // Define links with proper source and target names
  const links = [
    { source: 'Power Supply', target: 'Distribution Grid', value: 280 },
    { source: 'Distribution Grid', target: 'Rice Processing', value: 95 },
    { source: 'Distribution Grid', target: 'Drying', value: 75 },
    { source: 'Distribution Grid', target: 'Milling', value: 45 },
    { source: 'Distribution Grid', target: 'Utilities', value: 35 },
    { source: 'Distribution Grid', target: 'Technical Losses', value: 18 },
    { source: 'Milling', target: 'Packaging', value: 20 },
    { source: 'Utilities', target: 'Lighting', value: 15 },
    { source: 'Utilities', target: 'HVAC', value: 20 },
  ];
  
  // Create a proper Sankey diagram data structure
  return {
    nodes,
    links,
  };
};

export const generateCircuitModels = () => {
  return [
    {
      id: 'circuit-1',
      name: 'Main Power Feed',
      description: 'Primary power distribution circuit',
      nodes: [
        { id: 'node-1', name: 'Grid Supply', power: 220, voltage: 480, current: 275 },
        { id: 'node-2', name: 'Main Breaker', power: 215, voltage: 478, current: 270 },
        { id: 'node-3', name: 'Line Stabilizer', power: 210, voltage: 477, current: 268 }
      ]
    },
    {
      id: 'circuit-2',
      name: 'Processing Unit A',
      description: 'Power circuit for processing unit A',
      nodes: [
        { id: 'node-4', name: 'Transformer A', power: 110, voltage: 240, current: 458 },
        { id: 'node-5', name: 'Motor Drive A', power: 105, voltage: 238, current: 450 },
        { id: 'node-6', name: 'Control System A', power: 5, voltage: 24, current: 208 }
      ]
    }
  ];
};

export const generateMaintenanceAlerts = () => {
  return [
    {
      id: 'alert-1',
      machineId: 'machine-1',
      machineName: 'Main Compressor',
      title: 'Overheating Warning',
      description: 'Temperature exceeds normal operating range.',
      severity: 'medium',
      detectedAt: new Date().toISOString(),
      metrics: [
        {
          name: 'Temperature',
          value: 120.5,
          unit: '°C',
          deviation: 15.2
        },
        {
          name: 'Pressure',
          value: 8.3,
          unit: 'bar',
          deviation: -2.1
        }
      ],
      recommendation: 'Check cooling system and reduce load.',
      status: 'new'
    },
    {
      id: 'alert-2',
      machineId: 'machine-2',
      machineName: 'Conveyor Belt B',
      title: 'Vibration Alert',
      description: 'Unusual vibration detected.',
      severity: 'low',
      detectedAt: new Date().toISOString(),
      metrics: [
        {
          name: 'Vibration Level',
          value: 6.7,
          unit: 'mm/s',
          deviation: 2.5
        }
      ],
      recommendation: 'Inspect belt alignment and tension.',
      status: 'acknowledged'
    },
    {
      id: 'alert-3',
      machineId: 'machine-3',
      machineName: 'Main Motor Drive',
      title: 'Current Imbalance',
      description: 'Phase current imbalance detected.',
      severity: 'high',
      detectedAt: new Date().toISOString(),
      metrics: [
        {
          name: 'Phase A Current',
          value: 45.2,
          unit: 'A',
          deviation: 10.1
        },
        {
          name: 'Phase B Current',
          value: 38.9,
          unit: 'A',
          deviation: -8.5
        }
      ],
      recommendation: 'Check motor windings and power supply.',
      status: 'new'
    },
    {
      id: 'alert-4',
      machineId: 'machine-4',
      machineName: 'Cooling Tower Fan',
      title: 'Reduced Airflow',
      description: 'Airflow significantly reduced.',
      severity: 'medium',
      detectedAt: new Date().toISOString(),
      metrics: [
        {
          name: 'Airflow Rate',
          value: 75.3,
          unit: '%',
          deviation: -22.7
        }
      ],
      recommendation: 'Inspect fan blades and air intakes.',
      status: 'resolved'
    }
  ];
};
