import { VisualizationStep } from '../types';

export class DFSVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private graph: number[][];
  private visited: boolean[];
  private stack: number[];

  constructor() {
    // Sample graph for demonstration
    this.graph = [
      [0, 1, 1, 0, 0],
      [1, 0, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 0, 1],
      [0, 1, 1, 1, 0]
    ];
    this.visited = new Array(this.graph.length).fill(false);
    this.stack = [];
  }

  private addStep(
    description: string,
    currentNode: number | null = null,
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.graph.map(row => [...row]),
        visited: this.visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        stack: [...this.stack],
        currentNode,
        path: metadata.path || []
      },
      highlights: currentNode !== null ? [currentNode] : [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private dfs(startNode: number = 0): void {
    this.visited = new Array(this.graph.length).fill(false);
    this.stack = [];
    const path: [number, number][] = [];

    this.addStep(
      `Starting DFS from node ${startNode}`,
      startNode,
      { path }
    );

    this.dfsRecursive(startNode, path);

    this.addStep(
      'DFS traversal complete',
      null,
      { path, completed: [0] }
    );
  }

  private dfsRecursive(node: number, path: [number, number][]): void {
    this.visited[node] = true;
    this.stack.push(node);

    this.addStep(
      `Visiting node ${node}`,
      node,
      { path: [...path] }
    );

    // Explore all adjacent nodes
    for (let i = 0; i < this.graph.length; i++) {
      if (this.graph[node][i] === 1 && !this.visited[i]) {
        path.push([node, i]);
        
        this.addStep(
          `Found unvisited neighbor ${i} of node ${node}`,
          i,
          { path: [...path] }
        );

        this.dfsRecursive(i, path);
      }
    }

    this.stack.pop();
    this.addStep(
      `Backtracking from node ${node}`,
      node,
      { path: [...path] }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dfs(0);
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'dfs',
      name: 'Depth First Search (DFS)',
      category: 'Graph',
      description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function dfs(graph, startNode, visited = new Set()) {
  // Mark current node as visited
  visited.add(startNode);
  console.log('Visiting node:', startNode);
  
  // Explore all adjacent nodes
  for (let i = 0; i < graph[startNode].length; i++) {
    if (graph[startNode][i] === 1 && !visited.has(i)) {
      dfs(graph, i, visited);
    }
  }
}

// Iterative implementation using stack
function dfsIterative(graph, startNode) {
  const visited = new Set();
  const stack = [startNode];
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    if (!visited.has(node)) {
      visited.add(node);
      console.log('Visiting node:', node);
      
      // Add all unvisited neighbors to stack
      for (let i = graph[node].length - 1; i >= 0; i--) {
        if (graph[node][i] === 1 && !visited.has(i)) {
          stack.push(i);
        }
      }
    }
  }
}

// Usage
const graph = [
  [0, 1, 1, 0, 0],
  [1, 0, 0, 1, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 0, 0, 1],
  [0, 1, 1, 1, 0]
];

dfs(graph, 0);`,
        java: `// Java Implementation
import java.util.*;

public class DFS {
    
    // Recursive DFS
    public static void dfs(int[][] graph, int startNode, boolean[] visited) {
        // Mark current node as visited
        visited[startNode] = true;
        System.out.println("Visiting node: " + startNode);
        
        // Explore all adjacent nodes
        for (int i = 0; i < graph[startNode].length; i++) {
            if (graph[startNode][i] == 1 && !visited[i]) {
                dfs(graph, i, visited);
            }
        }
    }
    
    // Iterative DFS using stack
    public static void dfsIterative(int[][] graph, int startNode) {
        boolean[] visited = new boolean[graph.length];
        Stack<Integer> stack = new Stack<>();
        
        stack.push(startNode);
        
        while (!stack.isEmpty()) {
            int node = stack.pop();
            
            if (!visited[node]) {
                visited[node] = true;
                System.out.println("Visiting node: " + node);
                
                // Add all unvisited neighbors to stack
                for (int i = graph[node].length - 1; i >= 0; i--) {
                    if (graph[node][i] == 1 && !visited[i]) {
                        stack.push(i);
                    }
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 1, 1, 0, 0},
            {1, 0, 0, 1, 1},
            {1, 0, 0, 0, 1},
            {0, 1, 0, 0, 1},
            {0, 1, 1, 1, 0}
        };
        
        boolean[] visited = new boolean[graph.length];
        dfs(graph, 0, visited);
    }
}`
      }
    };
  }
}