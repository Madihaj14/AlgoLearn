import { VisualizationStep } from '../types';

export class LCSVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private str1: string;
  private str2: string;
  private dpTable: number[][];

  constructor(str1: string = "ABCBDAB", str2: string = "BDCABA") {
    this.str1 = str1;
    this.str2 = str2;
    this.dpTable = Array(str1.length + 1).fill(null)
      .map(() => Array(str2.length + 1).fill(0));
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
        str1: this.str1,
        str2: this.str2,
        dpTable: this.dpTable.map(row => [...row]),
        currentI,
        currentJ,
        lcsLength: metadata.lcsLength,
        lcsString: metadata.lcsString
      },
      highlights: [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private findLCS(): void {
    const m = this.str1.length;
    const n = this.str2.length;
    
    // Initialize first row and column with zeros (base case)
    this.addStep(
      `Initializing DP table with base cases: empty strings have LCS of length 0`,
      0,
      0,
      { initializing: true }
    );
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        this.addStep(
          `Comparing characters: ${this.str1[i-1]} at position ${i-1} in string 1 and ${this.str2[j-1]} at position ${j-1} in string 2`,
          i,
          j,
          { comparing: true }
        );
        
        if (this.str1[i-1] === this.str2[j-1]) {
          this.dpTable[i][j] = this.dpTable[i-1][j-1] + 1;
          
          this.addStep(
            `Characters match! ${this.str1[i-1]} = ${this.str2[j-1]}. LCS length at [${i}][${j}] = ${this.dpTable[i][j]}`,
            i,
            j,
            { match: true }
          );
        } else {
          this.dpTable[i][j] = Math.max(this.dpTable[i-1][j], this.dpTable[i][j-1]);
          
          this.addStep(
            `Characters don't match. Taking maximum of left (${this.dpTable[i][j-1]}) and top (${this.dpTable[i-1][j]}). LCS length at [${i}][${j}] = ${this.dpTable[i][j]}`,
            i,
            j,
            { noMatch: true }
          );
        }
      }
    }
    
    // Backtrack to find the LCS string
    let lcsString = "";
    let i = m, j = n;
    
    while (i > 0 && j > 0) {
      if (this.str1[i-1] === this.str2[j-1]) {
        lcsString = this.str1[i-1] + lcsString;
        i--;
        j--;
        
        this.addStep(
          `Backtracking: Characters match at [${i}][${j}]. Adding ${this.str1[i]} to LCS.`,
          i,
          j,
          { backtracking: true, lcsString }
        );
      } else if (this.dpTable[i-1][j] > this.dpTable[i][j-1]) {
        i--;
        
        this.addStep(
          `Backtracking: Moving up to [${i}][${j}]`,
          i,
          j,
          { backtracking: true, lcsString }
        );
      } else {
        j--;
        
        this.addStep(
          `Backtracking: Moving left to [${i}][${j}]`,
          i,
          j,
          { backtracking: true, lcsString }
        );
      }
    }
    
    this.addStep(
      `LCS problem solved! The longest common subsequence is "${lcsString}" with length ${this.dpTable[m][n]}`,
      m,
      n,
      { completed: [0], lcsLength: this.dpTable[m][n], lcsString }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dpTable = Array(this.str1.length + 1).fill(null)
      .map(() => Array(this.str2.length + 1).fill(0));
    
    this.addStep(
      `Starting Longest Common Subsequence for strings "${this.str1}" and "${this.str2}"`,
      0,
      0,
      { starting: true }
    );
    
    this.findLCS();
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      category: 'Dynamic Programming',
      description: 'Find the longest subsequence common to two sequences using dynamic programming with 2D table approach.',
      timeComplexity: 'O(mn)',
      spaceComplexity: 'O(mn)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  
  // Create DP table
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find the LCS string
  let lcs = "";
  let i = m, j = n;
  
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs = text1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return {
    length: dp[m][n],
    sequence: lcs
  };
}

// Usage
const text1 = "ABCBDAB";
const text2 = "BDCABA";
const result = longestCommonSubsequence(text1, text2);

console.log("LCS Length:", result.length);
console.log("LCS Sequence:", result.sequence);`,
        java: `// Java Implementation
public class LongestCommonSubsequence {
    
    public static String findLCS(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        
        // Create DP table
        int[][] dp = new int[m + 1][n + 1];
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Backtrack to find the LCS string
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;
        
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                lcs.insert(0, text1.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs.toString();
    }
    
    public static void main(String[] args) {
        String text1 = "ABCBDAB";
        String text2 = "BDCABA";
        
        String lcs = findLCS(text1, text2);
        System.out.println("LCS Length: " + lcs.length());
        System.out.println("LCS Sequence: " + lcs);
    }
}`
      }
    };
  }
}