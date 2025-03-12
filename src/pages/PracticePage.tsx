import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, Circle, ExternalLink, BookOpen, Code, Brain } from 'lucide-react';

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
  
  // Two Pointers
  {
    id: '6',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    link: 'https://leetcode.com/problems/valid-palindrome/'
  },
  {
    id: '7',
    title: '3Sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    link: 'https://leetcode.com/problems/3sum/'
  },
  {
    id: '8',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    link: 'https://leetcode.com/problems/container-with-most-water/'
  },
  
  // Sliding Window
  {
    id: '9',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
  },
  {
    id: '10',
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    category: 'Sliding Window',
    link: 'https://leetcode.com/problems/longest-repeating-character-replacement/'
  },
  
  // Stack
  {
    id: '11',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    link: 'https://leetcode.com/problems/valid-parentheses/'
  },
  
  // Binary Search
  {
    id: '12',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search',
    link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
  },
  {
    id: '13',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search',
    link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'
  },
  
  // Linked List
  {
    id: '14',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/reverse-linked-list/'
  },
  {
    id: '15',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/merge-two-sorted-lists/'
  },
  {
    id: '16',
    title: 'Reorder List',
    difficulty: 'Medium',
    category: 'Linked List',
    link: 'https://leetcode.com/problems/reorder-list/'
  },
  
  // Trees
  {
    id: '17',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
  },
  {
    id: '18',
    title: 'Same Tree',
    difficulty: 'Easy',
    category: 'Trees',
    link: 'https://leetcode.com/problems/same-tree/'
  },
  {
    id: '19',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
  },
  
  // Tries
  {
    id: '20',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    category: 'Tries',
    link: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
  },
  
  // Heap / Priority Queue
  {
    id: '21',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    category: 'Heap',
    link: 'https://leetcode.com/problems/find-median-from-data-stream/'
  },
  
  // Backtracking
  {
    id: '22',
    title: 'Combination Sum',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/combination-sum/'
  },
  {
    id: '23',
    title: 'Word Search',
    difficulty: 'Medium',
    category: 'Backtracking',
    link: 'https://leetcode.com/problems/word-search/'
  },
  
  // Graphs
  {
    id: '24',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/number-of-islands/'
  },
  {
    id: '25',
    title: 'Clone Graph',
    difficulty: 'Medium',
    category: 'Graphs',
    link: 'https://leetcode.com/problems/clone-graph/'
  },
  
  // Dynamic Programming
  {
    id: '26',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/climbing-stairs/'
  },
  {
    id: '27',
    title: 'House Robber',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/house-robber/'
  },
  {
    id: '28',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    link: 'https://leetcode.com/problems/longest-palindromic-substring/'
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
                
                <div className="flex items-center space-x-2">
                  <a
                    href={`/documentation#${question.category.toLowerCase()}`}
                    className={`p-2 rounded-full transition-colors duration-300
                              ${theme === 'dark'
                                ? 'hover:bg-dark-primary/20'
                                : 'hover:bg-light-primary/20'}`}
                    title="View related documentation"
                  >
                    <BookOpen size={20} />
                  </a>
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-colors duration-300
                              ${theme === 'dark'
                                ? 'hover:bg-dark-primary/20'
                                : 'hover:bg-light-primary/20'}`}
                  >
                    <ExternalLink size={20} />
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