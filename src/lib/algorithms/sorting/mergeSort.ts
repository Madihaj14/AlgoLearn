import { Step } from './bubbleSort';

export const mergeSort = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const array = [...initialArray];
  const sorted: number[] = [];
  
  // Initial state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  const mergeSortHelper = (arr: number[], start: number, end: number) => {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      
      // Recursively sort first and second halves
      mergeSortHelper(arr, start, mid);
      mergeSortHelper(arr, mid + 1, end);
      
      // Merge the sorted halves
      merge(arr, start, mid, end);
    } else if (start === end) {
      // Single element is already sorted
      if (!sorted.includes(start)) {
        sorted.push(start);
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [],
          sorted: [...sorted]
        });
      }
    }
  };
  
  const merge = (arr: number[], start: number, mid: number, end: number) => {
    const leftSize = mid - start + 1;
    const rightSize = end - mid;
    
    // Create temporary arrays
    const leftArray = new Array(leftSize);
    const rightArray = new Array(rightSize);
    
    // Copy data to temporary arrays
    for (let i = 0; i < leftSize; i++) {
      leftArray[i] = arr[start + i];
    }
    for (let j = 0; j < rightSize; j++) {
      rightArray[j] = arr[mid + 1 + j];
    }
    
    // Merge the temporary arrays back into arr[start..end]
    let i = 0; // Initial index of left subarray
    let j = 0; // Initial index of right subarray
    let k = start; // Initial index of merged subarray
    
    while (i < leftSize && j < rightSize) {
      // Add comparison step
      steps.push({
        array: [...array],
        comparing: [start + i, mid + 1 + j],
        swapping: [],
        sorted: [...sorted]
      });
      
      if (leftArray[i] <= rightArray[j]) {
        arr[k] = leftArray[i];
        i++;
      } else {
        arr[k] = rightArray[j];
        j++;
      }
      
      // Add placement step
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted]
      });
      
      k++;
    }
    
    // Copy remaining elements of leftArray, if any
    while (i < leftSize) {
      arr[k] = leftArray[i];
      
      // Add placement step
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted]
      });
      
      i++;
      k++;
    }
    
    // Copy remaining elements of rightArray, if any
    while (j < rightSize) {
      arr[k] = rightArray[j];
      
      // Add placement step
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted]
      });
      
      j++;
      k++;
    }
    
    // Mark the merged section as sorted
    for (let idx = start; idx <= end; idx++) {
      if (!sorted.includes(idx)) {
        sorted.push(idx);
      }
    }
    
    // Add sorted step
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted]
    });
  };
  
  mergeSortHelper(array, 0, array.length - 1);
  
  // Final state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: array.length }, (_, i) => i)
  });
  
  return steps;
};