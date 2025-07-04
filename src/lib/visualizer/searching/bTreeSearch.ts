import { VisualizationStep } from '../types';

export class BTreeSearchVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private tree: BTreeNode;
  private order: number;

  constructor(order: number = 3) {
    this.order = order;
    this.tree = new BTreeNode(true);
    
    // Insert sample data
    const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    for (const value of values) {
      this.insertKey(value);
    }
  }

  private addStep(
    description: string,
    currentNode: number[] = [],
    searchPath: number[][] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        tree: this.serializeTree(),
        currentNode,
        searchPath,
        target: metadata.target,
        found: metadata.found,
        inserted: metadata.inserted,
        split: metadata.split
      },
      highlights: metadata.target !== undefined ? [metadata.target] : [],
      comparisons: metadata.comparing || [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private serializeTree() {
    const nodes: { id: string; keys: number[]; isLeaf: boolean }[] = [];
    const edges: { source: string; target: string }[] = [];
    
    // Perform a level-order traversal to serialize the tree
    const queue: [BTreeNode, string, number][] = [[this.tree, 'root', 0]];
    let nodeCounter = 0;
    
    while (queue.length > 0) {
      const [node, id, level] = queue.shift()!;
      
      nodes.push({
        id,
        keys: [...node.keys],
        isLeaf: node.isLeaf
      });
      
      if (!node.isLeaf) {
        for (let i = 0; i <= node.keys.length; i++) {
          const childId = `node-${++nodeCounter}`;
          edges.push({
            source: id,
            target: childId
          });
          
          queue.push([node.children[i], childId, level + 1]);
        }
      }
    }
    
    return { nodes, edges, order: this.order };
  }

  private search(key: number): void {
    this.addStep(
      `Starting search for key ${key} in the B-Tree of order ${this.order}`,
      [],
      [],
      { target: key, starting: true }
    );
    
    const searchResult = this.searchKey(this.tree, key, []);
    
    if (searchResult.found) {
      this.addStep(
        `Found key ${key} in the B-Tree!`,
        searchResult.node.keys,
        searchResult.path,
        { target: key, found: true, completed: [0] }
      );
    } else {
      this.addStep(
        `Key ${key} not found in the B-Tree.`,
        searchResult.node.keys,
        searchResult.path,
        { target: key, notFound: true }
      );
    }
  }

  private searchKey(node: BTreeNode, key: number, path: number[][]): { found: boolean; node: BTreeNode; path: number[][] } {
    let i = 0;
    
    // Find the first key greater than or equal to k
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }
    
    const currentPath = [...path, node.keys];
    
    this.addStep(
      `Searching in node with keys [${node.keys.join(', ')}]`,
      node.keys,
      currentPath,
      { target: key, comparing: [i < node.keys.length ? node.keys[i] : null] }
    );
    
    // If the key is found
    if (i < node.keys.length && key === node.keys[i]) {
      return { found: true, node, path: currentPath };
    }
    
    // If this is a leaf node and key not found
    if (node.isLeaf) {
      return { found: false, node, path: currentPath };
    }
    
    // Recur to the appropriate child
    this.addStep(
      `Key ${key} not found in current node. Moving to child node.`,
      node.keys,
      currentPath,
      { target: key, movingToChild: true }
    );
    
    return this.searchKey(node.children[i], key, currentPath);
  }

  private insertKey(key: number): void {
    this.addStep(
      `Starting insertion of key ${key} into the B-Tree`,
      [],
      [],
      { target: key, starting: true }
    );
    
    // If root is full, split it
    if (this.tree.keys.length === 2 * this.order - 1) {
      const newRoot = new BTreeNode(false);
      newRoot.children[0] = this.tree;
      this.splitChild(newRoot, 0);
      this.tree = newRoot;
      
      this.addStep(
        `Root node is full. Creating new root and splitting.`,
        newRoot.keys,
        [],
        { target: key, split: true, newRoot: true }
      );
    }
    
    this.insertNonFull(this.tree, key, []);
  }

  private insertNonFull(node: BTreeNode, key: number, path: number[][]): void {
    let i = node.keys.length - 1;
    
    const currentPath = [...path, node.keys];
    
    this.addStep(
      `Inserting key ${key} into node with keys [${node.keys.join(', ')}]`,
      node.keys,
      currentPath,
      { target: key }
    );
    
    // If this is a leaf node
    if (node.isLeaf) {
      // Find position to insert
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      
      // Insert the key
      node.keys[i + 1] = key;
      
      this.addStep(
        `Inserted key ${key} into leaf node. New keys: [${node.keys.join(', ')}]`,
        node.keys,
        currentPath,
        { target: key, inserted: true, completed: [0] }
      );
    } else {
      // Find the child which is going to have the new key
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;
      
      this.addStep(
        `Key ${key} will be inserted in child ${i}`,
        node.keys,
        currentPath,
        { target: key, childIndex: i }
      );
      
      // If the child is full, split it
      if (node.children[i].keys.length === 2 * this.order - 1) {
        this.splitChild(node, i);
        
        this.addStep(
          `Child node is full. Splitting child ${i}.`,
          node.keys,
          currentPath,
          { target: key, split: true, childIndex: i }
        );
        
        // After split, the middle key of children[i] goes up and
        // children[i] is split into two. See which of the two
        // is going to have the new key
        if (key > node.keys[i]) {
          i++;
        }
      }
      
      this.insertNonFull(node.children[i], key, currentPath);
    }
  }

  private splitChild(parent: BTreeNode, index: number): void {
    const child = parent.children[index];
    const newChild = new BTreeNode(child.isLeaf);
    
    // Middle key that will move up to the parent
    const midKey = child.keys[this.order - 1];
    
    // Copy the second half of keys to the new child
    for (let j = 0; j < this.order - 1; j++) {
      newChild.keys[j] = child.keys[j + this.order];
    }
    
    // If child is not a leaf, copy the second half of children too
    if (!child.isLeaf) {
      for (let j = 0; j < this.order; j++) {
        newChild.children[j] = child.children[j + this.order];
      }
    }
    
    // Reduce the number of keys in the original child
    child.keys.length = this.order - 1;
    
    // Create space for the new child in the parent
    for (let j = parent.keys.length; j >= index; j--) {
      parent.children[j + 1] = parent.children[j];
    }
    
    // Link the new child to the parent
    parent.children[index + 1] = newChild;
    
    // Move the middle key to the parent
    for (let j = parent.keys.length - 1; j >= index; j--) {
      parent.keys[j + 1] = parent.keys[j];
    }
    parent.keys[index] = midKey;
  }

  public generateSteps(operation: 'search' | 'insert', value: number = 55): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    
    switch (operation) {
      case 'search':
        this.search(value);
        break;
      case 'insert':
        this.insertKey(value);
        break;
    }
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'b-tree-search',
      name: 'B-Tree Search',
      category: 'Searching',
      description: 'A self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(n)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
