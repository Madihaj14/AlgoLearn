import { DocContent } from './types';

export const dataStructuresContent: Record<string, DocContent> = {
  'arrays': {
    id: 'arrays',
    title: 'Arrays',
    description: 'A fundamental data structure that stores elements in contiguous memory locations.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(1) for access, O(n) for search',
      best: 'O(1) for access, O(1) for search if index known',
      worst: 'O(1) for access, O(n) for search'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'Database implementations',
      'Buffer management',
      'Polynomial manipulation',
      'Image processing'
    ]
  },
  'linked-list': {
    id: 'linked-list',
    title: 'Linked Lists',
    description: 'A linear data structure where elements are stored in nodes connected through references.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n) for search, O(1) for insertion at known position',
      best: 'O(1) for insertion at known position',
      worst: 'O(n) for search and insertion at end'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'Dynamic memory allocation',
      'Undo functionality in software',
      'Hash tables with chaining',
      'Symbol tables'
    ]
  },
  'stack': {
    id: 'stack',
    title: 'Stack',
    description: 'A linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements are added and removed from the same end, called the top. Stacks are fundamental for managing function calls, undo operations, and parsing expressions.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(1) for push/pop',
      best: 'O(1) for all operations',
      worst: 'O(1) for all operations'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'Function call management',
      'Expression evaluation',
      'Undo mechanisms',
      'Browser history'
    ]
  },
  'queue': {
    id: 'queue',
    title: 'Queue',
    description: 'A linear data structure following the First-In-First-Out (FIFO) principle. Elements are added at the rear and removed from the front. Queues are essential for managing tasks that need to be processed in order of arrival.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(1) for enqueue/dequeue',
      best: 'O(1) for all operations',
      worst: 'O(1) for all operations'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'Task scheduling',
      'Print job management',
      'Breadth-first search',
      'Message queues'
    ]
  },
  'tree': {
    id: 'tree',
    title: 'Tree',
    description: 'A hierarchical data structure consisting of nodes connected by edges. Each node has a parent (except the root) and zero or more children. Trees are used to represent hierarchical relationships and optimize search operations.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(log n) for balanced trees',
      best: 'O(1) for root access',
      worst: 'O(n) for unbalanced trees'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'File systems',
      'Database indexing',
      'DOM in web browsers',
      'Decision trees'
    ]
  },
  'heap': {
    id: 'heap',
    title: 'Heap',
    description: 'A specialized tree-based data structure that satisfies the heap property. In a max heap, parent nodes are greater than children; in a min heap, they are smaller. Heaps are efficient for maintaining priority queues and finding extremal values.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(log n) for insert/delete',
      best: 'O(1) for peek',
      worst: 'O(log n) for insert/delete'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'Priority queues',
      'Scheduling algorithms',
      'Graph algorithms',
      'Memory management'
    ]
  },
  'hash-table': {
    id: 'hash-table',
    title: 'Hash Table',
    description: 'A data structure that implements an associative array abstract data type, mapping keys to values. It uses a hash function to compute an index into an array where the desired value can be found, providing fast data access.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(1) for insert/delete/search',
      best: 'O(1) for all operations',
      worst: 'O(n) with many collisions'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'Database indexing',
      'Caching',
      'Symbol tables',
      'Cryptography'
    ]
  },
  'graph': {
    id: 'graph',
    title: 'Graph',
    description: 'A non-linear data structure consisting of vertices (nodes) and edges connecting them. Graphs can be directed or undirected, weighted or unweighted, and are used to represent networks and relationships between objects.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(V + E) for traversal',
      best: 'O(1) for vertex access',
      worst: 'O(V²) for dense graphs'
    },
    spaceComplexity: 'O(V + E)',
    applications: [
      'Social networks',
      'Route planning',
      'Network topology',
      'Dependency resolution'
    ]
  }
};

export const algorithmsContent: Record<string, DocContent> = {
  'bubble-sort': {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n²)',
      best: 'O(n) when array is already sorted',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    applications: [
      'Educational purposes',
      'Small datasets',
      'Nearly sorted arrays',
      'Simple implementation needs'
    ]
  },
  'quick-sort': {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'An efficient, in-place sorting algorithm that uses divide and conquer strategy to sort elements.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n log n)',
      best: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    applications: [
      'General-purpose sorting',
      'Large datasets',
      'Systems with good cache performance',
      'Virtual memory systems'
    ]
  },
  'merge-sort': {
    id: 'merge-sort',
    title: 'Merge Sort',
    description: 'A divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n log n)',
      best: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    applications: [
      'External sorting',
      'Linked list sorting',
      'Stable sorting needs',
      'Parallel processing'
    ]
  },
  'insertion-sort': {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'A simple sorting algorithm that builds the final sorted array one item at a time. It iterates through the input array and grows a sorted array behind it. The algorithm is efficient for small data sets and nearly sorted arrays.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n²)',
      best: 'O(n) when nearly sorted',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    applications: [
      'Small datasets',
      'Nearly sorted arrays',
      'Online sorting',
      'Adaptive sorting'
    ]
  },
  'selection-sort': {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'A sorting algorithm that divides the input into a sorted and unsorted region. It repeatedly selects the smallest element from the unsorted region and adds it to the sorted region. Simple but inefficient for large lists.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n²)',
      best: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    applications: [
      'Small lists',
      'Teaching sorting concepts',
      'When memory is limited',
      'Simple implementation needed'
    ]
  },
  'heap-sort': {
    id: 'heap-sort',
    title: 'Heap Sort',
    description: 'A comparison-based sorting algorithm that uses a binary heap data structure. It divides the input into a sorted and unsorted region, and iteratively shrinks the unsorted region by extracting the largest element and inserting it into the sorted region.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n log n)',
      best: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)',
    applications: [
      'Systems with memory constraints',
      'Real-time systems',
      'Embedded systems',
      'Priority queue implementation'
    ]
  },
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'An efficient algorithm for searching a sorted array by repeatedly dividing the search interval in half.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(log n)',
      best: 'O(1)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    applications: [
      'Sorted array searching',
      'Database indexing',
      'Finding insertion points',
      'Range queries'
    ]
  },
  'linear-search': {
    id: 'linear-search',
    title: 'Linear Search',
    description: 'A simple search algorithm that checks every element in a list sequentially until a match is found or the end is reached. While not efficient for large datasets, it works on unsorted arrays and is useful for small lists.',
    content: `// Content here`,
    timeComplexity: {
      average: 'O(n)',
      best: 'O(1)',
      worst: 'O(n)'
    },
    spaceComplexity: 'O(1)',
    applications: [
      'Small datasets',
      'Unsorted arrays',
      'Simple searches',
      'One-time searches'
    ]
  }
};