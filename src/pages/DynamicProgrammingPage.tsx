import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, Calculator, TrendingUp, Grid, Layers, Play, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicProgrammingVisualizer from '../components/visualizer/DynamicProgrammingVisualizer';

interface DPAlgorithm {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  category: 'Classic' | 'String' | 'Array';
  icon: React.ReactNode;
}

const DynamicProgrammingPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const algorithms: DPAlgorithm[] = [
    {
      id: 'fibonacci',
      name: 'Fibonacci Sequence',
      description: 'Classic dynamic programming problem demonstrating memoization and bottom-up approaches to compute Fibonacci numbers efficiently.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Easy',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      category: 'Classic',
      icon: <Calculator size={20} />
    },
    {
      id: 'knapsack-01',
      name: '0/1 Knapsack Problem',
      description: 'Optimize the selection of items with given weights and values to maximize value within a weight constraint using dynamic programming.',
      image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&auto=format&fit=crop&w=2106&q=80',
      difficulty: 'Medium',
      timeComplexity: 'O(nW)',
      spaceComplexity: 'O(nW)',
      category: 'Classic',
      icon: <Grid size={20} />
    },
    {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      description: 'Find the longest subsequence common to two sequences using dynamic programming with 2D table approach.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Medium',
      timeComplexity: 'O(mn)',
      spaceComplexity: 'O(mn)',
      category: 'String',
      icon: <Layers size={20} />
    },
    {
      id: 'lis',
      name: 'Longest Increasing Subsequence',
      description: 'Find the length of the longest subsequence where elements are in increasing order using dynamic programming.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Medium',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(n)',
      category: 'Array',
      icon: <TrendingUp size={20} />
    },
    {
      id: 'edit-distance',
      name: 'Edit Distance (Levenshtein)',
      description: 'Calculate the minimum number of operations required to transform one string into another using insertions, deletions, and substitutions.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Hard',
      timeComplexity: 'O(mn)',
      spaceComplexity: 'O(mn)',
      category: 'String',
      icon: <Calculator size={20} />
    },
    {
      id: 'coin-change',
      name: 'Coin Change Problem',
      description: 'Find the minimum number of coins needed to make a given amount using dynamic programming with optimal substructure.',
      image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
      difficulty: 'Medium',
      timeComplexity: 'O(amount × coins)',
      spaceComplexity: 'O(amount)',
      category: 'Classic',
      icon: <Grid size={20} />
    },
    {
      id: 'matrix-chain',
      name: 'Matrix Chain Multiplication',
      description: 'Find the optimal way to parenthesize a chain of matrices to minimize the number of scalar multiplications.',
      image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
      difficulty: 'Hard',
      timeComplexity: 'O(n³)',
      spaceComplexity: 'O(n²)',
      category: 'Classic',
      icon: <Layers size={20} />
    },
    {
      id: 'palindrome-partitioning',
      name: 'Palindrome Partitioning',
      description: 'Find the minimum number of cuts needed to partition a string such that every substring is a palindrome.',
      image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Hard',
      timeComplexity: 'O(n³)',
      spaceComplexity: 'O(n²)',
      category: 'String',
      icon: <Calculator size={20} />
    }
  ];

  const categories = [
    { id: 'all', name: 'All Problems' },
    { id: 'Classic', name: 'Classic DP' },
    { id: 'String', name: 'String DP' },
    { id: 'Array', name: 'Array DP' }
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
            Dynamic Programming
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-80 px-4">
            Master dynamic programming with classic problems and step-by-step visualizations showing optimal substructure and memoization techniques.
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
                  placeholder="Search dynamic programming problems..."
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
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src={algo.image} 
                  alt={algo.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-full mr-2
                                  ${theme === 'dark' 
                                    ? 'bg-dark-primary/20 text-dark-primary' 
                                    : 'bg-light-primary/20 text-light-primary'}`}>
                      {algo.icon}
                    </div>
                  </div>
                  <h3 className="text-white text-lg sm:text-xl font-bold">{algo.name}</h3>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
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
          <DynamicProgrammingVisualizer
            algorithm={selectedAlgorithm}
            onClose={() => setSelectedAlgorithm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicProgrammingPage;