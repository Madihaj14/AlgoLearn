import { Step } from './bubbleSort';

export const selectionSort = (initialArray: number[]): Step[] => {
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
  
  for (let i = 0; i < array.length - 1; i++) {
    let minIdx = i;
    
    // Find minimum element
    for (let j = i + 1; j < array.length; j++) {
      // Show comparison
      steps.push({
        array: [...array],
        comparing: [minIdx, j],
        swapping: [],
        sorted: Array.from(sorted)
      });
      
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    
    // Swap if needed
    if (minIdx !== i) {
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i, minIdx],
        sorted: Array.from(sorted)
      });
      
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      
      // Show after swap
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from(sorted)
      });
    }
    
    sorted.add(i);
    
    // Show sorted element
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from(sorted)
    });
  }
  
  // Add last element to sorted
  sorted.add(array.length - 1);
  
  // Final state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from(sorted)
  });
  
  return steps;
};