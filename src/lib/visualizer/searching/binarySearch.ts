import { VisualizationStep } from '../types';

export class BinarySearchVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private array: number[];
  private target: number;

  constructor(array: number[] = [11, 12, 22, 25, 34, 64, 90], target: number = 25) {
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
        searchRange: metadata.searchRange,
        midIndex: metadata.midIndex
      },
      highlights,
      comparisons,
      swaps: [],
      completed: metadata.found ? [metadata.foundIndex] : [],
      metadata
    });
  }

  private binarySearch(): void {
    const arr = [...this.array];
    let totalComparisons = 0;
    let left = 0;
    let right = arr.length - 1;

    this.addStep(
      arr,
      `Starting Binary Search for target value ${this.target} in sorted array`,
      [],
      [],
      { 
        comparisons: totalComparisons, 
        position: -1, 
        searchRange: [left, right] 
      }
    );

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      totalComparisons++;

      this.addStep(
        arr,
        `Searching in range [${left}, ${right}]. Checking middle element at index ${mid}: ${arr[mid]}`,
        [mid],
        [mid],
        { 
          comparisons: totalComparisons, 
          position: -1, 
          searchRange: [left, right],
          midIndex: mid
        }
      );

      if (arr[mid] === this.target) {
        this.addStep(
          arr,
          `Found target ${this.target} at index ${mid}!`,
          [],
          [],
          { 
            comparisons: totalComparisons, 
            position: mid, 
            found: true, 
            foundIndex: mid,
            searchRange: [left, right]
          }
        );
        return;
      } else if (arr[mid] < this.target) {
        this.addStep(
          arr,
          `${arr[mid]} < ${this.target}, search in right half [${mid + 1}, ${right}]`,
          [],
          [],
          { 
            comparisons: totalComparisons, 
            position: -1,
            searchRange: [mid + 1, right],
            eliminated: [left, mid]
          }
        );
        left = mid + 1;
      } else {
        this.addStep(
          arr,
          `${arr[mid]} > ${this.target}, search in left half [${left}, ${mid - 1}]`,
          [],
          [],
          { 
            comparisons: totalComparisons, 
            position: -1,
            searchRange: [left, mid - 1],
            eliminated: [mid, right]
          }
        );
        right = mid - 1;
      }
    }

    this.addStep(
      arr,
      `Target ${this.target} not found in the array`,
      [],
      [],
      { comparisons: totalComparisons, position: -1, notFound: true }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.binarySearch();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'binary-search',
      name: 'Binary Search',
      category: 'Searching',
      description: 'An efficient algorithm for searching a sorted array by repeatedly dividing the search interval in half.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Find middle element
    const mid = Math.floor((left + right) / 2);
    
    // Check if target is at mid
    if (arr[mid] === target) {
      return mid;
    }
    
    // If target is greater, ignore left half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // If target is smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}

// Usage
const numbers = [11, 12, 22, 25, 34, 64, 90]; // Must be sorted
const target = 25;
const result = binarySearch(numbers, target);

if (result !== -1) {
  console.log(\`Target \${target} found at index \${result}\`);
} else {
  console.log(\`Target \${target} not found\`);
}`,
        java: `// Java Implementation
public class BinarySearch {
    
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            // Find middle element
            int mid = left + (right - left) / 2;
            
            // Check if target is at mid
            if (arr[mid] == target) {
                return mid;
            }
            
            // If target is greater, ignore left half
            if (arr[mid] < target) {
                left = mid + 1;
            } 
            // If target is smaller, ignore right half
            else {
                right = mid - 1;
            }
        }
        
        return -1; // Target not found
    }
    
    public static void main(String[] args) {
        int[] numbers = {11, 12, 22, 25, 34, 64, 90}; // Must be sorted
        int target = 25;
        int result = binarySearch(numbers, target);
        
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