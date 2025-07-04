import { Step } from '../sorting/bubbleSort';

export const linearSearch = (initialArray: number[], target: number): Step[] => {
  const steps: Step[] = [];
  const array = [...initialArray];
  
  // Initial state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  for (let i = 0; i < array.length; i++) {
    // Show current element being checked
    steps.push({
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: []
    });
    
    if (array[i] === target) {
      // Found target
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [i]
      });
      break;
    }
  }
  
  return steps;
};