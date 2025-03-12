import { Step } from './bubbleSort';

export const insertionSort = (initialArray: number[]): Step[] => {
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
  
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;
    
    // Compare current element with previous elements
    steps.push({
      array: [...array],
      comparing: [i, j],
      swapping: [],
      sorted: Array.from(sorted)
    });
    
    while (j >= 0 && array[j] > key) {
      // Show comparison
      steps.push({
        array: [...array],
        comparing: [j + 1, j],
        swapping: [j + 1, j],
        sorted: Array.from(sorted)
      });
      
      // Move elements forward
      array[j + 1] = array[j];
      j--;
      
      // Show movement
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [j + 1],
        sorted: Array.from(sorted)
      });
    }
    
    array[j + 1] = key;
    sorted.add(i);
    
    // Show insertion
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from(sorted)
    });
  }
  
  // Final state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: array.length }, (_, i) => i)
  });
  
  return steps;
};