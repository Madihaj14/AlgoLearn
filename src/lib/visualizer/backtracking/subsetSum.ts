import { VisualizationStep } from '../types';

export class SubsetSumVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private numbers: number[];
  private target: number;

  constructor(numbers: number[] = [3, 34, 4, 12, 5, 2], target: number = 9) {
    this.numbers = numbers;
    this.target = target;
  }

  private addStep(
    currentSubset: number[],
    currentSum: number,
    index: number,
    description: string,
    metadata: any = {}
  ) {
    const subsetIndices = currentSubset.map(num => this.numbers.indexOf(num));
    
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        numbers: [...this.numbers],
        target: this.target,
        currentSubset: [...currentSubset],
        currentSum,
        currentIndex: index,
        subsetIndices,
        backtrackCount: metadata.backtrackCount || 0,
        found: metadata.found || false
      },
      highlights: index >= 0 && index < this.numbers.length ? [index] : [],
      comparisons: subsetIndices,
      swaps: [],
      completed: metadata.found ? [0] : [],
      metadata
    });
  }

  private subsetSum(
    index: number,
    currentSubset: number[],
    currentSum: number,
    backtrackCount = 0
  ): boolean {
    // Base case: if current sum equals target
    if (currentSum === this.target) {
      this.addStep(
        currentSubset,
        currentSum,
        -1,
        `✅ Solution found! Subset [${currentSubset.join(', ')}] sums to ${this.target}`,
        { backtrackCount, found: true }
      );
      return true;
    }

    // Base case: if we've processed all numbers or sum exceeds target
    if (index >= this.numbers.length || currentSum > this.target) {
      if (currentSum > this.target) {
        this.addStep(
          currentSubset,
          currentSum,
          index,
          `❌ Current sum ${currentSum} exceeds target ${this.target}. Backtracking...`,
          { backtrackCount: backtrackCount + 1, exceeded: true }
        );
      } else {
        this.addStep(
          currentSubset,
          currentSum,
          index,
          `❌ Reached end of array without finding solution. Backtracking...`,
          { backtrackCount: backtrackCount + 1 }
        );
      }
      return false;
    }

    const currentNumber = this.numbers[index];

    // Show current state
    this.addStep(
      currentSubset,
      currentSum,
      index,
      `🔍 Considering number ${currentNumber} at index ${index}. Current sum: ${currentSum}`,
      { backtrackCount, considering: true }
    );

    // Choice 1: Include current number
    this.addStep(
      currentSubset,
      currentSum,
      index,
      `➕ Including ${currentNumber} in subset. New sum would be: ${currentSum + currentNumber}`,
      { backtrackCount, including: true }
    );

    const newSubset = [...currentSubset, currentNumber];
    const newSum = currentSum + currentNumber;

    if (this.subsetSum(index + 1, newSubset, newSum, backtrackCount)) {
      return true;
    }

    // Choice 2: Exclude current number (backtrack)
    backtrackCount++;
    this.addStep(
      currentSubset,
      currentSum,
      index,
      `➖ Excluding ${currentNumber} from subset. Trying without it...`,
      { backtrackCount, excluding: true }
    );

    return this.subsetSum(index + 1, currentSubset, currentSum, backtrackCount);
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;

    this.addStep(
      [],
      0,
      -1,
      `🎯 Starting Subset Sum problem. Target: ${this.target}, Numbers: [${this.numbers.join(', ')}]`,
      { backtrackCount: 0 }
    );

    const found = this.subsetSum(0, [], 0);

    if (!found) {
      this.addStep(
        [],
        0,
        -1,
        `❌ No subset found that sums to ${this.target}`,
        { backtrackCount: 0, notFound: true }
      );
    }

    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'subset-sum',
      name: 'Subset Sum Problem',
      category: 'Backtracking',
      description: 'Find if there exists a subset of given numbers that sum to a target value using backtracking.',
      timeComplexity: 'O(2^n)',
      spaceComplexity: 'O(n)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function subsetSum(numbers, target, index = 0, currentSubset = [], currentSum = 0) {
  // Base case: found target sum
  if (currentSum === target) {
    console.log("Solution found:", currentSubset);
    return true;
  }
  
  // Base case: exceeded target or end of array
  if (index >= numbers.length || currentSum > target) {
    return false;
  }
  
  const currentNumber = numbers[index];
  
  // Choice 1: Include current number
  if (subsetSum(numbers, target, index + 1, 
                [...currentSubset, currentNumber], 
                currentSum + currentNumber)) {
    return true;
  }
  
  // Choice 2: Exclude current number
  return subsetSum(numbers, target, index + 1, 
                   currentSubset, currentSum);
}

// Usage
const numbers = [3, 34, 4, 12, 5, 2];
const target = 9;
subsetSum(numbers, target);`,
        java: `// Java Implementation
import java.util.*;

public class SubsetSum {
    
    public static boolean subsetSum(int[] numbers, int target, 
                                   int index, List<Integer> currentSubset, 
                                   int currentSum) {
        // Base case: found target sum
        if (currentSum == target) {
            System.out.println("Solution found: " + currentSubset);
            return true;
        }
        
        // Base case: exceeded target or end of array
        if (index >= numbers.length || currentSum > target) {
            return false;
        }
        
        int currentNumber = numbers[index];
        
        // Choice 1: Include current number
        currentSubset.add(currentNumber);
        if (subsetSum(numbers, target, index + 1, 
                     currentSubset, currentSum + currentNumber)) {
            return true;
        }
        
        // Choice 2: Exclude current number (backtrack)
        currentSubset.remove(currentSubset.size() - 1);
        return subsetSum(numbers, target, index + 1, 
                        currentSubset, currentSum);
    }
    
    public static void main(String[] args) {
        int[] numbers = {3, 34, 4, 12, 5, 2};
        int target = 9;
        List<Integer> subset = new ArrayList<>();
        
        boolean found = subsetSum(numbers, target, 0, subset, 0);
        if (!found) {
            System.out.println("No subset found that sums to " + target);
        }
    }
}`
      }
    };
  }

  public setNumbers(numbers: number[]) {
    this.numbers = numbers;
  }

  public setTarget(target: number) {
    this.target = target;
  }
}