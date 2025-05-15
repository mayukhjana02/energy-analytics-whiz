
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import RiceProductionTable from '@/components/dashboard/RiceProductionTable';
import { initialRiceProductionData, generateUpdatedRiceData, createRiceMetricsData } from '@/utils/riceProductionData';
import { RiceProductionMetric } from '@/types/riceData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiceProduction = () => {
  const [riceData, setRiceData] = useState<RiceProductionMetric[]>(initialRiceProductionData);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Generate more sample data on initial load
  useEffect(() => {
    // Generate 10 more sets of data to have richer data
    let updatedData = [...riceData];
    for (let i = 0; i < 10; i++) {
      updatedData = generateUpdatedRiceData(updatedData);
    }
    setRiceData(updatedData);
  }, []);

  // Prepare chart data whenever rice data updates
  useEffect(() => {
    // Extract unique timestamps
    const timestamps = Array.from(new Set(riceData.map(item => item.timestamp)))
      .sort((a, b) => a - b);
    
    // Create chart data array by combining metrics for each timestamp
    const newChartData = timestamps.map(timestamp => {
      const metricsAtTimestamp = riceData.filter(item => item.timestamp === timestamp);
      
      // Create a data point with all metrics for this timestamp
      const dataPoint: Record<string, any> = {
        timestamp,
        timeLabel: new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
      };
      
      // Add all metrics to this data point
      metricsAtTimestamp.forEach(metric => {
        dataPoint[metric.tagId] = metric.value;
      });
      
      return dataPoint;
    });
    
    setChartData(newChartData);
  }, [riceData]);
  
  // Update rice production data every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setRiceData(prevData => generateUpdatedRiceData(prevData));
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Create rice metrics for display
  const riceMetrics = createRiceMetricsData(riceData);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold mb-2 tracking-tight section-fade">Rice Production Data</h1>
              <p className="text-muted-foreground section-fade" style={{ animationDelay: '100ms' }}>
                Detailed monitoring of rice processing metrics and energy consumption
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {riceMetrics.map((metric, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-baseline">
                      <div className="text-2xl font-bold">
                        {metric.value.toFixed(2)} {metric.unit}
                      </div>
                      <div className={`text-sm flex items-center ${
                        metric.trend === 'up' ? 'text-green-500' : 
                        metric.trend === 'down' ? 'text-red-500' : 
                        'text-muted-foreground'
                      }`}>
                        {metric.change}% 
                        {metric.trend === 'up' ? ' ↑' : metric.trend === 'down' ? ' ↓' : ''}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Tabs defaultValue="table" className="mb-6">
              <TabsList>
                <TabsTrigger value="table">Data Table</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table" className="mt-4">
                <RiceProductionTable data={riceData} />
              </TabsContent>
              
              <TabsContent value="charts" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rice Production Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timeLabel" 
                            angle={-45} 
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="INPUT_PADDY_TPH" 
                            name="Input Paddy (TPH)"
                            stroke="#8884d8" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="WHITE_RICE_TPH" 
                            name="White Rice Output (TPH)"
                            stroke="#82ca9d" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ENERGY_AMPS" 
                            name="Energy Consumption (A)"
                            stroke="#ff7300" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="h-[400px] mt-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timeLabel" 
                            angle={-45} 
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="BROWN_RICE_TPH_1" 
                            name="Brown Rice Line 1 (TPH)"
                            stroke="#8884d8" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="BROWN_RICE_TPH_2" 
                            name="Brown Rice Line 2 (TPH)"
                            stroke="#82ca9d" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ENERGY_KWH" 
                            name="Energy Consumption (kWh)"
                            stroke="#ff7300" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Alert className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Data Insights</AlertTitle>
                  <AlertDescription>
                    The charts show a strong correlation between input paddy volume and energy consumption. 
                    There's an opportunity to optimize energy usage during lower production periods.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiceProduction;
