import { Step } from '../sorting/bubbleSort';
import { GraphNode } from './depthFirstSearch';

export const breadthFirstSearch = (nodes: GraphNode[], start: number): Step[] => {
  const steps: Step[] = [];
  const visited = new Set<number>();
  const queue: number[] = [start];
  
  visited.add(start);
  steps.push({
    array: Array.from(visited),
    comparing: [start],
    swapping: [],
    sorted: Array.from(visited)
  });
  
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes.find(n => n.id === nodeId);
    
    if (node) {
      for (const neighbor of node.neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          
          steps.push({
            array: Array.from(visited),
            comparing: [nodeId, neighbor],
            swapping: [],
            sorted: Array.from(visited)
          });
        }
      }
    }
  }
  
  return steps;
};