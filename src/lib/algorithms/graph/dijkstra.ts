import { Step } from '../sorting/bubbleSort';

export interface WeightedGraphNode {
  id: number;
  edges: { to: number; weight: number }[];
}

// Sample graph for visualization
const sampleGraph: WeightedGraphNode[] = [
  { id: 0, edges: [{ to: 1, weight: 4 }, { to: 2, weight: 2 }] },
  { id: 1, edges: [{ to: 2, weight: 1 }, { to: 3, weight: 5 }] },
  { id: 2, edges: [{ to: 3, weight: 8 }, { to: 4, weight: 10 }] },
  { id: 3, edges: [{ to: 4, weight: 2 }] },
  { id: 4, edges: [] }
];

export const dijkstra = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const nodes = sampleGraph;
  const start = 0;
  const distances = new Map<number, number>();
  const visited = new Set<number>();
  
  // Initialize distances
  nodes.forEach(node => {
    distances.set(node.id, node.id === start ? 0 : Infinity);
  });
  
  // Initial state
  steps.push({
    array: initialArray,
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  while (visited.size < nodes.length) {
    // Find node with minimum distance
    let minDistance = Infinity;
    let minNode = -1;
    
    distances.forEach((distance, nodeId) => {
      if (!visited.has(nodeId) && distance < minDistance) {
        minDistance = distance;
        minNode = nodeId;
      }
    });
    
    if (minNode === -1) break;
    
    visited.add(minNode);
    const currentDistances = Array.from(distances.values());
    
    steps.push({
      array: currentDistances,
      comparing: [minNode],
      swapping: [],
      sorted: Array.from(visited)
    });
    
    const currentNode = nodes.find(n => n.id === minNode);
    if (!currentNode) continue;
    
    for (const edge of currentNode.edges) {
      if (!visited.has(edge.to)) {
        const newDistance = distances.get(minNode)! + edge.weight;
        
        steps.push({
          array: currentDistances,
          comparing: [minNode, edge.to],
          swapping: [],
          sorted: Array.from(visited)
        });
        
        if (newDistance < distances.get(edge.to)!) {
          distances.set(edge.to, newDistance);
          steps.push({
            array: Array.from(distances.values()),
            comparing: [],
            swapping: [edge.to],
            sorted: Array.from(visited)
          });
        }
      }
    }
  }
  
  // Final state
  steps.push({
    array: Array.from(distances.values()),
    comparing: [],
    swapping: [],
    sorted: Array.from(visited)
  });
  
  return steps;
};