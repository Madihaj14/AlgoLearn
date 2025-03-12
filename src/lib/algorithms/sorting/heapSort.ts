import { Step } from './bubbleSort';

export const heapSort = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const array = [...initialArray];
  const sorted = new Set<number>();
  
  // Initial state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from(sorted)
  });
  
  const heapify = (n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Compare with children
    steps.push({
      array: [...array],
      comparing: [largest, left, right].filter(x => x < n),
      swapping: [],
      sorted: Array.from(sorted)
    });
    
    if (left < n && array[left] > array[largest]) {
      largest = left;
    }
    
    if (right < n && array[right] > array[largest]) {
      largest = right;
    }
    
    if (largest !== i) {
      // Show swap
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i, largest],
        sorted: Array.from(sorted)
      });
      
      [array[i], array[largest]] = [array[largest], array[i]];
      
      // Show after swap
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from(sorted)
      });
      
      heapify(n, largest);
    }
  };
  
  // Build max heap
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    heapify(array.length, i);
  }
  
  // Extract elements from heap
  for (let i = array.length - 1; i > 0; i--) {
    // Show swap with root
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [0, i],
      sorted: Array.from(sorted)
    });
    
    [array[0], array[i]] = [array[i], array[0]];
    sorted.add(i);
    
    // Show after swap
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from(sorted)
    });
    
    heapify(i, 0);
  }
  
  // Add first element to sorted
  sorted.add(0);
  
  // Final state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from(sorted)
  });
  
  return steps;
};