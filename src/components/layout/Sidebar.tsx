
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChartIcon,
  BoltIcon,
  FlaskRoundIcon,
  GaugeIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LightbulbIcon,
  MenuIcon,
  SettingsIcon,
  ZapIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-x-3 px-3',
              active
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={onClick}
          >
            {icon}
            <span className="truncate">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-1">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'h-screen flex flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[220px]'
      )}
    >
      <div className="flex items-center h-16 px-3 border-b border-border">
        <div className={cn('flex items-center', collapsed ? 'justify-center w-full' : 'gap-x-2')}>
          <div className="h-8 w-8 rounded-md bg-energy-blue flex items-center justify-center">
            <ZapIcon className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="font-semibold text-lg">Energy</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn('ml-auto', collapsed && 'hidden')}
          onClick={() => setCollapsed(true)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className={cn('px-3 py-4 flex flex-col gap-y-1', collapsed && 'items-center')}>
        {collapsed ? (
          <>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    onClick={() => setCollapsed(false)}
                  >
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-1">
                  Expand Sidebar
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="mt-3 space-y-3">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-accent text-accent-foreground">
                      <LayoutDashboardIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-1">
                    Dashboard
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <BarChartIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-1">
                    Analytics
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <BoltIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-1">
                    Consumption
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <FlaskRoundIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-1">
                    Optimization
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <GaugeIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-1">
                    Monitoring
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        ) : (
          <>
            <SidebarItem
              icon={<LayoutDashboardIcon className="h-5 w-5" />}
              label="Dashboard"
              active
            />
            <SidebarItem
              icon={<BarChartIcon className="h-5 w-5" />}
              label="Analytics"
            />
            <SidebarItem
              icon={<BoltIcon className="h-5 w-5" />}
              label="Consumption"
            />
            <SidebarItem
              icon={<FlaskRoundIcon className="h-5 w-5" />}
              label="Optimization"
            />
            <SidebarItem
              icon={<GaugeIcon className="h-5 w-5" />}
              label="Monitoring"
            />
          </>
        )}
      </div>

      <div className={cn('mt-auto px-3 py-4 border-t border-border', collapsed && 'items-center')}>
        {collapsed ? (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-1">
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <SidebarItem
            icon={<SettingsIcon className="h-5 w-5" />}
            label="Settings"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
