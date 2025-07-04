import { VisualizationStep } from '../types';

export class PalindromePartitioningVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private string: string;
  private isPalindrome: boolean[][];
  private dpTable: number[][];

  constructor(string: string = "aabac") {
    this.string = string;
    const n = string.length;
    this.isPalindrome = Array(n).fill(null).map(() => Array(n).fill(false));
    this.dpTable = Array(n).fill(null).map(() => Array(n).fill(Infinity));
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
        string: this.string,
        isPalindrome: this.isPalindrome.map(row => [...row]),
        dpTable: this.dpTable.map(row => [...row]),
        currentI,
        currentJ,
        minCuts: metadata.minCuts,
        palindromes: metadata.palindromes
      },
      highlights: [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private minCutPalindrome(): void {
    const n = this.string.length;
    
    // Precompute all palindrome substrings
    this.addStep(
      `Precomputing all palindrome substrings of "${this.string}"`,
      0,
      0,
      { precomputing: true }
    );
    
    // All substrings of length 1 are palindromes
    for (let i = 0; i < n; i++) {
      this.isPalindrome[i][i] = true;
      this.dpTable[i][i] = 0; // 0 cuts needed for a single character
    }
    
    this.addStep(
      `All single characters are palindromes with 0 cuts`,
      0,
      0,
      { singleChars: true }
    );
    
    // Check for palindromes of length 2
    for (let i = 0; i < n - 1; i++) {
      if (this.string[i] === this.string[i + 1]) {
        this.isPalindrome[i][i + 1] = true;
        this.dpTable[i][i + 1] = 0; // 0 cuts needed for a palindrome
        
        this.addStep(
          `Substring "${this.string.substring(i, i + 2)}" is a palindrome with 0 cuts`,
          i,
          i + 1,
          { palindrome: true }
        );
      } else {
        this.dpTable[i][i + 1] = 1; // 1 cut needed for non-palindrome of length 2
        
        this.addStep(
          `Substring "${this.string.substring(i, i + 2)}" is not a palindrome, needs 1 cut`,
          i,
          i + 1,
          { notPalindrome: true }
        );
      }
    }
    
    // Check for palindromes of length 3 or more
    for (let len = 3; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        
        // Check if substring is palindrome
        if (this.string[i] === this.string[j] && this.isPalindrome[i + 1][j - 1]) {
          this.isPalindrome[i][j] = true;
          this.dpTable[i][j] = 0; // 0 cuts needed for a palindrome
          
          this.addStep(
            `Substring "${this.string.substring(i, j + 1)}" is a palindrome with 0 cuts`,
            i,
            j,
            { palindrome: true }
          );
        } else {
          // Find the minimum cuts
          for (let k = i; k < j; k++) {
            const cuts = this.dpTable[i][k] + this.dpTable[k + 1][j] + 1;
            
            this.addStep(
              `Trying cut at position ${k} for substring "${this.string.substring(i, j + 1)}": ${this.dpTable[i][k]} + ${this.dpTable[k + 1][j]} + 1 = ${cuts}`,
              i,
              j,
              { tryingCut: true, cutPosition: k, cuts }
            );
            
            if (cuts < this.dpTable[i][j]) {
              this.dpTable[i][j] = cuts;
              
              this.addStep(
                `Found better solution! Updated dp[${i}][${j}] = ${cuts}`,
                i,
                j,
                { updated: true, newCuts: cuts }
              );
            }
          }
        }
      }
    }
    
    // Find all palindrome substrings for visualization
    const palindromes: string[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        if (this.isPalindrome[i][j]) {
          palindromes.push(this.string.substring(i, j + 1));
        }
      }
    }
    
    this.addStep(
      `Palindrome Partitioning problem solved! Minimum cuts needed: ${this.dpTable[0][n-1]}`,
      0,
      n - 1,
      { completed: [0], minCuts: this.dpTable[0][n-1], palindromes }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    
    const n = this.string.length;
    this.isPalindrome = Array(n).fill(null).map(() => Array(n).fill(false));
    this.dpTable = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    this.addStep(
      `Starting Palindrome Partitioning for string "${this.string}"`,
      -1,
      -1,
      { starting: true }
    );
    
    this.minCutPalindrome();
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'palindrome-partitioning',
      name: 'Palindrome Partitioning',
      category: 'Dynamic Programming',
      description: 'Find the minimum number of cuts needed to partition a string such that every substring is a palindrome.',
      timeComplexity: 'O(n³)',
      spaceComplexity: 'O(n²)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function minCutPalindrome(s) {
  const n = s.length;
  
  // Create tables
  const isPalindrome = Array(n).fill().map(() => Array(n).fill(false));
  const dp = Array(n).fill().map(() => Array(n).fill(Infinity));
  
  // All substrings of length 1 are palindromes
  for (let i = 0; i < n; i++) {
    isPalindrome[i][i] = true;
    dp[i][i] = 0; // 0 cuts needed for a single character
  }
  
  // Check for palindromes of length 2
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      isPalindrome[i][i + 1] = true;
      dp[i][i + 1] = 0; // 0 cuts needed for a palindrome
    } else {
      dp[i][i + 1] = 1; // 1 cut needed for non-palindrome of length 2
    }
  }
  
  // Check for palindromes of length 3 or more
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      
      // Check if substring is palindrome
      if (s[i] === s[j] && isPalindrome[i + 1][j - 1]) {
        isPalindrome[i][j] = true;
        dp[i][j] = 0; // 0 cuts needed for a palindrome
      } else {
        // Find the minimum cuts
        for (let k = i; k < j; k++) {
          dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + 1);
        }
      }
    }
  }
  
  return dp[0][n - 1];
}

