import { VisualizationStep } from '../types';

export class BFSVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private graph: number[][];

  constructor() {
    // Sample graph for demonstration
    this.graph = [
      [0, 1, 1, 0, 0],
      [1, 0, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 0, 1],
      [0, 1, 1, 1, 0]
    ];
  }

  private addStep(
    description: string,
    currentNode: number | null = null,
    visited: number[] = [],
    queue: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        graph: this.graph.map(row => [...row]),
        visited: [...visited],
        queue: [...queue],
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

  private bfs(startNode: number = 0): void {
    const visited: boolean[] = new Array(this.graph.length).fill(false);
    const queue: number[] = [];
    const visitedNodes: number[] = [];
    const path: [number, number][] = [];

    this.addStep(
      `Starting BFS from node ${startNode}`,
      startNode,
      visitedNodes,
      queue,
      { path }
    );

    queue.push(startNode);
    visited[startNode] = true;
    visitedNodes.push(startNode);

    this.addStep(
      `Added node ${startNode} to queue and marked as visited`,
      startNode,
      visitedNodes,
      queue,
      { path }
    );

    while (queue.length > 0) {
      const currentNode = queue.shift()!;

      this.addStep(
        `Processing node ${currentNode} from front of queue`,
        currentNode,
        visitedNodes,
        queue,
        { path: [...path] }
      );

      // Explore all adjacent nodes
      for (let i = 0; i < this.graph.length; i++) {
        if (this.graph[currentNode][i] === 1 && !visited[i]) {
          visited[i] = true;
          visitedNodes.push(i);
          queue.push(i);
          path.push([currentNode, i]);

          this.addStep(
            `Found unvisited neighbor ${i} of node ${currentNode}. Added to queue.`,
            i,
            visitedNodes,
            queue,
            { path: [...path] }
          );
        }
      }

      this.addStep(
        `Finished processing node ${currentNode}`,
        null,
        visitedNodes,
        queue,
        { path: [...path] }
      );
    }

    this.addStep(
      'BFS traversal complete',
      null,
      visitedNodes,
      queue,
      { path, completed: [0] }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.bfs(0);
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'bfs',
      name: 'Breadth First Search (BFS)',
      category: 'Graph',
      description: 'A graph traversal algorithm that explores all vertices at the current depth before moving to vertices at the next depth level.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function bfs(graph, startNode) {
  const visited = new Array(graph.length).fill(false);
  const queue = [];
  
  // Start with the initial node
  queue.push(startNode);
  visited[startNode] = true;
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    console.log('Visiting node:', currentNode);
    
    // Explore all adjacent nodes
    for (let i = 0; i < graph[currentNode].length; i++) {
      if (graph[currentNode][i] === 1 && !visited[i]) {
        visited[i] = true;
        queue.push(i);
      }
    }
  }
}

// BFS to find shortest path
function bfsShortestPath(graph, startNode, targetNode) {
  const visited = new Array(graph.length).fill(false);
  const queue = [];
  const parent = new Array(graph.length).fill(-1);
  
  queue.push(startNode);
  visited[startNode] = true;
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    
    if (currentNode === targetNode) {
      // Reconstruct path
      const path = [];
      let node = targetNode;
      while (node !== -1) {
        path.unshift(node);
        node = parent[node];
      }
      return path;
    }
    
    for (let i = 0; i < graph[currentNode].length; i++) {
      if (graph[currentNode][i] === 1 && !visited[i]) {
        visited[i] = true;
        parent[i] = currentNode;
        queue.push(i);
      }
    }
  }
  
  return null; // No path found
}

// Usage
const graph = [
  [0, 1, 1, 0, 0],
  [1, 0, 0, 1, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 0, 0, 1],
  [0, 1, 1, 1, 0]
];

bfs(graph, 0);`,
        java: `// Java Implementation
import java.util.*;

public class BFS {
    
    public static void bfs(int[][] graph, int startNode) {
        boolean[] visited = new boolean[graph.length];
        Queue<Integer> queue = new LinkedList<>();
        
        // Start with the initial node
        queue.offer(startNode);
        visited[startNode] = true;
        
        while (!queue.isEmpty()) {
            int currentNode = queue.poll();
            System.out.println("Visiting node: " + currentNode);
            
            // Explore all adjacent nodes
            for (int i = 0; i < graph[currentNode].length; i++) {
                if (graph[currentNode][i] == 1 && !visited[i]) {
                    visited[i] = true;
                    queue.offer(i);
                }
            }
        }
    }
    
    // BFS to find shortest path
    public static List<Integer> bfsShortestPath(int[][] graph, int startNode, int targetNode) {
        boolean[] visited = new boolean[graph.length];
        Queue<Integer> queue = new LinkedList<>();
        int[] parent = new int[graph.length];
        Arrays.fill(parent, -1);
        
        queue.offer(startNode);
        visited[startNode] = true;
        
        while (!queue.isEmpty()) {
            int currentNode = queue.poll();
            
            if (currentNode == targetNode) {
                // Reconstruct path
                List<Integer> path = new ArrayList<>();
                int node = targetNode;
                while (node != -1) {
                    path.add(0, node);
                    node = parent[node];
                }
                return path;
            }
            
            for (int i = 0; i < graph[currentNode].length; i++) {
                if (graph[currentNode][i] == 1 && !visited[i]) {
                    visited[i] = true;
                    parent[i] = currentNode;
                    queue.offer(i);
                }
            }
        }
        
        return null; // No path found
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 1, 1, 0, 0},
            {1, 0, 0, 1, 1},
            {1, 0, 0, 0, 1},
            {0, 1, 0, 0, 1},
            {0, 1, 1, 1, 0}
        };
        
        bfs(graph, 0);
    }
}`
      }
    };
  }
}