
export interface RiceProductionMetric {
  id: number;
  tagId: string;
  value: number;
  timestamp: number;
  machineId: string;
  createdAt: string;
}

export type RiceMetricTagId = 
  | 'INPUT_PADDY_TPH'
  | 'INPUT_PADDY_TOT'
  | 'BROWN_RICE_TPH_1'
  | 'BROWN_RICE_TPH_2'
  | 'BROWN_RICE_TOT_1'
  | 'BROWN_RICE_TOT_2'
  | 'WHITE_RICE_TPH'
  | 'WHITE_RICE_TOT'
  | 'ENERGY_AMPS'
  | 'ENERGY_KWH'
  | 'VIBRATION_LEVEL'
  | 'ROLLER_RPM'
  | 'MACHINE_TEMP'
  | 'FRICTION_COEFFICIENT'
  | 'PRESSURE_LEVEL'
  | 'MOTOR_TORQUE';

export interface RiceProductionData {
  metrics: RiceProductionMetric[];
  lastUpdated: string;
}

export interface PhysicsParameters {
  frictionCoefficient: number;
  rollerSpeed: number;
  pressureLevel: number;
  vibrationLevel: number;
  motorTorque: number;
  temperature: number;
  humidity: number;
  airResistance: number;
  particleDensity: number;
  grainMoisture: number;
}

export interface MachineEfficiency {
  id: string;
  name: string;
  currentEfficiency: number;
  optimalEfficiency: number;
  physicsParams: PhysicsParameters;
  recommendations: string[];
  lastUpdated: string;
}
