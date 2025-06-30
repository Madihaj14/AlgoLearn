import { VisualizationStep } from '../types';

export class InsertionSortVisualizer {
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
        shifts: metadata.shifts || 0,
        sortedPortion: metadata.sortedPortion || []
      },
      highlights,
      comparisons,
      swaps,
      completed: metadata.completed || [],
      metadata
    });
  }

  private insertionSort(): void {
    const arr = [...this.array];
    const n = arr.length;
    let totalComparisons = 0;
    let totalShifts = 0;
    const sortedPortion: number[] = [0]; // First element is considered sorted

    this.addStep(
      arr,
      `Starting Insertion Sort. First element ${arr[0]} is considered sorted`,
      [0],
      [],
      [],
      { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion] }
    );

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      this.addStep(
        arr,
        `Taking element ${key} at position ${i} to insert into sorted portion`,
        [i],
        [],
        [],
        { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion], key, keyPosition: i }
      );

      // Move elements that are greater than key one position ahead
      while (j >= 0) {
        totalComparisons++;
        
        this.addStep(
          arr,
          `Comparing key ${key} with element ${arr[j]} at position ${j}`,
          [i],
          [j],
          [],
          { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion], key, keyPosition: i }
        );

        if (arr[j] > key) {
          this.addStep(
            arr,
            `${arr[j]} > ${key}, shifting ${arr[j]} one position to the right`,
            [i],
            [],
            [j, j + 1],
            { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion], key, keyPosition: i }
          );

          arr[j + 1] = arr[j];
          totalShifts++;
          j--;

          this.addStep(
            arr,
            `Element ${arr[j + 2]} shifted to position ${j + 2}`,
            [i],
            [],
            [],
            { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion], key, keyPosition: i }
          );
        } else {
          this.addStep(
            arr,
            `${arr[j]} ≤ ${key}, found correct position for ${key}`,
            [i],
            [],
            [],
            { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion], key, keyPosition: i }
          );
          break;
        }
      }

      // Insert the key at its correct position
      arr[j + 1] = key;
      sortedPortion.push(i);

      this.addStep(
        arr,
        `Inserting ${key} at position ${j + 1}. Sorted portion now includes positions 0 to ${i}`,
        [j + 1],
        [],
        [],
        { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion], inserted: true }
      );
    }

    this.addStep(
      arr,
      `Insertion Sort complete! Array sorted in ${totalComparisons} comparisons and ${totalShifts} shifts`,
      [],
      [],
      [],
      { comparisons: totalComparisons, shifts: totalShifts, sortedPortion: [...sortedPortion], completed: Array.from({length: n}, (_, i) => i), final: true }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.insertionSort();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'insertion-sort',
      name: 'Insertion Sort',
      category: 'Sorting',
      description: 'A simple sorting algorithm that builds the final sorted array one item at a time by repeatedly inserting elements into their correct position.',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      difficulty: 'Easy' as const,
      code: {
        javascript: `// JavaScript Implementation
function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert key at its correct position
    arr[j + 1] = key;
  }
  
  return arr;
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
insertionSort(numbers);
console.log("Sorted array:", numbers);`,
        java: `// Java Implementation
public class InsertionSort {
    
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            
            // Move elements greater than key one position ahead
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            
            // Insert key at its correct position
            arr[j + 1] = key;
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
        
        insertionSort(numbers);
        
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