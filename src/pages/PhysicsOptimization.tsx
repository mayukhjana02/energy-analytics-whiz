
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MachineEfficiency } from '@/types/riceData';
import { generateMockMachineEfficiencies, simulateOptimization } from '@/utils/physicsCalculations';
import MachineEfficiencyCard from '@/components/physics/MachineEfficiencyCard';
import MachineDetailsModal from '@/components/physics/MachineDetailsModal';
import { toast } from 'sonner';
import RiceMillingPhysics from '@/components/physics/RiceMillingPhysics';

const PhysicsOptimization: React.FC = () => {
  const [machines, setMachines] = useState<MachineEfficiency[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<MachineEfficiency | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load initial machine data
    const loadMachines = () => {
      setLoading(true);
      // Simulate API loading
      setTimeout(() => {
        const mockMachines = generateMockMachineEfficiencies();
        setMachines(mockMachines);
        setLoading(false);
        toast.success('Machine physics data loaded');
      }, 800);
    };
    
    loadMachines();
  }, []);
  
  const handleOptimize = (machineId: string) => {
    setMachines(prev => {
      const updatedMachines = prev.map(machine => {
        if (machine.id === machineId) {
          const optimized = simulateOptimization(machine);
          
          // Update selected machine if it's currently displayed
          if (selectedMachine?.id === machineId) {
            setSelectedMachine(optimized);
          }
          
          return optimized;
        }
        return machine;
      });
      
      toast.success(`Optimization applied to ${machines.find(m => m.id === machineId)?.name}`);
      return updatedMachines;
    });
  };
  
  const handleViewDetails = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (machine) {
      setSelectedMachine(machine);
      setIsDetailsOpen(true);
    }
  };
  
  const closeDetails = () => {
    setIsDetailsOpen(false);
  };
  
  // Calculate average efficiency
  const avgEfficiency = machines.length 
    ? machines.reduce((sum, machine) => sum + machine.currentEfficiency, 0) / machines.length
    : 0;
  
  // Calculate potential improvement
  const potentialImprovement = machines.length
    ? machines.reduce((sum, machine) => sum + (machine.optimalEfficiency - machine.currentEfficiency), 0) / machines.length
    : 0;
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold mb-2 tracking-tight">Rice Mill Physics Optimization</h1>
              <p className="text-muted-foreground">
                Monitor and optimize rice mill machines using physics-based parameters and simulations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {avgEfficiency.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Current system efficiency</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Potential Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    +{potentialImprovement.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Available efficiency gain</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Rice Quality Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {potentialImprovement > 10 ? 'High' : potentialImprovement > 5 ? 'Medium' : 'Low'}
                  </div>
                  <p className="text-sm text-muted-foreground">Potential quality improvement</p>
                </CardContent>
              </Card>
            </div>
            
            {machines.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Live Simulation</h2>
                <RiceMillingPhysics 
                  params={machines[0].physicsParams} 
                  height={300}
                />
              </div>
            )}
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Rice Processing Machines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Card key={i} className="w-full h-[300px] animate-pulse bg-gray-100" />
                  ))
                ) : (
                  machines.map(machine => (
                    <MachineEfficiencyCard
                      key={machine.id}
                      machine={machine}
                      onOptimize={handleOptimize}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </div>
            </div>
            
            <MachineDetailsModal
              machine={selectedMachine}
              open={isDetailsOpen}
              onClose={closeDetails}
              onOptimize={handleOptimize}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PhysicsOptimization;
