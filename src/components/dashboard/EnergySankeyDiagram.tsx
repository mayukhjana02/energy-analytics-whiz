
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
    return (
      <div className="bg-background border rounded shadow p-2 text-xs">
        <p className="font-medium">{`${data.source?.name || ''} → ${data.target?.name || ''}`}</p>
        <p>{`Energy: ${data.value.toFixed(2)} kWh`}</p>
      </div>
    );
  }

  return null;
};

const EnergySankeyDiagram: React.FC<EnergySankeyDiagramProps> = ({ data, className }) => {
  const [tooltipData, setTooltipData] = useState<any>(null);

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

  return (
    <Card className={className}>
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Energy Flow Distribution</CardTitle>
          <Badge variant="outline" className="rounded-md">
            {lossPercentage}% energy loss
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-0 pt-2 pb-4 h-[400px]">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={data}
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
      </CardContent>
    </Card>
  );
};

export default EnergySankeyDiagram;
