import { VisualizationStep } from '../types';

export class TopologicalSortVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private graph: number[][];

  constructor() {
    // Sample directed acyclic graph (DAG) for demonstration
    this.graph = [
      [0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0]
    ];
  }

  private addStep(
    description: string,
    currentNode: number | null = null,
    visited: number[] = [],
    stack: number[] = [],
    topologicalOrder: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.graph.map(row => [...row]),
        visited: [...visited],
        stack: [...stack],
        currentNode,
        topologicalOrder: [...topologicalOrder]
      },
      highlights: currentNode !== null ? [currentNode] : [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private topologicalSort(): void {
    const visited: boolean[] = new Array(this.graph.length).fill(false);
    const visitedNodes: number[] = [];
    const stack: number[] = [];
    const topologicalOrder: number[] = [];

    this.addStep(
      'Starting Topological Sort using DFS',
      null,
      visitedNodes,
      stack,
      topologicalOrder
    );

    for (let i = 0; i < this.graph.length; i++) {
      if (!visited[i]) {
        this.addStep(
          `Starting DFS from unvisited node ${i}`,
          i,
          visitedNodes,
          stack,
          topologicalOrder
        );
        this.dfsUtil(i, visited, visitedNodes, stack, topologicalOrder);
      }
    }

    // Pop all items from stack to get topological order
    while (stack.length > 0) {
      const node = stack.pop()!;
      topologicalOrder.push(node);

      this.addStep(
        `Added node ${node} to topological order`,
        node,
        visitedNodes,
        stack,
        topologicalOrder
      );
    }

    this.addStep(
      'Topological Sort complete',
      null,
      visitedNodes,
      stack,
      topologicalOrder,
      { completed: [0] }
    );
  }

  private dfsUtil(
    node: number,
    visited: boolean[],
    visitedNodes: number[],
    stack: number[],
    topologicalOrder: number[]
  ): void {
    visited[node] = true;
    visitedNodes.push(node);

    this.addStep(
      `Visiting node ${node}`,
      node,
      visitedNodes,
      stack,
      topologicalOrder
    );

    // Visit all adjacent nodes
    for (let i = 0; i < this.graph.length; i++) {
      if (this.graph[node][i] === 1 && !visited[i]) {
        this.addStep(
          `Found unvisited neighbor ${i} of node ${node}`,
          i,
          visitedNodes,
          stack,
          topologicalOrder
        );
        this.dfsUtil(i, visited, visitedNodes, stack, topologicalOrder);
      }
    }

    // Push current node to stack after visiting all neighbors
    stack.push(node);
    this.addStep(
      `Finished processing node ${node}, added to stack`,
      node,
      visitedNodes,
      stack,
      topologicalOrder
    );
  }

  // Alternative implementation using Kahn's algorithm (BFS-based)
  private topologicalSortKahn(): void {
    const inDegree: number[] = new Array(this.graph.length).fill(0);
    const queue: number[] = [];
    const topologicalOrder: number[] = [];

    // Calculate in-degrees
    for (let i = 0; i < this.graph.length; i++) {
      for (let j = 0; j < this.graph.length; j++) {
        if (this.graph[i][j] === 1) {
          inDegree[j]++;
        }
      }
    }

    this.addStep(
      'Starting Topological Sort using Kahn\'s algorithm (BFS)',
      null,
      [],
      queue,
      topologicalOrder,
      { inDegree: [...inDegree] }
    );

    // Add all nodes with in-degree 0 to queue
    for (let i = 0; i < this.graph.length; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
        this.addStep(
          `Added node ${i} to queue (in-degree = 0)`,
          i,
          [],
          queue,
          topologicalOrder,
          { inDegree: [...inDegree] }
        );
      }
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      topologicalOrder.push(node);

      this.addStep(
        `Processed node ${node}, added to topological order`,
        node,
        [],
        queue,
        topologicalOrder,
        { inDegree: [...inDegree] }
      );

      // Reduce in-degree of all adjacent nodes
      for (let i = 0; i < this.graph.length; i++) {
        if (this.graph[node][i] === 1) {
          inDegree[i]--;

          this.addStep(
            `Reduced in-degree of node ${i} to ${inDegree[i]}`,
            i,
            [],
            queue,
            topologicalOrder,
            { inDegree: [...inDegree] }
          );

          if (inDegree[i] === 0) {
            queue.push(i);
            this.addStep(
              `Added node ${i} to queue (in-degree = 0)`,
              i,
              [],
              queue,
              topologicalOrder,
              { inDegree: [...inDegree] }
            );
          }
        }
      }
    }

    if (topologicalOrder.length !== this.graph.length) {
      this.addStep(
        'Graph contains a cycle! Topological sort not possible.',
        null,
        [],
        queue,
        topologicalOrder,
        { hasCycle: true }
      );
    } else {
      this.addStep(
        'Topological Sort complete using Kahn\'s algorithm',
        null,
        [],
        queue,
        topologicalOrder,
        { completed: [0] }
      );
    }
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.topologicalSort(); // Using DFS-based approach
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'topological-sort',
      name: 'Topological Sort',
      category: 'Graph',
      description: 'Linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge, the source comes before the destination.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation - DFS Based
function topologicalSortDFS(graph) {
  const n = graph.length;
  const visited = new Array(n).fill(false);
  const stack = [];
  
  function dfsUtil(node) {
    visited[node] = true;
    
    // Visit all adjacent nodes
    for (let i = 0; i < n; i++) {
      if (graph[node][i] === 1 && !visited[i]) {
        dfsUtil(i);
      }
    }
    
    // Push current node to stack after visiting all neighbors
    stack.push(node);
  }
  
  // Call DFS for all unvisited nodes
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfsUtil(i);
    }
  }
  
  // Pop all items from stack to get topological order
  const topologicalOrder = [];
  while (stack.length > 0) {
    topologicalOrder.push(stack.pop());
  }
  
  return topologicalOrder;
}

