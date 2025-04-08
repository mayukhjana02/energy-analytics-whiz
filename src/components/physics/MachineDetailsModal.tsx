
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MachineEfficiency } from '@/types/riceData';
import RiceMillingPhysics from './RiceMillingPhysics';
import { calculateOptimalParameters } from '@/utils/physicsCalculations';

interface MachineDetailsModalProps {
  machine: MachineEfficiency | null;
  open: boolean;
  onClose: () => void;
  onOptimize: (machineId: string) => void;
}

const MachineDetailsModal: React.FC<MachineDetailsModalProps> = ({
  machine,
  open,
  onClose,
  onOptimize
}) => {
  if (!machine) return null;
  
  const optimal = calculateOptimalParameters(machine.physicsParams);
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{machine.name} - Detailed Physics Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <RiceMillingPhysics params={machine.physicsParams} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Current Parameters</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Friction Coefficient:</span>
                  <span className="font-medium">{machine.physicsParams.frictionCoefficient.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roller Speed:</span>
                  <span className="font-medium">{machine.physicsParams.rollerSpeed.toFixed(0)} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pressure Level:</span>
                  <span className="font-medium">{machine.physicsParams.pressureLevel.toFixed(1)} kPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vibration Level:</span>
                  <span className="font-medium">{machine.physicsParams.vibrationLevel.toFixed(1)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Motor Torque:</span>
                  <span className="font-medium">{machine.physicsParams.motorTorque.toFixed(1)} N·m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="font-medium">{machine.physicsParams.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span className="font-medium">{machine.physicsParams.humidity.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grain Moisture:</span>
                  <span className="font-medium">{machine.physicsParams.grainMoisture.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Optimal Parameters</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Friction Coefficient:</span>
                  <span className="font-medium">{optimal.frictionCoefficient.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roller Speed:</span>
                  <span className="font-medium">{optimal.rollerSpeed.toFixed(0)} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pressure Level:</span>
                  <span className="font-medium">{optimal.pressureLevel.toFixed(1)} kPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vibration Level:</span>
                  <span className="font-medium">{optimal.vibrationLevel.toFixed(1)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Motor Torque:</span>
                  <span className="font-medium">{optimal.motorTorque.toFixed(1)} N·m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="font-medium">{optimal.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span className="font-medium">{optimal.humidity.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grain Moisture:</span>
                  <span className="font-medium">{optimal.grainMoisture.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Physics-Based Recommendations</h3>
            <ul className="space-y-2">
              {machine.recommendations.map((rec, index) => (
                <li key={index} className="text-sm bg-slate-50 p-2 rounded-md border border-slate-200">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => onOptimize(machine.id)}>Apply Optimizations</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MachineDetailsModal;
