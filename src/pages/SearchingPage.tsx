import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, GitBranch, Target, Zap, Play, BookOpen, ArrowLeft, Network, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchingVisualizer from '../components/visualizer/SearchingVisualizer';

interface SearchingAlgorithm {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  category: 'Linear' | 'Divide & Conquer' | 'Tree-based';
  icon: React.ReactNode;
}

const SearchingPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const algorithms: SearchingAlgorithm[] = [
    {
      id: 'linear-search',
      name: 'Linear Search',
      description: 'A simple search algorithm that checks every element in a list sequentially until a match is found or the end is reached.',
      difficulty: 'Easy',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      category: 'Linear',
      icon: <Search size={32} />
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      description: 'An efficient algorithm for searching a sorted array by repeatedly dividing the search interval in half.',
      difficulty: 'Medium',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      category: 'Divide & Conquer',
      icon: <Target size={32} />
    },
    {
      id: 'jump-search',
      name: 'Jump Search',
      description: 'A searching algorithm for sorted arrays that works by jumping ahead by fixed steps and then performing linear search.',
      difficulty: 'Medium',
      timeComplexity: 'O(√n)',
      spaceComplexity: 'O(1)',
      category: 'Linear',
      icon: <Zap size={32} />
    },
    {
      id: 'interpolation-search',
      name: 'Interpolation Search',
      description: 'An improved variant of binary search for uniformly distributed sorted arrays that estimates the position of the target.',
      difficulty: 'Hard',
      timeComplexity: 'O(log log n)',
      spaceComplexity: 'O(1)',
      category: 'Divide & Conquer',
      icon: <Target size={32} />
    },
    {
      id: 'binary-search-tree',
      name: 'Binary Search Tree',
      description: 'A tree-based data structure where each node has at most two children, and all nodes to the left are less than the current node, while all nodes to the right are greater.',
      difficulty: 'Medium',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(n)',
      category: 'Tree-based',
      icon: <TreePine size={32} />
    },
    {
      id: 'trie-search',
      name: 'Trie Search',
      description: 'A specialized tree-based data structure used for efficient retrieval of keys in a dataset of strings, particularly useful for prefix-based searching.',
      difficulty: 'Hard',
      timeComplexity: 'O(m)',
      spaceComplexity: 'O(n*m)',
      category: 'Tree-based',
      icon: <GitBranch size={32} />
    },
    {
      id: 'b-tree-search',
      name: 'B-Tree Search',
      description: 'A self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.',
      difficulty: 'Hard',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(n)',
      category: 'Tree-based',
      icon: <Network size={32} />
    }
  ];

  const categories = [
    { id: 'all', name: 'All Algorithms' },
    { id: 'Linear', name: 'Linear Search' },
    { id: 'Divide & Conquer', name: 'Divide & Conquer' },
    { id: 'Tree-based', name: 'Tree-based' }
  ];

  const filteredAlgorithms = algorithms.filter(algo => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || algo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'Hard': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/algorithms')}
            className={`flex items-center text-sm font-medium mb-4
                      ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Algorithms
          </button>
        </div>

        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Searching Algorithms
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-80 px-4">
            Explore different searching algorithms and understand how they find elements in data structures through interactive visualizations.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className={`flex items-center p-3 rounded-full
                            ${theme === 'dark'
                              ? 'bg-dark-surface border border-dark-primary/30'
                              : 'bg-light-surface border border-light-primary/30'}`}>
                <Search size={20} className="ml-2 mr-3 opacity-60 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search searching algorithms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-2 py-1 bg-transparent focus:outline-none
                            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                            ${selectedCategory === category.id
                              ? theme === 'dark'
                                ? 'bg-dark-primary text-dark-background'
                                : 'bg-light-primary text-white'
                              : theme === 'dark'
                                ? 'bg-dark-surface hover:bg-dark-primary/20'
                                : 'bg-light-surface hover:bg-light-primary/20'
                            }`}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAlgorithms.map((algo, index) => (
            <motion.div
              key={algo.id}
              className="card card-glass overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-4 rounded-full
                                ${theme === 'dark' 
                                  ? 'bg-dark-primary/20 text-dark-primary' 
                                  : 'bg-light-primary/20 text-light-primary'}`}>
                    {algo.icon}
                  </div>
                  <h3 className="text-xl font-bold ml-4">{algo.name}</h3>
                </div>
                
                <p className="mb-4 opacity-80 text-sm sm:text-base line-clamp-3">{algo.description}</p>
                
                {/* Complexity Badges */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm opacity-70 mr-2">Time:</span>
                    <span className={`text-xs sm:text-sm px-2 py-1 rounded-full
                                  ${theme === 'dark'
                                    ? 'bg-dark-primary/20 text-dark-primary'
                                    : 'bg-light-primary/20 text-light-primary'}`}>
                      {algo.timeComplexity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm opacity-70 mr-2">Space:</span>
                    <span className={`text-xs sm:text-sm px-2 py-1 rounded-full
                                  ${theme === 'dark'
                                    ? 'bg-dark-primary/20 text-dark-primary'
                                    : 'bg-light-primary/20 text-light-primary'}`}>
                      {algo.spaceComplexity}
                    </span>
                  </div>
                </div>

                {/* Category and Difficulty */}
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-xs px-2 py-1 rounded-full
                                 ${theme === 'dark'
                                   ? 'bg-dark-primary/20 text-dark-primary'
                                   : 'bg-light-primary/20 text-light-primary'}`}>
                    {algo.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(algo.difficulty)}`}>
                    {algo.difficulty}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    onClick={() => setSelectedAlgorithm(algo.id)}
                    className={`flex items-center justify-center text-sm font-medium
                              ${theme === 'dark'
                                ? 'text-dark-primary hover:text-dark-primary/80'
                                : 'text-light-primary hover:text-light-primary/80'}`}
                  >
                    <Play size={16} className="mr-1" /> Visualize
                  </button>
                  <button 
                    onClick={() => navigate(`/documentation#${algo.id}`)}
                    className={`flex items-center justify-center text-sm font-medium
                              ${theme === 'dark'
                                ? 'text-dark-primary hover:text-dark-primary/80'
                                : 'text-light-primary hover:text-light-primary/80'}`}
                  >
                    <BookOpen size={16} className="mr-1" /> Learn
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl opacity-80">No algorithms found matching your search.</p>
          </div>
        )}

        {/* Visualizer Modal */}
        {selectedAlgorithm && (
          <SearchingVisualizer
            algorithm={selectedAlgorithm}
            onClose={() => setSelectedAlgorithm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SearchingPage;