
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  description,
  trend,
  className,
  valueClassName,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        'glass-card overflow-hidden transition-all',
        onClick && 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-1.5">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span>{title}</span>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3.5 w-3.5 text-muted-foreground/70 cursor-help ml-0.5" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <div className={cn("metric-value", valueClassName)}>
          <span className="font-medium tracking-tight">
            {value}
            {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
          </span>
        </div>
      </CardContent>
      {trend && (
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center text-xs text-muted-foreground">
            {trend.direction === 'up' && (
              <span className="text-energy-green flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
                {trend.value}% {trend.label || 'increase'}
              </span>
            )}
            {trend.direction === 'down' && (
              <span className="text-energy-red flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                    clipRule="evenodd"
                  />
                </svg>
                {trend.value}% {trend.label || 'decrease'}
              </span>
            )}
            {trend.direction === 'neutral' && (
              <span className="text-muted-foreground flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                    clipRule="evenodd"
                  />
                </svg>
                No change {trend.label && `in ${trend.label}`}
              </span>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MetricCard;
