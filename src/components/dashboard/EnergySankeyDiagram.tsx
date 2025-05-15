
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sankey, 
  Tooltip, 
  Rectangle, 
  Layer, 
  ResponsiveContainer 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CircleIcon,
  Factory,
  Lightbulb,
  Cpu,
  PackageIcon,
  Droplets,
  Wind,
  AlertTriangle 
} from 'lucide-react';

interface SankeyNode {
  name: string;
  category: 'source' | 'process' | 'output' | 'loss';
  value?: number;
  uv?: number;
  pv?: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  uv?: number;
  pv?: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface EnergySankeyDiagramProps {
  data: SankeyData;
  className?: string;
}

// Custom node for the Sankey diagram with proper typing
const CustomNode = (props: any) => {
  const { x, y, width, height, index, payload } = props;
  const category = payload.category;
  
  let fill = '#8884d8';
  switch (category) {
    case 'source':
      fill = '#2563EB'; // Energy source (blue)
      break;
    case 'process':
      fill = '#10B981'; // Processing (green)
      break;
    case 'output':
      fill = '#8B5CF6'; // Output (purple)
      break;
    case 'loss':
      fill = '#EF4444'; // Losses (red)
      break;
    default:
      fill = '#8884d8';
  }

  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      fillOpacity={0.9}
    />
  );
};

// Custom tooltip for the Sankey diagram with proper typing
const CustomTooltip = (props: any) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Add null checks to prevent accessing properties of undefined
    return (
      <div className="bg-background border rounded shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{`${data.source?.name || ''} → ${data.target?.name || ''}`}</p>
        {data.value !== undefined && (
          <div className="flex flex-col gap-1 mt-2">
            <p className="flex justify-between">
              <span>Energy flow:</span> 
              <span className="font-mono font-medium tabular-nums ml-2">{data.value.toFixed(2)} kWh</span>
            </p>
            {data.source?.category === 'process' && data.target?.category === 'loss' && (
              <p className="text-xs text-destructive mt-1">
                Potential efficiency improvement opportunity
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const EnergySankeyDiagram: React.FC<EnergySankeyDiagramProps> = ({ data, className }) => {
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'all' | 'losses' | 'processes'>('all');

  // Calculate total energy input
  const totalInput = data.nodes
    .filter(node => node.category === 'source')
    .reduce((sum, node) => {
      // Find all links where this node is the source
      const nodeLinks = data.links.filter(link => 
        link.source === data.nodes.indexOf(node)
      );
      
      const nodeTotal = nodeLinks.reduce((s, link) => s + link.value, 0);
      return sum + nodeTotal;
    }, 0);
  
  // Calculate total energy losses
  const totalLoss = data.nodes
    .filter(node => node.category === 'loss')
    .reduce((sum, node) => {
      // Find all links where this node is the target
      const nodeLinks = data.links.filter(link => 
        link.target === data.nodes.indexOf(node)
      );
      
      const nodeTotal = nodeLinks.reduce((s, link) => s + link.value, 0);
      return sum + nodeTotal;
    }, 0);

  const lossPercentage = ((totalLoss / totalInput) * 100).toFixed(1);
  
  // Filter data based on view mode
  const filteredData = React.useMemo(() => {
    if (viewMode === 'all') {
      return data;
    }
    
    // For 'losses' mode, show only nodes that are sources, losses, or are connected to losses
    if (viewMode === 'losses') {
      const lossNodeIndexes = data.nodes
        .map((node, index) => node.category === 'loss' ? index : null)
        .filter(index => index !== null) as number[];
        
      const relevantLinks = data.links.filter(link => 
        lossNodeIndexes.includes(link.target) || 
        lossNodeIndexes.some(lossIndex => 
          data.links.some(l => l.target === lossIndex && l.source === link.source)
        )
      );
      
      // Get all node indexes that should be shown
      const relevantNodeIndexes = Array.from(new Set([
        ...relevantLinks.map(link => link.source),
        ...relevantLinks.map(link => link.target),
      ]));
      
      return {
        nodes: data.nodes.filter((_, index) => relevantNodeIndexes.includes(index)),
        links: relevantLinks
      };
    }
    
    // For 'processes' mode, show only processing nodes and their connections
    if (viewMode === 'processes') {
      const processNodeIndexes = data.nodes
        .map((node, index) => node.category === 'process' ? index : null)
        .filter(index => index !== null) as number[];
        
      const relevantLinks = data.links.filter(link => 
        processNodeIndexes.includes(link.source) || processNodeIndexes.includes(link.target)
      );
      
      // Get all node indexes that should be shown
      const relevantNodeIndexes = Array.from(new Set([
        ...relevantLinks.map(link => link.source),
        ...relevantLinks.map(link => link.target),
      ]));
      
      return {
        nodes: data.nodes.filter((_, index) => relevantNodeIndexes.includes(index)),
        links: relevantLinks
      };
    }
    
    return data;
  }, [data, viewMode]);

  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <CardTitle>Energy Flow Distribution</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Breakdown of energy flow throughout the rice processing facility
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={totalLoss / totalInput > 0.1 ? "destructive" : "outline"} className="rounded-md">
              {lossPercentage}% energy loss
            </Badge>
            
            <Badge variant="secondary" className="rounded-md">
              {totalInput.toFixed(1)} kWh total input
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={viewMode === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('all')}
          >
            All Flows
          </Button>
          <Button
            variant={viewMode === 'losses' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('losses')}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3 text-red-400" />
            Losses
          </Button>
          <Button
            variant={viewMode === 'processes' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('processes')}
            className="flex items-center gap-1"
          >
            <Factory className="h-3 w-3" />
            Processes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-0 pt-2 pb-4 h-[450px]">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={filteredData}
              node={<CustomNode />}
              link={{ stroke: '#d9d9d9' }}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              nodeWidth={20}
              nodePadding={60}
            >
              <Tooltip content={<CustomTooltip />} />
              <Layer />
            </Sankey>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#2563EB] mr-1" /> 
            <span>Energy Source</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#10B981] mr-1" /> 
            <span>Process</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#8B5CF6] mr-1" /> 
            <span>Output</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#EF4444] mr-1" /> 
            <span>Loss</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergySankeyDiagram;
