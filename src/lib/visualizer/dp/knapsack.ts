import { VisualizationStep } from '../types';

export class KnapsackVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private items: { weight: number; value: number }[];
  private capacity: number;
  private dpTable: number[][];

  constructor() {
    this.items = [
      { weight: 1, value: 1 },
      { weight: 2, value: 6 },
      { weight: 3, value: 10 },
      { weight: 4, value: 16 },
      { weight: 5, value: 20 }
    ];
    this.capacity = 10;
    this.dpTable = Array(this.items.length + 1).fill(null)
      .map(() => Array(this.capacity + 1).fill(0));
  }

  private addStep(
    description: string,
    currentItem: number,
    currentWeight: number,
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        items: [...this.items],
        capacity: this.capacity,
        dpTable: this.dpTable.map(row => [...row]),
        currentItem,
        currentWeight,
        maxValue: metadata.maxValue
      },
      highlights: [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private knapsack01(): void {
    // Initialize first row with zeros (base case: no items)
    this.addStep(
      `Initializing DP table with base case: no items (row 0) = 0 value`,
      0,
      0,
      { initializing: true }
    );

    // Fill the DP table
    for (let i = 1; i <= this.items.length; i++) {
      const item = this.items[i - 1];
      
      this.addStep(
        `Processing item ${i}: weight = ${item.weight}, value = ${item.value}`,
        i,
        0,
        { processingItem: true }
      );
      
      for (let w = 0; w <= this.capacity; w++) {
        this.addStep(
          `Considering capacity ${w} with item ${i}`,
          i,
          w,
          { considering: true }
        );
        
        // If current item's weight is more than the capacity, skip it
        if (item.weight > w) {
          this.dpTable[i][w] = this.dpTable[i - 1][w];
          
          this.addStep(
            `Item ${i} (weight ${item.weight}) is too heavy for capacity ${w}. Using previous value: ${this.dpTable[i][w]}`,
            i,
            w,
            { tooHeavy: true }
          );
        } else {
          // Max of (not taking the item, taking the item)
          const valueWithoutItem = this.dpTable[i - 1][w];
          const valueWithItem = this.dpTable[i - 1][w - item.weight] + item.value;
          
          this.addStep(
            `Comparing: Not taking item ${i} (${valueWithoutItem}) vs Taking item ${i} (${valueWithItem})`,
            i,
            w,
            { comparing: true, valueWithoutItem, valueWithItem }
          );
          
          this.dpTable[i][w] = Math.max(valueWithoutItem, valueWithItem);
          
          this.addStep(
            `Chose ${this.dpTable[i][w] === valueWithItem ? 'to take' : 'not to take'} item ${i}. Max value: ${this.dpTable[i][w]}`,
            i,
            w,
            { decision: this.dpTable[i][w] === valueWithItem ? 'take' : 'skip' }
          );
        }
      }
    }
    
    this.addStep(
      `Knapsack problem solved! Maximum value: ${this.dpTable[this.items.length][this.capacity]}`,
      this.items.length,
      this.capacity,
      { completed: [0], maxValue: this.dpTable[this.items.length][this.capacity] }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dpTable = Array(this.items.length + 1).fill(null)
      .map(() => Array(this.capacity + 1).fill(0));
    
    this.addStep(
      `Starting 0/1 Knapsack problem with ${this.items.length} items and capacity ${this.capacity}`,
      0,
      0,
      { starting: true }
    );
    
    this.knapsack01();
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'knapsack-01',
      name: '0/1 Knapsack Problem',
      category: 'Dynamic Programming',
      description: 'Optimize the selection of items with given weights and values to maximize value within a weight constraint.',
      timeComplexity: 'O(nW)',
      spaceComplexity: 'O(nW)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function knapsack01(items, capacity) {
  const n = items.length;
  
  // Create DP table
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    
    for (let w = 0; w <= capacity; w++) {
      // If current item's weight is more than capacity, skip it
      if (item.weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        // Max of (not taking the item, taking the item)
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - item.weight] + item.value
        );
      }
    }
  }
  
  // Backtrack to find selected items
  const selectedItems = [];
  let w = capacity;
  
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(i - 1);
      w -= items[i - 1].weight;
    }
  }
  
  return {
    maxValue: dp[n][capacity],
    selectedItems: selectedItems.reverse()
  };
}

// Usage
const items = [
  { weight: 1, value: 1 },
  { weight: 2, value: 6 },
  { weight: 3, value: 10 },
  { weight: 4, value: 16 },
  { weight: 5, value: 20 }
];
const capacity = 10;

const result = knapsack01(items, capacity);
console.log("Maximum value:", result.maxValue);
console.log("Selected items:", result.selectedItems);`,
        java: `// Java Implementation
import java.util.*;

public class Knapsack01 {
    
    static class Item {
        int weight;
        int value;
        
        Item(int weight, int value) {
            this.weight = weight;
            this.value = value;
        }
    }
    
    public static int knapsack01(Item[] items, int capacity) {
        int n = items.length;
        int[][] dp = new int[n + 1][capacity + 1];
        
        // Fill the DP table
        for (int i = 1; i <= n; i++) {
            Item item = items[i - 1];
            
            for (int w = 0; w <= capacity; w++) {
                // If current item's weight is more than capacity, skip it
                if (item.weight > w) {
                    dp[i][w] = dp[i - 1][w];
                } else {
                    // Max of (not taking the item, taking the item)
                    dp[i][w] = Math.max(
                        dp[i - 1][w],
                        dp[i - 1][w - item.weight] + item.value
                    );
                }
            }
        }
        
        // Backtrack to find selected items
        List<Integer> selectedItems = new ArrayList<>();
        int w = capacity;
        
        for (int i = n; i > 0; i--) {
            if (dp[i][w] != dp[i - 1][w]) {
                selectedItems.add(i - 1);
                w -= items[i - 1].weight;
            }
        }
        
        Collections.reverse(selectedItems);
        
        // Print selected items
        System.out.println("Selected items: " + selectedItems);
        
        return dp[n][capacity];
    }
    
    public static void main(String[] args) {
        Item[] items = {
            new Item(1, 1),
            new Item(2, 6),
            new Item(3, 10),
            new Item(4, 16),
            new Item(5, 20)
        };
        int capacity = 10;
        
        int maxValue = knapsack01(items, capacity);
        System.out.println("Maximum value: " + maxValue);
    }
}`
      }
    };
  }
}