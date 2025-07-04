import { VisualizationStep } from '../types';

export class EditDistanceVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private str1: string;
  private str2: string;
  private dpTable: number[][];

  constructor(str1: string = "kitten", str2: string = "sitting") {
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
        editDistance: metadata.editDistance,
        operations: metadata.operations
      },
      highlights: [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private calculateEditDistance(): void {
    const m = this.str1.length;
    const n = this.str2.length;
    
    // Initialize first row and column
    for (let i = 0; i <= m; i++) {
      this.dpTable[i][0] = i;
    }
    
    for (let j = 0; j <= n; j++) {
      this.dpTable[0][j] = j;
    }
    
    this.addStep(
      `Initializing DP table: First row and column represent deletions and insertions from empty string`,
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
          this.dpTable[i][j] = this.dpTable[i-1][j-1];
          
          this.addStep(
            `Characters match! ${this.str1[i-1]} = ${this.str2[j-1]}. No operation needed. Edit distance at [${i}][${j}] = ${this.dpTable[i][j]}`,
            i,
            j,
            { match: true }
          );
        } else {
          // Min of (deletion, insertion, substitution) + 1
          const deletion = this.dpTable[i-1][j];
          const insertion = this.dpTable[i][j-1];
          const substitution = this.dpTable[i-1][j-1];
          
          this.dpTable[i][j] = Math.min(deletion, insertion, substitution) + 1;
          
          let operation;
          if (this.dpTable[i][j] === deletion + 1) {
            operation = "deletion";
          } else if (this.dpTable[i][j] === insertion + 1) {
            operation = "insertion";
          } else {
            operation = "substitution";
          }
          
          this.addStep(
            `Characters don't match. Choosing minimum of deletion (${deletion}), insertion (${insertion}), substitution (${substitution}) + 1. Edit distance at [${i}][${j}] = ${this.dpTable[i][j]} (${operation})`,
            i,
            j,
            { noMatch: true, operation }
          );
        }
      }
    }
    
    // Backtrack to find the operations
    const operations: string[] = [];
    let i = m, j = n;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && this.str1[i-1] === this.str2[j-1]) {
        // No operation (match)
        operations.unshift(`Keep ${this.str1[i-1]}`);
        i--;
        j--;
      } else if (i > 0 && j > 0 && this.dpTable[i][j] === this.dpTable[i-1][j-1] + 1) {
        // Substitution
        operations.unshift(`Replace ${this.str1[i-1]} with ${this.str2[j-1]}`);
        i--;
        j--;
      } else if (i > 0 && this.dpTable[i][j] === this.dpTable[i-1][j] + 1) {
        // Deletion
        operations.unshift(`Delete ${this.str1[i-1]}`);
        i--;
      } else {
        // Insertion
        operations.unshift(`Insert ${this.str2[j-1]}`);
        j--;
      }
    }
    
    this.addStep(
      `Edit Distance problem solved! The minimum edit distance is ${this.dpTable[m][n]}`,
      m,
      n,
      { completed: [0], editDistance: this.dpTable[m][n], operations }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dpTable = Array(this.str1.length + 1).fill(null)
      .map(() => Array(this.str2.length + 1).fill(0));
    
    this.addStep(
      `Starting Edit Distance calculation for strings "${this.str1}" and "${this.str2}"`,
      0,
      0,
      { starting: true }
    );
    
    this.calculateEditDistance();
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'edit-distance',
      name: 'Edit Distance (Levenshtein)',
      category: 'Dynamic Programming',
      description: 'Calculate the minimum number of operations required to transform one string into another using insertions, deletions, and substitutions.',
      timeComplexity: 'O(mn)',
      spaceComplexity: 'O(mn)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  
  // Create DP table
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        ) + 1;
      }
    }
  }
  
  // Backtrack to find the operations
  const operations = [];
  let i = m, j = n;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
      // No operation (match)
      operations.unshift(\`Keep \${word1[i - 1]}\`);
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      // Substitution
      operations.unshift(\`Replace \${word1[i - 1]} with \${word2[j - 1]}\`);
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      // Deletion
      operations.unshift(\`Delete \${word1[i - 1]}\`);
      i--;
    } else {
      // Insertion
      operations.unshift(\`Insert \${word2[j - 1]}\`);
      j--;
    }
  }
  
  return {
    distance: dp[m][n],
    operations
  };
}

// Usage
const word1 = "kitten";
const word2 = "sitting";
const result = editDistance(word1, word2);

console.log("Edit Distance:", result.distance);
console.log("Operations:", result.operations);`,
        java: `// Java Implementation
import java.util.*;

public class EditDistance {
    
    public static int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Create DP table
        int[][] dp = new int[m + 1][n + 1];
        
        // Initialize first row and column
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j],     // deletion
                        Math.min(
                            dp[i][j - 1],     // insertion
                            dp[i - 1][j - 1]  // substitution
                        )
                    ) + 1;
                }
            }
        }
        
        return dp[m][n];
    }
    
    public static List<String> getOperations(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Create DP table
        int[][] dp = new int[m + 1][n + 1];
        
        // Initialize first row and column
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j],     // deletion
                        Math.min(
                            dp[i][j - 1],     // insertion
                            dp[i - 1][j - 1]  // substitution
                        )
                    ) + 1;
                }
            }
        }
        
        // Backtrack to find the operations
        List<String> operations = new ArrayList<>();
        int i = m, j = n;
        
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && word1.charAt(i - 1) == word2.charAt(j - 1)) {
                // No operation (match)
                operations.add(0, "Keep " + word1.charAt(i - 1));
                i--;
                j--;
            } else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1) {
                // Substitution
                operations.add(0, "Replace " + word1.charAt(i - 1) + 
                              " with " + word2.charAt(j - 1));
                i--;
                j--;
            } else if (i > 0 && dp[i][j] == dp[i - 1][j] + 1) {
                // Deletion
                operations.add(0, "Delete " + word1.charAt(i - 1));
                i--;
            } else {
                // Insertion
                operations.add(0, "Insert " + word2.charAt(j - 1));
                j--;
            }
        }
        
        return operations;
    }
    
    public static void main(String[] args) {
        String word1 = "kitten";
        String word2 = "sitting";
        
        int distance = minDistance(word1, word2);
        List<String> operations = getOperations(word1, word2);
        
        System.out.println("Edit Distance: " + distance);
        System.out.println("Operations:");
        for (String op : operations) {
            System.out.println("- " + op);
        }
    }
}`
      }
    };
  }
}