class BTreeNode {
  constructor(isLeaf = false) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}

class BTree {
  constructor(order = 3) {
    this.root = new BTreeNode(true);
    this.order = order; // Minimum degree
  }
  
  // Search a key in the B-Tree
  search(key) {
    return this._search(this.root, key);
  }
  
  _search(node, key) {
    let i = 0;
    
    // Find the first key greater than or equal to k
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }
    
    // If the key is found
    if (i < node.keys.length && key === node.keys[i]) {
      return { found: true, node, index: i };
    }
    
    // If this is a leaf node and key not found
    if (node.isLeaf) {
      return { found: false };
    }
    
    // Recur to the appropriate child
    return this._search(node.children[i], key);
  }
  
  // Insert a key into the B-Tree
  insert(key) {
    // If root is full, split it
    if (this.root.keys.length === 2 * this.order - 1) {
      const newRoot = new BTreeNode(false);
      newRoot.children[0] = this.root;
      this._splitChild(newRoot, 0);
      this.root = newRoot;
    }
    
    this._insertNonFull(this.root, key);
  }
  
  _insertNonFull(node, key) {
    let i = node.keys.length - 1;
    
    // If this is a leaf node
    if (node.isLeaf) {
      // Find position to insert
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      
      // Insert the key
      node.keys[i + 1] = key;
    } else {
      // Find the child which is going to have the new key
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;
      
      // If the child is full, split it
      if (node.children[i].keys.length === 2 * this.order - 1) {
        this._splitChild(node, i);
        
        // After split, the middle key of children[i] goes up and
        // children[i] is split into two. See which of the two
        // is going to have the new key
        if (key > node.keys[i]) {
          i++;
        }
      }
      
      this._insertNonFull(node.children[i], key);
    }
  }
  
  _splitChild(parent, index) {
    const child = parent.children[index];
    const newChild = new BTreeNode(child.isLeaf);
    
    // Middle key that will move up to the parent
    const midKey = child.keys[this.order - 1];
    
    // Copy the second half of keys to the new child
    for (let j = 0; j < this.order - 1; j++) {
      newChild.keys[j] = child.keys[j + this.order];
    }
    
    // If child is not a leaf, copy the second half of children too
    if (!child.isLeaf) {
      for (let j = 0; j < this.order; j++) {
        newChild.children[j] = child.children[j + this.order];
      }
    }
    
    // Reduce the number of keys in the original child
    child.keys.length = this.order - 1;
    
    // Create space for the new child in the parent
    for (let j = parent.keys.length; j >= index; j--) {
      parent.children[j + 1] = parent.children[j];
    }
    
    // Link the new child to the parent
    parent.children[index + 1] = newChild;
    
    // Move the middle key to the parent
    for (let j = parent.keys.length - 1; j >= index; j--) {
      parent.keys[j + 1] = parent.keys[j];
    }
    parent.keys[index] = midKey;
  }
  
  // Print the B-Tree level by level
  print() {
    if (!this.root) return "Empty tree";
    
    const result = [];
    const queue = [{ node: this.root, level: 0 }];
    let currentLevel = 0;
    let currentLevelNodes = [];
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (level > currentLevel) {
        result.push(currentLevelNodes.join('  '));
        currentLevelNodes = [];
        currentLevel = level;
      }
      
      currentLevelNodes.push(\`[\${node.keys.join(',')}]\`);
      
      if (!node.isLeaf) {
        for (let i = 0; i <= node.keys.length; i++) {
          queue.push({ node: node.children[i], level: level + 1 });
        }
      }
    }
    
    if (currentLevelNodes.length > 0) {
      result.push(currentLevelNodes.join('  '));
    }
    
    return result.join('\\n');
  }
}

// Usage
const btree = new BTree(3); // Order 3
const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

for (const value of values) {
  btree.insert(value);
  console.log(\`After inserting \${value}:\\n\${btree.print()}\\n\`);
}

const searchKey = 50;
const result = btree.search(searchKey);
console.log(\`Search for \${searchKey}: \${result.found ? 'Found' : 'Not found'}\`);`,
        java: `// Java Implementation
import java.util.*;

class BTreeNode {
    int[] keys;
    BTreeNode[] children;
    int keyCount;
    boolean isLeaf;
    int order;
    
    public BTreeNode(int order, boolean isLeaf) {
        this.order = order;
        this.isLeaf = isLeaf;
        this.keys = new int[2 * order - 1];
        this.children = new BTreeNode[2 * order];
        this.keyCount = 0;
    }
}

public class BTree {
    private BTreeNode root;
    private int order; // Minimum degree
    
    public BTree(int order) {
        this.root = new BTreeNode(order, true);
        this.order = order;
    }
    
    // Search a key in the B-Tree
    public boolean search(int key) {
        return search(root, key);
    }
    
    private boolean search(BTreeNode node, int key) {
        int i = 0;
        
        // Find the first key greater than or equal to k
        while (i < node.keyCount && key > node.keys[i]) {
            i++;
        }
        
        // If the key is found
        if (i < node.keyCount && key == node.keys[i]) {
            return true;
        }
        
        // If this is a leaf node and key not found
        if (node.isLeaf) {
            return false;
        }
        
        // Recur to the appropriate child
        return search(node.children[i], key);
    }
    
    // Insert a key into the B-Tree
    public void insert(int key) {
        BTreeNode root = this.root;
        
        // If root is full, split it
        if (root.keyCount == 2 * order - 1) {
            BTreeNode newRoot = new BTreeNode(order, false);
            newRoot.children[0] = root;
            splitChild(newRoot, 0);
            this.root = newRoot;
        }
        
        insertNonFull(this.root, key);
    }
    
    private void insertNonFull(BTreeNode node, int key) {
        int i = node.keyCount - 1;
        
        // If this is a leaf node
        if (node.isLeaf) {
            // Find position to insert
            while (i >= 0 && key < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            
            // Insert the key
            node.keys[i + 1] = key;
            node.keyCount++;
        } else {
            // Find the child which is going to have the new key
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            i++;
            
            // If the child is full, split it
            if (node.children[i].keyCount == 2 * order - 1) {
                splitChild(node, i);
                
                // After split, the middle key of children[i] goes up and
                // children[i] is split into two. See which of the two
                // is going to have the new key
                if (key > node.keys[i]) {
                    i++;
                }
            }
            
            insertNonFull(node.children[i], key);
        }
    }
    
    private void splitChild(BTreeNode parent, int index) {
        BTreeNode child = parent.children[index];
        BTreeNode newChild = new BTreeNode(order, child.isLeaf);
        newChild.keyCount = order - 1;
        
        // Copy the second half of keys to the new child
        for (int j = 0; j < order - 1; j++) {
            newChild.keys[j] = child.keys[j + order];
        }
        
        // If child is not a leaf, copy the second half of children too
        if (!child.isLeaf) {
            for (int j = 0; j < order; j++) {
                newChild.children[j] = child.children[j + order];
            }
        }
        
        // Reduce the number of keys in the original child
        child.keyCount = order - 1;
        
        // Create space for the new child in the parent
        for (int j = parent.keyCount; j > index; j--) {
            parent.children[j + 1] = parent.children[j];
        }
        
        // Link the new child to the parent
        parent.children[index + 1] = newChild;
        
        // Move the middle key to the parent
        for (int j = parent.keyCount - 1; j >= index; j--) {
            parent.keys[j + 1] = parent.keys[j];
        }
        parent.keys[index] = child.keys[order - 1];
        parent.keyCount++;
    }
    
    // Print the B-Tree level by level
    public void print() {
        if (root == null) {
            System.out.println("Empty tree");
            return;
        }
        
        Queue<BTreeNode> queue = new LinkedList<>();
        Queue<Integer> levelQueue = new LinkedList<>();
        queue.add(root);
        levelQueue.add(0);
        int currentLevel = 0;
        
        System.out.println("B-Tree of order " + order + ":");
        StringBuilder sb = new StringBuilder();
        
        while (!queue.isEmpty()) {
            BTreeNode node = queue.poll();
            int level = levelQueue.poll();
            
            if (level > currentLevel) {
                System.out.println(sb.toString());
                sb = new StringBuilder();
                currentLevel = level;
            }
            
            sb.append("[");
            for (int i = 0; i < node.keyCount; i++) {
                sb.append(node.keys[i]);
                if (i < node.keyCount - 1) {
                    sb.append(",");
                }
            }
            sb.append("]  ");
            
            if (!node.isLeaf) {
                for (int i = 0; i <= node.keyCount; i++) {
                    if (node.children[i] != null) {
                        queue.add(node.children[i]);
                        levelQueue.add(level + 1);
                    }
                }
            }
        }
        
        System.out.println(sb.toString());
    }
    
    public static void main(String[] args) {
        BTree btree = new BTree(3); // Order 3
        int[] values = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
        
        for (int value : values) {
            btree.insert(value);
            System.out.println("After inserting " + value + ":");
            btree.print();
            System.out.println();
        }
        
        int searchKey = 50;
        System.out.println("Search for " + searchKey + ": " + 
                          (btree.search(searchKey) ? "Found" : "Not found"));
    }
}`
      }
    };
  }
}

class BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
  
  constructor(isLeaf: boolean) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}