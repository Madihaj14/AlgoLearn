import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, Circle } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  link: string;
  completed?: boolean;
}

const questions: Question[] = [
  // Arrays
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/two-sum/'
  },
  {
    id: '2',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
  },
  {
    id: '3',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/contains-duplicate/'
  },
  {
    id: '4',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/product-of-array-except-self/'
  },
  {
    id: '5',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/maximum-subarray/'
  },
  {
    id: '6',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/maximum-product-subarray/'
  },
  {
    id: '7',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'
  },
  {
    id: '8',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
  },
  {
    id: '9',
    title: '3Sum',
    difficulty: 'Medium',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/3sum/'
  },
  {
    id: '10',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Arrays',
    link: 'https://leetcode.com/problems/container-with-most-water/'
  },
  
  // Two Pointers
  {
    id: '11',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    link: 'https://leetcode.com/problems/valid-palindrome/'
  },
  {
    id: '12',
    title: 'Reverse String',
    difficulty: 'Easy',
    category: 'Two Pointers',
    link: 'https://leetcode.com/problems/reverse-string/'
  },
  {
    id: '13',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    category: 'Two Pointers',
    link: 'https://leetcode.com/problems/merge-sorted-array/'
  },
  {
    id: '14',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    category: 'Two Pointers',
    link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/'
  },
  
  // Sliding Window
  {
    id: '15',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
  },
  {
    id: '16',
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    category: 'Sliding Window',
    link: 'https://leetcode.com/problems/longest-repeating-character-replacement/'
  },
  {
    id: '17',
    title: 'Minimum Size Subarray Sum',
    difficulty: 'Medium',
    category: 'Sliding Window',
    link: 'https://leetcode.com/problems/minimum-size-subarray-sum/'
  },
  {
    id: '18',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    category: 'Sliding Window',
    link: 'https://leetcode.com/problems/sliding-window-maximum/'
  },
  
  // Stack
  {
    id: '19',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    link: 'https://leetcode.com/problems/valid-parentheses/'
  },
  {
    id: '20',
    title: 'Min Stack',
    difficulty: 'Easy',
    category: 'Stack',
    link: 'https://leetcode.com/problems/min-stack/'
  },
  {
    id: '21',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    category: 'Stack',
    link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'
  },
  {
    id: '22',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    category: 'Stack',
    link: 'https://leetcode.com/problems/daily-temperatures/'
  },
  {
    id: '23',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    category: 'Stack',
    link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/'
  },
  
  // Binary Search
  {
    id: '24',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    link: 'https://leetcode.com/problems/binary-search/'
  },
  {
    id: '25',
    title: 'Search Insert Position',
    difficulty: 'Easy',
    category: 'Binary Search',
    link: 'https://leetcode.com/problems/search-insert-position/'
  },
  {
    id: '26',
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search',
    link: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/'
  },
  {
    id: '27',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    category: 'Binary Search',
    link: 'https://leetcode.com/problems/search-a-2d-matrix/'
  },
  {
    id: '28',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
  },
  
  // Linked List
  {
    id: '29',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/reverse-linked-list/'
  },
  {
    id: '30',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/merge-two-sorted-lists/'
  },
  {
    id: '31',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/linked-list-cycle/'
  },
  {
    id: '32',
    title: 'Reorder List',
    difficulty: 'Medium',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/reorder-list/'
  },
  {
    id: '33',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
  },
  {
    id: '34',
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/copy-list-with-random-pointer/'
  },
  {
    id: '35',
    title: 'LRU Cache',
    difficulty: 'Medium',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/lru-cache/'
  },
  {
    id: '36',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/merge-k-sorted-lists/'
  },
  
  // Trees
  {
    id: '37',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
  },
  {
    id: '38',
    title: 'Same Tree',
    difficulty: 'Easy',
    category: 'Trees',
    link: 'https://leetcode.com/problems/same-tree/'
  },
  {
    id: '39',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    link: 'https://leetcode.com/problems/invert-binary-tree/'
  },
  {
    id: '40',
    title: 'Subtree of Another Tree',
    difficulty: 'Easy',
    category: 'Trees',
    link: 'https://leetcode.com/problems/subtree-of-another-tree/'
  },
  {
    id: '41',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
  },
  {
    id: '42',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'Trees',
    link: 'https://leetcode.com/problems/validate-binary-search-tree/'
  },
  {
    id: '43',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    category: 'Trees',
    link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'
  },
  {
    id: '44',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/'
  },
  {
    id: '45',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    category: 'Trees',
    link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'
  },
  {
    id: '46',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    category: 'Trees',
    link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/'
  },
  
  // Tries
  {
    id: '47',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    category: 'Tries',
    link: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
  },
  {
    id: '48',
    title: 'Word Search II',
    difficulty: 'Hard',
    category: 'Tries',
    link: 'https://leetcode.com/problems/word-search-ii/'
  },
  {
    id: '49',
    title: 'Design Add and Search Words Data Structure',
    difficulty: 'Medium',
    category: 'Tries',
    link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/'
  },
  
  // Heap / Priority Queue
  {
    id: '50',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    category: 'Heap',
    link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
  },
  {
    id: '51',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: 'Heap',
    link: 'https://leetcode.com/problems/top-k-frequent-elements/'
  },
  {
    id: '52',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    category: 'Heap',
    link: 'https://leetcode.com/problems/find-median-from-data-stream/'
  },
  {
    id: '53',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    category: 'Heap',
    link: 'https://leetcode.com/problems/merge-k-sorted-lists/'
  },
  
  // Backtracking
  {
    id: '54',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/'
  },
  {
    id: '55',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/generate-parentheses/'
  },
  {
    id: '56',
    title: 'Permutations',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/permutations/'
  },
  {
    id: '57',
    title: 'Subsets',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/subsets/'
  },
  {
    id: '58',
    title: 'Combination Sum',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/combination-sum/'
  },
  {
    id: '59',
    title: 'Word Search',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/word-search/'
  },
  {
    id: '60',
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/palindrome-partitioning/'
  },
  {
    id: '61',
    title: 'N-Queens',
    difficulty: 'Hard',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/n-queens/'
  },
  
  // Graphs
  {
    id: '62',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/number-of-islands/'
  },
  {
    id: '63',
    title: 'Clone Graph',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/clone-graph/'
  },
  {
    id: '64',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/'
  },
  {
    id: '65',
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/course-schedule/'
  },
  {
    id: '66',
    title: 'Course Schedule II',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/course-schedule-ii/'
  },
  {
    id: '67',
    title: 'Redundant Connection',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/redundant-connection/'
  },
  {
    id: '68',
    title: 'Word Ladder',
    difficulty: 'Hard',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/word-ladder/'
  },
  {
    id: '69',
    title: 'Alien Dictionary',
    difficulty: 'Hard',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/alien-dictionary/'
  },
  
  // Dynamic Programming
  {
    id: '70',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/climbing-stairs/'
  },
  {
    id: '71',
    title: 'House Robber',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/house-robber/'
  },
  {
    id: '72',
    title: 'House Robber II',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/house-robber-ii/'
  },
  {
    id: '73',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/longest-palindromic-substring/'
  },
  {
    id: '74',
    title: 'Decode Ways',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/decode-ways/'
  },
  {
    id: '75',
    title: 'Unique Paths',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/unique-paths/'
  },
  {
    id: '76',
    title: 'Jump Game',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/jump-game/'
  },
  {
    id: '77',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/coin-change/'
  },
  {
    id: '78',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/longest-increasing-subsequence/'
  },
  {
    id: '79',
    title: 'Word Break',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/word-break/'
  },
  {
    id: '80',
    title: 'Combination Sum IV',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/combination-sum-iv/'
  },
  {
    id: '81',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/regular-expression-matching/'
  },
  {
    id: '82',
    title: 'Longest Valid Parentheses',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/longest-valid-parentheses/'
  },
  {
    id: '83',
    title: 'Edit Distance',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/edit-distance/'
  },
  {
    id: '84',
    title: 'Burst Balloons',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/burst-balloons/'
  },
  
  // Greedy
  {
    id: '85',
    title: 'Maximum Subarray',
    difficulty: 'Easy',
    category: 'Greedy',
    link: 'https://leetcode.com/problems/maximum-subarray/'
  },
  {
    id: '86',
    title: 'Jump Game',
    difficulty: 'Medium',
    category: 'Greedy',
    link: 'https://leetcode.com/problems/jump-game/'
  },
  {
    id: '87',
    title: 'Gas Station',
    difficulty: 'Medium',
    category: 'Greedy',
    link: 'https://leetcode.com/problems/gas-station/'
  },
  {
    id: '88',
    title: 'Hand of Straights',
    difficulty: 'Medium',
    category: 'Greedy',
    link: 'https://leetcode.com/problems/hand-of-straights/'
  },
  {
    id: '89',
    title: 'Merge Triplets to Form Target Triplet',
    difficulty: 'Medium',
    category: 'Greedy',
    link: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/'
  },
  {
    id: '90',
    title: 'Partition Labels',
    difficulty: 'Medium',
    category: 'Greedy',
    link: 'https://leetcode.com/problems/partition-labels/'
  },
  
  // Intervals
  {
    id: '91',
    title: 'Meeting Rooms',
    difficulty: 'Easy',
    category: 'Intervals',
    link: 'https://leetcode.com/problems/meeting-rooms/'
  },
  {
    id: '92',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    link: 'https://leetcode.com/problems/merge-intervals/'
  },
  {
    id: '93',
    title: 'Insert Interval',
    difficulty: 'Medium',
    category: 'Intervals',
    link: 'https://leetcode.com/problems/insert-interval/'
  },
  {
    id: '94',
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    link: 'https://leetcode.com/problems/non-overlapping-intervals/'
  },
  {
    id: '95',
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    category: 'Intervals',
    link: 'https://leetcode.com/problems/meeting-rooms-ii/'
  },
  {
    id: '96',
    title: 'Minimum Interval to Include Each Query',
    difficulty: 'Hard',
    category: 'Intervals',
    link: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/'
  },
  
  // Math & Geometry
  {
    id: '97',
    title: 'Rotate Image',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/rotate-image/'
  },
  {
    id: '98',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/spiral-matrix/'
  },
  {
    id: '99',
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/set-matrix-zeroes/'
  },
  {
    id: '100',
    title: 'Happy Number',
    difficulty: 'Easy',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/happy-number/'
  },
  {
    id: '101',
    title: 'Plus One',
    difficulty: 'Easy',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/plus-one/'
  },
  {
    id: '102',
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/powx-n/'
  },
  {
    id: '103',
    title: 'Multiply Strings',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/multiply-strings/'
  },
  {
    id: '104',
    title: 'Detect Squares',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    link: 'https://leetcode.com/problems/detect-squares/'
  },
  
  // Bit Manipulation
  {
    id: '105',
    title: 'Single Number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    link: 'https://leetcode.com/problems/single-number/'
  },
  {
    id: '106',
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    link: 'https://leetcode.com/problems/number-of-1-bits/'
  },
  {
    id: '107',
    title: 'Counting Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    link: 'https://leetcode.com/problems/counting-bits/'
  },
  {
    id: '108',
    title: 'Reverse Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    link: 'https://leetcode.com/problems/reverse-bits/'
  },
  {
    id: '109',
    title: 'Missing Number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    link: 'https://leetcode.com/problems/missing-number/'
  },
  {
    id: '110',
    title: 'Sum of Two Integers',
    difficulty: 'Medium',
    category: 'Bit Manipulation',
    link: 'https://leetcode.com/problems/sum-of-two-integers/'
  }
];

