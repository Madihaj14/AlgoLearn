import { Step } from './bubbleSort';

export const mergeSort = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const array = [...initialArray];
  const sorted = new Set<number>();
  
  const merge = (left: number, middle: number, right: number) => {
    const n1 = middle - left + 1;
    const n2 = right - middle;
    
    const L = array.slice(left, middle + 1);
    const R = array.slice(middle + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      steps.push({
        array: [...array],
        comparing: [left + i, middle + 1 + j],
        swapping: [],
        sorted: Array.from(sorted)
      });
      
      if (L[i] <= R[j]) {
        array[k] = L[i];
        i++;
      } else {
        array[k] = R[j];
        j++;
      }
      
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: Array.from(sorted)
      });
      
      k++;
    }
    
    while (i < n1) {
      array[k] = L[i];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: Array.from(sorted)
      });
      i++;
      k++;
    }
    
    while (j < n2) {
      array[k] = R[j];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: Array.from(sorted)
      });
      j++;
      k++;
    }
    
    // Mark merged section as sorted
    for (let m = left; m <= right; m++) {
      sorted.add(m);
    }
    
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from(sorted)
    });
  };
  
  const mergeSortHelper = (left: number, right: number) => {
    if (left < right) {
      const middle = Math.floor((left + right) / 2);
      
      mergeSortHelper(left, middle);
      mergeSortHelper(middle + 1, right);
      
      merge(left, middle, right);
    }
  };
  
  mergeSortHelper(0, array.length - 1);
  
  return steps;
};