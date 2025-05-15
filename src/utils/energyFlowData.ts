
import { MaintenanceAlert } from '@/components/dashboard/MaintenanceAlerts';

// Define the category type to match the SankeyNode interface
type SankeyNodeCategory = 'source' | 'process' | 'output' | 'loss';

// Energy Sankey diagram data with more detailed flow information
export const generateSankeyData = () => {
  return {
    nodes: [
      // Energy sources
      { name: 'Grid Input', category: 'source' as SankeyNodeCategory },          // 0
      { name: 'Solar Input', category: 'source' as SankeyNodeCategory },         // 1
      { name: 'Generator', category: 'source' as SankeyNodeCategory },           // 2
      
      // Main processing stages
      { name: 'Main Distribution', category: 'process' as SankeyNodeCategory },   // 3
      
      // Processing departments
      { name: 'Rice Processing', category: 'process' as SankeyNodeCategory },     // 4
      { name: 'Drying', category: 'process' as SankeyNodeCategory },             // 5
      { name: 'Milling', category: 'process' as SankeyNodeCategory },            // 6
      { name: 'Packaging', category: 'process' as SankeyNodeCategory },          // 7
      
      // Supporting systems
      { name: 'Utilities', category: 'process' as SankeyNodeCategory },          // 8
      { name: 'HVAC', category: 'output' as SankeyNodeCategory },                // 9
      { name: 'Lighting', category: 'output' as SankeyNodeCategory },            // 10
      { name: 'Water Treatment', category: 'output' as SankeyNodeCategory },      // 11
      
      // Equipment level
      { name: 'Huskers', category: 'output' as SankeyNodeCategory },              // 12
      { name: 'Polishers', category: 'output' as SankeyNodeCategory },            // 13
      { name: 'Sorting', category: 'output' as SankeyNodeCategory },             // 14
      { name: 'Dryer Units', category: 'output' as SankeyNodeCategory },          // 15
      { name: 'Packaging Machines', category: 'output' as SankeyNodeCategory },    // 16
      
      // Losses
      { name: 'Transmission Losses', category: 'loss' as SankeyNodeCategory },    // 17
      { name: 'Heat Losses', category: 'loss' as SankeyNodeCategory },           // 18
      { name: 'Reactive Power', category: 'loss' as SankeyNodeCategory },         // 19
      { name: 'Motor Inefficiency', category: 'loss' as SankeyNodeCategory }      // 20
    ],
    links: [
      // Energy inputs to main distribution
      { source: 0, target: 3, value: 75.8 },  // Grid -> Main Distribution
      { source: 1, target: 3, value: 24.2 },  // Solar -> Main Distribution
      { source: 2, target: 3, value: 12.5 },  // Generator -> Main Distribution
      
      // Main distribution losses
      { source: 3, target: 17, value: 3.4 },  // Main Distribution -> Transmission Losses
      
      // Main distribution to departments
      { source: 3, target: 4, value: 42.5 },  // Main Distribution -> Rice Processing
      { source: 3, target: 5, value: 30.2 },  // Main Distribution -> Drying
      { source: 3, target: 6, value: 22.8 },  // Main Distribution -> Milling
      { source: 3, target: 7, value: 15.5 },  // Main Distribution -> Packaging
      { source: 3, target: 8, value: 18.3 },  // Main Distribution -> Utilities
      
      // Rice Processing breakdown
      { source: 4, target: 12, value: 22.3 }, // Rice Processing -> Huskers
      { source: 4, target: 13, value: 14.6 }, // Rice Processing -> Polishers
      { source: 4, target: 14, value: 5.6 },  // Rice Processing -> Sorting
      { source: 4, target: 19, value: 1.8 },  // Rice Processing -> Reactive Power Loss
      { source: 4, target: 20, value: 2.2 },  // Rice Processing -> Motor Inefficiency
      
      // Drying breakdown
      { source: 5, target: 15, value: 26.4 }, // Drying -> Dryer Units
      { source: 5, target: 18, value: 3.8 },  // Drying -> Heat Losses
      
      // Milling breakdown
      { source: 6, target: 19, value: 2.1 },  // Milling -> Reactive Power Loss
      { source: 6, target: 20, value: 1.8 },  // Milling -> Motor Inefficiency
      
      // Packaging breakdown
      { source: 7, target: 16, value: 14.1 }, // Packaging -> Packaging Machines
      { source: 7, target: 19, value: 1.4 },  // Packaging -> Reactive Power Loss
      
      // Utilities breakdown
      { source: 8, target: 9, value: 8.7 },   // Utilities -> HVAC
      { source: 8, target: 10, value: 6.2 },  // Utilities -> Lighting
      { source: 8, target: 11, value: 3.4 },  // Utilities -> Water Treatment
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
