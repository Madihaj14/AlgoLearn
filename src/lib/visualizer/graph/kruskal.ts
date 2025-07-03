import { VisualizationStep } from '../types';

export class KruskalVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private edges: { from: number; to: number; weight: number }[];
  private vertices: number;

  constructor() {
    this.vertices = 5;
    this.edges = [
      { from: 0, to: 1, weight: 2 },
      { from: 0, to: 3, weight: 6 },
      { from: 1, to: 2, weight: 3 },
      { from: 1, to: 3, weight: 8 },
      { from: 1, to: 4, weight: 5 },
      { from: 2, to: 4, weight: 7 },
      { from: 3, to: 4, weight: 9 }
    ];
  }

  private addStep(
    description: string,
    currentEdge: { from: number; to: number; weight: number } | null = null,
    mstEdges: [number, number][] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.createAdjacencyMatrix(),
        currentEdge,
        mstEdges: [...mstEdges],
        edges: this.edges,
        vertices: this.vertices,
        totalWeight: metadata.totalWeight || 0
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
      matrix[edge.to][edge.from] = { weight: edge.weight };
    });
    
    return matrix;
  }

  private find(parent: number[], i: number): number {
    if (parent[i] !== i) {
      parent[i] = this.find(parent, parent[i]);
    }
    return parent[i];
  }

  private union(parent: number[], rank: number[], x: number, y: number): void {
    const rootX = this.find(parent, x);
    const rootY = this.find(parent, y);

    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }
  }

  private kruskal(): void {
    const sortedEdges = [...this.edges].sort((a, b) => a.weight - b.weight);
    const mstEdges: [number, number][] = [];
    const parent = Array.from({ length: this.vertices }, (_, i) => i);
    const rank = new Array(this.vertices).fill(0);
    let totalWeight = 0;

    this.addStep(
      'Starting Kruskal\'s algorithm. Edges sorted by weight.',
      null,
      mstEdges,
      { totalWeight }
    );

    for (const edge of sortedEdges) {
      this.addStep(
        `Considering edge (${edge.from}, ${edge.to}) with weight ${edge.weight}`,
        edge,
        mstEdges,
        { totalWeight }
      );

      const rootFrom = this.find(parent, edge.from);
      const rootTo = this.find(parent, edge.to);

      if (rootFrom !== rootTo) {
        mstEdges.push([edge.from, edge.to]);
        totalWeight += edge.weight;
        this.union(parent, rank, edge.from, edge.to);

        this.addStep(
          `Added edge (${edge.from}, ${edge.to}) to MST. No cycle formed.`,
          edge,
          mstEdges,
          { totalWeight }
        );

        if (mstEdges.length === this.vertices - 1) {
          break;
        }
      } else {
        this.addStep(
          `Rejected edge (${edge.from}, ${edge.to}). Would create a cycle.`,
          edge,
          mstEdges,
          { totalWeight }
        );
      }
    }

    this.addStep(
      `Kruskal's algorithm complete. MST has total weight: ${totalWeight}`,
      null,
      mstEdges,
      { totalWeight, completed: [0] }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.kruskal();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'kruskal',
      name: "Kruskal's Algorithm",
      category: 'Graph',
      description: 'Finds a minimum spanning tree for a connected weighted graph using a greedy algorithm that sorts edges by weight.',
      timeComplexity: 'O(E log E)',
      spaceComplexity: 'O(V)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
      return true;
    }
    return false;
  }
}

function kruskal(edges, vertices) {
  // Sort edges by weight
  const sortedEdges = edges.sort((a, b) => a.weight - b.weight);
  const mst = [];
  const uf = new UnionFind(vertices);
  let totalWeight = 0;
  
  for (const edge of sortedEdges) {
    if (uf.union(edge.from, edge.to)) {
      mst.push(edge);
      totalWeight += edge.weight;
      
      if (mst.length === vertices - 1) {
        break;
      }
    }
  }
  
  return { mst, totalWeight };
}

// Usage
const edges = [
  { from: 0, to: 1, weight: 2 },
  { from: 0, to: 3, weight: 6 },
  { from: 1, to: 2, weight: 3 },
  { from: 1, to: 3, weight: 8 },
  { from: 1, to: 4, weight: 5 },
  { from: 2, to: 4, weight: 7 },
  { from: 3, to: 4, weight: 9 }
];

const result = kruskal(edges, 5);
console.log('MST edges:', result.mst);
console.log('Total weight:', result.totalWeight);`,
        java: `// Java Implementation
import java.util.*;

public class Kruskal {
    
    static class Edge implements Comparable<Edge> {
        int from, to, weight;
        
        Edge(int from, int to, int weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }
        
        @Override
        public int compareTo(Edge other) {
            return Integer.compare(this.weight, other.weight);
        }
    }
    
    static class UnionFind {
        int[] parent, rank;
        
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        
        boolean union(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            
            if (rootX != rootY) {
                if (rank[rootX] < rank[rootY]) {
                    parent[rootX] = rootY;
                } else if (rank[rootX] > rank[rootY]) {
                    parent[rootY] = rootX;
                } else {
                    parent[rootY] = rootX;
                    rank[rootX]++;
                }
                return true;
            }
            return false;
        }
    }
    
    public static List<Edge> kruskal(List<Edge> edges, int vertices) {
        Collections.sort(edges);
        List<Edge> mst = new ArrayList<>();
        UnionFind uf = new UnionFind(vertices);
        
        for (Edge edge : edges) {
            if (uf.union(edge.from, edge.to)) {
                mst.add(edge);
                if (mst.size() == vertices - 1) {
                    break;
                }
            }
        }
        
        return mst;
    }
    
    public static void main(String[] args) {
        List<Edge> edges = Arrays.asList(
            new Edge(0, 1, 2),
            new Edge(0, 3, 6),
            new Edge(1, 2, 3),
            new Edge(1, 3, 8),
            new Edge(1, 4, 5),
            new Edge(2, 4, 7),
            new Edge(3, 4, 9)
        );
        
        List<Edge> mst = kruskal(edges, 5);
        int totalWeight = mst.stream().mapToInt(e -> e.weight).sum();
        
        System.out.println("MST edges:");
        for (Edge edge : mst) {
            System.out.println("(" + edge.from + ", " + edge.to + ") weight: " + edge.weight);
        }
        System.out.println("Total weight: " + totalWeight);
    }
}`
      }
    };
  }
}