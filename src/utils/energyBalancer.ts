
/**
 * Utility functions for balancing energy readings between parent and child nodes
 * to minimize unaccounted energy and improve accuracy
 */

interface MeasurementNode {
  id: string;
  value: number;
  children?: string[];
  parent?: string;
  isEstimated?: boolean;
}

/**
 * Balances parent-child relationships in energy readings
 * to minimize unaccounted energy
 */
export const balanceEnergyReadings = (nodes: MeasurementNode[]): MeasurementNode[] => {
  const balancedNodes = [...nodes];
  
  // Create a map for faster lookups
  const nodeMap = new Map<string, MeasurementNode>();
  nodes.forEach(node => nodeMap.set(node.id, node));
  
  // First pass: identify parent-child relationships
  const parentNodes = balancedNodes.filter(node => node.children && node.children.length > 0);
  
  // Second pass: balance each parent with its children
  parentNodes.forEach(parent => {
    const parentNode = nodeMap.get(parent.id);
    if (!parentNode || !parentNode.children) return;
    
    const childNodes = parentNode.children
      .map(childId => nodeMap.get(childId))
      .filter(Boolean) as MeasurementNode[];
    
    if (childNodes.length === 0) return;
    
    // Calculate the sum of child values
    const childSum = childNodes.reduce((sum, child) => sum + child.value, 0);
    
    // Calculate the difference between parent value and sum of children
    const difference = parentNode.value - childSum;
    
    // If the difference is significant (more than 2%), adjust based on confidence
    if (Math.abs(difference) > (parentNode.value * 0.02)) {
      const estimatedNodes = childNodes.filter(node => node.isEstimated);
      
      if (estimatedNodes.length > 0) {
        // If we have estimated nodes, distribute the difference among them
        const adjustmentPerNode = difference / estimatedNodes.length;
        estimatedNodes.forEach(node => {
          const targetNode = balancedNodes.find(n => n.id === node.id);
          if (targetNode) {
            targetNode.value += adjustmentPerNode;
          }
        });
      } else {
        // If no nodes are marked as estimated, distribute proportionally
        const totalChildValue = childNodes.reduce((sum, child) => sum + child.value, 0);
        childNodes.forEach(node => {
          const targetNode = balancedNodes.find(n => n.id === node.id);
          if (targetNode && totalChildValue > 0) {
            const proportion = node.value / totalChildValue;
            targetNode.value += difference * proportion;
          }
        });
      }
    }
  });
  
  return balancedNodes;
};

/**
 * Detects anomalies in energy readings by comparing current readings
 * with historical patterns and parent-child relationships
 */
export const detectEnergyAnomalies = (
  currentNodes: MeasurementNode[],
  historicalNodes: MeasurementNode[][],
  thresholdPercentage = 15
): { nodeId: string; deviation: number }[] => {
  const anomalies: { nodeId: string; deviation: number }[] = [];
  
  // For each current node, check for anomalies
  currentNodes.forEach(currentNode => {
    // Get historical readings for this node
    const historicalReadings = historicalNodes
      .map(nodes => nodes.find(n => n.id === currentNode.id))
      .filter(Boolean)
      .map(node => node?.value) as number[];
    
    if (historicalReadings.length < 3) return; // Need minimum historical data
    
    // Calculate average and standard deviation of historical readings
    const average = historicalReadings.reduce((sum, val) => sum + val, 0) / historicalReadings.length;
    const variance = historicalReadings.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / historicalReadings.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate the deviation of current reading from historical average
    const deviation = ((currentNode.value - average) / average) * 100;
    
    // Check if deviation exceeds threshold (considering standard deviation)
    const dynamicThreshold = thresholdPercentage * (1 + stdDev / average);
    if (Math.abs(deviation) > dynamicThreshold) {
      anomalies.push({ nodeId: currentNode.id, deviation });
    }
  });
  
  return anomalies;
};

/**
 * Estimate missing energy readings based on parent-child relationships
 * and historical patterns
 */
export const estimateMissingReadings = (
  nodes: MeasurementNode[],
  historicalNodes: MeasurementNode[][]
): MeasurementNode[] => {
  const result = [...nodes];
  const nodeMap = new Map<string, MeasurementNode>();
  nodes.forEach(node => nodeMap.set(node.id, node));
  
  // Find nodes with missing values (value === 0 or undefined)
  const missingNodes = nodes
    .filter(node => node.value === 0 || node.value === undefined)
    .map(node => node.id);
  
  missingNodes.forEach(nodeId => {
    const node = nodeMap.get(nodeId);
    if (!node) return;
    
    // Try to estimate based on parent-child relationship
    if (node.parent) {
      const parentNode = nodeMap.get(node.parent);
      if (parentNode && parentNode.children) {
        const siblings = parentNode.children
          .filter(id => id !== nodeId)
          .map(id => nodeMap.get(id))
          .filter(Boolean) as MeasurementNode[];
        
        if (siblings.length > 0 && parentNode.value) {
          const siblingsSum = siblings.reduce((sum, sibling) => sum + (sibling.value || 0), 0);
          const estimatedValue = Math.max(0, parentNode.value - siblingsSum);
          
          const targetNode = result.find(n => n.id === nodeId);
          if (targetNode) {
            targetNode.value = estimatedValue;
            targetNode.isEstimated = true;
          }
        }
      }
    } 
    
    // If still missing, try historical average
    if (!node.value) {
      const historicalValues = historicalNodes
        .map(nodes => nodes.find(n => n.id === nodeId))
        .filter(Boolean)
        .map(node => node?.value) as number[];
      
      if (historicalValues.length > 0) {
        const average = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
        
        const targetNode = result.find(n => n.id === nodeId);
        if (targetNode) {
          targetNode.value = average;
          targetNode.isEstimated = true;
        }
      }
    }
  });
  
  return result;
};
