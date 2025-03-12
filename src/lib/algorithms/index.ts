import { bubbleSort } from './sorting/bubbleSort';
import { quickSort } from './sorting/quickSort';
import { mergeSort } from './sorting/mergeSort';
import { insertionSort } from './sorting/insertionSort';
import { selectionSort } from './sorting/selectionSort';
import { heapSort } from './sorting/heapSort';
import { binarySearch } from './searching/binarySearch';
import { linearSearch } from './searching/linearSearch';

export interface Step {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

export type Algorithm = (array: number[], target?: number) => Step[];

export const algorithms: Record<string, Algorithm> = {
  'bubble-sort': bubbleSort,
  'quick-sort': quickSort,
  'merge-sort': mergeSort,
  'insertion-sort': insertionSort,
  'selection-sort': selectionSort,
  'heap-sort': heapSort,
  'binary-search': (array: number[]) => binarySearch(array, array[Math.floor(array.length / 2)]),
  'linear-search': (array: number[]) => linearSearch(array, array[Math.floor(array.length / 2)])
};

export const getAlgorithmTitle = (id: string): string => {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getAlgorithmDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    'bubble-sort': 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    'quick-sort': 'An efficient, in-place sorting algorithm that uses divide and conquer strategy to sort elements.',
    'merge-sort': 'A divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
    'insertion-sort': 'A simple sorting algorithm that builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.',
    'selection-sort': 'A sorting algorithm that divides the input into a sorted and unsorted region and repeatedly selects the smallest element from the unsorted region.',
    'heap-sort': 'A comparison-based sorting algorithm that uses a binary heap data structure to build a max-heap and repeatedly extract the maximum element.',
    'binary-search': 'An efficient algorithm for searching a sorted array by repeatedly dividing the search interval in half.',
    'linear-search': 'A simple search algorithm that checks each element in the list sequentially until a match is found.'
  };
  
  return descriptions[id] || '';
};

export const getAlgorithmCode = (id: string): string => {
  const codes: Record<string, string> = {
    'bubble-sort': `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`,
    'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    'merge-sort': `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    'insertion-sort': `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}`,
    'selection-sort': `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  
  return arr;
}`,
    'heap-sort': `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    'binary-search': `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    'linear-search': `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`
  };
  
  return codes[id] || '';
};