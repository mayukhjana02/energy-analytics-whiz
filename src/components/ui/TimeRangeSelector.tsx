
import React from 'react';
import { cn } from '@/lib/utils';

type TimeRange = 'hour' | '12hours' | 'day' | 'week' | 'month';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onChange,
  className
}) => {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: 'hour', label: '1h' },
    { value: '12hours', label: '12h' },
    { value: 'day', label: '24h' },
    { value: 'week', label: '1w' },
    { value: 'month', label: '1m' }
  ];

  return (
    <div className={cn("inline-flex rounded-md shadow-sm", className)}>
      {ranges.map((range) => (
        <button
          key={range.value}
          type="button"
          className={cn(
            "relative inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all",
            "first:rounded-l-md last:rounded-r-md",
            "border border-input",
            selectedRange === range.value
              ? "bg-primary text-primary-foreground hover:bg-primary/90 z-10"
              : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
            "focus:z-10 focus:outline-none focus:ring-1 focus:ring-ring"
          )}
          onClick={() => onChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
