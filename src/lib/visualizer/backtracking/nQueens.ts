import { VisualizationStep, NQueensState } from '../types';

export class NQueensVisualizer {
  private n: number;
  private steps: VisualizationStep[] = [];
  private stepId = 0;

  constructor(n: number = 8) {
    this.n = n;
  }

  private isValid(board: number[][], row: number, col: number): boolean {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }

    // Check diagonal (top-left to bottom-right)
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }

    // Check diagonal (top-right to bottom-left)
    for (let i = row - 1, j = col + 1; i >= 0 && j < this.n; i--, j++) {
      if (board[i][j] === 1) return false;
    }

    return true;
  }

  private addStep(
    board: number[][],
    description: string,
    highlights: number[] = [],
    metadata: any = {}
  ) {
    const queens: [number, number][] = [];
    const conflicts: [number, number][] = [];

    // Find all queens and conflicts
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (board[i][j] === 1) {
          queens.push([i, j]);
          // Check for conflicts with this queen
          if (!this.isValid(board, i, j)) {
            conflicts.push([i, j]);
          }
        }
      }
    }

    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        board: board.map(row => [...row]),
        queens,
        conflicts,
        currentPosition: metadata.currentPosition || null,
        backtrackCount: metadata.backtrackCount || 0
      },
      highlights,
      comparisons: [],
      swaps: [],
      completed: queens.length === this.n ? [0] : [],
      metadata
    });
  }

  private solveNQueens(board: number[][], row: number, backtrackCount = 0): boolean {
    if (row === this.n) {
      this.addStep(
        board,
        `Solution found! All ${this.n} queens placed successfully.`,
        [],
        { backtrackCount, solved: true }
      );
      return true;
    }

    for (let col = 0; col < this.n; col++) {
      this.addStep(
        board,
        `Trying to place queen at position (${row}, ${col})`,
        [row * this.n + col],
        { currentPosition: [row, col], backtrackCount }
      );

      if (this.isValid(board, row, col)) {
        board[row][col] = 1;
        this.addStep(
          board,
          `Queen placed at (${row}, ${col}). Position is valid.`,
          [row * this.n + col],
          { currentPosition: [row, col], backtrackCount }
        );

        if (this.solveNQueens(board, row + 1, backtrackCount)) {
          return true;
        }

        // Backtrack
        board[row][col] = 0;
        backtrackCount++;
        this.addStep(
          board,
          `Backtracking from (${row}, ${col}). Removing queen.`,
          [row * this.n + col],
          { currentPosition: [row, col], backtrackCount }
        );
      } else {
        this.addStep(
          board,
          `Position (${row}, ${col}) is invalid. Queen conflicts with existing queens.`,
          [row * this.n + col],
          { currentPosition: [row, col], backtrackCount, invalid: true }
        );
      }
    }

    return false;
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;

    const board = Array(this.n).fill(null).map(() => Array(this.n).fill(0));
    
    this.addStep(
      board,
      `Starting N-Queens problem with ${this.n}x${this.n} board`,
      [],
      { backtrackCount: 0 }
    );

    this.solveNQueens(board, 0);

    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'n-queens',
      name: 'N-Queens Problem',
      category: 'Backtracking',
      description: 'Place N queens on an NxN chessboard so that no two queens attack each other.',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function solveNQueens(board, row) {
  const N = board.length;
  
  if (row === N) {
    return true; // All queens placed
  }
  
  for (let col = 0; col < N; col++) {
    if (isValid(board, row, col)) {
      board[row][col] = 1; // Place queen
      
      if (solveNQueens(board, row + 1)) {
        return true;
      }
      
      board[row][col] = 0; // Backtrack
    }
  }
  
  return false;
}

function isValid(board, row, col) {
  const N = board.length;
  
  // Check column
  for (let i = 0; i < row; i++) {
    if (board[i][col] === 1) return false;
  }
  
  // Check diagonal (top-left to bottom-right)
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) return false;
  }
  
  // Check diagonal (top-right to bottom-left)
  for (let i = row - 1, j = col + 1; i >= 0 && j < N; i--, j++) {
    if (board[i][j] === 1) return false;
  }
  
  return true;
}

// Usage
const N = 8;
const board = Array(N).fill(null).map(() => Array(N).fill(0));
solveNQueens(board, 0);`,
        java: `// Java Implementation
public class NQueens {
    private int N;
    
    public NQueens(int n) {
        this.N = n;
    }
    
    public boolean solveNQueens(int[][] board, int row) {
        if (row == N) {
            return true; // All queens placed
        }
        
        for (int col = 0; col < N; col++) {
            if (isValid(board, row, col)) {
                board[row][col] = 1; // Place queen
                
                if (solveNQueens(board, row + 1)) {
                    return true;
                }
                
                board[row][col] = 0; // Backtrack
            }
        }
        
        return false;
    }
    
    private boolean isValid(int[][] board, int row, int col) {
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 1) {
                return false;
            }
        }
        
        // Check diagonal (top-left to bottom-right)
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 1) {
                return false;
            }
        }
        
        // Check diagonal (top-right to bottom-left)
        for (int i = row - 1, j = col + 1; i >= 0 && j < N; i--, j++) {
            if (board[i][j] == 1) {
                return false;
            }
        }
        
        return true;
    }
    
    public static void main(String[] args) {
        int N = 8;
        NQueens nQueens = new NQueens(N);
        int[][] board = new int[N][N];
        
        if (nQueens.solveNQueens(board, 0)) {
            System.out.println("Solution found!");
            printBoard(board);
        } else {
            System.out.println("No solution exists");
        }
    }
    
    private static void printBoard(int[][] board) {
        for (int[] row : board) {
            for (int cell : row) {
                System.out.print(cell == 1 ? "Q " : ". ");
            }
            System.out.println();
        }
    }
}`
      }
    };
  }
}