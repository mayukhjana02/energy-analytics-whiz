
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRightIcon, WrenchIcon, ZapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MachineEfficiency } from '@/types/riceData';

interface MachineEfficiencyCardProps {
  machine: MachineEfficiency;
  onOptimize: (machineId: string) => void;
  onViewDetails: (machineId: string) => void;
}

const MachineEfficiencyCard: React.FC<MachineEfficiencyCardProps> = ({ 
  machine, 
  onOptimize,
  onViewDetails 
}) => {
  const { name, currentEfficiency, optimalEfficiency, recommendations } = machine;
  
  // Determine efficiency color based on percentage
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'bg-green-500';
    if (efficiency >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const efficiencyGap = optimalEfficiency - currentEfficiency;
  const lastUpdated = new Date(machine.lastUpdated).toLocaleString();
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>Last updated: {lastUpdated}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(machine.id)}
            >
              Details
            </Button>
            <Button 
              size="sm" 
              onClick={() => onOptimize(machine.id)}
            >
              <WrenchIcon className="h-4 w-4 mr-1" /> Optimize
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Efficiency</span>
              <span className="text-sm font-medium">{currentEfficiency.toFixed(1)}%</span>
            </div>
            <Progress value={currentEfficiency} className={getEfficiencyColor(currentEfficiency)} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Optimal Efficiency</span>
              <span className="text-sm font-medium">{optimalEfficiency.toFixed(1)}%</span>
            </div>
            <Progress value={optimalEfficiency} className="bg-blue-500" />
          </div>
          
          {efficiencyGap > 5 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-center text-amber-800 mb-2">
                <ZapIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Optimization Opportunity: {efficiencyGap.toFixed(1)}% potential improvement</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-800">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRightIcon className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
                {recommendations.length > 2 && (
                  <li className="text-xs text-amber-600">
                    +{recommendations.length - 2} more recommendations
                  </li>
                )}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Friction</span>
              <span>{machine.physicsParams.frictionCoefficient.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Roller Speed</span>
              <span>{machine.physicsParams.rollerSpeed.toFixed(0)} RPM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Temperature</span>
              <span>{machine.physicsParams.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Vibration</span>
              <span>{machine.physicsParams.vibrationLevel.toFixed(1)} Hz</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineEfficiencyCard;
