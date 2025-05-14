
import { MaintenanceAlert } from '@/components/dashboard/MaintenanceAlerts';

// Define the category type to match the SankeyNode interface
type SankeyNodeCategory = 'source' | 'process' | 'output' | 'loss';

// Energy Sankey diagram data
export const generateSankeyData = () => {
  return {
    nodes: [
      { name: 'Main Input', category: 'source' as SankeyNodeCategory },           // 0
      { name: 'Processing', category: 'process' as SankeyNodeCategory },           // 1
      { name: 'Drying', category: 'process' as SankeyNodeCategory },              // 2
      { name: 'Milling', category: 'process' as SankeyNodeCategory },             // 3
      { name: 'Packaging', category: 'process' as SankeyNodeCategory },            // 4
      { name: 'Utilities', category: 'process' as SankeyNodeCategory },            // 5
      { name: 'Lighting', category: 'output' as SankeyNodeCategory },             // 6
      { name: 'HVAC', category: 'output' as SankeyNodeCategory },                 // 7
      { name: 'Processing Losses', category: 'loss' as SankeyNodeCategory },       // 8
      { name: 'Transmission Losses', category: 'loss' as SankeyNodeCategory },     // 9
      { name: 'Conversion Losses', category: 'loss' as SankeyNodeCategory }        // 10
    ],
    links: [
      { source: 0, target: 1, value: 42.5 },  // Main -> Processing
      { source: 0, target: 2, value: 30.2 },  // Main -> Drying
      { source: 0, target: 3, value: 25.8 },  // Main -> Milling
      { source: 0, target: 4, value: 15.5 },  // Main -> Packaging
      { source: 0, target: 5, value: 18.3 },  // Main -> Utilities
      { source: 0, target: 9, value: 3.2 },   // Main -> Transmission Losses
      
      { source: 5, target: 6, value: 6.8 },   // Utilities -> Lighting
      { source: 5, target: 7, value: 9.2 },   // Utilities -> HVAC
      { source: 5, target: 10, value: 2.3 },  // Utilities -> Conversion Losses
      
      { source: 1, target: 8, value: 4.1 },   // Processing -> Processing Losses
      { source: 2, target: 8, value: 3.8 },   // Drying -> Processing Losses
      { source: 3, target: 8, value: 2.6 },   // Milling -> Processing Losses
      { source: 4, target: 8, value: 1.5 }    // Packaging -> Processing Losses
    ]
  };
};

// Circuit energy flow models
export const generateCircuitModels = () => {
  return [
    {
      id: 'circuit-1',
      title: 'Rice Milling Circuit',
      description: 'Primary processing line for rice milling operations',
      nodes: [
        {
          id: 'node-1',
          name: 'Main Distribution Panel',
          power: 85.3,
          voltage: 415.2,
          current: 205.4,
          status: 'normal' as const
        },
        {
          id: 'node-2',
          name: 'Milling Motor Controls',
          power: 42.7,
          voltage: 410.8,
          current: 103.9,
          status: 'normal' as const
        },
        {
          id: 'node-3',
          name: 'Husker Motor',
          power: 18.3,
          voltage: 408.5,
          current: 44.8,
          status: 'warning' as const
        },
        {
          id: 'node-4',
          name: 'Polisher System',
          power: 21.8,
          voltage: 407.9,
          current: 53.4,
          status: 'normal' as const
        }
      ],
      connections: [
        {
          source: 'node-1',
          target: 'node-2',
          power: 42.7,
          loss: 1.2
        },
        {
          source: 'node-2',
          target: 'node-3',
          power: 18.3,
          loss: 0.8
        },
        {
          source: 'node-2',
          target: 'node-4',
          power: 21.8,
          loss: 0.6
        }
      ]
    },
    {
      id: 'circuit-2',
      title: 'Drying Circuit',
      description: 'Dedicated power circuit for the rice drying system',
      nodes: [
        {
          id: 'node-5',
          name: 'Dryer Control Panel',
          power: 38.9,
          voltage: 412.7,
          current: 94.3,
          status: 'normal' as const
        },
        {
          id: 'node-6',
          name: 'Heating Elements',
          power: 25.4,
          voltage: 410.1,
          current: 62.0,
          status: 'normal' as const
        },
        {
          id: 'node-7',
          name: 'Fan Motors',
          power: 11.7,
          voltage: 409.3,
          current: 28.6,
          status: 'critical' as const
        }
      ],
      connections: [
        {
          source: 'node-5',
          target: 'node-6',
          power: 25.4,
          loss: 0.5
        },
        {
          source: 'node-5',
          target: 'node-7',
          power: 11.7,
          loss: 0.3
        }
      ]
    }
  ];
};

// Generate maintenance alerts based on energy patterns
export const generateMaintenanceAlerts = () => {
  const alerts: MaintenanceAlert[] = [
    {
      id: 'alert-1',
      machineId: 'machine-3',
      machineName: 'Husker Motor',
      title: 'Abnormal Power Consumption',
      description: 'The husker motor is drawing 15.3% more power than normal operating parameters while processing the same volume.',
      severity: 'medium',
      detectedAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
      metrics: [
        {
          name: 'Power',
          value: 18.3,
          unit: 'kW',
          deviation: 15.3
        },
        {
          name: 'Current',
          value: 44.8,
          unit: 'A',
          deviation: 12.8
        },
        {
          name: 'Temperature',
          value: 68.5,
          unit: '°C',
          deviation: 22.1
        }
      ],
      recommendation: 'Schedule inspection for motor bearings and check for mechanical obstructions.',
      status: 'acknowledged'
    },
    {
      id: 'alert-2',
      machineId: 'machine-7',
      machineName: 'Fan Motors',
      title: 'Critical Overheating',
      description: 'Fan motor temperature exceeds critical threshold with reduced airflow detected.',
      severity: 'high',
      detectedAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
      metrics: [
        {
          name: 'Temperature',
          value: 92.3,
          unit: '°C',
          deviation: 65.4
        },
        {
          name: 'Airflow',
          value: 230,
          unit: 'CFM',
          deviation: -42.5
        },
        {
          name: 'Vibration',
          value: 12.8,
          unit: 'mm/s',
          deviation: 128.5
        }
      ],
      recommendation: 'Immediate shutdown required. Check cooling system and inspect motor windings.',
      status: 'new'
    },
    {
      id: 'alert-3',
      machineId: 'machine-6',
      machineName: 'Heating Elements',
      title: 'Efficiency Degradation',
      description: 'Heating element efficiency has decreased by 8.2% over the past week.',
      severity: 'low',
      detectedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
      metrics: [
        {
          name: 'Efficiency',
          value: 84.3,
          unit: '%',
          deviation: -8.2
        },
        {
          name: 'Power',
          value: 25.4,
          unit: 'kW',
          deviation: 3.7
        }
      ],
      recommendation: 'Schedule maintenance to clean heating elements and check insulation.',
      status: 'scheduled'
    },
    {
      id: 'alert-4',
      machineId: 'machine-4',
      machineName: 'Polisher System',
      title: 'Harmonic Distortion',
      description: 'High harmonic distortion detected in the polisher system power supply.',
      severity: 'medium',
      detectedAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
      metrics: [
        {
          name: 'THD',
          value: 12.8,
          unit: '%',
          deviation: 113.3
        },
        {
          name: 'Power Factor',
          value: 0.82,
          unit: '',
          deviation: -10.9
        }
      ],
      recommendation: 'Install harmonic filters and verify variable frequency drive settings.',
      status: 'new'
    }
  ];
  
  return alerts;
};
