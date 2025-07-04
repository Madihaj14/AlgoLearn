import { VisualizationStep } from '../types';

export class TrieSearchVisualizer {
  private steps: VisualizationStep[] = [];
  private stepId = 0;
  private trie: TrieNode;
  private words: string[];

  constructor() {
    this.trie = new TrieNode();
    this.words = ['apple', 'app', 'application', 'banana', 'band', 'bat', 'cat', 'car'];
    
    // Build the trie with sample words
    for (const word of this.words) {
      this.insertWord(word);
    }
  }

  private insertWord(word: string) {
    let current = this.trie;
    
    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    
    current.isEndOfWord = true;
  }

  private addStep(
    description: string,
    currentNode: string = '',
    searchPath: string[] = [],
    metadata: any = {}
  ) {
    this.steps.push({
      id: `step-${this.stepId++}`,
      description,
      data: {
        trie: this.serializeTrie(),
        currentNode,
        searchPath,
        prefix: metadata.prefix,
        matches: metadata.matches || [],
        currentChar: metadata.currentChar,
        currentWord: metadata.currentWord
      },
      highlights: [],
      comparisons: [],
      swaps: [],
      completed: metadata.completed || [],
      metadata
    });
  }

  private serializeTrie() {
    const nodes: { id: string; label: string; isEndOfWord: boolean }[] = [];
    const edges: { source: string; target: string; label: string }[] = [];
    
    const queue: [TrieNode, string, string][] = [[this.trie, 'root', '']];
    
    while (queue.length > 0) {
      const [node, id, prefix] = queue.shift()!;
      
      nodes.push({
        id,
        label: prefix,
        isEndOfWord: node.isEndOfWord
      });
      
      for (const char in node.children) {
        const childId = `${id}-${char}`;
        const childPrefix = prefix + char;
        
        edges.push({
          source: id,
          target: childId,
          label: char
        });
        
        queue.push([node.children[char], childId, childPrefix]);
      }
    }
    
    return { nodes, edges };
  }

  private searchPrefix(prefix: string): void {
    this.addStep(
      `Starting search for prefix "${prefix}" in the Trie`,
      'root',
      [],
      { prefix, starting: true }
    );
    
    let current = this.trie;
    const searchPath: string[] = [];
    let currentPrefix = '';
    
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      currentPrefix += char;
      
      this.addStep(
        `Checking for character "${char}" at current node`,
        searchPath.length > 0 ? searchPath[searchPath.length - 1] : 'root',
        [...searchPath],
        { prefix, currentChar: char, currentPrefix }
      );
      
      if (!current.children[char]) {
        this.addStep(
          `Character "${char}" not found. Prefix "${prefix}" does not exist in the Trie.`,
          searchPath.length > 0 ? searchPath[searchPath.length - 1] : 'root',
          [...searchPath],
          { prefix, notFound: true }
        );
        return;
      }
      
      current = current.children[char];
      const nodeId = searchPath.length === 0 ? `root-${char}` : `${searchPath[searchPath.length - 1]}-${char}`;
      searchPath.push(nodeId);
      
      this.addStep(
        `Found character "${char}". Moving to next node.`,
        nodeId,
        [...searchPath],
        { prefix, currentChar: char, currentPrefix }
      );
    }
    
    // Find all words with the given prefix
    const matches: string[] = [];
    this.findAllWords(current, prefix, matches);
    
