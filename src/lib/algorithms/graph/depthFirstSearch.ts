import { Step } from '../sorting/bubbleSort';

export interface GraphNode {
  id: number;
  neighbors: number[];
}

export const depthFirstSearch = (nodes: GraphNode[], start: number): Step[] => {
  const steps: Step[] = [];
  const visited = new Set<number>();
  
  const dfs = (nodeId: number) => {
    visited.add(nodeId);
    steps.push({
      array: Array.from(visited),
      comparing: [nodeId],
      swapping: [],
      sorted: Array.from(visited)
    });
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      for (const neighbor of node.neighbors) {
        if (!visited.has(neighbor)) {
          steps.push({
            array: Array.from(visited),
            comparing: [nodeId, neighbor],
            swapping: [],
            sorted: Array.from(visited)
          });
          dfs(neighbor);
        }
      }
    }
  };
  
  dfs(start);
  return steps;
};