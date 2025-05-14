
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';
import { ArrowDownIcon, ArrowRightIcon, ZapIcon } from 'lucide-react';

interface CircuitNode {
  id: string;
  name: string;
  power: number;
  voltage: number;
  current: number;
  status: 'normal' | 'warning' | 'critical';
}

interface CircuitConnection {
  source: string;
  target: string;
  power: number;
  loss: number;
}

interface CircuitDiagram {
  id: string;
  title: string;
  description: string;
  nodes: CircuitNode[];
  connections: CircuitConnection[];
}

interface CircuitEnergyFlowProps {
  diagrams: CircuitDiagram[];
  className?: string;
}

const getStatusColor = (status: CircuitNode['status']) => {
  switch (status) {
    case 'critical':
      return 'bg-energy-red/10 text-energy-red border-energy-red/20';
    case 'warning':
      return 'bg-energy-yellow/10 text-energy-yellow border-energy-yellow/20';
    case 'normal':
    default:
      return 'bg-energy-green/10 text-energy-green border-energy-green/20';
  }
};

const CircuitEnergyFlow: React.FC<CircuitEnergyFlowProps> = ({ diagrams, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Circuit Energy Flow Models</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Carousel className="w-full">
          <CarouselContent>
            {diagrams.map((diagram) => (
              <CarouselItem key={diagram.id}>
                <div className="p-1">
                  <div className="rounded-lg border overflow-hidden">
                    <div className="bg-muted/30 p-3 border-b">
                      <h3 className="font-medium">{diagram.title}</h3>
                      <p className="text-sm text-muted-foreground">{diagram.description}</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex flex-col gap-4">
                        {diagram.nodes.map((node, i) => (
                          <div key={node.id} className="relative">
                            <div className={`p-3 rounded-lg border flex items-start gap-3 ${getStatusColor(node.status)}`}>
                              <div className="mt-0.5">
                                <ZapIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <h4 className="font-medium text-sm">{node.name}</h4>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {node.power.toFixed(1)} kW
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {node.voltage.toFixed(1)} V
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {node.current.toFixed(1)} A
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className={`
                                    ${node.status === 'normal' ? 'bg-energy-green/10 text-energy-green' : 
                                      node.status === 'warning' ? 'bg-energy-yellow/10 text-energy-yellow' : 
                                      'bg-energy-red/10 text-energy-red'}`
                                    }>
                                    {node.status === 'normal' ? 'Normal' : 
                                     node.status === 'warning' ? 'Warning' : 'Critical'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {i < diagram.nodes.length - 1 && (
                              <div className="flex justify-center my-2">
                                <div className="flex flex-col items-center">
                                  <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
                                  {diagram.connections.find(c => c.source === node.id)?.loss > 0 && (
                                    <div className="text-xs text-energy-red">
                                      Loss: {diagram.connections.find(c => c.source === node.id)?.loss.toFixed(1)} kW
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="static transform-none" />
            <CarouselNext className="static transform-none" />
          </div>
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default CircuitEnergyFlow;
