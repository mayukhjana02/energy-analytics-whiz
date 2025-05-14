
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sankey, Tooltip, Rectangle, Layer, ResponsiveContainer } from 'recharts';

interface SankeyNode {
  name: string;
  value?: number;
  fill?: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  fill?: string;
  opacity?: number;
}

interface EnergySankeyDiagramProps {
  data: {
    nodes: SankeyNode[];
    links: SankeyLink[];
  };
  className?: string;
}

const EnergySankeyDiagram: React.FC<EnergySankeyDiagramProps> = ({ data, className }) => {
  const colorMap = useMemo(() => {
    return {
      'Main Input': '#0A84FF',
      'Processing': '#30D158',
      'Drying': '#FF9F0A',
      'Milling': '#BF5AF2',
      'Packaging': '#FF453A',
      'Utilities': '#5E5CE6',
      'Lighting': '#64D2FF',
      'HVAC': '#FFD60A',
      'Losses': '#FF375F',
    };
  }, []);

  // Add colors to nodes based on their name
  const enhancedData = useMemo(() => {
    const nodes = data.nodes.map(node => ({
      ...node,
      fill: colorMap[node.name] || '#999999',
    }));

    const links = data.links.map(link => ({
      ...link,
      fill: nodes[link.source].fill,
      opacity: 0.4,
    }));

    return { nodes, links };
  }, [data, colorMap]);

  const CustomNode = ({ payload, x, y, width, height, index }) => {
    const isInput = index === 0;
    const isLoss = payload.name.includes('Loss');
    
    let nodeColor = payload.fill;
    if (isLoss) nodeColor = '#FF375F';
    if (isInput) nodeColor = '#0A84FF';
    
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={nodeColor}
        fillOpacity={0.9}
        className="node-rectangle"
      />
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const sourceName = data.sourceNode ? data.sourceNode.name : '';
      const targetName = data.targetNode ? data.targetNode.name : '';
      const value = data.value;

      return (
        <div className="glass-card p-3 border shadow-sm text-xs">
          {data.sourceNode && data.targetNode ? (
            <>
              <p className="font-medium">{sourceName} → {targetName}</p>
              <p className="text-sm mt-1">{value.toFixed(2)} kW</p>
            </>
          ) : (
            <>
              <p className="font-medium">{data.name}</p>
              <p className="text-sm mt-1">{data.value?.toFixed(2)} kW</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Energy Flow Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={enhancedData}
              node={<CustomNode />}
              link={{ stroke: '#77777730' }}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              nodePadding={50}
              nodeWidth={10}
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
