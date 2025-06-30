import { VisualizationStep } from '../types';

export class QuickSortVisualizer {
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
        recursionDepth: metadata.recursionDepth || 0,
        pivot: metadata.pivot,
        partitionRange: metadata.partitionRange
      },
      highlights,
      comparisons,
      swaps,
      completed: metadata.completed || [],
      metadata
    });
  }

  private partition(arr: number[], low: number, high: number, totalComparisons: { value: number }, totalSwaps: { value: number }, completed: number[], recursionDepth: number): number {
    const pivot = arr[high];
    
    this.addStep(
      arr,
      `Partitioning range [${low}, ${high}]. Choosing pivot: ${pivot} at position ${high}`,
      [high],
      [],
      [],
      { 
        comparisons: totalComparisons.value, 
        swaps: totalSwaps.value, 
        recursionDepth, 
        pivot, 
        partitionRange: [low, high],
        completed: [...completed]
      }
    );

    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
      totalComparisons.value++;
      
      this.addStep(
        arr,
        `Comparing element ${arr[j]} at position ${j} with pivot ${pivot}`,
        [high],
        [j],
        [],
        { 
          comparisons: totalComparisons.value, 
          swaps: totalSwaps.value, 
          recursionDepth, 
          pivot, 
          partitionRange: [low, high],
          completed: [...completed]
        }
      );

      if (arr[j] < pivot) {
        i++;
        
        if (i !== j) {
          this.addStep(
            arr,
            `${arr[j]} < ${pivot}, swapping ${arr[j]} at position ${j} with ${arr[i]} at position ${i}`,
            [high],
            [],
            [i, j],
            { 
              comparisons: totalComparisons.value, 
              swaps: totalSwaps.value, 
              recursionDepth, 
              pivot, 
              partitionRange: [low, high],
              completed: [...completed]
            }
          );

          [arr[i], arr[j]] = [arr[j], arr[i]];
          totalSwaps.value++;

          this.addStep(
            arr,
            `Swap complete. Elements ≤ pivot are now to the left of position ${i + 1}`,
            [high],
            [],
            [],
            { 
              comparisons: totalComparisons.value, 
              swaps: totalSwaps.value, 
              recursionDepth, 
              pivot, 
              partitionRange: [low, high],
              completed: [...completed]
            }
          );
        } else {
          this.addStep(
            arr,
            `${arr[j]} < ${pivot}, element is already in correct relative position`,
            [high],
            [],
            [],
            { 
              comparisons: totalComparisons.value, 
              swaps: totalSwaps.value, 
              recursionDepth, 
              pivot, 
              partitionRange: [low, high],
              completed: [...completed]
            }
          );
        }
      } else {
        this.addStep(
          arr,
          `${arr[j]} ≥ ${pivot}, element stays in place`,
          [high],
          [],
          [],
          { 
            comparisons: totalComparisons.value, 
            swaps: totalSwaps.value, 
            recursionDepth, 
            pivot, 
            partitionRange: [low, high],
            completed: [...completed]
          }
        );
      }
    }

    // Place pivot in its correct position
    const pivotPosition = i + 1;
    
    this.addStep(
      arr,
      `Placing pivot ${pivot} in its final position ${pivotPosition}`,
      [high],
      [],
      [pivotPosition, high],
      { 
        comparisons: totalComparisons.value, 
        swaps: totalSwaps.value, 
        recursionDepth, 
        pivot, 
        partitionRange: [low, high],
        completed: [...completed]
      }
    );

    [arr[pivotPosition], arr[high]] = [arr[high], arr[pivotPosition]];
    totalSwaps.value++;
    completed.push(pivotPosition);

    this.addStep(
      arr,
      `Partition complete. Pivot ${pivot} is in its final sorted position ${pivotPosition}`,
      [pivotPosition],
      [],
      [],
      { 
        comparisons: totalComparisons.value, 
        swaps: totalSwaps.value, 
        recursionDepth, 
        pivot, 
        partitionRange: [low, high],
        completed: [...completed],
        partitionComplete: true
      }
    );

    return pivotPosition;
  }

  private quickSortHelper(arr: number[], low: number, high: number, totalComparisons: { value: number }, totalSwaps: { value: number }, completed: number[], recursionDepth: number = 0): void {
    if (low < high) {
      this.addStep(
        arr,
        `Recursion depth ${recursionDepth}: Sorting range [${low}, ${high}]`,
        [],
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          swaps: totalSwaps.value, 
          recursionDepth, 
          partitionRange: [low, high],
          completed: [...completed]
        }
      );

      const pivotIndex = this.partition(arr, low, high, totalComparisons, totalSwaps, completed, recursionDepth);

      this.addStep(
        arr,
        `Recursively sorting left subarray [${low}, ${pivotIndex - 1}] and right subarray [${pivotIndex + 1}, ${high}]`,
        [pivotIndex],
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          swaps: totalSwaps.value, 
          recursionDepth, 
          completed: [...completed],
          recursiveCall: true
        }
      );

      // Recursively sort elements before and after partition
      this.quickSortHelper(arr, low, pivotIndex - 1, totalComparisons, totalSwaps, completed, recursionDepth + 1);
      this.quickSortHelper(arr, pivotIndex + 1, high, totalComparisons, totalSwaps, completed, recursionDepth + 1);
    } else if (low === high) {
      // Single element is already sorted
      completed.push(low);
      this.addStep(
        arr,
        `Single element ${arr[low]} at position ${low} is already sorted`,
        [low],
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          swaps: totalSwaps.value, 
          recursionDepth, 
          completed: [...completed],
          singleElement: true
        }
      );
    }
  }

  private quickSort(): void {
    const arr = [...this.array];
    const n = arr.length;
    const totalComparisons = { value: 0 };
    const totalSwaps = { value: 0 };
    const completed: number[] = [];

    this.addStep(
      arr,
      `Starting Quick Sort with array of ${n} elements`,
      [],
      [],
      [],
      { comparisons: 0, swaps: 0, recursionDepth: 0 }
    );

    if (n <= 1) {
      this.addStep(
        arr,
        `Array has ${n} element(s), already sorted`,
        n === 1 ? [0] : [],
        [],
        [],
        { comparisons: 0, swaps: 0, completed: n === 1 ? [0] : [], final: true }
      );
      return;
    }

    this.quickSortHelper(arr, 0, n - 1, totalComparisons, totalSwaps, completed);

    this.addStep(
      arr,
      `Quick Sort complete! Array sorted in ${totalComparisons.value} comparisons and ${totalSwaps.value} swaps`,
      [],
      [],
      [],
      { 
        comparisons: totalComparisons.value, 
        swaps: totalSwaps.value, 
        completed: Array.from({length: n}, (_, i) => i), 
        final: true 
      }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.quickSort();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'quick-sort',
      name: 'Quick Sort',
      category: 'Sorting',
      description: 'An efficient divide-and-conquer sorting algorithm that works by selecting a pivot element and partitioning the array around it.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  let i = low - 1; // Index of smaller element
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
  }
  
  // Place pivot in its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1; // Return pivot index
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
quickSort(numbers);
console.log("Sorted array:", numbers);`,
        java: `// Java Implementation
public class QuickSort {
    
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // Partition the array and get pivot index
            int pivotIndex = partition(arr, low, high);
            
            // Recursively sort elements before and after partition
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        // Choose the rightmost element as pivot
        int pivot = arr[high];
        int i = low - 1; // Index of smaller element
        
        for (int j = low; j < high; j++) {
            // If current element is smaller than or equal to pivot
            if (arr[j] <= pivot) {
                i++;
                // Swap elements
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        // Place pivot in its correct position
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1; // Return pivot index
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
        
        quickSort(numbers, 0, numbers.length - 1);
        
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