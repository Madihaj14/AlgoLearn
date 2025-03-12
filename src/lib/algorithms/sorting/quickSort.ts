import { Step } from './bubbleSort';

export const quickSort = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const array = [...initialArray];
  const sorted = new Set<number>();
  
  const partition = (low: number, high: number): number => {
    const pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      // Add comparing step
      steps.push({
        array: [...array],
        comparing: [j, high],
        swapping: [],
        sorted: Array.from(sorted)
      });
      
      if (array[j] < pivot) {
        i++;
        // Add swapping step
        steps.push({
          array: [...array],
          comparing: [j, high],
          swapping: [i, j],
          sorted: Array.from(sorted)
        });
        
        [array[i], array[j]] = [array[j], array[i]];
        
        // Add post-swap step
        steps.push({
          array: [...array],
          comparing: [j, high],
          swapping: [],
          sorted: Array.from(sorted)
        });
      }
    }
    
    // Swap pivot
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [i + 1, high],
      sorted: Array.from(sorted)
    });
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    
    sorted.add(i + 1);
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from(sorted)
    });
    
    return i + 1;
  };
  
  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sorted.add(low);
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from(sorted)
      });
    }
  };
  
  quickSortHelper(0, array.length - 1);
  
  return steps;
};