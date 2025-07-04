import { VisualizationStep } from '../types';

export class BinarySearchTreeVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private tree: TreeNode | null = null;

  constructor() {
    // Initialize with a sample BST
    this.buildSampleTree();
  }

  private buildSampleTree() {
    // Create a balanced BST with sample data
    const values = [50, 30, 70, 20, 40, 60, 80];
    for (const value of values) {
      this.insert(value);
    }
  }

  private addStep(
    description: string,
    currentNode: number | null = null,
    searchPath: number[] = [],
    metadata: any = {}
  ) {
    const treeData = this.serializeTree();
    
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        tree: treeData,
        currentNode,
        searchPath,
        target: metadata.target,
        found: metadata.found,
        inserted: metadata.inserted,
        deleted: metadata.deleted
      },
      highlights: currentNode !== null ? [currentNode] : [],
      comparisons: searchPath,
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private serializeTree() {
    if (!this.tree) return { nodes: [], edges: [] };
    
    const nodes: { id: number; value: number }[] = [];
    const edges: { source: number; target: number }[] = [];
    
    const queue = [this.tree];
    while (queue.length > 0) {
      const node = queue.shift()!;
      nodes.push({ id: node.value, value: node.value });
      
      if (node.left) {
        edges.push({ source: node.value, target: node.left.value });
        queue.push(node.left);
      }
      
      if (node.right) {
        edges.push({ source: node.value, target: node.right.value });
        queue.push(node.right);
      }
    }
    
    return { nodes, edges };
  }

  private insert(value: number) {
    const newNode = new TreeNode(value);
    
    if (!this.tree) {
      this.tree = newNode;
      return;
    }
    
    let current = this.tree;
    let parent = null;
    
    while (current) {
      parent = current;
      
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        // Value already exists
        return;
      }
    }
    
    if (value < parent!.value) {
      parent!.left = newNode;
    } else {
      parent!.right = newNode;
    }
  }

  private search(value: number): void {
    if (!this.tree) {
      this.addStep(
        `Tree is empty. Cannot search for ${value}.`,
        null,
        [],
        { target: value }
      );
      return;
    }
    
    this.addStep(
      `Starting search for value ${value} in the Binary Search Tree`,
      null,
      [],
      { target: value, starting: true }
    );
    
    let current = this.tree;
    const searchPath: number[] = [];
    
    while (current) {
      searchPath.push(current.value);
      
      this.addStep(
        `Comparing target ${value} with current node ${current.value}`,
        current.value,
        [...searchPath],
        { target: value, comparing: true }
      );
      
      if (value === current.value) {
        this.addStep(
          `Found target ${value}!`,
          current.value,
          [...searchPath],
          { target: value, found: true, completed: [0] }
        );
        return;
      } else if (value < current.value) {
        this.addStep(
          `${value} < ${current.value}, moving to left subtree`,
          current.value,
          [...searchPath],
          { target: value, movingLeft: true }
        );
        current = current.left;
      } else {
        this.addStep(
          `${value} > ${current.value}, moving to right subtree`,
          current.value,
          [...searchPath],
          { target: value, movingRight: true }
        );
        current = current.right;
      }
      
      if (!current) {
        this.addStep(
          `Target ${value} not found in the tree`,
          null,
          [...searchPath],
          { target: value, notFound: true }
        );
      }
    }
  }

  private insertWithVisualization(value: number): void {
    this.addStep(
      `Starting insertion of value ${value} into the Binary Search Tree`,
      null,
      [],
      { target: value, starting: true }
    );
    
    if (!this.tree) {
      this.tree = new TreeNode(value);
      this.addStep(
        `Tree was empty. Created root node with value ${value}`,
        value,
        [value],
        { target: value, inserted: true, completed: [0] }
      );
      return;
    }
    
    let current = this.tree;
    let parent = null;
    const searchPath: number[] = [];
    
    while (current) {
      parent = current;
      searchPath.push(current.value);
      
      this.addStep(
        `Comparing ${value} with current node ${current.value}`,
        current.value,
        [...searchPath],
        { target: value, comparing: true }
      );
      
      if (value === current.value) {
        this.addStep(
          `Value ${value} already exists in the tree. No insertion needed.`,
          current.value,
          [...searchPath],
          { target: value, alreadyExists: true, completed: [0] }
        );
        return;
      } else if (value < current.value) {
        this.addStep(
          `${value} < ${current.value}, moving to left child`,
          current.value,
          [...searchPath],
          { target: value, movingLeft: true }
        );
        current = current.left;
      } else {
        this.addStep(
          `${value} > ${current.value}, moving to right child`,
          current.value,
          [...searchPath],
          { target: value, movingRight: true }
        );
        current = current.right;
      }
    }
    
    const newNode = new TreeNode(value);
    
    if (value < parent!.value) {
      parent!.left = newNode;
      this.addStep(
        `Inserting ${value} as left child of ${parent!.value}`,
        value,
        [...searchPath, value],
        { target: value, inserted: true, parent: parent!.value, position: 'left', completed: [0] }
      );
    } else {
      parent!.right = newNode;
      this.addStep(
        `Inserting ${value} as right child of ${parent!.value}`,
        value,
        [...searchPath, value],
        { target: value, inserted: true, parent: parent!.value, position: 'right', completed: [0] }
      );
    }
  }

  private deleteWithVisualization(value: number): void {
    if (!this.tree) {
      this.addStep(
        `Tree is empty. Cannot delete ${value}.`,
        null,
        [],
        { target: value }
      );
      return;
    }
    
    this.addStep(
      `Starting deletion of value ${value} from the Binary Search Tree`,
      null,
      [],
      { target: value, starting: true }
    );
    
    let current = this.tree;
    let parent: TreeNode | null = null;
    let isLeftChild = false;
    const searchPath: number[] = [];
    
    // Search for the node to delete
    while (current && current.value !== value) {
      parent = current;
      searchPath.push(current.value);
      
      this.addStep(
        `Searching for ${value} to delete. Comparing with ${current.value}`,
        current.value,
        [...searchPath],
        { target: value, comparing: true }
      );
      
      if (value < current.value) {
        isLeftChild = true;
        current = current.left;
      } else {
        isLeftChild = false;
        current = current.right;
      }
    }
    
    if (!current) {
      this.addStep(
        `Value ${value} not found in the tree. Nothing to delete.`,
        null,
        [...searchPath],
        { target: value, notFound: true }
      );
      return;
    }
    
    this.addStep(
      `Found node with value ${value} to delete`,
      current.value,
      [...searchPath, current.value],
      { target: value, found: true }
    );
    
    // Case 1: Node has no children
    if (!current.left && !current.right) {
      this.addStep(
        `Node ${value} has no children. Simple removal.`,
        current.value,
        [...searchPath, current.value],
        { target: value, case: 'no-children' }
      );
      
      if (!parent) {
        this.tree = null;
      } else if (isLeftChild) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    }
    // Case 2: Node has one child
    else if (!current.right) {
      this.addStep(
        `Node ${value} has only a left child. Replacing with left child.`,
        current.value,
        [...searchPath, current.value],
        { target: value, case: 'one-child-left' }
      );
      
      if (!parent) {
        this.tree = current.left;
      } else if (isLeftChild) {
        parent.left = current.left;
      } else {
        parent.right = current.left;
      }
    }
    else if (!current.left) {
      this.addStep(
        `Node ${value} has only a right child. Replacing with right child.`,
        current.value,
        [...searchPath, current.value],
        { target: value, case: 'one-child-right' }
      );
      
      if (!parent) {
        this.tree = current.right;
      } else if (isLeftChild) {
        parent.left = current.right;
      } else {
        parent.right = current.right;
      }
    }
    // Case 3: Node has two children
    else {
      this.addStep(
        `Node ${value} has two children. Finding successor...`,
        current.value,
        [...searchPath, current.value],
        { target: value, case: 'two-children' }
      );
      
      // Find successor (minimum value in right subtree)
      let successor = current.right;
      let successorParent = current;
      const successorPath = [...searchPath, current.value];
      
      while (successor.left) {
        successorParent = successor;
        successor = successor.left;
        successorPath.push(successor.value);
        
        this.addStep(
          `Looking for successor. Moving to ${successor.value}`,
          successor.value,
          [...successorPath],
          { target: value, findingSuccessor: true }
        );
      }
      
      this.addStep(
        `Found successor ${successor.value} for node ${value}`,
        successor.value,
        [...successorPath],
        { target: value, successorFound: true, successor: successor.value }
      );
      
      // If successor is not the right child of the node to delete
      if (successorParent !== current) {
        successorParent.left = successor.right;
        successor.right = current.right;
        
        this.addStep(
          `Updating pointers to maintain tree structure`,
          successor.value,
          [...successorPath],
          { target: value, updatingPointers: true }
        );
      }
      
      // Replace the node to delete with successor
      if (!parent) {
        successor.left = this.tree!.left;
        this.tree = successor;
      } else if (isLeftChild) {
        successor.left = current.left;
        parent.left = successor;
      } else {
        successor.left = current.left;
        parent.right = successor;
      }
      
      this.addStep(
        `Replaced node ${value} with successor ${successor.value}`,
        successor.value,
        [...searchPath],
        { target: value, replaced: true, successor: successor.value }
      );
    }
    
    this.addStep(
      `Successfully deleted node with value ${value} from the tree`,
      null,
      [...searchPath],
      { target: value, deleted: true, completed: [0] }
    );
  }

  public generateSteps(operation: 'search' | 'insert' | 'delete', value: number = 45): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    
    switch (operation) {
      case 'search':
        this.search(value);
        break;
      case 'insert':
        this.insertWithVisualization(value);
        break;
      case 'delete':
        this.deleteWithVisualization(value);
        break;
    }
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'binary-search-tree',
      name: 'Binary Search Tree',
      category: 'Searching',
      description: 'A tree-based data structure where each node has at most two children, and all nodes to the left are less than the current node, while all nodes to the right are greater.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(n)',
      difficulty: 'Medium' as const,
      code: {
        javascript: `// JavaScript Implementation
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // Insert a value into the BST
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    let current = this.root;
    
    while (true) {
      // Value already exists
      if (value === current.value) return;
      
      if (value < current.value) {
        // Go left
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        // Go right
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }
  
  // Search for a value in the BST
  search(value) {
    let current = this.root;
    
    while (current) {
      if (value === current.value) {
        return true; // Found
      }
      
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    return false; // Not found
  }
  
  // Delete a value from the BST
  delete(value) {
    this.root = this._deleteNode(this.root, value);
  }
  
  _deleteNode(root, value) {
    if (!root) return null;
    
    // Search for the node
    if (value < root.value) {
      root.left = this._deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = this._deleteNode(root.right, value);
    } else {
      // Node found, now delete it
      
      // Case 1: Leaf node (no children)
      if (!root.left && !root.right) {
        return null;
      }
      
      // Case 2: One child
      if (!root.left) {
        return root.right;
      }
      if (!root.right) {
        return root.left;
      }
      
      // Case 3: Two children
      // Find the inorder successor (smallest in right subtree)
      let successor = root.right;
      while (successor.left) {
        successor = successor.left;
      }
      
      // Replace value with successor's value
      root.value = successor.value;
      
      // Delete the successor
      root.right = this._deleteNode(root.right, successor.value);
    }
    
    return root;
  }
  
  // Inorder traversal
  inorder() {
    const result = [];
    this._inorderHelper(this.root, result);
    return result;
  }
  
  _inorderHelper(node, result) {
    if (node) {
      this._inorderHelper(node.left, result);
      result.push(node.value);
      this._inorderHelper(node.right, result);
    }
  }
}

// Usage
const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log("Inorder traversal:", bst.inorder()); // [20, 30, 40, 50, 60, 70, 80]
console.log("Search for 40:", bst.search(40)); // true
console.log("Search for 100:", bst.search(100)); // false

bst.delete(30);
console.log("After deleting 30:", bst.inorder()); // [20, 40, 50, 60, 70, 80]`,
        java: `// Java Implementation
class TreeNode {
    int value;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

public class BinarySearchTree {
    private TreeNode root;
    
    public BinarySearchTree() {
        this.root = null;
    }
    
    // Insert a value into the BST
    public void insert(int value) {
        TreeNode newNode = new TreeNode(value);
        
        if (root == null) {
            root = newNode;
            return;
        }
        
        TreeNode current = root;
        
        while (true) {
            // Value already exists
            if (value == current.value) return;
            
            if (value < current.value) {
                // Go left
                if (current.left == null) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else {
                // Go right
                if (current.right == null) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }
    
    // Search for a value in the BST
    public boolean search(int value) {
        TreeNode current = root;
        
        while (current != null) {
            if (value == current.value) {
                return true; // Found
            }
            
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        return false; // Not found
    }
    
    // Delete a value from the BST
    public void delete(int value) {
        root = deleteNode(root, value);
    }
    
    private TreeNode deleteNode(TreeNode root, int value) {
        if (root == null) return null;
        
        // Search for the node
        if (value < root.value) {
            root.left = deleteNode(root.left, value);
        } else if (value > root.value) {
            root.right = deleteNode(root.right, value);
        } else {
            // Node found, now delete it
            
            // Case 1: Leaf node (no children)
            if (root.left == null && root.right == null) {
                return null;
            }
            
            // Case 2: One child
            if (root.left == null) {
                return root.right;
            }
            if (root.right == null) {
                return root.left;
            }
            
            // Case 3: Two children
            // Find the inorder successor (smallest in right subtree)
            TreeNode successor = root.right;
            while (successor.left != null) {
                successor = successor.left;
            }
            
            // Replace value with successor's value
            root.value = successor.value;
            
            // Delete the successor
            root.right = deleteNode(root.right, successor.value);
        }
        
        return root;
    }
    
    // Inorder traversal
    public List<Integer> inorder() {
        List<Integer> result = new ArrayList<>();
        inorderHelper(root, result);
        return result;
    }
    
    private void inorderHelper(TreeNode node, List<Integer> result) {
        if (node != null) {
            inorderHelper(node.left, result);
            result.add(node.value);
            inorderHelper(node.right, result);
        }
    }
    
    public static void main(String[] args) {
        BinarySearchTree bst = new BinarySearchTree();
        bst.insert(50);
        bst.insert(30);
        bst.insert(70);
        bst.insert(20);
        bst.insert(40);
        bst.insert(60);
        bst.insert(80);
        
        System.out.println("Inorder traversal: " + bst.inorder()); // [20, 30, 40, 50, 60, 70, 80]
        System.out.println("Search for 40: " + bst.search(40)); // true
        System.out.println("Search for 100: " + bst.search(100)); // false
        
        bst.delete(30);
        System.out.println("After deleting 30: " + bst.inorder()); // [20, 40, 50, 60, 70, 80]
    }
}`
      }
    };
  }
}

class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  
  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}