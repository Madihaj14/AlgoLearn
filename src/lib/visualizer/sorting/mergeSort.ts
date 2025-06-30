import { VisualizationStep } from '../types';

export class MergeSortVisualizer {
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
        merges: metadata.merges || 0,
        recursionDepth: metadata.recursionDepth || 0,
        leftArray: metadata.leftArray,
        rightArray: metadata.rightArray,
        mergeRange: metadata.mergeRange
      },
      highlights,
      comparisons,
      swaps,
      completed: metadata.completed || [],
      metadata
    });
  }

  private merge(arr: number[], left: number, mid: number, right: number, totalComparisons: { value: number }, totalMerges: { value: number }, recursionDepth: number): void {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);

    this.addStep(
      arr,
      `Merging subarrays: [${leftArray.join(', ')}] and [${rightArray.join(', ')}]`,
      [],
      [],
      [],
      { 
        comparisons: totalComparisons.value, 
        merges: totalMerges.value, 
        recursionDepth,
        leftArray: [...leftArray],
        rightArray: [...rightArray],
        mergeRange: [left, right]
      }
    );

    let i = 0, j = 0, k = left;

    // Merge the two arrays
    while (i < leftArray.length && j < rightArray.length) {
      totalComparisons.value++;
      
      this.addStep(
        arr,
        `Comparing ${leftArray[i]} from left array with ${rightArray[j]} from right array`,
        [],
        [left + i, mid + 1 + j],
        [],
        { 
          comparisons: totalComparisons.value, 
          merges: totalMerges.value, 
          recursionDepth,
          leftArray: [...leftArray],
          rightArray: [...rightArray],
          mergeRange: [left, right],
          comparing: [leftArray[i], rightArray[j]]
        }
      );

      if (leftArray[i] <= rightArray[j]) {
        arr[k] = leftArray[i];
        
        this.addStep(
          arr,
          `${leftArray[i]} ≤ ${rightArray[j]}, placing ${leftArray[i]} at position ${k}`,
          [k],
          [],
          [],
          { 
            comparisons: totalComparisons.value, 
            merges: totalMerges.value, 
            recursionDepth,
            leftArray: [...leftArray],
            rightArray: [...rightArray],
            mergeRange: [left, right],
            placed: leftArray[i]
          }
        );
        
        i++;
      } else {
        arr[k] = rightArray[j];
        
        this.addStep(
          arr,
          `${rightArray[j]} < ${leftArray[i]}, placing ${rightArray[j]} at position ${k}`,
          [k],
          [],
          [],
          { 
            comparisons: totalComparisons.value, 
            merges: totalMerges.value, 
            recursionDepth,
            leftArray: [...leftArray],
            rightArray: [...rightArray],
            mergeRange: [left, right],
            placed: rightArray[j]
          }
        );
        
        j++;
      }
      k++;
    }

    // Copy remaining elements from left array
    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      
      this.addStep(
        arr,
        `Copying remaining element ${leftArray[i]} from left array to position ${k}`,
        [k],
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          merges: totalMerges.value, 
          recursionDepth,
          leftArray: [...leftArray],
          rightArray: [...rightArray],
          mergeRange: [left, right],
          remaining: 'left'
        }
      );
      
      i++;
      k++;
    }

    // Copy remaining elements from right array
    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      
      this.addStep(
        arr,
        `Copying remaining element ${rightArray[j]} from right array to position ${k}`,
        [k],
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          merges: totalMerges.value, 
          recursionDepth,
          leftArray: [...leftArray],
          rightArray: [...rightArray],
          mergeRange: [left, right],
          remaining: 'right'
        }
      );
      
      j++;
      k++;
    }

    totalMerges.value++;
    
    this.addStep(
      arr,
      `Merge complete. Subarray [${left}, ${right}] is now sorted: [${arr.slice(left, right + 1).join(', ')}]`,
      Array.from({length: right - left + 1}, (_, i) => left + i),
      [],
      [],
      { 
        comparisons: totalComparisons.value, 
        merges: totalMerges.value, 
        recursionDepth,
        mergeRange: [left, right],
        mergeComplete: true
      }
    );
  }

  private mergeSortHelper(arr: number[], left: number, right: number, totalComparisons: { value: number }, totalMerges: { value: number }, recursionDepth: number = 0): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      this.addStep(
        arr,
        `Recursion depth ${recursionDepth}: Dividing array [${left}, ${right}] at midpoint ${mid}`,
        [],
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          merges: totalMerges.value, 
          recursionDepth,
          dividing: [left, mid, right]
        }
      );

      // Recursively sort first and second halves
      this.addStep(
        arr,
        `Recursively sorting left half [${left}, ${mid}]`,
        Array.from({length: mid - left + 1}, (_, i) => left + i),
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          merges: totalMerges.value, 
          recursionDepth,
          sortingLeft: [left, mid]
        }
      );

      this.mergeSortHelper(arr, left, mid, totalComparisons, totalMerges, recursionDepth + 1);

      this.addStep(
        arr,
        `Recursively sorting right half [${mid + 1}, ${right}]`,
        Array.from({length: right - mid}, (_, i) => mid + 1 + i),
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          merges: totalMerges.value, 
          recursionDepth,
          sortingRight: [mid + 1, right]
        }
      );

      this.mergeSortHelper(arr, mid + 1, right, totalComparisons, totalMerges, recursionDepth + 1);

      // Merge the sorted halves
      this.merge(arr, left, mid, right, totalComparisons, totalMerges, recursionDepth);
    } else {
      this.addStep(
        arr,
        `Base case: Single element ${arr[left]} at position ${left} is already sorted`,
        [left],
        [],
        [],
        { 
          comparisons: totalComparisons.value, 
          merges: totalMerges.value, 
          recursionDepth,
          baseCase: true
        }
      );
    }
  }

  private mergeSort(): void {
    const arr = [...this.array];
    const n = arr.length;
    const totalComparisons = { value: 0 };
    const totalMerges = { value: 0 };

    this.addStep(
      arr,
      `Starting Merge Sort with array of ${n} elements`,
      [],
      [],
      [],
      { comparisons: 0, merges: 0, recursionDepth: 0 }
    );

    if (n <= 1) {
      this.addStep(
        arr,
        `Array has ${n} element(s), already sorted`,
        n === 1 ? [0] : [],
        [],
        [],
        { comparisons: 0, merges: 0, completed: n === 1 ? [0] : [], final: true }
      );
      return;
    }

    this.mergeSortHelper(arr, 0, n - 1, totalComparisons, totalMerges);

    this.addStep(
      arr,
      `Merge Sort complete! Array sorted in ${totalComparisons.value} comparisons and ${totalMerges.value} merge operations`,
      [],
      [],
      [],
      { 
        comparisons: totalComparisons.value, 
        merges: totalMerges.value, 
        completed: Array.from({length: n}, (_, i) => i), 
        final: true 
      }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.mergeSort();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'merge-sort',
      name: 'Merge Sort',
      category: 'Sorting',
      description: 'A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  // Divide the array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves and merge them
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  // Merge the two sorted arrays
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  // Add remaining elements
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }
  
  return result;
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
const sorted = mergeSort(numbers);
console.log("Sorted array:", sorted);`,
        java: `// Java Implementation
public class MergeSort {
    
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            // Find the middle point
            int mid = left + (right - left) / 2;
            
            // Recursively sort first and second halves
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            
            // Merge the sorted halves
            merge(arr, left, mid, right);
        }
    }
    
    private static void merge(int[] arr, int left, int mid, int right) {
        // Create temporary arrays for left and right subarrays
        int[] leftArray = new int[mid - left + 1];
        int[] rightArray = new int[right - mid];
        
        // Copy data to temporary arrays
        for (int i = 0; i < leftArray.length; i++) {
            leftArray[i] = arr[left + i];
        }
        for (int j = 0; j < rightArray.length; j++) {
            rightArray[j] = arr[mid + 1 + j];
        }
        
        // Merge the temporary arrays back into arr[left..right]
        int i = 0, j = 0, k = left;
        
        while (i < leftArray.length && j < rightArray.length) {
            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements
        while (i < leftArray.length) {
            arr[k] = leftArray[i];
            i++;
            k++;
        }
        
        while (j < rightArray.length) {
            arr[k] = rightArray[j];
            j++;
            k++;
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
        
        mergeSort(numbers, 0, numbers.length - 1);
        
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