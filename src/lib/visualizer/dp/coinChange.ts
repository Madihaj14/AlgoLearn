import { VisualizationStep } from '../types';

export class CoinChangeVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private coins: number[];
  private amount: number;
  private dpTable: number[];

  constructor(coins: number[] = [1, 2, 5], amount: number = 11) {
    this.coins = coins;
    this.amount = amount;
    this.dpTable = new Array(amount + 1).fill(Infinity);
    this.dpTable[0] = 0; // Base case: 0 coins needed to make amount 0
  }

  private addStep(
    description: string,
    currentAmount: number,
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        coins: [...this.coins],
        amount: this.amount,
        dpTable: [...this.dpTable],
        currentAmount,
        minCoins: metadata.minCoins,
        currentCoin: metadata.currentCoin
      },
      highlights: [currentAmount],
      comparisons: metadata.comparing || [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private solveCoinChange(): void {
    this.addStep(
      `Initializing DP table: dp[0] = 0 (base case), all other values set to Infinity`,
      0,
      { initializing: true }
    );
    
    // Fill the DP table
    for (let amount = 1; amount <= this.amount; amount++) {
      this.addStep(
        `Processing amount ${amount}`,
        amount,
        { processing: true }
      );
      
      for (const coin of this.coins) {
        if (coin <= amount) {
          this.addStep(
            `Considering coin ${coin} for amount ${amount}`,
            amount,
            { currentCoin: coin, considering: true }
          );
          
          const subproblem = amount - coin;
          const potentialValue = this.dpTable[subproblem] + 1;
          
          this.addStep(
            `Checking if using coin ${coin} is better: dp[${amount}] = min(dp[${amount}] = ${this.dpTable[amount]}, dp[${subproblem}] + 1 = ${potentialValue})`,
            amount,
            { currentCoin: coin, comparing: true, subproblem, potentialValue }
          );
          
          if (this.dpTable[subproblem] !== Infinity && potentialValue < this.dpTable[amount]) {
            this.dpTable[amount] = potentialValue;
            
            this.addStep(
              `Updated dp[${amount}] = ${this.dpTable[amount]} by using coin ${coin}`,
              amount,
              { currentCoin: coin, updated: true }
            );
          } else {
            this.addStep(
              `No update needed: Either subproblem is unsolvable or current solution is better`,
              amount,
              { currentCoin: coin, noUpdate: true }
            );
          }
        }
      }
    }
    
    const result = this.dpTable[this.amount] === Infinity ? -1 : this.dpTable[this.amount];
    
    this.addStep(
      `Coin Change problem solved! Minimum coins needed: ${result === -1 ? 'Not possible' : result}`,
      this.amount,
      { completed: [0], minCoins: result }
    );
  }

  public generateSteps(): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    this.dpTable = new Array(this.amount + 1).fill(Infinity);
    this.dpTable[0] = 0;
    
    this.addStep(
      `Starting Coin Change problem with coins [${this.coins.join(', ')}] and amount ${this.amount}`,
      0,
      { starting: true }
    );
    
    this.solveCoinChange();
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'coin-change',
      name: 'Coin Change Problem',
      category: 'Dynamic Programming',
      description: 'Find the minimum number of coins needed to make a given amount using dynamic programming with optimal substructure.',
      timeComplexity: 'O(amount × coins)',
      spaceComplexity: 'O(amount)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
function coinChange(coins, amount) {
  // Create DP table
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 coins needed to make amount 0
  
  // Fill the DP table
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  // If dp[amount] is still Infinity, it means the amount cannot be made
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Find the actual coins used
function coinChangeWithCoins(coins, amount) {
  // Create DP table
  const dp = new Array(amount + 1).fill(Infinity);
  const coinUsed = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  
  // Fill the DP table
  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      const coin = coins[j];
      if (coin <= i && dp[i - coin] !== Infinity && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        coinUsed[i] = j;
      }
    }
  }
  
  // If amount cannot be made
  if (dp[amount] === Infinity) {
    return {
      minCoins: -1,
      coinsUsed: []
    };
  }
  
  // Backtrack to find the coins used
  const coinsUsed = [];
  let remaining = amount;
  
  while (remaining > 0) {
    const coinIndex = coinUsed[remaining];
    coinsUsed.push(coins[coinIndex]);
    remaining -= coins[coinIndex];
  }
  
  return {
    minCoins: dp[amount],
    coinsUsed
  };
}

// Usage
const coins = [1, 2, 5];
const amount = 11;

console.log("Minimum coins needed:", coinChange(coins, amount));

const result = coinChangeWithCoins(coins, amount);
console.log("Minimum coins:", result.minCoins);
console.log("Coins used:", result.coinsUsed);`,
        java: `// Java Implementation
import java.util.*;

public class CoinChange {
    
    public static int coinChange(int[] coins, int amount) {
        // Create DP table
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE - 1);
        dp[0] = 0; // Base case: 0 coins needed to make amount 0
        
        // Fill the DP table
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        // If dp[amount] is still MAX_VALUE-1, it means the amount cannot be made
        return dp[amount] == Integer.MAX_VALUE - 1 ? -1 : dp[amount];
    }
    
    // Find the actual coins used
    public static int[] coinChangeWithCoins(int[] coins, int amount) {
        // Create DP table
        int[] dp = new int[amount + 1];
        int[] coinUsed = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE - 1);
        Arrays.fill(coinUsed, -1);
        dp[0] = 0;
        
        // Fill the DP table
        for (int i = 1; i <= amount; i++) {
            for (int j = 0; j < coins.length; j++) {
                int coin = coins[j];
                if (coin <= i && dp[i - coin] != Integer.MAX_VALUE - 1 && 
                    dp[i - coin] + 1 < dp[i]) {
                    dp[i] = dp[i - coin] + 1;
                    coinUsed[i] = j;
                }
            }
        }
        
        // If amount cannot be made
        if (dp[amount] == Integer.MAX_VALUE - 1) {
            return new int[0];
        }
        
        // Backtrack to find the coins used
        List<Integer> coinsUsed = new ArrayList<>();
        int remaining = amount;
        
        while (remaining > 0) {
            int coinIndex = coinUsed[remaining];
            coinsUsed.add(coins[coinIndex]);
            remaining -= coins[coinIndex];
        }
        
        // Convert list to array
        int[] result = new int[coinsUsed.size()];
        for (int i = 0; i < coinsUsed.size(); i++) {
            result[i] = coinsUsed.get(i);
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        int amount = 11;
        
        System.out.println("Minimum coins needed: " + coinChange(coins, amount));
        
        int[] coinsUsed = coinChangeWithCoins(coins, amount);
        System.out.print("Coins used: ");
        for (int coin : coinsUsed) {
            System.out.print(coin + " ");
        }
    }
}`
      }
    };
  }
}