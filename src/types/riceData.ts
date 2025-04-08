
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
  | 'ENERGY_KWH';

export interface RiceProductionData {
  metrics: RiceProductionMetric[];
  lastUpdated: string;
}
