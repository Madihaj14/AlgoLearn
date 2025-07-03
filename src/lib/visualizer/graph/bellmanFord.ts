import { VisualizationStep } from '../types';

export class BellmanFordVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private edges: { from: number; to: number; weight: number }[];
  private vertices: number;

  constructor() {
    this.vertices = 5;
    this.edges = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 2, weight: 1 },
      { from: 1, to: 3, weight: 5 },
      { from: 2, to: 3, weight: 8 },
      { from: 2, to: 4, weight: 10 },
      { from: 3, to: 4, weight: 2 }
    ];
  }

  private addStep(
    description: string,
    currentEdge: { from: number; to: number; weight: number } | null = null,
    distances: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.createAdjacencyMatrix(),
        distances: [...distances],
        currentEdge,
        edges: this.edges,
        vertices: this.vertices
      },
      highlights: currentEdge ? [currentEdge.from, currentEdge.to] : [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private createAdjacencyMatrix(): any[][] {
    const matrix = Array(this.vertices).fill(null).map(() => Array(this.vertices).fill(null));
    
    this.edges.forEach(edge => {
      matrix[edge.from][edge.to] = { weight: edge.weight };
    });
    
    return matrix;
  }

  private bellmanFord(startNode: number = 0): void {
    const distances: number[] = new Array(this.vertices).fill(Infinity);
    distances[startNode] = 0;

    this.addStep(
      `Starting Bellman-Ford algorithm from node ${startNode}`,
      null,
      distances
    );

    // Relax edges V-1 times
    for (let i = 0; i < this.vertices - 1; i++) {
      this.addStep(
        `Iteration ${i + 1}: Relaxing all edges`,
        null,
        distances
      );

      let updated = false;

      for (const edge of this.edges) {
        if (distances[edge.from] !== Infinity) {
          const newDistance = distances[edge.from] + edge.weight;

          this.addStep(
            `Checking edge (${edge.from}, ${edge.to}) with weight ${edge.weight}`,
            edge,
            distances
          );

          if (newDistance < distances[edge.to]) {
            distances[edge.to] = newDistance;
            updated = true;

            this.addStep(
              `Updated distance to node ${edge.to}: ${newDistance}`,
              edge,
              distances
            );
          } else {
            this.addStep(
              `No update needed for node ${edge.to}`,
              edge,
              distances
            );
          }
        }
      }

      if (!updated) {
        this.addStep(
          `No updates in iteration ${i + 1}. Algorithm can terminate early.`,
          null,
          distances
        );
        break;
      }
    }

    // Check for negative cycles
    this.addStep(
      'Checking for negative cycles...',
      null,
      distances
    );

    let hasNegativeCycle = false;
    for (const edge of this.edges) {
      if (distances[edge.from] !== Infinity) {
        const newDistance = distances[edge.from] + edge.weight;
        if (newDistance < distances[edge.to]) {
          hasNegativeCycle = true;
          break;
        }
      }
    }

    if (hasNegativeCycle) {
      this.addStep(
        'Negative cycle detected!',
        null,
        distances,
        { negativeCycle: true }
      );
    } else {
      this.addStep(
        'No negative cycle found. Bellman-Ford algorithm complete.',
        null,
        distances,
        { completed: [0] }
      );
    }
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.bellmanFord(0);
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'bellman-ford',
      name: 'Bellman-Ford Algorithm',
      category: 'Graph',
      description: 'Computes shortest paths from a single source vertex to all other vertices in a weighted graph, can handle negative weights.',
      timeComplexity: 'O(VE)',
      spaceComplexity: 'O(V)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function bellmanFord(edges, vertices, startNode) {
  const distances = new Array(vertices).fill(Infinity);
  distances[startNode] = 0;
  
  // Relax edges V-1 times
  for (let i = 0; i < vertices - 1; i++) {
    for (const edge of edges) {
      if (distances[edge.from] !== Infinity) {
        const newDistance = distances[edge.from] + edge.weight;
        if (newDistance < distances[edge.to]) {
          distances[edge.to] = newDistance;
        }
      }
    }
  }
  
  // Check for negative cycles
  for (const edge of edges) {
    if (distances[edge.from] !== Infinity) {
      const newDistance = distances[edge.from] + edge.weight;
      if (newDistance < distances[edge.to]) {
        throw new Error('Graph contains negative cycle');
      }
    }
  }
  
  return distances;
}

// Usage
const edges = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 2 },
  { from: 1, to: 2, weight: 1 },
  { from: 1, to: 3, weight: 5 },
  { from: 2, to: 3, weight: 8 },
  { from: 2, to: 4, weight: 10 },
  { from: 3, to: 4, weight: 2 }
];

try {
  const distances = bellmanFord(edges, 5, 0);
  console.log('Shortest distances:', distances);
} catch (error) {
  console.error(error.message);
}`,
        java: `// Java Implementation
import java.util.*;

public class BellmanFord {
    
    static class Edge {
        int from, to, weight;
        
        Edge(int from, int to, int weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }
    }
    
    public static int[] bellmanFord(List<Edge> edges, int vertices, int startNode) {
        int[] distances = new int[vertices];
        Arrays.fill(distances, Integer.MAX_VALUE);
        distances[startNode] = 0;
        
        // Relax edges V-1 times
        for (int i = 0; i < vertices - 1; i++) {
            for (Edge edge : edges) {
                if (distances[edge.from] != Integer.MAX_VALUE) {
                    int newDistance = distances[edge.from] + edge.weight;
                    if (newDistance < distances[edge.to]) {
                        distances[edge.to] = newDistance;
                    }
                }
            }
        }
        
        // Check for negative cycles
        for (Edge edge : edges) {
            if (distances[edge.from] != Integer.MAX_VALUE) {
                int newDistance = distances[edge.from] + edge.weight;
                if (newDistance < distances[edge.to]) {
                    throw new RuntimeException("Graph contains negative cycle");
                }
            }
        }
        
        return distances;
    }
    
    public static void main(String[] args) {
        List<Edge> edges = Arrays.asList(
            new Edge(0, 1, 4),
            new Edge(0, 2, 2),
            new Edge(1, 2, 1),
            new Edge(1, 3, 5),
            new Edge(2, 3, 8),
            new Edge(2, 4, 10),
            new Edge(3, 4, 2)
        );
        
        try {
            int[] distances = bellmanFord(edges, 5, 0);
            System.out.println("Shortest distances: " + Arrays.toString(distances));
        } catch (RuntimeException e) {
            System.err.println(e.getMessage());
        }
    }
}`
      }
    };
  }
}