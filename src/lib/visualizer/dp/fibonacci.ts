import { VisualizationStep } from '../types';

export class FibonacciVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private n: number;
  private dpTable: number[];

  constructor(n: number = 10) {
    this.n = n;
    this.dpTable = new Array(n + 1).fill(-1);
  }

  private addStep(
    description: string,
    currentN: number,
    result?: number,
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        n: this.n,
        dpTable: [...this.dpTable],
        currentN,
        result
      },
      highlights: [currentN],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private fibonacciTopDown(n: number): number {
    // Base cases
    if (n <= 1) {
      this.dpTable[n] = n;
      this.addStep(
        `Base case: F(${n}) = ${n}`,
        n,
        n,
        { baseCase: true }
      );
      return n;
    }

    // Check if already computed
    if (this.dpTable[n] !== -1) {
      this.addStep(
        `Using memoized value: F(${n}) = ${this.dpTable[n]}`,
        n,
        this.dpTable[n],
        { memoized: true }
      );
      return this.dpTable[n];
    }

    this.addStep(
      `Computing F(${n}) = F(${n-1}) + F(${n-2})`,
      n,
      undefined,
      { computing: true }
    );

    // Recursive calls
    const result1 = this.fibonacciTopDown(n - 1);
    const result2 = this.fibonacciTopDown(n - 2);
    
    // Compute and store result
    this.dpTable[n] = result1 + result2;
    
    this.addStep(
      `Computed F(${n}) = F(${n-1}) + F(${n-2}) = ${result1} + ${result2} = ${this.dpTable[n]}`,
      n,
      this.dpTable[n],
      { computed: true }
    );
    
    return this.dpTable[n];
  }

  private fibonacciBottomUp(): void {
    // Initialize base cases
    this.dpTable[0] = 0;
    this.dpTable[1] = 1;
    
    this.addStep(
      `Initialize base cases: F(0) = 0, F(1) = 1`,
      0,
      0,
      { baseCase: true }
    );
    
    this.addStep(
      `Initialize base cases: F(0) = 0, F(1) = 1`,
      1,
      1,
      { baseCase: true }
    );
    
    // Build up the table
    for (let i = 2; i <= this.n; i++) {
      this.addStep(
        `Computing F(${i}) = F(${i-1}) + F(${i-2})`,
        i,
        undefined,
        { computing: true }
      );
      
      this.dpTable[i] = this.dpTable[i-1] + this.dpTable[i-2];
      
      this.addStep(
        `Computed F(${i}) = F(${i-1}) + F(${i-2}) = ${this.dpTable[i-1]} + ${this.dpTable[i-2]} = ${this.dpTable[i]}`,
        i,
        this.dpTable[i],
        { computed: true }
      );
    }
    
    this.addStep(
      `Final result: F(${this.n}) = ${this.dpTable[this.n]}`,
      this.n,
      this.dpTable[this.n],
      { completed: [0] }
    );
  }

  public generateSteps(useTopDown: boolean = false): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dpTable = new Array(this.n + 1).fill(-1);
    
    if (useTopDown) {
      this.addStep(
        `Starting top-down (memoization) approach to compute F(${this.n})`,
        this.n,
        undefined,
        { approach: 'top-down' }
      );
      
      this.fibonacciTopDown(this.n);
      
      this.addStep(
        `Final result: F(${this.n}) = ${this.dpTable[this.n]}`,
        this.n,
        this.dpTable[this.n],
        { completed: [0] }
      );
    } else {
      this.addStep(
        `Starting bottom-up (tabulation) approach to compute F(${this.n})`,
        0,
        undefined,
        { approach: 'bottom-up' }
      );
      
      this.fibonacciBottomUp();
    }
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'fibonacci',
      name: 'Fibonacci Sequence',
      category: 'Dynamic Programming',
      description: 'Calculate Fibonacci numbers efficiently using dynamic programming to avoid redundant calculations.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      difficulty: 'Easy' as const,
      code: {
        javascript: `// JavaScript Implementation - Top-down (Memoization)
function fibonacciMemoization(n, memo = {}) {
  // Base cases
  if (n <= 1) return n;
  
  // Check if already computed
  if (memo[n]) return memo[n];
  
  // Compute and store result
  memo[n] = fibonacciMemoization(n - 1, memo) + 
            fibonacciMemoization(n - 2, memo);
  
  return memo[n];
}

// Bottom-up (Tabulation)
function fibonacciTabulation(n) {
  if (n <= 1) return n;
  
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// Space-optimized version
function fibonacciOptimized(n) {
  if (n <= 1) return n;
  
  let prev2 = 0;
  let prev1 = 1;
  let current;
  
  for (let i = 2; i <= n; i++) {
    current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}

// Usage
console.log(fibonacciMemoization(10)); // 55
console.log(fibonacciTabulation(10));  // 55
console.log(fibonacciOptimized(10));   // 55`,
        java: `// Java Implementation
public class Fibonacci {
    
    // Top-down (Memoization)
    public static int fibonacciMemoization(int n, Integer[] memo) {
        // Base cases
        if (n <= 1) return n;
        
        // Check if already computed
        if (memo[n] != null) return memo[n];
        
        // Compute and store result
        memo[n] = fibonacciMemoization(n - 1, memo) + 
                  fibonacciMemoization(n - 2, memo);
        
        return memo[n];
    }
    
    // Bottom-up (Tabulation)
    public static int fibonacciTabulation(int n) {
        if (n <= 1) return n;
        
        int[] dp = new int[n + 1];
        dp[0] = 0;
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
    
    // Space-optimized version
    public static int fibonacciOptimized(int n) {
        if (n <= 1) return n;
        
        int prev2 = 0;
        int prev1 = 1;
        int current = 0;
        
        for (int i = 2; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
    
    public static void main(String[] args) {
        int n = 10;
        
        // Memoization
        Integer[] memo = new Integer[n + 1];
        System.out.println(fibonacciMemoization(n, memo)); // 55
        
        // Tabulation
        System.out.println(fibonacciTabulation(n));  // 55
        
        // Optimized
        System.out.println(fibonacciOptimized(n));   // 55
    }
}`
      }
    };
  }
}