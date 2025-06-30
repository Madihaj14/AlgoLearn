import { VisualizationStep } from '../types';

export class SelectionSortVisualizer {
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
        currentMin: metadata.currentMin,
        minIndex: metadata.minIndex
      },
      highlights,
      comparisons,
      swaps,
      completed: metadata.completed || [],
      metadata
    });
  }

  private selectionSort(): void {
    const arr = [...this.array];
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;
    const completed: number[] = [];

    this.addStep(
      arr,
      `Starting Selection Sort with array of ${n} elements`,
      [],
      [],
      [],
      { comparisons: totalComparisons, swaps: totalSwaps }
    );

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      let currentMin = arr[i];

      this.addStep(
        arr,
        `Pass ${i + 1}: Finding minimum element in unsorted portion (positions ${i} to ${n - 1})`,
        [i],
        [],
        [],
        { comparisons: totalComparisons, swaps: totalSwaps, currentMin, minIndex, completed: [...completed] }
      );

      this.addStep(
        arr,
        `Assuming element ${arr[i]} at position ${i} is the minimum`,
        [i],
        [],
        [],
        { comparisons: totalComparisons, swaps: totalSwaps, currentMin, minIndex, completed: [...completed] }
      );

      // Find the minimum element in the remaining unsorted array
      for (let j = i + 1; j < n; j++) {
        totalComparisons++;

        this.addStep(
          arr,
          `Comparing current minimum ${currentMin} with element ${arr[j]} at position ${j}`,
          [minIndex],
          [j],
          [],
          { comparisons: totalComparisons, swaps: totalSwaps, currentMin, minIndex, completed: [...completed] }
        );

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
          currentMin = arr[j];

          this.addStep(
            arr,
            `Found new minimum: ${arr[j]} at position ${j}`,
            [j],
            [],
            [],
            { comparisons: totalComparisons, swaps: totalSwaps, currentMin, minIndex, completed: [...completed], newMin: true }
          );
        } else {
          this.addStep(
            arr,
            `${arr[j]} ≥ ${currentMin}, current minimum unchanged`,
            [minIndex],
            [],
            [],
            { comparisons: totalComparisons, swaps: totalSwaps, currentMin, minIndex, completed: [...completed] }
          );
        }
      }

      // Swap the found minimum element with the first element
      if (minIndex !== i) {
        this.addStep(
          arr,
          `Swapping minimum element ${arr[minIndex]} at position ${minIndex} with element ${arr[i]} at position ${i}`,
          [],
          [],
          [i, minIndex],
          { comparisons: totalComparisons, swaps: totalSwaps, currentMin, minIndex, completed: [...completed] }
        );

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        totalSwaps++;

        this.addStep(
          arr,
          `Swap complete. Element ${arr[i]} is now in its final sorted position`,
          [i],
          [],
          [],
          { comparisons: totalComparisons, swaps: totalSwaps, currentMin: arr[i], minIndex: i, completed: [...completed] }
        );
      } else {
        this.addStep(
          arr,
          `Minimum element ${arr[i]} is already in correct position ${i}`,
          [i],
          [],
          [],
          { comparisons: totalComparisons, swaps: totalSwaps, currentMin, minIndex, completed: [...completed], noSwapNeeded: true }
        );
      }

      completed.push(i);
      this.addStep(
        arr,
        `Position ${i} is now sorted. Sorted portion: positions 0 to ${i}`,
        [],
        [],
        [],
        { comparisons: totalComparisons, swaps: totalSwaps, completed: [...completed], passComplete: true }
      );
    }

    // Last element is automatically sorted
    completed.push(n - 1);
    this.addStep(
      arr,
      `Selection Sort complete! Array sorted in ${totalComparisons} comparisons and ${totalSwaps} swaps`,
      [],
      [],
      [],
      { comparisons: totalComparisons, swaps: totalSwaps, completed: [...completed], final: true }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.selectionSort();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'selection-sort',
      name: 'Selection Sort',
      category: 'Sorting',
      description: 'A sorting algorithm that divides the input into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      difficulty: 'Easy' as const,
      code: {
        javascript: `// JavaScript Implementation
function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in remaining unsorted array
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
selectionSort(numbers);
console.log("Sorted array:", numbers);`,
        java: `// Java Implementation
public class SelectionSort {
    
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            // Find the minimum element in remaining unsorted array
            int minIndex = i;
            
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            
            // Swap the found minimum element with the first element
            if (minIndex != i) {
                int temp = arr[minIndex];
                arr[minIndex] = arr[i];
                arr[i] = temp;
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
        
        selectionSort(numbers);
        
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