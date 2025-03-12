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
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Add comparing step
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
      });
      
      if (array[j] > array[j + 1]) {
        // Add swapping step
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
        });
        
        // Perform swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        
        // Add post-swap step
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
        });
      }
    }
    
    // Add sorted element
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k)
    });
  }
  
  // Final sorted state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i)
  });
  
  return steps;
};