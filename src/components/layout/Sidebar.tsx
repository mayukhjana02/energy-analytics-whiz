
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart3Icon,
  GaugeIcon,
  HomeIcon,
  FlaskConicalIcon,
  WheatIcon, // Replaced GrainIcon with WheatIcon which is available in lucide-react
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-[240px] border-r border-border h-screen overflow-y-auto bg-background flex-shrink-0 hidden md:block">
      <div className="py-4 px-2 flex justify-center">
        <Link to="/" className="text-xl font-bold text-foreground flex items-center">
          <GaugeIcon className="w-6 h-6 mr-2 text-primary" />
          <span>Energy Demo</span>
        </Link>
      </div>
      
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          Navigation
        </h2>
        <div className="space-y-1">
          <Button
            variant={isActive('/') ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start', 
              isActive('/') ? 'bg-secondary text-secondary-foreground' : ''
            )}
            asChild
          >
            <Link to="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          
          <Button
            variant={isActive('/rice-production') ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start',
              isActive('/rice-production') ? 'bg-secondary text-secondary-foreground' : ''
            )}
            asChild
          >
            <Link to="/rice-production">
              <WheatIcon className="mr-2 h-4 w-4" />
              Rice Production
            </Link>
          </Button>
          
          <Button
            variant={isActive('/physics') ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start',
              isActive('/physics') ? 'bg-secondary text-secondary-foreground' : ''
            )}
            asChild
          >
            <Link to="/physics">
              <FlaskConicalIcon className="mr-2 h-4 w-4" />
              Physics Optimization
            </Link>
          </Button>
          
          <Button
            variant={isActive('/analytics') ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start',
              isActive('/analytics') ? 'bg-secondary text-secondary-foreground' : ''
            )}
            asChild
          >
            <Link to="/analytics">
              <BarChart3Icon className="mr-2 h-4 w-4" />
              Consumption Analytics
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          Rice Processing
        </h2>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            disabled
          >
            <GaugeIcon className="mr-2 h-4 w-4" />
            Quality Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