// Kahn's Algorithm - BFS Based
function topologicalSortKahn(graph) {
  const n = graph.length;
  const inDegree = new Array(n).fill(0);
  const queue = [];
  const topologicalOrder = [];
  
  // Calculate in-degrees
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (graph[i][j] === 1) {
        inDegree[j]++;
      }
    }
  }
  
  // Add all nodes with in-degree 0 to queue
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }
  
  while (queue.length > 0) {
    const node = queue.shift();
    topologicalOrder.push(node);
    
    // Reduce in-degree of all adjacent nodes
    for (let i = 0; i < n; i++) {
      if (graph[node][i] === 1) {
        inDegree[i]--;
        if (inDegree[i] === 0) {
          queue.push(i);
        }
      }
    }
  }
  
  // Check for cycle
  if (topologicalOrder.length !== n) {
    throw new Error('Graph contains a cycle');
  }
  
  return topologicalOrder;
}

// Usage
const graph = [
  [0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0]
];

console.log('DFS-based:', topologicalSortDFS(graph));
console.log('Kahn\\'s algorithm:', topologicalSortKahn(graph));`,
        java: `// Java Implementation
import java.util.*;

public class TopologicalSort {
    
    // DFS-based implementation
    public static List<Integer> topologicalSortDFS(int[][] graph) {
        int n = graph.length;
        boolean[] visited = new boolean[n];
        Stack<Integer> stack = new Stack<>();
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfsUtil(graph, i, visited, stack);
            }
        }
        
        List<Integer> topologicalOrder = new ArrayList<>();
        while (!stack.isEmpty()) {
            topologicalOrder.add(stack.pop());
        }
        
        return topologicalOrder;
    }
    
    private static void dfsUtil(int[][] graph, int node, boolean[] visited, Stack<Integer> stack) {
        visited[node] = true;
        
        // Visit all adjacent nodes
        for (int i = 0; i < graph.length; i++) {
            if (graph[node][i] == 1 && !visited[i]) {
                dfsUtil(graph, i, visited, stack);
            }
        }
        
        // Push current node to stack after visiting all neighbors
        stack.push(node);
    }
    
    // Kahn's Algorithm - BFS based
    public static List<Integer> topologicalSortKahn(int[][] graph) {
        int n = graph.length;
        int[] inDegree = new int[n];
        Queue<Integer> queue = new LinkedList<>();
        List<Integer> topologicalOrder = new ArrayList<>();
        
        // Calculate in-degrees
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (graph[i][j] == 1) {
                    inDegree[j]++;
                }
            }
        }
        
        // Add all nodes with in-degree 0 to queue
        for (int i = 0; i < n; i++) {
            if (inDegree[i] == 0) {
                queue.offer(i);
            }
        }
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            topologicalOrder.add(node);
            
            // Reduce in-degree of all adjacent nodes
            for (int i = 0; i < n; i++) {
                if (graph[node][i] == 1) {
                    inDegree[i]--;
                    if (inDegree[i] == 0) {
                        queue.offer(i);
                    }
                }
            }
        }
        
        // Check for cycle
        if (topologicalOrder.size() != n) {
            throw new RuntimeException("Graph contains a cycle");
        }
        
        return topologicalOrder;
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 1, 1, 0, 0, 0},
            {0, 0, 0, 1, 1, 0},
            {0, 0, 0, 0, 1, 1},
            {0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 0}
        };
        
        System.out.println("DFS-based: " + topologicalSortDFS(graph));
        System.out.println("Kahn's algorithm: " + topologicalSortKahn(graph));
    }
}`
      }
    };
  }
}