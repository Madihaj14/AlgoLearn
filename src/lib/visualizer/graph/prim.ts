import { VisualizationStep } from '../types';

export class PrimVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private graph: { weight: number }[][];

  constructor() {
    // Sample weighted graph for demonstration
    this.graph = [
      [{ weight: 0 }, { weight: 2 }, { weight: 0 }, { weight: 6 }, { weight: 0 }],
      [{ weight: 2 }, { weight: 0 }, { weight: 3 }, { weight: 8 }, { weight: 5 }],
      [{ weight: 0 }, { weight: 3 }, { weight: 0 }, { weight: 0 }, { weight: 7 }],
      [{ weight: 6 }, { weight: 8 }, { weight: 0 }, { weight: 0 }, { weight: 9 }],
      [{ weight: 0 }, { weight: 5 }, { weight: 7 }, { weight: 9 }, { weight: 0 }]
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
    currentEdge: [number, number] | null = null,
    mstEdges: [number, number][] = [],
    visited: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.graph.map(row => [...row]),
        currentEdge,
        mstEdges: [...mstEdges],
        visited: [...visited],
        totalWeight: metadata.totalWeight || 0
      },
      highlights: currentEdge ? [currentEdge[0], currentEdge[1]] : [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private prim(startNode: number = 0): void {
    const visited: boolean[] = new Array(this.graph.length).fill(false);
    const visitedNodes: number[] = [];
    const mstEdges: [number, number][] = [];
    let totalWeight = 0;

    visited[startNode] = true;
    visitedNodes.push(startNode);

    this.addStep(
      `Starting Prim's algorithm from node ${startNode}`,
      null,
      mstEdges,
      visitedNodes,
      { totalWeight }
    );

    while (visitedNodes.length < this.graph.length) {
      let minWeight = Infinity;
      let minEdge: [number, number] | null = null;

      // Find minimum weight edge from visited to unvisited nodes
      for (const u of visitedNodes) {
        for (let v = 0; v < this.graph.length; v++) {
          if (!visited[v] && this.graph[u][v] && this.graph[u][v].weight < minWeight) {
            minWeight = this.graph[u][v].weight;
            minEdge = [u, v];
          }
        }
      }

      if (minEdge) {
        const [u, v] = minEdge;
        visited[v] = true;
        visitedNodes.push(v);
        mstEdges.push(minEdge);
        totalWeight += minWeight;

        this.addStep(
          `Added edge (${u}, ${v}) with weight ${minWeight} to MST`,
          minEdge,
          mstEdges,
          visitedNodes,
          { totalWeight }
        );
      }
    }

    this.addStep(
      `Prim's algorithm complete. MST has total weight: ${totalWeight}`,
      null,
      mstEdges,
      visitedNodes,
      { totalWeight, completed: [0] }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.prim(0);
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'prim',
      name: "Prim's Algorithm",
      category: 'Graph',
      description: 'Finds a minimum spanning tree for a weighted undirected graph by growing the tree one vertex at a time.',
      timeComplexity: 'O(E log V)',
      spaceComplexity: 'O(V)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function prim(graph, startNode = 0) {
  const n = graph.length;
  const visited = new Array(n).fill(false);
  const mst = [];
  let totalWeight = 0;
  
  visited[startNode] = true;
  
  while (mst.length < n - 1) {
    let minWeight = Infinity;
    let minEdge = null;
    
    // Find minimum weight edge from visited to unvisited nodes
    for (let u = 0; u < n; u++) {
      if (visited[u]) {
        for (let v = 0; v < n; v++) {
          if (!visited[v] && graph[u][v] && graph[u][v] < minWeight) {
            minWeight = graph[u][v];
            minEdge = [u, v];
          }
        }
      }
    }
    
    if (minEdge) {
      const [u, v] = minEdge;
      visited[v] = true;
      mst.push({ from: u, to: v, weight: minWeight });
      totalWeight += minWeight;
    }
  }
  
  return { mst, totalWeight };
}

// Priority Queue implementation for better performance
class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  
  push(item) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }
  
  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return min;
  }
  
  heapifyUp(index) {
    const parent = Math.floor((index - 1) / 2);
    if (parent >= 0 && this.heap[parent].weight > this.heap[index].weight) {
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      this.heapifyUp(parent);
    }
  }
  
  heapifyDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;
    
    if (left < this.heap.length && this.heap[left].weight < this.heap[smallest].weight) {
      smallest = left;
    }
    if (right < this.heap.length && this.heap[right].weight < this.heap[smallest].weight) {
      smallest = right;
    }
    
    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this.heapifyDown(smallest);
    }
  }
  
  isEmpty() {
    return this.heap.length === 0;
  }
}

function primOptimized(graph, startNode = 0) {
  const n = graph.length;
  const visited = new Array(n).fill(false);
  const pq = new PriorityQueue();
  const mst = [];
  let totalWeight = 0;
  
  visited[startNode] = true;
  
  // Add all edges from start node to priority queue
  for (let v = 0; v < n; v++) {
    if (graph[startNode][v]) {
      pq.push({ from: startNode, to: v, weight: graph[startNode][v] });
    }
  }
  
  while (!pq.isEmpty() && mst.length < n - 1) {
    const edge = pq.pop();
    
    if (visited[edge.to]) continue;
    
    visited[edge.to] = true;
    mst.push(edge);
    totalWeight += edge.weight;
    
    // Add all edges from newly added vertex
    for (let v = 0; v < n; v++) {
      if (!visited[v] && graph[edge.to][v]) {
        pq.push({ from: edge.to, to: v, weight: graph[edge.to][v] });
      }
    }
  }
  
  return { mst, totalWeight };
}

// Usage
const graph = [
  [0, 2, 0, 6, 0],
  [2, 0, 3, 8, 5],
  [0, 3, 0, 0, 7],
  [6, 8, 0, 0, 9],
  [0, 5, 7, 9, 0]
];

const result = prim(graph, 0);
console.log('MST edges:', result.mst);
console.log('Total weight:', result.totalWeight);`,
        java: `// Java Implementation
import java.util.*;

public class Prim {
    
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
    
    public static List<Edge> prim(int[][] graph, int startNode) {
        int n = graph.length;
        boolean[] visited = new boolean[n];
        PriorityQueue<Edge> pq = new PriorityQueue<>();
        List<Edge> mst = new ArrayList<>();
        
        visited[startNode] = true;
        
        // Add all edges from start node to priority queue
        for (int v = 0; v < n; v++) {
            if (graph[startNode][v] != 0) {
                pq.offer(new Edge(startNode, v, graph[startNode][v]));
            }
        }
        
        while (!pq.isEmpty() && mst.size() < n - 1) {
            Edge edge = pq.poll();
            
            if (visited[edge.to]) continue;
            
            visited[edge.to] = true;
            mst.add(edge);
            
            // Add all edges from newly added vertex
            for (int v = 0; v < n; v++) {
                if (!visited[v] && graph[edge.to][v] != 0) {
                    pq.offer(new Edge(edge.to, v, graph[edge.to][v]));
                }
            }
        }
        
        return mst;
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 2, 0, 6, 0},
            {2, 0, 3, 8, 5},
            {0, 3, 0, 0, 7},
            {6, 8, 0, 0, 9},
            {0, 5, 7, 9, 0}
        };
        
        List<Edge> mst = prim(graph, 0);
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