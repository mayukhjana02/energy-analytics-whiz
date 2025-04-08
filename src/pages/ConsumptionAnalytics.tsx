
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { calculatePowerRequirement } from '@/utils/physicsCalculations';
import { initialRiceProductionData, getLatestMetrics } from '@/utils/riceProductionData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiceProductionMetric } from '@/types/riceData';

const ConsumptionAnalytics: React.FC = () => {
  const [riceData, setRiceData] = useState<RiceProductionMetric[]>(initialRiceProductionData);
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [viewType, setViewType] = useState<'energy' | 'production' | 'efficiency'>('energy');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      toast.success('Energy consumption data loaded');
    }, 800);
  }, []);
  
  // Get the latest metrics for each tag
  const latestMetrics = getLatestMetrics(riceData);
  
  // Calculate energy per ton of processed rice
  const energyPerTon = () => {
    const energy = latestMetrics.find(m => m.tagId === 'ENERGY_KWH')?.value || 0;
    const whiteRiceTotal = latestMetrics.find(m => m.tagId === 'WHITE_RICE_TOT')?.value || 1;
    return (energy / whiteRiceTotal) * 1000; // kWh per ton
  };
  
  // Calculate power consumption by time
  const getPowerConsumptionData = () => {
    // Group by 30-minute intervals for the chart
    const energyByTime: Record<string, { time: string; power: number; input: number; output: number }> = {};
    
    riceData.forEach(metric => {
      const date = new Date(metric.timestamp);
      // Format to hours and half hours
      const timeKey = `${date.getHours().toString().padStart(2, '0')}:${
        date.getMinutes() < 30 ? '00' : '30'
      }`;
      
      if (!energyByTime[timeKey]) {
        energyByTime[timeKey] = { time: timeKey, power: 0, input: 0, output: 0 };
      }
      
      if (metric.tagId === 'ENERGY_AMPS') {
        energyByTime[timeKey].power = metric.value;
      } else if (metric.tagId === 'INPUT_PADDY_TPH') {
        energyByTime[timeKey].input = metric.value;
      } else if (metric.tagId === 'WHITE_RICE_TPH') {
        energyByTime[timeKey].output = metric.value;
      }
    });
    
    return Object.values(energyByTime).sort((a, b) => a.time.localeCompare(b.time));
  };
  
  // Prepare data for the production efficiency chart
  const getProductionEfficiencyData = () => {
    const inputTph = latestMetrics.find(m => m.tagId === 'INPUT_PADDY_TPH')?.value || 0;
    const brownRiceTph1 = latestMetrics.find(m => m.tagId === 'BROWN_RICE_TPH_1')?.value || 0;
    const brownRiceTph2 = latestMetrics.find(m => m.tagId === 'BROWN_RICE_TPH_2')?.value || 0;
    const whiteRiceTph = latestMetrics.find(m => m.tagId === 'WHITE_RICE_TPH')?.value || 0;
    
    const cleaningLoss = inputTph - (brownRiceTph1 + brownRiceTph2);
    const hullingLoss = (brownRiceTph1 + brownRiceTph2) - whiteRiceTph;
    
    return [
      { name: 'White Rice', value: whiteRiceTph },
      { name: 'Hulling Loss', value: hullingLoss },
      { name: 'Cleaning Loss', value: cleaningLoss }
    ];
  };
  
  // Calculate energy distribution by process
  const getEnergyDistributionData = () => [
    { name: 'Paddy Cleaning', value: 15 },
    { name: 'Hulling', value: 35 },
    { name: 'Whitening', value: 30 },
    { name: 'Polishing', value: 10 },
    { name: 'Sorting', value: 5 },
    { name: 'Packaging', value: 5 }
  ];
  
  const getPhysicsRelatedMetrics = () => {
    // Calculate theoretical vs. actual power based on physics principles
    const rpmAvg = 850; // average rpm for rice mill components
    const torqueEstimate = 50; // N⋅m (estimated torque)
    const theoreticalPower = calculatePowerRequirement(torqueEstimate, rpmAvg) / 1000; // Convert to kW
    
    // Actual power can be derived from energy consumption
    const currentPower = (latestMetrics.find(m => m.tagId === 'ENERGY_AMPS')?.value || 0) * 220 / 1000; // Simplified P = I⋅V
    
    // Production metrics
    const inputRate = latestMetrics.find(m => m.tagId === 'INPUT_PADDY_TPH')?.value || 0;
    const outputRate = latestMetrics.find(m => m.tagId === 'WHITE_RICE_TPH')?.value || 0;
    const efficiency = inputRate > 0 ? (outputRate / inputRate) * 100 : 0;
    
    return [
      {
        name: 'Energy Efficiency',
        theoretical: 100,
        actual: (theoreticalPower / currentPower) * 100,
        unit: '%'
      },
      {
        name: 'Power Consumption',
        theoretical: theoreticalPower,
        actual: currentPower,
        unit: 'kW'
      },
      {
        name: 'Rice Yield',
        theoretical: 70, // Theoretical maximum yield percentage
        actual: efficiency,
        unit: '%'
      }
    ];
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold mb-2 tracking-tight">Energy Consumption Analytics</h1>
              <p className="text-muted-foreground">
                Physics-based analysis of energy consumption in rice processing
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">View:</span>
                <Select
                  value={viewType}
                  onValueChange={(value) => setViewType(value as any)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energy">Energy Consumption</SelectItem>
                    <SelectItem value="production">Production Metrics</SelectItem>
                    <SelectItem value="efficiency">Efficiency Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Time Range:</span>
                <Select
                  value={timeRange}
                  onValueChange={(value) => setTimeRange(value as any)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={() => toast.info('Data refreshed')}>
                Refresh Data
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Energy per Ton</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {energyPerTon().toFixed(1)} kWh
                  </div>
                  <p className="text-sm text-muted-foreground">Energy used per ton of white rice</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Load</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {(latestMetrics.find(m => m.tagId === 'ENERGY_AMPS')?.value || 0).toFixed(1)} A
                  </div>
                  <p className="text-sm text-muted-foreground">System current draw</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Conversion Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {((latestMetrics.find(m => m.tagId === 'WHITE_RICE_TPH')?.value || 0) / 
                      (latestMetrics.find(m => m.tagId === 'INPUT_PADDY_TPH')?.value || 1) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Rice conversion rate</p>
                </CardContent>
              </Card>
            </div>
            
            {viewType === 'energy' && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Power Consumption vs. Production Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getPowerConsumptionData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="power" stroke="#8884d8" name="Current (A)" />
                        <Line yAxisId="right" type="monotone" dataKey="input" stroke="#82ca9d" name="Input Rate (TPH)" />
                        <Line yAxisId="right" type="monotone" dataKey="output" stroke="#ff7300" name="Output Rate (TPH)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Energy Distribution by Process</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getEnergyDistributionData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {getEnergyDistributionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Physics-Based Optimization Targets</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getPhysicsRelatedMetrics()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value, name) => [`${value.toFixed(1)}`, name]} />
                          <Legend />
                          <Bar dataKey="actual" fill="#8884d8" name="Actual" />
                          <Bar dataKey="theoretical" fill="#82ca9d" name="Theoretical Optimal" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            
            {viewType === 'production' && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Rice Production Throughput</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Input Paddy', value: latestMetrics.find(m => m.tagId === 'INPUT_PADDY_TPH')?.value || 0 },
                          { name: 'Brown Rice 1', value: latestMetrics.find(m => m.tagId === 'BROWN_RICE_TPH_1')?.value || 0 },
                          { name: 'Brown Rice 2', value: latestMetrics.find(m => m.tagId === 'BROWN_RICE_TPH_2')?.value || 0 },
                          { name: 'White Rice', value: latestMetrics.find(m => m.tagId === 'WHITE_RICE_TPH')?.value || 0 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Throughput (TPH)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Production Efficiency Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getProductionEfficiencyData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {getProductionEfficiencyData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Production vs. Energy Consumption</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getPowerConsumptionData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="output" stroke="#82ca9d" name="Output (TPH)" />
                          <Line type="monotone" dataKey="power" stroke="#8884d8" name="Energy (A)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            
            {viewType === 'efficiency' && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Physics-Based Process Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Cleaning', current: 82, optimal: 90 },
                          { name: 'Husking', current: 78, optimal: 85 },
                          { name: 'Separation', current: 91, optimal: 95 },
                          { name: 'Whitening', current: 76, optimal: 88 },
                          { name: 'Polishing', current: 85, optimal: 92 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" fill="#8884d8" name="Current Efficiency" />
                        <Bar dataKey="optimal" fill="#82ca9d" name="Optimal Efficiency" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Energy Loss Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Useful Work', value: 65 },
                              { name: 'Friction Loss', value: 12 },
                              { name: 'Heat Loss', value: 8 },
                              { name: 'Motor Inefficiency', value: 10 },
                              { name: 'Other Losses', value: 5 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {getProductionEfficiencyData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Physics-Based Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 p-2">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <h3 className="font-medium text-green-800">Friction Reduction</h3>
                          <p className="text-sm text-green-700 mt-1">
                            Reduce friction coefficient in the whitening machine by 15% through improved lubrication to save 8.3 kWh/ton.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <h3 className="font-medium text-blue-800">Optimal RPM Adjustment</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Adjust husker roller speed from 950 RPM to 880 RPM to match rice moisture content for 5.7% improved efficiency.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <h3 className="font-medium text-amber-800">Vibration Damping</h3>
                          <p className="text-sm text-amber-700 mt-1">
                            Install vibration dampeners on the separator to reduce energy loss and improve separation efficiency by 3.2%.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                          <h3 className="font-medium text-purple-800">Temperature Optimization</h3>
                          <p className="text-sm text-purple-700 mt-1">
                            Maintain optimal operating temperature of 25°C in whitening chamber to reduce energy consumption by 4.8%.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConsumptionAnalytics;
