import { VisualizationStep } from '../types';

export class MatrixChainVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private matrices: { rows: number; cols: number }[];
  private dpTable: number[][];
  private parenthesization: string[][];

  constructor() {
    // Define matrices as [rows, cols] pairs
    // For example, A1 is 30x35, A2 is 35x15, etc.
    const dimensions = [30, 35, 15, 5, 10, 20, 25];
    
    this.matrices = [];
    for (let i = 0; i < dimensions.length - 1; i++) {
      this.matrices.push({
        rows: dimensions[i],
        cols: dimensions[i + 1]
      });
    }
    
    const n = this.matrices.length;
    this.dpTable = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    this.parenthesization = Array(n).fill(null).map(() => Array(n).fill(''));
    
    // Base case: cost is 0 when multiplying a single matrix
    for (let i = 0; i < n; i++) {
      this.dpTable[i][i] = 0;
      this.parenthesization[i][i] = `A${i+1}`;
    }
  }

  private addStep(
    description: string,
    currentI: number,
    currentJ: number,
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        matrices: [...this.matrices],
        dpTable: this.dpTable.map(row => [...row]),
        parenthesization: this.parenthesization.map(row => [...row]),
        currentI,
        currentJ,
        minOperations: metadata.minOperations,
        optimalParenthesization: metadata.optimalParenthesization
      },
      highlights: [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private matrixChainOrder(): void {
    const n = this.matrices.length;
    
    this.addStep(
      `Initializing DP table: Cost of multiplying a single matrix is 0`,
      0,
      0,
      { initializing: true }
    );
    
    // l is chain length
    for (let l = 2; l <= n; l++) {
      this.addStep(
        `Processing chains of length ${l}`,
        0,
        l - 1,
        { chainLength: l }
      );
      
      for (let i = 0; i <= n - l; i++) {
        const j = i + l - 1;
        
        this.addStep(
          `Processing subproblem for matrices A${i+1} to A${j+1}`,
          i,
          j,
          { subproblem: true }
        );
        
        // Try each possible split point
        for (let k = i; k < j; k++) {
          const cost1 = this.dpTable[i][k]; // Cost of multiplying A_i to A_k
          const cost2 = this.dpTable[k+1][j]; // Cost of multiplying A_{k+1} to A_j
          const cost3 = this.matrices[i].rows * this.matrices[k].cols * this.matrices[j].cols; // Cost of multiplying the two resulting matrices
          
          const totalCost = cost1 + cost2 + cost3;
          
          this.addStep(
            `Trying split at k=${k}: Cost = dp[${i}][${k}] + dp[${k+1}][${j}] + (${this.matrices[i].rows} × ${this.matrices[k].cols} × ${this.matrices[j].cols}) = ${cost1} + ${cost2} + ${cost3} = ${totalCost}`,
            i,
            j,
            { split: k, cost1, cost2, cost3, totalCost }
          );
          
          if (totalCost < this.dpTable[i][j]) {
            this.dpTable[i][j] = totalCost;
            this.parenthesization[i][j] = `(${this.parenthesization[i][k]})×(${this.parenthesization[k+1][j]})`;
            
            this.addStep(
              `Found better solution! Updated dp[${i}][${j}] = ${totalCost}`,
              i,
              j,
              { updated: true, newCost: totalCost }
            );
          }
        }
      }
    }
    
    this.addStep(
      `Matrix Chain Multiplication problem solved! Minimum number of operations: ${this.dpTable[0][n-1]}`,
      0,
      n - 1,
      { 
        completed: [0], 
        minOperations: this.dpTable[0][n-1],
        optimalParenthesization: this.parenthesization[0][n-1]
      }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    
    const n = this.matrices.length;
    this.dpTable = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    this.parenthesization = Array(n).fill(null).map(() => Array(n).fill(''));
    
    // Base case: cost is 0 when multiplying a single matrix
    for (let i = 0; i < n; i++) {
      this.dpTable[i][i] = 0;
      this.parenthesization[i][i] = `A${i+1}`;
    }
    
    this.addStep(
      `Starting Matrix Chain Multiplication for ${n} matrices`,
      -1,
      -1,
      { starting: true }
    );
    
    this.matrixChainOrder();
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'matrix-chain',
      name: 'Matrix Chain Multiplication',
      category: 'Dynamic Programming',
      description: 'Find the optimal way to parenthesize a chain of matrices to minimize the number of scalar multiplications.',
      timeComplexity: 'O(n³)',
      spaceComplexity: 'O(n²)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function matrixChainOrder(matrices) {
  const n = matrices.length;
  
  // Create DP tables
  const dp = Array(n).fill().map(() => Array(n).fill(Infinity));
  const parenthesization = Array(n).fill().map(() => Array(n).fill(''));
  
  // Base case: cost is 0 when multiplying a single matrix
  for (let i = 0; i < n; i++) {
    dp[i][i] = 0;
    parenthesization[i][i] = \`A\${i+1}\`;
  }
  
  // l is chain length
  for (let l = 2; l <= n; l++) {
    for (let i = 0; i <= n - l; i++) {
      const j = i + l - 1;
      
      // Try each possible split point
      for (let k = i; k < j; k++) {
        const cost1 = dp[i][k]; // Cost of multiplying A_i to A_k
        const cost2 = dp[k+1][j]; // Cost of multiplying A_{k+1} to A_j
        const cost3 = matrices[i].rows * matrices[k].cols * matrices[j].cols; // Cost of multiplying the two resulting matrices
        
        const totalCost = cost1 + cost2 + cost3;
        
        if (totalCost < dp[i][j]) {
          dp[i][j] = totalCost;
          parenthesization[i][j] = \`(\${parenthesization[i][k]})×(\${parenthesization[k+1][j]})\`;
        }
      }
    }
  }
  
  return {
    minOperations: dp[0][n-1],
    optimalParenthesization: parenthesization[0][n-1]
  };
}

// Usage
const matrices = [
  { rows: 30, cols: 35 }, // A1
  { rows: 35, cols: 15 }, // A2
  { rows: 15, cols: 5 },  // A3
  { rows: 5, cols: 10 },  // A4
  { rows: 10, cols: 20 }, // A5
  { rows: 20, cols: 25 }  // A6
];

const result = matrixChainOrder(matrices);
console.log("Minimum operations:", result.minOperations);
console.log("Optimal parenthesization:", result.optimalParenthesization);`,
        java: `// Java Implementation
public class MatrixChainMultiplication {
    
    static class Matrix {
        int rows;
        int cols;
        
        Matrix(int rows, int cols) {
            this.rows = rows;
            this.cols = cols;
        }
    }
    
    public static int matrixChainOrder(Matrix[] matrices) {
        int n = matrices.length;
        
        // Create DP table
        int[][] dp = new int[n][n];
        String[][] parenthesization = new String[n][n];
        
        // Base case: cost is 0 when multiplying a single matrix
        for (int i = 0; i < n; i++) {
            dp[i][i] = 0;
            parenthesization[i][i] = "A" + (i + 1);
        }
        
        // l is chain length
        for (int l = 2; l <= n; l++) {
            for (int i = 0; i <= n - l; i++) {
                int j = i + l - 1;
                dp[i][j] = Integer.MAX_VALUE;
                
                // Try each possible split point
                for (int k = i; k < j; k++) {
                    int cost1 = dp[i][k]; // Cost of multiplying A_i to A_k
                    int cost2 = dp[k+1][j]; // Cost of multiplying A_{k+1} to A_j
                    int cost3 = matrices[i].rows * matrices[k].cols * matrices[j].cols; // Cost of multiplying the two resulting matrices
                    
                    int totalCost = cost1 + cost2 + cost3;
                    
                    if (totalCost < dp[i][j]) {
                        dp[i][j] = totalCost;
                        parenthesization[i][j] = "(" + parenthesization[i][k] + ")×(" + 
                                               parenthesization[k+1][j] + ")";
                    }
                }
            }
        }
        
        System.out.println("Optimal parenthesization: " + parenthesization[0][n-1]);
        return dp[0][n-1];
    }
    
    public static void main(String[] args) {
        Matrix[] matrices = {
            new Matrix(30, 35), // A1
            new Matrix(35, 15), // A2
            new Matrix(15, 5),  // A3
            new Matrix(5, 10),  // A4
            new Matrix(10, 20), // A5
            new Matrix(20, 25)  // A6
        };
        
        int minOperations = matrixChainOrder(matrices);
        System.out.println("Minimum operations: " + minOperations);
    }
}`
      }
    };
  }
}