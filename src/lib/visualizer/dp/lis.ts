import { VisualizationStep } from '../types';

export class LISVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private array: number[];
  private dpTable: number[];

  constructor(array: number[] = [10, 22, 9, 33, 21, 50, 41, 60, 80]) {
    this.array = array;
    this.dpTable = new Array(array.length).fill(0);
  }

  private addStep(
    description: string,
    currentIndex: number,
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        array: [...this.array],
        dpTable: [...this.dpTable],
        currentIndex,
        lisLength: metadata.lisLength,
        lisSequence: metadata.lisSequence
      },
      highlights: [currentIndex],
      comparisons: metadata.comparing || [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private findLIS(): void {
    const n = this.array.length;
    
    // Initialize all LIS values to 1
    for (let i = 0; i < n; i++) {
      this.dpTable[i] = 1;
    }
    
    this.addStep(
      `Initializing DP table: Each element has a LIS of at least 1 (the element itself)`,
      0,
      { initializing: true }
    );
    
    // Compute LIS values in bottom-up manner
    for (let i = 1; i < n; i++) {
      this.addStep(
        `Processing element ${this.array[i]} at index ${i}`,
        i,
        { processing: true }
      );
      
      for (let j = 0; j < i; j++) {
        this.addStep(
          `Comparing with previous element ${this.array[j]} at index ${j}`,
          i,
          { comparing: [j], comparing: true }
        );
        
        if (this.array[i] > this.array[j] && this.dpTable[i] < this.dpTable[j] + 1) {
          this.dpTable[i] = this.dpTable[j] + 1;
          
          this.addStep(
            `Found increasing subsequence: ${this.array[j]} < ${this.array[i]}. Updating LIS at index ${i} to ${this.dpTable[i]}`,
            i,
            { updated: true, comparing: [j] }
          );
        } else {
          this.addStep(
            `No update needed: Either ${this.array[j]} >= ${this.array[i]} or current LIS (${this.dpTable[i]}) is already optimal`,
            i,
            { noUpdate: true, comparing: [j] }
          );
        }
      }
    }
    
    // Find the maximum LIS value
    let maxLIS = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < n; i++) {
      if (this.dpTable[i] > maxLIS) {
        maxLIS = this.dpTable[i];
        maxIndex = i;
      }
    }
    
    // Backtrack to find the LIS sequence
    const lisSequence: number[] = [];
    let currentLength = maxLIS;
    let currentIndex = maxIndex;
    
    for (let i = maxIndex; i >= 0; i--) {
      if (this.dpTable[i] === currentLength) {
        lisSequence.unshift(this.array[i]);
        currentLength--;
      }
    }
    
    this.addStep(
      `LIS problem solved! The longest increasing subsequence has length ${maxLIS}: [${lisSequence.join(', ')}]`,
      maxIndex,
      { completed: [0], lisLength: maxLIS, lisSequence }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dpTable = new Array(this.array.length).fill(0);
    
    this.addStep(
      `Starting Longest Increasing Subsequence for array [${this.array.join(', ')}]`,
      -1,
      { starting: true }
    );
    
    this.findLIS();
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'lis',
      name: 'Longest Increasing Subsequence',
      category: 'Dynamic Programming',
      description: 'Find the length of the longest subsequence where elements are in increasing order using dynamic programming.',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(n)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation - O(n²)
function longestIncreasingSubsequence(nums) {
  if (nums.length === 0) return 0;
  
  const n = nums.length;
  const dp = new Array(n).fill(1); // LIS ending at each position
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  // Find the maximum LIS value
  let maxLIS = 0;
  for (let i = 0; i < n; i++) {
    maxLIS = Math.max(maxLIS, dp[i]);
  }
  
  // Backtrack to find the LIS sequence
  const sequence = [];
  let currentLength = maxLIS;
  
  for (let i = n - 1; i >= 0; i--) {
    if (dp[i] === currentLength) {
      sequence.unshift(nums[i]);
      currentLength--;
    }
  }
  
  return {
    length: maxLIS,
    sequence
  };
}

// Optimized O(n log n) solution using binary search
function lisOptimized(nums) {
  if (nums.length === 0) return 0;
  
  const n = nums.length;
  const tails = [];
  
  for (let num of nums) {
    // Binary search to find the position to insert current element
    let left = 0, right = tails.length;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    // If we're at the end, append to tails
    if (left === tails.length) {
      tails.push(num);
    } else {
      // Replace the element at position
      tails[left] = num;
    }
  }
  
  return tails.length;
}

// Usage
const nums = [10, 22, 9, 33, 21, 50, 41, 60, 80];
const result = longestIncreasingSubsequence(nums);

console.log("LIS Length:", result.length);
console.log("LIS Sequence:", result.sequence);
console.log("Optimized LIS Length:", lisOptimized(nums));`,
        java: `// Java Implementation
import java.util.*;

public class LongestIncreasingSubsequence {
    
    // O(n²) solution
    public static int[] findLIS(int[] nums) {
        if (nums.length == 0) return new int[0];
        
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
        }
        
        // Find the maximum LIS value and its index
        int maxLIS = 0;
        int maxIndex = 0;
        
        for (int i = 0; i < n; i++) {
            if (dp[i] > maxLIS) {
                maxLIS = dp[i];
                maxIndex = i;
            }
        }
        
        // Backtrack to find the LIS sequence
        List<Integer> sequence = new ArrayList<>();
        int currentLength = maxLIS;
        
        for (int i = maxIndex; i >= 0; i--) {
            if (dp[i] == currentLength) {
                sequence.add(0, nums[i]);
                currentLength--;
            }
        }
        
        // Convert list to array
        int[] result = new int[sequence.size()];
        for (int i = 0; i < sequence.size(); i++) {
            result[i] = sequence.get(i);
        }
        
        return result;
    }
    
    // O(n log n) solution using binary search
    public static int lisOptimized(int[] nums) {
        if (nums.length == 0) return 0;
        
        int[] tails = new int[nums.length];
        int size = 0;
        
        for (int num : nums) {
            int left = 0, right = size;
            
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails[mid] < num) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            
            tails[left] = num;
            if (left == size) size++;
        }
        
        return size;
    }
    
    public static void main(String[] args) {
        int[] nums = {10, 22, 9, 33, 21, 50, 41, 60, 80};
        
        int[] lisSequence = findLIS(nums);
        System.out.println("LIS Length: " + lisSequence.length);
        System.out.print("LIS Sequence: ");
        for (int num : lisSequence) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        System.out.println("Optimized LIS Length: " + lisOptimized(nums));
    }
}`
      }
    };
  }
}