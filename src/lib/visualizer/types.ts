export interface VisualizationStep {
  id: string;
  description: string;
  data: any;
  highlights: number[];
  comparisons: number[];
  swaps: number[];
  completed: number[];
  metadata?: Record<string, any>;
}

export interface VisualizationConfig {
  speed: number;
  autoPlay: boolean;
  showCode: boolean;
  showDescription: boolean;
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  code: string | { javascript: string; java: string };
}

export interface VisualizerState {
  steps: VisualizationStep[];
  currentStep: number;
  isPlaying: boolean;
  config: VisualizationConfig;
  algorithm: AlgorithmInfo;
}

// Backtracking specific types
export interface BacktrackingState {
  board: any[][];
  path: number[][];
  currentPosition: [number, number];
  visited: Set<string>;
  solutions: any[][];
  backtrackCount: number;
}

export interface NQueensState extends BacktrackingState {
  board: number[][];
  queens: [number, number][];
  conflicts: [number, number][];
}

export interface SudokuState extends BacktrackingState {
  board: number[][];
  currentCell: [number, number];
  possibleValues: number[];
  invalidCells: [number, number][];
}

export interface MazeState extends BacktrackingState {
  maze: number[][];
  start: [number, number];
  end: [number, number];
  currentPath: [number, number][];
  deadEnds: [number, number][];
}

// Dynamic Programming specific types
export interface DPState {
  dpTable: any[][];
  currentState: any;
  optimalValue: number;
  optimalSolution: any;
}

export interface FibonacciState extends DPState {
  n: number;
  currentN: number;
  memo: Record<number, number>;
}

export interface KnapsackState extends DPState {
  items: { weight: number; value: number }[];
  capacity: number;
  currentItem: number;
  currentWeight: number;
  selectedItems: number[];
}

export interface LCSState extends DPState {
  str1: string;
  str2: string;
  currentI: number;
  currentJ: number;
  lcsString: string;
}

export interface EditDistanceState extends DPState {
  str1: string;
  str2: string;
  currentI: number;
  currentJ: number;
  operations: string[];
}

// Tree-based search specific types
export interface TreeSearchState {
  tree: any;
  currentNode: any;
  searchPath: any[];
  target: number;
  found: boolean;
}

export interface BinarySearchTreeState extends TreeSearchState {
  tree: { nodes: any[]; edges: any[] };
  currentNode: number;
  searchPath: number[];
}

export interface TrieSearchState extends TreeSearchState {
  trie: { nodes: any[]; edges: any[] };
  currentNode: string;
  searchPath: string[];
  prefix: string;
  matches: string[];
}

export interface BTreeSearchState extends TreeSearchState {
  tree: { nodes: any[]; edges: any[] };
  currentNode: number[];
  searchPath: number[][];
  order: number;
}