// Optimized approach using 1D DP
function minCutPalindromeOptimized(s) {
  const n = s.length;
  
  // Create palindrome lookup table
  const isPalindrome = Array(n).fill().map(() => Array(n).fill(false));
  
  // Precompute all palindrome substrings
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      isPalindrome[i][j] = s[i] === s[j] && (len <= 2 || isPalindrome[i + 1][j - 1]);
    }
  }
  
  // Create 1D DP array
  const dp = Array(n).fill(Infinity);
  
  for (let i = 0; i < n; i++) {
    if (isPalindrome[0][i]) {
      dp[i] = 0; // Whole substring is palindrome, no cuts needed
    } else {
      for (let j = 0; j < i; j++) {
        if (isPalindrome[j + 1][i]) {
          dp[i] = Math.min(dp[i], dp[j] + 1);
        }
      }
    }
  }
  
  return dp[n - 1];
}

// Usage
const s = "aabac";
console.log("Minimum cuts needed:", minCutPalindrome(s));
console.log("Optimized minimum cuts:", minCutPalindromeOptimized(s));`,
        java: `// Java Implementation
public class PalindromePartitioning {
    
    public static int minCutPalindrome(String s) {
        int n = s.length();
        
        // Create tables
        boolean[][] isPalindrome = new boolean[n][n];
        int[][] dp = new int[n][n];
        
        // Initialize dp table with maximum values
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dp[i][j] = Integer.MAX_VALUE;
            }
        }
        
        // All substrings of length 1 are palindromes
        for (int i = 0; i < n; i++) {
            isPalindrome[i][i] = true;
            dp[i][i] = 0; // 0 cuts needed for a single character
        }
        
        // Check for palindromes of length 2
        for (int i = 0; i < n - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                isPalindrome[i][i + 1] = true;
                dp[i][i + 1] = 0; // 0 cuts needed for a palindrome
            } else {
                dp[i][i + 1] = 1; // 1 cut needed for non-palindrome of length 2
            }
        }
        
        // Check for palindromes of length 3 or more
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                
                // Check if substring is palindrome
                if (s.charAt(i) == s.charAt(j) && isPalindrome[i + 1][j - 1]) {
                    isPalindrome[i][j] = true;
                    dp[i][j] = 0; // 0 cuts needed for a palindrome
                } else {
                    // Find the minimum cuts
                    for (int k = i; k < j; k++) {
                        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + 1);
                    }
                }
            }
        }
        
        return dp[0][n - 1];
    }
    
    // Optimized approach using 1D DP
    public static int minCutPalindromeOptimized(String s) {
        int n = s.length();
        
        // Create palindrome lookup table
        boolean[][] isPalindrome = new boolean[n][n];
        
        // Precompute all palindrome substrings
        for (int len = 1; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                isPalindrome[i][j] = s.charAt(i) == s.charAt(j) && 
                                    (len <= 2 || isPalindrome[i + 1][j - 1]);
            }
        }
        
        // Create 1D DP array
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        
        for (int i = 0; i < n; i++) {
            if (isPalindrome[0][i]) {
                dp[i] = 0; // Whole substring is palindrome, no cuts needed
            } else {
                for (int j = 0; j < i; j++) {
                    if (isPalindrome[j + 1][i]) {
                        dp[i] = Math.min(dp[i], dp[j] + 1);
                    }
                }
            }
        }
        
        return dp[n - 1];
    }
    
    public static void main(String[] args) {
        String s = "aabac";
        System.out.println("Minimum cuts needed: " + minCutPalindrome(s));
        System.out.println("Optimized minimum cuts: " + minCutPalindromeOptimized(s));
    }
}`
      }
    };
  }
}