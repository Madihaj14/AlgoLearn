import { VisualizationStep } from '../types';

export class DijkstraVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private graph: { weight: number }[][];

  constructor() {
    // Sample weighted graph for demonstration
    this.graph = [
      [{ weight: 0 }, { weight: 4 }, { weight: 2 }, { weight: 0 }, { weight: 0 }],
      [{ weight: 4 }, { weight: 0 }, { weight: 1 }, { weight: 5 }, { weight: 0 }],
      [{ weight: 2 }, { weight: 1 }, { weight: 0 }, { weight: 8 }, { weight: 10 }],
      [{ weight: 0 }, { weight: 5 }, { weight: 8 }, { weight: 0 }, { weight: 2 }],
      [{ weight: 0 }, { weight: 0 }, { weight: 10 }, { weight: 2 }, { weight: 0 }]
    ];
    
    // Convert 0 weights to null for non-edges
    for (let i = 0; i < this.graph.length; i++) {
      for (let j = 0; j < this.graph[i].length; j++) {
        if (i !== j && this.graph[i][j].weight === 0) {
          this.graph[i][j] = null as any;
        }
      }
    }
  }

  private addStep(
    description: string,
    currentNode: number | null = null,
    distances: number[] = [],
    visited: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.graph.map(row => [...row]),
        distances: [...distances],
        visited: [...visited],
        currentNode,
        shortestPath: metadata.shortestPath || []
      },
      highlights: currentNode !== null ? [currentNode] : [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private dijkstra(startNode: number = 0): void {
    const distances: number[] = new Array(this.graph.length).fill(Infinity);
    const visited: boolean[] = new Array(this.graph.length).fill(false);
    const visitedNodes: number[] = [];
    const previous: (number | null)[] = new Array(this.graph.length).fill(null);

    distances[startNode] = 0;

    this.addStep(
      `Starting Dijkstra's algorithm from node ${startNode}`,
      startNode,
      distances,
      visitedNodes
    );

    for (let i = 0; i < this.graph.length; i++) {
      // Find unvisited node with minimum distance
      let minDistance = Infinity;
      let minNode = -1;

      for (let j = 0; j < this.graph.length; j++) {
        if (!visited[j] && distances[j] < minDistance) {
          minDistance = distances[j];
          minNode = j;
        }
      }

      if (minNode === -1) break;

      visited[minNode] = true;
      visitedNodes.push(minNode);

      this.addStep(
        `Selected node ${minNode} with minimum distance ${distances[minNode]}`,
        minNode,
        distances,
        visitedNodes
      );

      // Update distances to neighbors
      for (let j = 0; j < this.graph.length; j++) {
        if (this.graph[minNode][j] && !visited[j]) {
          const newDistance = distances[minNode] + this.graph[minNode][j].weight;

          this.addStep(
            `Checking neighbor ${j}: current distance ${distances[j]}, new distance ${newDistance}`,
            j,
            distances,
            visitedNodes
          );

          if (newDistance < distances[j]) {
            distances[j] = newDistance;
            previous[j] = minNode;

            this.addStep(
              `Updated distance to node ${j}: ${newDistance}`,
              j,
              distances,
              visitedNodes
            );
          }
        }
      }
    }

    // Generate shortest path to last node
    const shortestPath: [number, number][] = [];
    let current = this.graph.length - 1;
    while (previous[current] !== null) {
      shortestPath.unshift([previous[current]!, current]);
      current = previous[current]!;
    }

    this.addStep(
      'Dijkstra\'s algorithm complete',
      null,
      distances,
      visitedNodes,
      { shortestPath, completed: [0] }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dijkstra(0);
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      category: 'Graph',
      description: 'Finds the shortest path between nodes in a weighted graph with non-negative edge weights.',
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function dijkstra(graph, startNode) {
  const distances = new Array(graph.length).fill(Infinity);
  const visited = new Array(graph.length).fill(false);
  const previous = new Array(graph.length).fill(null);
  
  distances[startNode] = 0;
  
  for (let i = 0; i < graph.length; i++) {
    // Find unvisited node with minimum distance
    let minDistance = Infinity;
    let minNode = -1;
    
    for (let j = 0; j < graph.length; j++) {
      if (!visited[j] && distances[j] < minDistance) {
        minDistance = distances[j];
        minNode = j;
      }
    }
    
    if (minNode === -1) break;
    
    visited[minNode] = true;
    
    // Update distances to neighbors
    for (let neighbor = 0; neighbor < graph.length; neighbor++) {
      if (graph[minNode][neighbor] && !visited[neighbor]) {
        const newDistance = distances[minNode] + graph[minNode][neighbor];
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = minNode;
        }
      }
    }
  }
  
  return { distances, previous };
}

// Get shortest path between two nodes
function getShortestPath(previous, startNode, endNode) {
  const path = [];
  let current = endNode;
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  return path[0] === startNode ? path : null;
}

// Usage
const graph = [
  [0, 4, 2, 0, 0],
  [4, 0, 1, 5, 0],
  [2, 1, 0, 8, 10],
  [0, 5, 8, 0, 2],
  [0, 0, 10, 2, 0]
];

const result = dijkstra(graph, 0);
console.log('Shortest distances:', result.distances);`,
        java: `// Java Implementation
import java.util.*;

public class Dijkstra {
    
    public static class Result {
        int[] distances;
        int[] previous;
        
        Result(int[] distances, int[] previous) {
            this.distances = distances;
            this.previous = previous;
        }
    }
    
    public static Result dijkstra(int[][] graph, int startNode) {
        int n = graph.length;
        int[] distances = new int[n];
        boolean[] visited = new boolean[n];
        int[] previous = new int[n];
        
        Arrays.fill(distances, Integer.MAX_VALUE);
        Arrays.fill(previous, -1);
        distances[startNode] = 0;
        
        for (int i = 0; i < n; i++) {
            // Find unvisited node with minimum distance
            int minDistance = Integer.MAX_VALUE;
            int minNode = -1;
            
            for (int j = 0; j < n; j++) {
                if (!visited[j] && distances[j] < minDistance) {
                    minDistance = distances[j];
                    minNode = j;
                }
            }
            
            if (minNode == -1) break;
            
            visited[minNode] = true;
            
            // Update distances to neighbors
            for (int neighbor = 0; neighbor < n; neighbor++) {
                if (graph[minNode][neighbor] != 0 && !visited[neighbor]) {
                    int newDistance = distances[minNode] + graph[minNode][neighbor];
                    
                    if (newDistance < distances[neighbor]) {
                        distances[neighbor] = newDistance;
                        previous[neighbor] = minNode;
                    }
                }
            }
        }
        
        return new Result(distances, previous);
    }
    
    public static List<Integer> getShortestPath(int[] previous, int startNode, int endNode) {
        List<Integer> path = new ArrayList<>();
        int current = endNode;
        
        while (current != -1) {
            path.add(0, current);
            current = previous[current];
        }
        
        return path.get(0) == startNode ? path : null;
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 4, 2, 0, 0},
            {4, 0, 1, 5, 0},
            {2, 1, 0, 8, 10},
            {0, 5, 8, 0, 2},
            {0, 0, 10, 2, 0}
        };
        
        Result result = dijkstra(graph, 0);
        System.out.println("Shortest distances: " + Arrays.toString(result.distances));
    }
}`
      }
    };
  }
}