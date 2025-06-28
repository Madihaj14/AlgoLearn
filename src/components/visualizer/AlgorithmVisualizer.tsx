import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Code, Settings, X } from 'lucide-react';

interface VisualizerProps {
  algorithm: string;
  data?: number[];
  speed?: number;
  onClose: () => void;
}

const AlgorithmVisualizer: React.FC<VisualizerProps> = ({ 
  algorithm, 
  data = [12, 29, 38, 27, 4, 9, 19, 36, 24, 22],
  speed = 1,
  onClose 
}) => {
  const { theme } = useTheme();
  const [array, setArray] = useState<number[]>(data);
  const [sortingSteps, setSortingSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(speed);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [codeVisible, setCodeVisible] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxValue = Math.max(...array, 1) * 1.2;
  
  // Store animation tracking data
  const animationDataRef = useRef<{
    comparing: number[][];
    swapping: number[][];
    sorted: number[][];
  }>({
    comparing: [],
    swapping: [],
    sorted: []
  });

  // Initialize component
  useEffect(() => {
    setSortingSteps([array.slice()]);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [array]);
  
  // Generate sorting steps based on algorithm
  useEffect(() => {
    const generateSortingSteps = () => {
      let steps: number[][] = [array.slice()];
      let comparing: number[][] = [];
      let swapping: number[][] = [];
      let sorted: number[][] = [];
      
      if (algorithm === 'bubble-sort') {
        const bubbleSort = (arr: number[]) => {
          const n = arr.length;
          const result = arr.slice();
          const stepsList: number[][] = [result.slice()];
          const comparingList: number[][] = [];
          const swappingList: number[][] = [];
          const sortedList: number[][] = [];
          
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
              comparingList.push([j, j + 1]);
              
              if (result[j] > result[j + 1]) {
                swappingList.push([j, j + 1]);
                
                const temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
                
                stepsList.push(result.slice());
              } else {
                stepsList.push(result.slice());
              }
            }
            sortedList.push([n - i - 1]);
          }
          
          return { steps: stepsList, comparing: comparingList, swapping: swappingList, sorted: sortedList };
        };
        
        const { steps: bubbleSteps, comparing: bubbleComparing, swapping: bubbleSwapping, sorted: bubbleSorted } = bubbleSort(array);
        steps = bubbleSteps;
        comparing = bubbleComparing;
        swapping = bubbleSwapping;
        sorted = bubbleSorted;
      } else if (algorithm === 'quick-sort') {
        const quickSort = (arr: number[]) => {
          const result = arr.slice();
          const stepsList: number[][] = [result.slice()];
          const comparingList: number[][] = [];
          const swappingList: number[][] = [];
          const sortedList: number[][] = [];
          
          const partition = (arr: number[], low: number, high: number) => {
            const pivot = arr[high];
            let i = low - 1;
            
            for (let j = low; j < high; j++) {
              comparingList.push([j, high]);
              
              if (arr[j] < pivot) {
                i++;
                swappingList.push([i, j]);
                
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                
                stepsList.push(arr.slice());
              } else {
                stepsList.push(arr.slice());
              }
            }
            
            swappingList.push([i + 1, high]);
            
            const temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
            
            stepsList.push(arr.slice());
            
            return i + 1;
          };
          
          const quickSortRecursive = (arr: number[], low: number, high: number) => {
            if (low < high) {
              const pi = partition(arr, low, high);
              sortedList.push([pi]);
              quickSortRecursive(arr, low, pi - 1);
              quickSortRecursive(arr, pi + 1, high);
            } else if (low === high) {
              sortedList.push([low]);
            }
          };
          
          quickSortRecursive(result, 0, result.length - 1);
          
          return { steps: stepsList, comparing: comparingList, swapping: swappingList, sorted: sortedList };
        };
        
        const { steps: quickSteps, comparing: quickComparing, swapping: quickSwapping, sorted: quickSorted } = quickSort(array);
        steps = quickSteps;
        comparing = quickComparing;
        swapping = quickSwapping;
        sorted = quickSorted;
      } else if (algorithm === 'merge-sort') {
        const mergeSort = (arr: number[]) => {
          const result = arr.slice();
          const stepsList: number[][] = [result.slice()];
          const comparingList: number[][] = [];
          const swappingList: number[][] = [];
          const sortedList: number[][] = [];
          
          const mergeSortRecursive = (arr: number[], l: number, r: number) => {
            if (l < r) {
              const m = Math.floor((l + r) / 2);
              
              mergeSortRecursive(arr, l, m);
              mergeSortRecursive(arr, m + 1, r);
              
              const n1 = m - l + 1;
              const n2 = r - m;
              
              const L = new Array(n1);
              const R = new Array(n2);
              
              for (let i = 0; i < n1; i++) L[i] = arr[l + i];
              for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
              
              let i = 0, j = 0, k = l;
              
              while (i < n1 && j < n2) {
                comparingList.push([l + i, m + 1 + j]);
                
                if (L[i] <= R[j]) {
                  arr[k] = L[i];
                  i++;
                } else {
                  arr[k] = R[j];
                  j++;
                }
                
                swappingList.push([k]);
                stepsList.push(arr.slice());
                k++;
              }
              
              while (i < n1) {
                arr[k] = L[i];
                swappingList.push([k]);
                stepsList.push(arr.slice());
                i++;
                k++;
              }
              
              while (j < n2) {
                arr[k] = R[j];
                swappingList.push([k]);
                stepsList.push(arr.slice());
                j++;
                k++;
              }
              
              for (let i = l; i <= r; i++) {
                sortedList.push([i]);
              }
            }
          };
          
          mergeSortRecursive(result, 0, result.length - 1);
          
          return { steps: stepsList, comparing: comparingList, swapping: swappingList, sorted: sortedList };
        };
        
        const { steps: mergeSteps, comparing: mergeComparing, swapping: mergeSwapping, sorted: mergeSorted } = mergeSort(array);
        steps = mergeSteps;
        comparing = mergeComparing;
        swapping = mergeSwapping;
        sorted = mergeSorted;
      } else if (algorithm === 'binary-search') {
        const binarySearch = (arr: number[], target: number) => {
          const sortedArr = [...arr].sort((a, b) => a - b);
          const stepsList: number[][] = [sortedArr.slice()];
          const comparingList: number[][] = [];
          const swappingList: number[][] = [];
          const sortedList: number[][] = [];
          
          let left = 0;
          let right = sortedArr.length - 1;
          let found = false;
          
          while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            comparingList.push([mid]);
            stepsList.push(sortedArr.slice());
            
            if (sortedArr[mid] === target) {
              swappingList.push([mid]);
              found = true;
              break;
            } else if (sortedArr[mid] < target) {
              left = mid + 1;
            } else {
              right = mid - 1;
            }
          }
          
          if (found) {
            sortedList.push([comparingList[comparingList.length - 1][0]]);
          }
          
          return { steps: stepsList, comparing: comparingList, swapping: swappingList, sorted: sortedList };
        };
        
        const target = array[Math.floor(array.length / 2)];
        const { steps: binarySteps, comparing: binaryComparing, swapping: binarySwapping, sorted: binarySorted } = binarySearch(array, target);
        steps = binarySteps;
        comparing = binaryComparing;
        swapping = binarySwapping;
        sorted = binarySorted;
      }
      
      setSortingSteps(steps);
      setCurrentStep(0);
      animationDataRef.current = { comparing, swapping, sorted };
    };
    
    generateSortingSteps();
  }, [algorithm, array]);
  
  // Handle step change
  useEffect(() => {
    if (currentStep >= sortingSteps.length) return;
    
    const { comparing, swapping, sorted } = animationDataRef.current;
    
    if (currentStep < comparing.length) {
      setComparingIndices(comparing[currentStep] || []);
    } else {
      setComparingIndices([]);
    }
    
    if (currentStep < swapping.length) {
      setSwappingIndices(swapping[currentStep] || []);
    } else {
      setSwappingIndices([]);
    }
    
    const newSortedIndices: number[] = [];
    for (let i = 0; i <= currentStep && i < sorted.length; i++) {
      if (sorted[i]) {
        sorted[i].forEach(index => {
          if (!newSortedIndices.includes(index)) {
            newSortedIndices.push(index);
          }
        });
      }
    }
    setSortedIndices(newSortedIndices);
    
    if (currentStep < sortingSteps.length) {
      setArray(sortingSteps[currentStep]);
    }
  }, [currentStep, sortingSteps]);
  
  // Handle playback
  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < sortingSteps.length - 1) {
            return prev + 1;
          }
          setIsPlaying(false);
          return prev;
        });
      }, 1000 / playbackSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, sortingSteps.length]);
  
  // Generate new random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 5);
    setArray(newArray);
    setCurrentStep(0);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
  };
  
  // Reset visualization
  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  // Play/pause visualization
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Step forward
  const stepForward = () => {
    if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };
  
  // Step backward
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Get algorithm code
  const getAlgorithmCode = () => {
    switch (algorithm) {
      case 'bubble-sort':
        return `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`;
      case 'quick-sort':
        return `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find the partition index
    const pi = partition(arr, low, high);
    
    // Sort elements before and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than pivot
    if (arr[j] < pivot) {
      i++;
      // Swap elements
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Swap pivot to its final position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1;
}`;
      case 'merge-sort':
        return `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  // Split array into halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  return merge(
    mergeSort(left),
    mergeSort(right)
  );
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  // Compare elements from both arrays
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  // Add remaining elements
  return result.concat(left.slice(i)).concat(right.slice(j));
}`;
      case 'binary-search':
        return `function binarySearch(arr, target) {
  // Array must be sorted
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Find middle element
    const mid = Math.floor((left + right) / 2);
    
    // Check if target is at mid
    if (arr[mid] === target) {
      return mid;
    }
    
    // If target is greater, ignore left half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // If target is smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  // Target not found
  return -1;
}`;
      default:
        return 'Algorithm code not available';
    }
  };
  
  // Get algorithm title
  const getAlgorithmTitle = () => {
    switch (algorithm) {
      case 'bubble-sort':
        return 'Bubble Sort';
      case 'quick-sort':
        return 'Quick Sort';
      case 'merge-sort':
        return 'Merge Sort';
      case 'binary-search':
        return 'Binary Search';
      default:
        return algorithm;
    }
  };
  
  // Get algorithm description
  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'bubble-sort':
        return 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.';
      case 'quick-sort':
        return 'An efficient, divide-and-conquer sorting algorithm that works by selecting a pivot element and partitioning the array around the pivot.';
      case 'merge-sort':
        return 'An efficient, divide-and-conquer sorting algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.';
      case 'binary-search':
        return 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.';
      default:
        return '';
    }
  };
  
  // Get time complexity
  const getTimeComplexity = () => {
    switch (algorithm) {
      case 'bubble-sort':
        return 'O(n²)';
      case 'quick-sort':
        return 'O(n log n)';
      case 'merge-sort':
        return 'O(n log n)';
      case 'binary-search':
        return 'O(log n)';
      default:
        return '';
    }
  };
  
  // Get space complexity
  const getSpaceComplexity = () => {
    switch (algorithm) {
      case 'bubble-sort':
        return 'O(1)';
      case 'quick-sort':
        return 'O(log n)';
      case 'merge-sort':
        return 'O(n)';
      case 'binary-search':
        return 'O(1)';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={`w-full max-w-6xl max-h-[90vh] overflow-auto rounded-xl shadow-xl
                  ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-dark-primary/30' : 'border-light-primary/30'}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold">{getAlgorithmTitle()} Visualization</h2>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Algorithm Info */}
          <div className="mb-6">
            <p className="mb-2 opacity-80 text-sm sm:text-base">{getAlgorithmDescription()}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Time Complexity:</span>
                <span className={`text-sm px-2 py-1 rounded-full
                                ${theme === 'dark' ? 'bg-dark-primary/20 text-dark-primary' : 'bg-light-primary/20 text-light-primary'}`}>
                  {getTimeComplexity()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Space Complexity:</span>
                <span className={`text-sm px-2 py-1 rounded-full
                                ${theme === 'dark' ? 'bg-dark-primary/20 text-dark-primary' : 'bg-light-primary/20 text-light-primary'}`}>
                  {getSpaceComplexity()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Visualization Area */}
          <div className={`p-4 sm:p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
            <div className="flex items-end justify-center h-48 sm:h-64 gap-1 overflow-x-auto">
              {array.map((value, index) => (
                <motion.div
                  key={index}
                  className={`w-8 sm:w-12 rounded-t-lg flex items-end justify-center flex-shrink-0
                            ${sortedIndices.includes(index) 
                              ? 'bg-green-500' 
                              : comparingIndices.includes(index)
                                ? theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'
                                : swappingIndices.includes(index)
                                  ? 'bg-red-500'
                                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    transition: 'height 0.3s ease-in-out'
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Main Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={resetVisualization}
                className={`p-2 sm:p-3 rounded-full
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <RefreshCw size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={stepBackward}
                disabled={currentStep === 0}
                className={`p-2 sm:p-3 rounded-full
                          ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <SkipBack size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={togglePlay}
                className={`p-2 sm:p-3 rounded-full
                          ${theme === 'dark' 
                            ? 'bg-dark-primary text-dark-background' 
                            : 'bg-light-primary text-white'}`}
              >
                {isPlaying ? <Pause size={16} className="sm:w-5 sm:h-5" /> : <Play size={16} className="sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={stepForward}
                disabled={currentStep === sortingSteps.length - 1}
                className={`p-2 sm:p-3 rounded-full
                          ${currentStep === sortingSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <SkipForward size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={generateRandomArray}
                className={`p-2 sm:p-3 rounded-full
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <Settings size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            
            {/* Secondary Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Speed:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="w-20 sm:w-24"
                  />
                  <span className="text-sm ml-2">{playbackSpeed}x</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm mr-2">Step:</span>
                  <span className="text-sm">{currentStep} / {sortingSteps.length - 1}</span>
                </div>
              </div>
              
              <button
                onClick={() => setCodeVisible(!codeVisible)}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <Code size={16} />
                {codeVisible ? 'Hide Code' : 'Show Code'}
              </button>
            </div>
          </div>
          
          {/* Code View */}
          {codeVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-lg p-4 mb-6 overflow-auto max-h-60 sm:max-h-80
                        ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
            >
              <pre className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} whitespace-pre-wrap`}>
                <code>{getAlgorithmCode()}</code>
              </pre>
            </motion.div>
          )}
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'}`}></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-red-500"></div>
              <span>Swapping</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-green-500"></div>
              <span>Sorted</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlgorithmVisualizer;