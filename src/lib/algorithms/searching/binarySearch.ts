import { Step } from '../sorting/bubbleSort';

export const binarySearch = (initialArray: number[], target: number): Step[] => {
  const steps: Step[] = [];
  // Make sure the array is sorted
  const array = [...initialArray].sort((a, b) => a - b);
  
  // Initial state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  let left = 0;
  let right = array.length - 1;
  const found: number[] = [];
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Show current search range
    steps.push({
      array: [...array],
      comparing: [mid],
      swapping: [],
      sorted: [...found]
    });
    
    if (array[mid] === target) {
      // Found target
      found.push(mid);
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [...found]
      });
      break;
    }
    
    if (array[mid] < target) {
      // Target is in the right half
      left = mid + 1;
      steps.push({
        array: [...array],
        comparing: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
        swapping: [],
        sorted: [...found]
      });
    } else {
      // Target is in the left half
      right = mid - 1;
      steps.push({
        array: [...array],
        comparing: Array.from({ length: mid - left }, (_, i) => left + i),
        swapping: [],
        sorted: [...found]
      });
    }
  }
  
  // If target not found
  if (found.length === 0) {
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: []
    });
  }
  
  return steps;
};