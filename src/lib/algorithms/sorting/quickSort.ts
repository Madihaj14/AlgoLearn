import { Step } from './bubbleSort';

export const quickSort = (initialArray: number[]): Step[] => {
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
  
  const quickSortHelper = (arr: number[], low: number, high: number) => {
    if (low < high) {
      // Partition the array and get pivot index
      const pivotIndex = partition(arr, low, high);
      
      // Mark pivot as sorted
      sorted.push(pivotIndex);
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [...sorted]
      });
      
      // Recursively sort elements before and after partition
      quickSortHelper(arr, low, pivotIndex - 1);
      quickSortHelper(arr, pivotIndex + 1, high);
    } else if (low === high) {
      // Single element is already sorted
      sorted.push(low);
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [...sorted]
      });
    }
  };
  
  const partition = (arr: number[], low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;
    
    // Add pivot selection step
    steps.push({
      array: [...arr],
      comparing: [high],
      swapping: [],
      sorted: [...sorted]
    });
    
    for (let j = low; j < high; j++) {
      // Add comparison step
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: [],
        sorted: [...sorted]
      });
      
      if (arr[j] < pivot) {
        i++;
        
        // Add swap step
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [i, j],
          sorted: [...sorted]
        });
        
        [arr[i], arr[j]] = [arr[j], arr[i]];
        
        // Add post-swap step
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sorted: [...sorted]
        });
      }
    }
    
    // Swap pivot to its final position
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [...sorted]
    });
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    // Add post-swap step
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted]
    });
    
    return i + 1;
  };
  
  quickSortHelper(array, 0, array.length - 1);
  
  // Final state - ensure all elements are marked as sorted
  const allSorted = Array.from({ length: array.length }, (_, i) => i);
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: allSorted
  });
  
  return steps;
};