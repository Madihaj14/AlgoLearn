import { VisualizationStep } from '../types';

export class JumpSearchVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private array: number[];
  private target: number;

  constructor(array: number[] = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], target: number = 21) {
    this.array = [...array].sort((a, b) => a - b); // Ensure array is sorted
    this.target = target;
  }

  private addStep(
    array: number[],
    description: string,
    highlights: number[] = [],
    comparisons: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        array: [...array],
        target: this.target,
        comparisons: metadata.comparisons || 0,
        position: metadata.position !== undefined ? metadata.position : -1,
        jumpSize: metadata.jumpSize,
        currentJump: metadata.currentJump,
        searchRange: metadata.searchRange
      },
      highlights,
      comparisons,
      swaps: [],
      completed: metadata.found ? [metadata.foundIndex] : [],
      metadata
    });
  }

  private jumpSearch(): void {
    const arr = [...this.array];
    const n = arr.length;
    const jumpSize = Math.floor(Math.sqrt(n));
    let totalComparisons = 0;
    let step = jumpSize;
    let prev = 0;

    this.addStep(
      arr,
      `Starting Jump Search for target ${this.target}. Jump size: √${n} = ${jumpSize}`,
      [],
      [],
      { 
        comparisons: totalComparisons, 
        position: -1, 
        jumpSize,
        currentJump: 0
      }
    );

    // Finding the block where element is present
    while (arr[Math.min(step, n) - 1] < this.target) {
      totalComparisons++;
      
      this.addStep(
        arr,
        `Jumping to index ${Math.min(step, n) - 1}: ${arr[Math.min(step, n) - 1]} < ${this.target}`,
        [Math.min(step, n) - 1],
        [Math.min(step, n) - 1],
        { 
          comparisons: totalComparisons, 
          position: -1, 
          jumpSize,
          currentJump: step,
          searchRange: [prev, Math.min(step, n) - 1]
        }
      );

      prev = step;
      step += jumpSize;
      
      if (prev >= n) {
        this.addStep(
          arr,
          `Reached end of array. Target ${this.target} not found`,
          [],
          [],
          { comparisons: totalComparisons, position: -1, notFound: true, jumpSize }
        );
        return;
      }

      this.addStep(
        arr,
        `Moving to next block. Previous: ${prev}, Next jump: ${step}`,
        [],
        [],
        { 
          comparisons: totalComparisons, 
          position: -1, 
          jumpSize,
          currentJump: step,
          searchRange: [prev, Math.min(step, n) - 1]
        }
      );
    }

    // Linear search in the identified block
    this.addStep(
      arr,
      `Target might be in block [${prev}, ${Math.min(step, n) - 1}]. Starting linear search...`,
      [],
      [],
      { 
        comparisons: totalComparisons, 
        position: -1, 
        jumpSize,
        searchRange: [prev, Math.min(step, n) - 1]
      }
    );

    while (arr[prev] < this.target) {
      totalComparisons++;
      
      this.addStep(
        arr,
        `Linear search: checking index ${prev}: ${arr[prev]}`,
        [prev],
        [prev],
        { 
          comparisons: totalComparisons, 
          position: -1, 
          jumpSize,
          searchRange: [prev, Math.min(step, n) - 1]
        }
      );

      prev++;
      
      if (prev === Math.min(step, n)) {
        this.addStep(
          arr,
          `Reached end of block. Target ${this.target} not found`,
          [],
          [],
          { comparisons: totalComparisons, position: -1, notFound: true, jumpSize }
        );
        return;
      }
    }

    totalComparisons++;
    
    if (arr[prev] === this.target) {
      this.addStep(
        arr,
        `Found target ${this.target} at index ${prev}!`,
        [],
        [],
        { 
          comparisons: totalComparisons, 
          position: prev, 
          found: true, 
          foundIndex: prev,
          jumpSize
        }
      );
    } else {
      this.addStep(
        arr,
        `Target ${this.target} not found in the array`,
        [],
        [],
        { comparisons: totalComparisons, position: -1, notFound: true, jumpSize }
      );
    }
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.jumpSearch();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'jump-search',
      name: 'Jump Search',
      category: 'Searching',
      description: 'A searching algorithm for sorted arrays that works by jumping ahead by fixed steps and then performing linear search.',
      timeComplexity: 'O(√n)',
      spaceComplexity: 'O(1)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function jumpSearch(arr, target) {
  const n = arr.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  let step = jumpSize;
  let prev = 0;
  
  // Finding the block where element is present
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += jumpSize;
    
    if (prev >= n) {
      return -1; // Element not found
    }
  }
  
  // Linear search in the identified block
  while (arr[prev] < target) {
    prev++;
    
    if (prev === Math.min(step, n)) {
      return -1; // Element not found
    }
  }
  
  // If element is found
  if (arr[prev] === target) {
    return prev;
  }
  
  return -1; // Element not found
}

// Usage
const numbers = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]; // Must be sorted
const target = 21;
const result = jumpSearch(numbers, target);

if (result !== -1) {
  console.log(\`Target \${target} found at index \${result}\`);
} else {
  console.log(\`Target \${target} not found\`);
}`,
        java: `// Java Implementation
public class JumpSearch {
    
    public static int jumpSearch(int[] arr, int target) {
        int n = arr.length;
        int jumpSize = (int) Math.floor(Math.sqrt(n));
        int step = jumpSize;
        int prev = 0;
        
        // Finding the block where element is present
        while (arr[Math.min(step, n) - 1] < target) {
            prev = step;
            step += jumpSize;
            
            if (prev >= n) {
                return -1; // Element not found
            }
        }
        
        // Linear search in the identified block
        while (arr[prev] < target) {
            prev++;
            
            if (prev == Math.min(step, n)) {
                return -1; // Element not found
            }
        }
        
        // If element is found
        if (arr[prev] == target) {
            return prev;
        }
        
        return -1; // Element not found
    }
    
    public static void main(String[] args) {
        int[] numbers = {0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89}; // Must be sorted
        int target = 21;
        int result = jumpSearch(numbers, target);
        
        if (result != -1) {
            System.out.println("Target " + target + " found at index " + result);
        } else {
            System.out.println("Target " + target + " not found");
        }
    }
}`
      }
    };
  }

  public setArray(array: number[]) {
    this.array = [...array].sort((a, b) => a - b);
  }

  public setTarget(target: number) {
    this.target = target;
  }
}