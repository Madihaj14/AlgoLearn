export interface Step {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

export const bubbleSort = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const array = [...initialArray];
  const n = array.length;
  
  // Initial state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  // Sorted elements (from the end)
  const sortedIndices: number[] = [];
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Add comparing step
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedIndices]
      });
      
      if (array[j] > array[j + 1]) {
        // Add swapping step
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices]
        });
        
        // Perform swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        
        // Add post-swap step
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [],
          sorted: [...sortedIndices]
        });
      }
    }
    
    // Mark the last element as sorted
    sortedIndices.push(n - 1 - i);
    
    // Add sorted step
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices]
    });
    
    // If no swaps occurred, the array is sorted
    if (!swapped) {
      // Mark all remaining elements as sorted
      for (let k = 0; k < n - i - 1; k++) {
        if (!sortedIndices.includes(k)) {
          sortedIndices.push(k);
        }
      }
      
      // Add final step
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices]
      });
      
      break;
    }
  }
  
  // Final state
  if (!sortedIndices.includes(0)) {
    sortedIndices.push(0);
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices]
    });
  }
  
  return steps;
};