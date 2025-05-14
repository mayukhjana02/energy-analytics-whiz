
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertOctagonIcon, AlertTriangleIcon, ArrowRightIcon, ToolIcon, ZapIcon } from 'lucide-react';
import { formatTimestamp } from '@/utils/dataTransformations';

export interface MaintenanceAlert {
  id: string;
  machineId: string;
  machineName: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  detectedAt: string;
  metrics: {
    name: string;
    value: number;
    unit: string;
    deviation: number; // percentage from expected
  }[];
  recommendation: string;
  status: 'new' | 'acknowledged' | 'scheduled' | 'resolved';
}

interface MaintenanceAlertsProps {
  alerts: MaintenanceAlert[];
  className?: string;
}

const getSeverityIcon = (severity: MaintenanceAlert['severity']) => {
  switch (severity) {
    case 'high':
      return <AlertOctagonIcon className="h-4 w-4" />;
    case 'medium':
      return <AlertTriangleIcon className="h-4 w-4" />;
    case 'low':
    default:
      return <ToolIcon className="h-4 w-4" />;
  }
};

const getSeverityColor = (severity: MaintenanceAlert['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-energy-red/10 text-energy-red border-energy-red/20';
    case 'medium':
      return 'bg-energy-yellow/10 text-energy-yellow border-energy-yellow/20';
    case 'low':
    default:
      return 'bg-energy-blue/10 text-energy-blue border-energy-blue/20';
  }
};

const getStatusBadge = (status: MaintenanceAlert['status']) => {
  switch (status) {
    case 'new':
      return <Badge variant="destructive" className="text-[10px] h-5 px-1.5 whitespace-nowrap">New</Badge>;
    case 'acknowledged':
      return <Badge variant="default" className="text-[10px] h-5 px-1.5 whitespace-nowrap bg-energy-yellow text-primary-foreground">Acknowledged</Badge>;
    case 'scheduled':
      return <Badge variant="default" className="text-[10px] h-5 px-1.5 whitespace-nowrap bg-energy-blue text-primary-foreground">Scheduled</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="text-[10px] h-5 px-1.5 whitespace-nowrap">Resolved</Badge>;
    default:
      return null;
  }
};

const MaintenanceAlerts: React.FC<MaintenanceAlertsProps> = ({ alerts, className }) => {
  // Filter to show only active alerts (not resolved)
  const activeAlerts = alerts.filter(alert => alert.status !== 'resolved');
  const displayAlerts = activeAlerts.length > 0 ? activeAlerts : alerts.slice(0, 3);
  
  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Maintenance Alerts</CardTitle>
          <Badge variant="outline" className="rounded-md">
            {activeAlerts.length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-0">
        <div className="space-y-4">
          {displayAlerts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No maintenance alerts detected</p>
            </div>
          ) : (
            displayAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${getSeverityColor(alert.severity)}`}
              >
                <div className="mt-0.5">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-medium text-sm">
                      {alert.title}
                    </h4>
                    {getStatusBadge(alert.status)}
                  </div>
                  
                  <p className="text-xs mt-0.5 opacity-80">
                    {alert.machineName} - Detected {formatTimestamp(alert.detectedAt, 'datetime')}
                  </p>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-xs">{alert.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-1">
                      {alert.metrics.map((metric, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                          <span>{metric.name}: {metric.value} {metric.unit}</span>
                          <span className={metric.deviation > 0 ? "text-energy-red" : "text-energy-green"}>
                            ({metric.deviation > 0 ? '+' : ''}{metric.deviation.toFixed(1)}%)
                          </span>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-2 pt-1 border-t border-current border-opacity-20">
                      <p className="text-xs italic">
                        Recommendation: {alert.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {alerts.length > 3 && (
            <div className="flex justify-center pt-2 pb-3">
              <Button variant="ghost" size="sm" className="text-xs">
                View all alerts
                <ArrowRightIcon className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceAlerts;
