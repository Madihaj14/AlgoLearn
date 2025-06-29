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
  code: string;
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