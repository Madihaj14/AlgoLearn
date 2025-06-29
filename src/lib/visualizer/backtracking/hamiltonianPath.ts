import { VisualizationStep } from '../types';

export class HamiltonianPathVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private vertices: number;
  private graph: number[][];

  constructor(vertices: number, graph?: number[][]) {
    this.vertices = vertices;
    this.graph = graph || this.generateSampleGraph();
  }

  private generateSampleGraph(): number[][] {
    // Create a sample graph with Hamiltonian path
    const graph = Array(this.vertices).fill(null).map(() => Array(this.vertices).fill(0));
    
    // Create a cycle to ensure Hamiltonian path exists
    for (let i = 0; i < this.vertices; i++) {
      const next = (i + 1) % this.vertices;
      graph[i][next] = 1;
      graph[next][i] = 1;
    }
    
    // Add some additional edges
    if (this.vertices > 3) {
      graph[0][2] = 1;
      graph[2][0] = 1;
      if (this.vertices > 4) {
        graph[1][3] = 1;
        graph[3][1] = 1;
      }
    }
    
    return graph;
  }

  private isValidMove(path: number[], pos: number, vertex: number): boolean {
    // Check if vertex is adjacent to the last vertex in path
    if (this.graph[path[pos - 1]][vertex] === 0) {
      return false;
    }

    // Check if vertex is already in path
    return !path.includes(vertex);
  }

  private addStep(
    path: number[],
    description: string,
    currentVertex: number | null = null,
    metadata: any = {}
  ) {
    const edges: [number, number][] = [];
    const visitedVertices = new Set(path.filter(v => v !== -1));
    
    // Add edges in the current path
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] !== -1 && path[i + 1] !== -1) {
        edges.push([path[i], path[i + 1]]);
      }
    }

    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.graph.map(row => [...row]),
        path: [...path],
        currentVertex,
        visitedVertices: Array.from(visitedVertices),
        edges,
        backtrackCount: metadata.backtrackCount || 0
      },
      highlights: currentVertex !== null ? [currentVertex] : [],
      comparisons: metadata.trying ? [metadata.trying] : [],
      swaps: [],
      completed: path.length === this.vertices && path.every(v => v !== -1) ? [0] : [],
      metadata
    });
  }

  private hamiltonianPath(path: number[], pos: number, backtrackCount = 0): boolean {
    if (pos === this.vertices) {
      this.addStep(
        path,
        'Hamiltonian path found! All vertices visited exactly once.',
        null,
        { backtrackCount, solved: true }
      );
      return true;
    }

    for (let vertex = 0; vertex < this.vertices; vertex++) {
      this.addStep(
        path,
        `Trying to add vertex ${vertex} to path at position ${pos}`,
        vertex,
        { backtrackCount, trying: vertex }
      );

      if (this.isValidMove(path, pos, vertex)) {
        path[pos] = vertex;
        this.addStep(
          path,
          `Vertex ${vertex} added to path. Current path: [${path.slice(0, pos + 1).join(', ')}]`,
          vertex,
          { backtrackCount }
        );

        if (this.hamiltonianPath(path, pos + 1, backtrackCount)) {
          return true;
        }

        // Backtrack
        path[pos] = -1;
        backtrackCount++;
        this.addStep(
          path,
          `Backtracking from vertex ${vertex}. Removing from path.`,
          vertex,
          { backtrackCount, backtrack: true }
        );
      } else {
        this.addStep(
          path,
          `Vertex ${vertex} cannot be added: ${path.includes(vertex) ? 'already visited' : 'not adjacent to current vertex'}`,
          vertex,
          { backtrackCount, invalid: true }
        );
      }
    }

    return false;
  }

  public generateSteps(startVertex: number = 0): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;

    const path = Array(this.vertices).fill(-1);
    path[0] = startVertex;

    this.addStep(
      path,
      `Starting Hamiltonian Path search from vertex ${startVertex}`,
      startVertex,
      { backtrackCount: 0 }
    );

    this.hamiltonianPath(path, 1);

    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'hamiltonian-path',
      name: 'Hamiltonian Path',
      category: 'Backtracking',
      description: 'Find a path that visits every vertex exactly once in a graph.',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function hamiltonianPath(graph, path, pos) {
  const vertices = graph.length;
  
  if (pos === vertices) {
    return true; // All vertices visited
  }
  
  for (let vertex = 0; vertex < vertices; vertex++) {
    if (isValidMove(graph, path, pos, vertex)) {
      path[pos] = vertex;
      
      if (hamiltonianPath(graph, path, pos + 1)) {
        return true;
      }
      
      path[pos] = -1; // Backtrack
    }
  }
  
  return false;
}

function isValidMove(graph, path, pos, vertex) {
  // Check if vertex is adjacent to last vertex in path
  if (graph[path[pos - 1]][vertex] === 0) {
    return false;
  }
  
  // Check if vertex is already in path
  for (let i = 0; i < pos; i++) {
    if (path[i] === vertex) {
      return false;
    }
  }
  
  return true;
}

// Usage
const vertices = 5;
const graph = [
  [0, 1, 0, 1, 0],
  [1, 0, 1, 1, 1],
  [0, 1, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [0, 1, 1, 1, 0]
];

const path = new Array(vertices).fill(-1);
path[0] = 0; // Start from vertex 0

if (hamiltonianPath(graph, path, 1)) {
  console.log("Hamiltonian Path found:", path);
} else {
  console.log("No Hamiltonian Path exists");
}`,
        java: `// Java Implementation
import java.util.*;

public class HamiltonianPath {
    private int vertices;
    private int[][] graph;
    
    public HamiltonianPath(int vertices, int[][] graph) {
        this.vertices = vertices;
        this.graph = graph;
    }
    
    public boolean hamiltonianPath(int[] path, int pos) {
        if (pos == vertices) {
            return true; // All vertices visited
        }
        
        for (int vertex = 0; vertex < vertices; vertex++) {
            if (isValidMove(path, pos, vertex)) {
                path[pos] = vertex;
                
                if (hamiltonianPath(path, pos + 1)) {
                    return true;
                }
                
                path[pos] = -1; // Backtrack
            }
        }
        
        return false;
    }
    
    private boolean isValidMove(int[] path, int pos, int vertex) {
        // Check if vertex is adjacent to last vertex in path
        if (graph[path[pos - 1]][vertex] == 0) {
            return false;
        }
        
        // Check if vertex is already in path
        for (int i = 0; i < pos; i++) {
            if (path[i] == vertex) {
                return false;
            }
        }
        
        return true;
    }
    
    public static void main(String[] args) {
        int vertices = 5;
        int[][] graph = {
            {0, 1, 0, 1, 0},
            {1, 0, 1, 1, 1},
            {0, 1, 0, 0, 1},
            {1, 1, 0, 0, 1},
            {0, 1, 1, 1, 0}
        };
        
        HamiltonianPath hp = new HamiltonianPath(vertices, graph);
        int[] path = new int[vertices];
        Arrays.fill(path, -1);
        path[0] = 0; // Start from vertex 0
        
        if (hp.hamiltonianPath(path, 1)) {
            System.out.println("Hamiltonian Path found:");
            System.out.println(Arrays.toString(path));
        } else {
            System.out.println("No Hamiltonian Path exists");
        }
    }
}`
      }
    };
  }

  public getGraph(): number[][] {
    return this.graph;
  }
}