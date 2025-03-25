
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnergyIncident } from '@/utils/mockData';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/utils/dataTransformations';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, AlertOctagonIcon, BatteryWarningIcon, BoltIcon, ZapIcon } from 'lucide-react';

interface EnergyIncidentsProps {
  incidents: EnergyIncident[];
  className?: string;
}

const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'voltage_sag':
    case 'voltage_swell':
      return <BatteryWarningIcon className="h-4 w-4" />;
    case 'harmonic_distortion':
      return <AlertOctagonIcon className="h-4 w-4" />;
    case 'power_factor':
      return <ZapIcon className="h-4 w-4" />;
    case 'overload':
      return <BoltIcon className="h-4 w-4" />;
    default:
      return <AlertTriangleIcon className="h-4 w-4" />;
  }
};

const getIncidentColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-energy-red/10 text-energy-red border-energy-red/20';
    case 'medium':
      return 'bg-energy-yellow/10 text-energy-yellow border-energy-yellow/20';
    case 'low':
      return 'bg-energy-blue/10 text-energy-blue border-energy-blue/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getIncidentTypeName = (type: string) => {
  switch (type) {
    case 'voltage_sag':
      return 'Voltage Sag';
    case 'voltage_swell':
      return 'Voltage Swell';
    case 'harmonic_distortion':
      return 'Harmonic Distortion';
    case 'power_factor':
      return 'Poor Power Factor';
    case 'overload':
      return 'System Overload';
    default:
      return type.replace('_', ' ');
  }
};

const EnergyIncidents: React.FC<EnergyIncidentsProps> = ({ incidents, className }) => {
  // Show max 5 incidents
  const displayedIncidents = incidents.slice(0, 5);
  
  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Recent Incidents</CardTitle>
          <Badge variant="outline" className="rounded-md">
            {incidents.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-0">
        <div className="space-y-4">
          {displayedIncidents.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No incidents detected</p>
            </div>
          ) : (
            displayedIncidents.map((incident) => (
              <div 
                key={incident.id} 
                className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${getIncidentColor(incident.severity)}`}
              >
                <div className="mt-0.5">
                  {getIncidentIcon(incident.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-medium text-sm">
                      {getIncidentTypeName(incident.type)}
                    </h4>
                    <Badge 
                      variant={incident.resolved ? "outline" : "secondary"} 
                      className="text-[10px] h-5 px-1.5 whitespace-nowrap"
                    >
                      {incident.resolved ? 'Resolved' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs mt-0.5 opacity-80">
                    {incident.description} - {formatTimestamp(incident.timestamp, 'datetime')}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs">
                      <span className="opacity-80">Value:</span>{' '}
                      <span className="font-medium">{incident.value}</span>{' '}
                      <span className="opacity-80">Threshold:</span>{' '}
                      <span className="font-medium">{incident.threshold}</span>
                    </p>
                    <p className="text-xs opacity-80">
                      {incident.consumptionPointId.replace('cp-', 'Point ')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {incidents.length > 5 && (
            <div className="flex justify-center pt-2 pb-3">
              <Button variant="ghost" size="sm" className="text-xs">
                View all incidents
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyIncidents;
