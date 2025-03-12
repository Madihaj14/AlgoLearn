import { Step } from '../sorting/bubbleSort';

export const binarySearch = (initialArray: number[], target: number): Step[] => {
  const steps: Step[] = [];
  const array = [...initialArray].sort((a, b) => a - b);
  
  // Initial state with sorted array
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  let left = 0;
  let right = array.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Show current range and middle element
    steps.push({
      array: [...array],
      comparing: [mid],
      swapping: [],
      sorted: []
    });
    
    if (array[mid] === target) {
      // Found target
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [mid]
      });
      break;
    }
    
    if (array[mid] < target) {
      // Show moving to right half
      steps.push({
        array: [...array],
        comparing: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
        swapping: [],
        sorted: []
      });
      left = mid + 1;
    } else {
      // Show moving to left half
      steps.push({
        array: [...array],
        comparing: Array.from({ length: mid - left }, (_, i) => left + i),
        swapping: [],
        sorted: []
      });
      right = mid - 1;
    }
  }
  
  return steps;
};