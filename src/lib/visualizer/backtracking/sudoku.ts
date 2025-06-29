import { VisualizationStep, SudokuState } from '../types';

export class SudokuVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private size = 9;

  private isValid(board: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let j = 0; j < this.size; j++) {
      if (board[row][j] === num) return false;
    }

    // Check column
    for (let i = 0; i < this.size; i++) {
      if (board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  }

  private findEmptyCell(board: number[][]): [number, number] | null {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board[i][j] === 0) return [i, j];
      }
    }
    return null;
  }

  private getPossibleValues(board: number[][], row: number, col: number): number[] {
    const possible: number[] = [];
    for (let num = 1; num <= 9; num++) {
      if (this.isValid(board, row, col, num)) {
        possible.push(num);
      }
    }
    return possible;
  }

  private getInvalidCells(board: number[][], row: number, col: number, num: number): [number, number][] {
    const invalid: [number, number][] = [];

    // Check row conflicts
    for (let j = 0; j < this.size; j++) {
      if (j !== col && board[row][j] === num) {
        invalid.push([row, j]);
      }
    }

    // Check column conflicts
    for (let i = 0; i < this.size; i++) {
      if (i !== row && board[i][col] === num) {
        invalid.push([i, col]);
      }
    }

    // Check 3x3 box conflicts
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && board[i][j] === num) {
          invalid.push([i, j]);
        }
      }
    }

    return invalid;
  }

  private addStep(
    board: number[][],
    description: string,
    currentCell: [number, number] | null = null,
    metadata: any = {}
  ) {
    const possibleValues = currentCell ? this.getPossibleValues(board, currentCell[0], currentCell[1]) : [];
    const invalidCells = metadata.num && currentCell ? 
      this.getInvalidCells(board, currentCell[0], currentCell[1], metadata.num) : [];

    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        board: board.map(row => [...row]),
        currentCell,
        possibleValues,
        invalidCells,
        backtrackCount: metadata.backtrackCount || 0
      },
      highlights: currentCell ? [currentCell[0] * this.size + currentCell[1]] : [],
      comparisons: invalidCells.map(([r, c]) => r * this.size + c),
      swaps: [],
      completed: this.isSolved(board) ? [0] : [],
      metadata
    });
  }

  private isSolved(board: number[][]): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    return true;
  }

  private solveSudoku(board: number[][], backtrackCount = 0): boolean {
    const emptyCell = this.findEmptyCell(board);
    
    if (!emptyCell) {
      this.addStep(
        board,
        'Sudoku solved! All cells filled correctly.',
        null,
        { backtrackCount, solved: true }
      );
      return true;
    }

    const [row, col] = emptyCell;
    this.addStep(
      board,
      `Found empty cell at (${row + 1}, ${col + 1}). Trying possible values...`,
      [row, col],
      { backtrackCount }
    );

    for (let num = 1; num <= 9; num++) {
      this.addStep(
        board,
        `Trying value ${num} at position (${row + 1}, ${col + 1})`,
        [row, col],
        { backtrackCount, num, trying: true }
      );

      if (this.isValid(board, row, col, num)) {
        board[row][col] = num;
        this.addStep(
          board,
          `Value ${num} is valid at (${row + 1}, ${col + 1}). Placed successfully.`,
          [row, col],
          { backtrackCount, num }
        );

        if (this.solveSudoku(board, backtrackCount)) {
          return true;
        }

        // Backtrack
        board[row][col] = 0;
        backtrackCount++;
        this.addStep(
          board,
          `Backtracking from (${row + 1}, ${col + 1}). Removing ${num}.`,
          [row, col],
          { backtrackCount, num, backtrack: true }
        );
      } else {
        this.addStep(
          board,
          `Value ${num} conflicts with existing numbers. Cannot place at (${row + 1}, ${col + 1}).`,
          [row, col],
          { backtrackCount, num, invalid: true }
        );
      }
    }

    return false;
  }

  public generateSteps(initialBoard?: number[][]): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;

    // Default puzzle if none provided
    const board = initialBoard || [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    this.addStep(
      board,
      'Starting Sudoku solver with the given puzzle',
      null,
      { backtrackCount: 0 }
    );

    this.solveSudoku(board);

    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'sudoku-solver',
      name: 'Sudoku Solver',
      category: 'Backtracking',
      description: 'Solve a 9x9 Sudoku puzzle using backtracking algorithm.',
      timeComplexity: 'O(9^(n*n))',
      spaceComplexity: 'O(n*n)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function solveSudoku(board) {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true; // Solved
  
  const [row, col] = emptyCell;
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      
      if (solveSudoku(board)) {
        return true;
      }
      
      board[row][col] = 0; // Backtrack
    }
  }
  
  return false;
}

function isValid(board, row, col, num) {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (board[row][j] === num) return false;
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  
  return true;
}

function findEmptyCell(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) return [i, j];
    }
  }
  return null;
}`,
        java: `// Java Implementation
public class SudokuSolver {
    private static final int SIZE = 9;
    
    public boolean solveSudoku(int[][] board) {
        int[] emptyCell = findEmptyCell(board);
        if (emptyCell == null) {
            return true; // Solved
        }
        
        int row = emptyCell[0];
        int col = emptyCell[1];
        
        for (int num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                
                if (solveSudoku(board)) {
                    return true;
                }
                
                board[row][col] = 0; // Backtrack
            }
        }
        
        return false;
    }
    
    private boolean isValid(int[][] board, int row, int col, int num) {
        // Check row
        for (int j = 0; j < SIZE; j++) {
            if (board[row][j] == num) {
                return false;
            }
        }
        
        // Check column
        for (int i = 0; i < SIZE; i++) {
            if (board[i][col] == num) {
                return false;
            }
        }
        
        // Check 3x3 box
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = boxRow; i < boxRow + 3; i++) {
            for (int j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] == num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    private int[] findEmptyCell(int[][] board) {
        for (int i = 0; i < SIZE; i++) {
            for (int j = 0; j < SIZE; j++) {
                if (board[i][j] == 0) {
                    return new int[]{i, j};
                }
            }
        }
        return null;
    }
    
    public static void main(String[] args) {
        SudokuSolver solver = new SudokuSolver();
        int[][] board = {
            {5, 3, 0, 0, 7, 0, 0, 0, 0},
            {6, 0, 0, 1, 9, 5, 0, 0, 0},
            {0, 9, 8, 0, 0, 0, 0, 6, 0},
            {8, 0, 0, 0, 6, 0, 0, 0, 3},
            {4, 0, 0, 8, 0, 3, 0, 0, 1},
            {7, 0, 0, 0, 2, 0, 0, 0, 6},
            {0, 6, 0, 0, 0, 0, 2, 8, 0},
            {0, 0, 0, 4, 1, 9, 0, 0, 5},
            {0, 0, 0, 0, 8, 0, 0, 7, 9}
        };
        
        if (solver.solveSudoku(board)) {
            System.out.println("Sudoku solved!");
            printBoard(board);
        } else {
            System.out.println("No solution exists");
        }
    }
    
    private static void printBoard(int[][] board) {
        for (int[] row : board) {
            for (int cell : row) {
                System.out.print(cell + " ");
            }
            System.out.println();
        }
    }
}`
      }
    };
  }
}