import { VisualizationStep } from '../types';

export class InterpolationSearchVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private array: number[];
  private target: number;

  constructor(array: number[] = [10, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 33, 35, 42, 47], target: number = 22) {
    this.array = [...array].sort((a, b) => a - b); // Ensure array is sorted
    this.target = target;
  }

  private addStep(
    array: number[],
    description: string,
    highlights: number[] = [],
    comparisons: number[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        array: [...array],
        target: this.target,
        comparisons: metadata.comparisons || 0,
        position: metadata.position !== undefined ? metadata.position : -1,
        searchRange: metadata.searchRange,
        interpolatedIndex: metadata.interpolatedIndex,
        formula: metadata.formula
      },
      highlights,
      comparisons,
      swaps: [],
      completed: metadata.found ? [metadata.foundIndex] : [],
      metadata
    });
  }

  private interpolationSearch(): void {
    const arr = [...this.array];
    let totalComparisons = 0;
    let low = 0;
    let high = arr.length - 1;

    this.addStep(
      arr,
      `Starting Interpolation Search for target ${this.target} in uniformly distributed sorted array`,
      [],
      [],
      { 
        comparisons: totalComparisons, 
        position: -1, 
        searchRange: [low, high] 
      }
    );

    while (low <= high && this.target >= arr[low] && this.target <= arr[high]) {
      // If low and high are same
      if (low === high) {
        totalComparisons++;
        
        this.addStep(
          arr,
          `Single element remaining at index ${low}: ${arr[low]}`,
          [low],
          [low],
          { 
            comparisons: totalComparisons, 
            position: -1, 
            searchRange: [low, high],
            interpolatedIndex: low
          }
        );

        if (arr[low] === this.target) {
          this.addStep(
            arr,
            `Found target ${this.target} at index ${low}!`,
            [],
            [],
            { 
              comparisons: totalComparisons, 
              position: low, 
              found: true, 
              foundIndex: low
            }
          );
          return;
        } else {
          this.addStep(
            arr,
            `Target ${this.target} not found`,
            [],
            [],
            { comparisons: totalComparisons, position: -1, notFound: true }
          );
          return;
        }
      }

      // Calculate interpolated position
      const pos = low + Math.floor(
        ((this.target - arr[low]) / (arr[high] - arr[low])) * (high - low)
      );

      const formula = `pos = ${low} + floor(((${this.target} - ${arr[low]}) / (${arr[high]} - ${arr[low]})) * (${high} - ${low})) = ${pos}`;

      this.addStep(
        arr,
        `Interpolating position using formula: ${formula}`,
        [pos],
        [],
        { 
          comparisons: totalComparisons, 
          position: -1, 
          searchRange: [low, high],
          interpolatedIndex: pos,
          formula
        }
      );

      totalComparisons++;

      this.addStep(
        arr,
        `Checking interpolated position ${pos}: ${arr[pos]}`,
        [pos],
        [pos],
        { 
          comparisons: totalComparisons, 
          position: -1, 
          searchRange: [low, high],
          interpolatedIndex: pos
        }
      );

      if (arr[pos] === this.target) {
        this.addStep(
          arr,
          `Found target ${this.target} at index ${pos}!`,
          [],
          [],
          { 
            comparisons: totalComparisons, 
            position: pos, 
            found: true, 
            foundIndex: pos
          }
        );
        return;
      }

      if (arr[pos] < this.target) {
        this.addStep(
          arr,
          `${arr[pos]} < ${this.target}, search in right portion [${pos + 1}, ${high}]`,
          [],
          [],
          { 
            comparisons: totalComparisons, 
            position: -1,
            searchRange: [pos + 1, high],
            eliminated: [low, pos]
          }
        );
        low = pos + 1;
      } else {
        this.addStep(
          arr,
          `${arr[pos]} > ${this.target}, search in left portion [${low}, ${pos - 1}]`,
          [],
          [],
          { 
            comparisons: totalComparisons, 
            position: -1,
            searchRange: [low, pos - 1],
            eliminated: [pos, high]
          }
        );
        high = pos - 1;
      }
    }

    this.addStep(
      arr,
      `Target ${this.target} not found in the array`,
      [],
      [],
      { comparisons: totalComparisons, position: -1, notFound: true }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.interpolationSearch();
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'interpolation-search',
      name: 'Interpolation Search',
      category: 'Searching',
      description: 'An improved variant of binary search for uniformly distributed sorted arrays that estimates the position of the target.',
      timeComplexity: 'O(log log n)',
      spaceComplexity: 'O(1)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    // If low and high are same
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    
    // Calculate interpolated position
    const pos = low + Math.floor(
      ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
    );
    
    // If target is found
    if (arr[pos] === target) {
      return pos;
    }
    
    // If target is larger, search in right subarray
    if (arr[pos] < target) {
      low = pos + 1;
    }
    // If target is smaller, search in left subarray
    else {
      high = pos - 1;
    }
  }
  
  return -1; // Target not found
}

// Usage
const numbers = [10, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 33, 35, 42, 47];
const target = 22;
const result = interpolationSearch(numbers, target);

if (result !== -1) {
  console.log(\`Target \${target} found at index \${result}\`);
} else {
  console.log(\`Target \${target} not found\`);
}`,
        java: `// Java Implementation
public class InterpolationSearch {
    
    public static int interpolationSearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            // If low and high are same
            if (low == high) {
                if (arr[low] == target) return low;
                return -1;
            }
            
            // Calculate interpolated position
            int pos = low + (((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
            
            // If target is found
            if (arr[pos] == target) {
                return pos;
            }
            
            // If target is larger, search in right subarray
            if (arr[pos] < target) {
                low = pos + 1;
            }
            // If target is smaller, search in left subarray
            else {
                high = pos - 1;
            }
        }
        
        return -1; // Target not found
    }
    
    public static void main(String[] args) {
        int[] numbers = {10, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 33, 35, 42, 47};
        int target = 22;
        int result = interpolationSearch(numbers, target);
        
        if (result != -1) {
            System.out.println("Target " + target + " found at index " + result);
        } else {
            System.out.println("Target " + target + " not found");
        }
    }
}`
      }
    };
  }

  public setArray(array: number[]) {
    this.array = [...array].sort((a, b) => a - b);
  }

  public setTarget(target: number) {
    this.target = target;
  }
}