const PracticePage: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  
  const categories = Array.from(new Set(questions.map(q => q.category))).sort();
  const difficulties = ['Easy', 'Medium', 'Hard'];
  
  const toggleQuestionCompletion = (questionId: string) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(questionId)) {
      newCompleted.delete(questionId);
    } else {
      newCompleted.add(questionId);
    }
    setCompletedQuestions(newCompleted);
  };
  
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });
  
  const stats = {
    total: questions.length,
    completed: completedQuestions.size,
    easy: questions.filter(q => q.difficulty === 'Easy').length,
    medium: questions.filter(q => q.difficulty === 'Medium').length,
    hard: questions.filter(q => q.difficulty === 'Hard').length
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-4xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Practice Problems
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-80">
            Curated collection of data structure and algorithm problems to help you prepare for technical interviews.
          </p>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`card card-glass p-4 text-center
                        ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <div className="text-2xl font-bold">{stats.completed}/{stats.total}</div>
            <div className="text-sm opacity-80">Completed</div>
          </div>
          <div className={`card card-glass p-4 text-center text-green-500`}>
            <div className="text-2xl font-bold">{stats.easy}</div>
            <div className="text-sm">Easy</div>
          </div>
          <div className={`card card-glass p-4 text-center text-yellow-500`}>
            <div className="text-2xl font-bold">{stats.medium}</div>
            <div className="text-sm">Medium</div>
          </div>
          <div className={`card card-glass p-4 text-center text-red-500`}>
            <div className="text-2xl font-bold">{stats.hard}</div>
            <div className="text-sm">Hard</div>
          </div>
          <div className={`card card-glass p-4 text-center
                        ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
            <div className="text-2xl font-bold">
              {Math.round((stats.completed / stats.total) * 100)}%
            </div>
            <div className="text-sm">Progress</div>
          </div>
        </motion.div>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className={`flex items-center p-2 rounded-full
                            ${theme === 'dark'
                              ? 'bg-dark-surface border border-dark-primary/30'
                              : 'bg-light-surface border border-light-primary/30'}`}>
                <Search size={20} className="ml-2 mr-1 opacity-60" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-3 py-2 bg-transparent focus:outline-none
                            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
                />
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full transition-all duration-300
                          ${selectedDifficulty === 'all'
                            ? theme === 'dark'
                              ? 'bg-dark-primary text-dark-background'
                              : 'bg-light-primary text-white'
                            : theme === 'dark'
                              ? 'bg-dark-surface hover:bg-dark-primary/20'
                              : 'bg-light-surface hover:bg-light-primary/20'
                          }`}
                onClick={() => setSelectedDifficulty('all')}
              >
                All
              </button>
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  className={`px-4 py-2 rounded-full transition-all duration-300
                            ${selectedDifficulty === difficulty
                              ? difficulty === 'Easy'
                                ? 'bg-green-500 text-white'
                                : difficulty === 'Medium'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-red-500 text-white'
                              : theme === 'dark'
                                ? 'bg-dark-surface hover:bg-dark-primary/20'
                                : 'bg-light-surface hover:bg-light-primary/20'
                            }`}
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300
                        ${selectedCategory === 'all'
                          ? theme === 'dark'
                            ? 'bg-dark-primary text-dark-background'
                            : 'bg-light-primary text-white'
                          : theme === 'dark'
                            ? 'bg-dark-surface hover:bg-dark-primary/20'
                            : 'bg-light-surface hover:bg-light-primary/20'
                        }`}
              onClick={() => setSelectedCategory('all')}
            >
              <Filter size={16} className="inline-block mr-1" />
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full transition-all duration-300
                          ${selectedCategory === category
                            ? theme === 'dark'
                              ? 'bg-dark-primary text-dark-background'
                              : 'bg-light-primary text-white'
                            : theme === 'dark'
                              ? 'bg-dark-surface hover:bg-dark-primary/20'
                              : 'bg-light-surface hover:bg-light-primary/20'
                          }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              className={`card card-glass p-4
                        ${theme === 'dark' ? 'hover:bg-dark-primary/10' : 'hover:bg-light-primary/10'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleQuestionCompletion(question.id)}
                    className={`transition-colors duration-300
                              ${completedQuestions.has(question.id)
                                ? theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'
                                : 'text-gray-400'}`}
                  >
                    {completedQuestions.has(question.id) ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  
                  <div>
                    <h3 className={`text-lg font-medium ${completedQuestions.has(question.id) ? 'line-through opacity-70' : ''}`}>
                      {question.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm px-2 py-1 rounded-full
                                    ${question.difficulty === 'Easy'
                                      ? 'bg-green-500/20 text-green-500'
                                      : question.difficulty === 'Medium'
                                        ? 'bg-yellow-500/20 text-yellow-500'
                                        : 'bg-red-500/20 text-red-500'}`}>
                        {question.difficulty}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full
                                    ${theme === 'dark'
                                      ? 'bg-dark-primary/20 text-dark-primary'
                                      : 'bg-light-primary/20 text-light-primary'}`}>
                        {question.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-colors duration-300 text-sm
                              ${theme === 'dark'
                                ? 'text-dark-primary hover:text-dark-primary/80'
                                : 'text-light-primary hover:text-light-primary/80'}`}
                  >
                    Solve
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl opacity-80">No questions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;