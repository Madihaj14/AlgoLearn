import { VisualizationStep } from '../types';

export class LinearSearchVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private array: number[];
  private target: number;

  constructor(array: number[] = [64, 34, 25, 12, 22, 11, 90], target: number = 22) {
    this.array = [...array];
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
        currentIndex: metadata.currentIndex
      },
      highlights,
      comparisons,
      swaps: [],
      completed: metadata.found ? [metadata.foundIndex] : [],
      metadata
    });
  }

  private linearSearch(): void {
    const arr = [...this.array];
    let totalComparisons = 0;

    this.addStep(
      arr,
      `Starting Linear Search for target value ${this.target}`,
      [],
      [],
      { comparisons: totalComparisons, position: -1 }
    );

    for (let i = 0; i < arr.length; i++) {
      totalComparisons++;
      
      this.addStep(
        arr,
        `Checking element at index ${i}: ${arr[i]}`,
        [i],
        [i],
        { comparisons: totalComparisons, currentIndex: i, position: -1 }
      );

      if (arr[i] === this.target) {
        this.addStep(
          arr,
          `Found target ${this.target} at index ${i}!`,
          [],
          [],
          { 
            comparisons: totalComparisons, 
            position: i, 
            found: true, 
            foundIndex: i,
            currentIndex: i
          }
        );
        return;
      } else {
        this.addStep(
          arr,
          `${arr[i]} ≠ ${this.target}, continue searching...`,
          [],
          [],
          { comparisons: totalComparisons, currentIndex: i, position: -1 }
        );
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
    this.linearSearch();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'linear-search',
      name: 'Linear Search',
      category: 'Searching',
      description: 'A simple search algorithm that checks every element in a list sequentially until a match is found or the end is reached.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      difficulty: 'Easy' as const,
      code: {
        javascript: `// JavaScript Implementation
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    // Check if current element matches target
    if (arr[i] === target) {
      return i; // Return index if found
    }
  }
  return -1; // Return -1 if not found
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
const target = 22;
const result = linearSearch(numbers, target);

if (result !== -1) {
  console.log(\`Target \${target} found at index \${result}\`);
} else {
  console.log(\`Target \${target} not found\`);
}`,
        java: `// Java Implementation
public class LinearSearch {
    
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            // Check if current element matches target
            if (arr[i] == target) {
                return i; // Return index if found
            }
        }
        return -1; // Return -1 if not found
    }
    
    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        int target = 22;
        int result = linearSearch(numbers, target);
        
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
    this.array = [...array];
  }

  public setTarget(target: number) {
    this.target = target;
  }
}