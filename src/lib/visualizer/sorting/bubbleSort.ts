import { VisualizationStep } from '../types';

export class BubbleSortVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private array: number[];

  constructor(array: number[] = [64, 34, 25, 12, 22, 11, 90]) {
    this.array = [...array];
  }

  private addStep(
    array: number[],
    description: string,
    highlights: number[] = [],
    comparisons: number[] = [],
    swaps: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        array: [...array],
        comparisons: metadata.comparisons || 0,
        swaps: metadata.swaps || 0,
        passes: metadata.passes || 0
      },
      highlights,
      comparisons,
      swaps,
      completed: metadata.completed || [],
      metadata
    });
  }

  private bubbleSort(): void {
    const arr = [...this.array];
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;
    const completed: number[] = [];
    let actualPasses = 0;

    this.addStep(
      arr,
      `Starting Bubble Sort with array of ${n} elements`,
      [],
      [],
      [],
      { comparisons: totalComparisons, swaps: totalSwaps, passes: 0 }
    );

    for (let i = 0; i < n - 1; i++) {
      actualPasses = i + 1;
      
      this.addStep(
        arr,
        `Pass ${i + 1}: Finding the largest element and bubbling it to position ${n - 1 - i}`,
        [],
        [],
        [],
        { comparisons: totalComparisons, swaps: totalSwaps, passes: i + 1 }
      );

      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        totalComparisons++;
        
        this.addStep(
          arr,
          `Comparing elements at positions ${j} and ${j + 1}: ${arr[j]} vs ${arr[j + 1]}`,
          [],
          [j, j + 1],
          [],
          { comparisons: totalComparisons, swaps: totalSwaps, passes: i + 1, completed }
        );

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          totalSwaps++;
          swapped = true;

          this.addStep(
            arr,
            `${arr[j + 1]} > ${arr[j]}, swapping positions ${j} and ${j + 1}`,
            [],
            [],
            [j, j + 1],
            { comparisons: totalComparisons, swaps: totalSwaps, passes: i + 1, completed }
          );
        } else {
          this.addStep(
            arr,
            `${arr[j]} ≤ ${arr[j + 1]}, no swap needed`,
            [],
            [],
            [],
            { comparisons: totalComparisons, swaps: totalSwaps, passes: i + 1, completed }
          );
        }
      }

      // Mark the last element as sorted
      completed.push(n - 1 - i);
      this.addStep(
        arr,
        `Pass ${i + 1} complete. Element ${arr[n - 1 - i]} is now in its final position`,
        [n - 1 - i],
        [],
        [],
        { comparisons: totalComparisons, swaps: totalSwaps, passes: i + 1, completed: [...completed] }
      );

      // Early termination if no swaps occurred
      if (!swapped) {
        // Mark remaining elements as sorted
        for (let k = 0; k < n - i - 1; k++) {
          if (!completed.includes(k)) {
            completed.push(k);
          }
        }
        this.addStep(
          arr,
          `No swaps in this pass - array is already sorted!`,
          [],
          [],
          [],
          { comparisons: totalComparisons, swaps: totalSwaps, passes: i + 1, completed: [...completed], earlyTermination: true }
        );
        break;
      }
    }

    // Mark first element as sorted if not already
    if (!completed.includes(0)) {
      completed.push(0);
    }

    this.addStep(
      arr,
      `Bubble Sort complete! Array sorted in ${totalComparisons} comparisons and ${totalSwaps} swaps`,
      [],
      [],
      [],
      { comparisons: totalComparisons, swaps: totalSwaps, passes: actualPasses, completed: [...completed], final: true }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.bubbleSort();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      category: 'Sorting',
      description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      difficulty: 'Easy' as const,
      code: {
        javascript: `// JavaScript Implementation
function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they are in wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred, array is sorted
    if (!swapped) {
      break;
    }
  }
  
  return arr;
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
bubbleSort(numbers);
console.log("Sorted array:", numbers);`,
        java: `// Java Implementation
public class BubbleSort {
    
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            
            // Last i elements are already in place
            for (int j = 0; j < n - i - 1; j++) {
                // Compare adjacent elements
                if (arr[j] > arr[j + 1]) {
                    // Swap if they are in wrong order
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            
            // If no swapping occurred, array is sorted
            if (!swapped) {
                break;
            }
        }
    }
    
    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("Original array:");
        printArray(numbers);
        
        bubbleSort(numbers);
        
        System.out.println("Sorted array:");
        printArray(numbers);
    }
}`
      }
    };
  }

  public setArray(array: number[]) {
    this.array = [...array];
  }
}