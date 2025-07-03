import { VisualizationStep } from '../types';

export class FloydWarshallVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private graph: number[][];

  constructor() {
    // Sample weighted graph for demonstration
    this.graph = [
      [0, 3, Infinity, 7],
      [8, 0, 2, Infinity],
      [5, Infinity, 0, 1],
      [2, Infinity, Infinity, 0]
    ];
  }

  private addStep(
    description: string,
    distanceMatrix: number[][],
    currentK: number | null = null,
    currentI: number | null = null,
    currentJ: number | null = null,
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        distanceMatrix: distanceMatrix.map(row => [...row]),
        currentK,
        currentI,
        currentJ
      },
      highlights: [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private floydWarshall(): void {
    const n = this.graph.length;
    const dist = this.graph.map(row => [...row]);

    this.addStep(
      'Starting Floyd-Warshall algorithm with initial distance matrix',
      dist
    );

    for (let k = 0; k < n; k++) {
      this.addStep(
        `Using vertex ${k} as intermediate vertex`,
        dist,
        k
      );

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          this.addStep(
            `Checking path from ${i} to ${j} via ${k}`,
            dist,
            k,
            i,
            j
          );

          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            const oldDistance = dist[i][j];
            dist[i][j] = dist[i][k] + dist[k][j];

            this.addStep(
              `Updated distance from ${i} to ${j}: ${oldDistance === Infinity ? '∞' : oldDistance} → ${dist[i][j]}`,
              dist,
              k,
              i,
              j
            );
          } else {
            this.addStep(
              `No improvement for path from ${i} to ${j}`,
              dist,
              k,
              i,
              j
            );
          }
        }
      }

      this.addStep(
        `Completed iteration with intermediate vertex ${k}`,
        dist,
        k
      );
    }

    this.addStep(
      'Floyd-Warshall algorithm complete. All shortest paths found.',
      dist,
      null,
      null,
      null,
      { completed: [0] }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.floydWarshall();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'floyd-warshall',
      name: 'Floyd-Warshall Algorithm',
      category: 'Graph',
      description: 'Finds shortest paths between all pairs of vertices in a weighted graph with positive or negative edge weights.',
      timeComplexity: 'O(V³)',
      spaceComplexity: 'O(V²)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function floydWarshall(graph) {
  const n = graph.length;
  const dist = graph.map(row => [...row]);
  
  // Main algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  
  return dist;
}

// Check for negative cycles
function hasNegativeCycle(dist) {
  for (let i = 0; i < dist.length; i++) {
    if (dist[i][i] < 0) {
      return true;
    }
  }
  return false;
}

// Get shortest path between two vertices
function getPath(graph, next, start, end) {
  if (next[start][end] === null) {
    return null; // No path exists
  }
  
  const path = [start];
  while (start !== end) {
    start = next[start][end];
    path.push(start);
  }
  
  return path;
}

// Usage
const graph = [
  [0, 3, Infinity, 7],
  [8, 0, 2, Infinity],
  [5, Infinity, 0, 1],
  [2, Infinity, Infinity, 0]
];

const shortestPaths = floydWarshall(graph);
console.log('All shortest paths:', shortestPaths);

if (hasNegativeCycle(shortestPaths)) {
  console.log('Graph contains negative cycle');
}`,
        java: `// Java Implementation
public class FloydWarshall {
    
    public static int[][] floydWarshall(int[][] graph) {
        int n = graph.length;
        int[][] dist = new int[n][n];
        
        // Initialize distance matrix
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = graph[i][j];
            }
        }
        
        // Main algorithm
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] != Integer.MAX_VALUE && 
                        dist[k][j] != Integer.MAX_VALUE &&
                        dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        
        return dist;
    }
    
    public static boolean hasNegativeCycle(int[][] dist) {
        for (int i = 0; i < dist.length; i++) {
            if (dist[i][i] < 0) {
                return true;
            }
        }
        return false;
    }
    
    public static void printMatrix(int[][] matrix) {
        for (int[] row : matrix) {
            for (int val : row) {
                if (val == Integer.MAX_VALUE) {
                    System.out.print("∞\t");
                } else {
                    System.out.print(val + "\t");
                }
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 3, Integer.MAX_VALUE, 7},
            {8, 0, 2, Integer.MAX_VALUE},
            {5, Integer.MAX_VALUE, 0, 1},
            {2, Integer.MAX_VALUE, Integer.MAX_VALUE, 0}
        };
        
        int[][] shortestPaths = floydWarshall(graph);
        System.out.println("All shortest paths:");
        printMatrix(shortestPaths);
        
        if (hasNegativeCycle(shortestPaths)) {
            System.out.println("Graph contains negative cycle");
        }
    }
}`
      }
    };
  }
}