    if (matches.length > 0) {
      this.addStep(
        `Found ${matches.length} words with prefix "${prefix}": ${matches.join(', ')}`,
        searchPath[searchPath.length - 1],
        [...searchPath],
        { prefix, matches, found: true, completed: [0] }
      );
    } else {
      this.addStep(
        `Prefix "${prefix}" exists in the Trie, but no complete words found with this prefix.`,
        searchPath[searchPath.length - 1],
        [...searchPath],
        { prefix, matches: [], completed: [0] }
      );
    }
  }

  private findAllWords(node: TrieNode, prefix: string, result: string[]) {
    if (node.isEndOfWord) {
      result.push(prefix);
    }
    
    for (const char in node.children) {
      this.findAllWords(node.children[char], prefix + char, result);
    }
  }

  private insertWithVisualization(word: string): void {
    this.addStep(
      `Starting insertion of word "${word}" into the Trie`,
      'root',
      [],
      { currentWord: word, starting: true }
    );
    
    let current = this.trie;
    const searchPath: string[] = [];
    let currentPrefix = '';
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      currentPrefix += char;
      
      this.addStep(
        `Processing character "${char}" at position ${i}`,
        searchPath.length > 0 ? searchPath[searchPath.length - 1] : 'root',
        [...searchPath],
        { currentWord: word, currentChar: char, currentPrefix }
      );
      
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
        
        const nodeId = searchPath.length === 0 ? `root-${char}` : `${searchPath[searchPath.length - 1]}-${char}`;
        searchPath.push(nodeId);
        
        this.addStep(
          `Character "${char}" not found. Creating new node.`,
          nodeId,
          [...searchPath],
          { currentWord: word, currentChar: char, currentPrefix, newNode: true }
        );
      } else {
        const nodeId = searchPath.length === 0 ? `root-${char}` : `${searchPath[searchPath.length - 1]}-${char}`;
        searchPath.push(nodeId);
        
        this.addStep(
          `Character "${char}" already exists. Moving to next node.`,
          nodeId,
          [...searchPath],
          { currentWord: word, currentChar: char, currentPrefix, existing: true }
        );
      }
      
      current = current.children[char];
    }
    
    const wasEndOfWord = current.isEndOfWord;
    current.isEndOfWord = true;
    
    if (wasEndOfWord) {
      this.addStep(
        `Word "${word}" already exists in the Trie.`,
        searchPath[searchPath.length - 1],
        [...searchPath],
        { currentWord: word, alreadyExists: true, completed: [0] }
      );
    } else {
      this.addStep(
        `Marking the end of word "${word}". Insertion complete.`,
        searchPath[searchPath.length - 1],
        [...searchPath],
        { currentWord: word, inserted: true, completed: [0] }
      );
    }
    
    // Update the words list if it's a new word
    if (!wasEndOfWord && !this.words.includes(word)) {
      this.words.push(word);
    }
  }

  public generateSteps(operation: 'search' | 'insert', input: string = 'app'): VisualizationStep[] {
    this.steps = [];
    this.stepId = 0;
    
    switch (operation) {
      case 'search':
        this.searchPrefix(input);
        break;
      case 'insert':
        this.insertWithVisualization(input);
        break;
    }
    
    return this.steps;
  }

  public getAlgorithmInfo() {
    return {
      id: 'trie-search',
      name: 'Trie Search',
      category: 'Searching',
      description: 'A specialized tree-based data structure used for efficient retrieval of keys in a dataset of strings, particularly useful for prefix-based searching.',
      timeComplexity: 'O(m)',
      spaceComplexity: 'O(n*m)',
      difficulty: 'Hard' as const,
      code: {
        javascript: `// JavaScript Implementation
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  // Insert a word into the trie
  insert(word) {
    let current = this.root;
    
    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    
    current.isEndOfWord = true;
  }
  
  // Search for a word in the trie
  search(word) {
    let current = this.root;
    
    for (const char of word) {
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    
    return current.isEndOfWord;
  }
  
  // Check if there is any word in the trie that starts with the given prefix
  startsWith(prefix) {
    let current = this.root;
    
    for (const char of prefix) {
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    
    return true;
  }
  
  // Find all words with the given prefix
  findWordsWithPrefix(prefix) {
    const result = [];
    let current = this.root;
    
    // Navigate to the node representing the prefix
    for (const char of prefix) {
      if (!current.children[char]) {
        return result;
      }
      current = current.children[char];
    }
    
    // Find all words starting from this node
    this._findAllWords(current, prefix, result);
    
    return result;
  }
  
  _findAllWords(node, prefix, result) {
    if (node.isEndOfWord) {
      result.push(prefix);
    }
    
    for (const char in node.children) {
      this._findAllWords(node.children[char], prefix + char, result);
    }
  }
}

// Usage
const trie = new Trie();
const words = ['apple', 'app', 'application', 'banana', 'band', 'bat'];

// Insert words into the trie
for (const word of words) {
  trie.insert(word);
}

console.log(trie.search('apple')); // true
console.log(trie.search('app')); // true
console.log(trie.search('orange')); // false

console.log(trie.startsWith('app')); // true
console.log(trie.startsWith('ban')); // true
console.log(trie.startsWith('cat')); // false

console.log(trie.findWordsWithPrefix('app')); // ['app', 'apple', 'application']
console.log(trie.findWordsWithPrefix('ba')); // ['banana', 'band', 'bat']`,
        java: `// Java Implementation
import java.util.*;

class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEndOfWord;
    
    public TrieNode() {
        children = new HashMap<>();
        isEndOfWord = false;
    }
}

public class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    // Insert a word into the trie
    public void insert(String word) {
        TrieNode current = root;
        
        for (char c : word.toCharArray()) {
            current.children.putIfAbsent(c, new TrieNode());
            current = current.children.get(c);
        }
        
        current.isEndOfWord = true;
    }
    
    // Search for a word in the trie
    public boolean search(String word) {
        TrieNode current = root;
        
        for (char c : word.toCharArray()) {
            if (!current.children.containsKey(c)) {
                return false;
            }
            current = current.children.get(c);
        }
        
        return current.isEndOfWord;
    }
    
    // Check if there is any word in the trie that starts with the given prefix
    public boolean startsWith(String prefix) {
        TrieNode current = root;
        
        for (char c : prefix.toCharArray()) {
            if (!current.children.containsKey(c)) {
                return false;
            }
            current = current.children.get(c);
        }
        
        return true;
    }
    
    // Find all words with the given prefix
    public List<String> findWordsWithPrefix(String prefix) {
        List<String> result = new ArrayList<>();
        TrieNode current = root;
        
        // Navigate to the node representing the prefix
        for (char c : prefix.toCharArray()) {
            if (!current.children.containsKey(c)) {
                return result;
            }
            current = current.children.get(c);
        }
        
        // Find all words starting from this node
        findAllWords(current, prefix, result);
        
        return result;
    }
    
    private void findAllWords(TrieNode node, String prefix, List<String> result) {
        if (node.isEndOfWord) {
            result.add(prefix);
        }
        
        for (Map.Entry<Character, TrieNode> entry : node.children.entrySet()) {
            findAllWords(entry.getValue(), prefix + entry.getKey(), result);
        }
    }
    
    public static void main(String[] args) {
        Trie trie = new Trie();
        String[] words = {"apple", "app", "application", "banana", "band", "bat"};
        
        // Insert words into the trie
        for (String word : words) {
            trie.insert(word);
        }
        
        System.out.println(trie.search("apple")); // true
        System.out.println(trie.search("app")); // true
        System.out.println(trie.search("orange")); // false
        
        System.out.println(trie.startsWith("app")); // true
        System.out.println(trie.startsWith("ban")); // true
        System.out.println(trie.startsWith("cat")); // false
        
        System.out.println(trie.findWordsWithPrefix("app")); // [app, apple, application]
        System.out.println(trie.findWordsWithPrefix("ba")); // [banana, band, bat]
    }
}`
      }
    };
  }
}

class TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
  
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}