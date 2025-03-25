
import React from 'react';
import { BellIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md z-10 border-b border-border sticky top-0 animate-fade-in">
      <div className="container h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-medium">Energy Analytics</h1>
          <div className="h-5 w-[1px] bg-border mx-2 hidden md:block" />
          <span className="text-sm text-muted-foreground hidden md:block">
            Dashboard
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-energy-red animate-pulse" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Alerts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="hidden md:flex items-center space-x-2 pl-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-energy-blue text-white">EA</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
