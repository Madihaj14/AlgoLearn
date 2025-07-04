import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronRight, Filter, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisualizerButton from '../components/visualizer/VisualizerButton';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  image: string;
  categories: string[];
  timeComplexity: string;
  spaceComplexity: string;
  subcategory?: string;
}

const AlgorithmsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'sorting', name: 'Sorting' },
    { id: 'searching', name: 'Searching' },
    { id: 'backtracking', name: 'Backtracking' },
    { id: 'graph', name: 'Graph' },
    { id: 'dynamic', name: 'Dynamic Programming' },
  ];
  
  const algorithms: Algorithm[] = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      description: 'A comprehensive collection of sorting algorithms including bubble sort, insertion sort, selection sort, quick sort, and merge sort with detailed visualizations.',
      image: 'https://images.unsplash.com/photo-1518281420975-50db6e5d0a97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      categories: ['sorting'],
      timeComplexity: 'Varies',
      spaceComplexity: 'Varies',
      subcategory: 'sorting'
    },
    {
      id: 'searching',
      name: 'Searching Algorithms',
      description: 'Explore various searching algorithms including linear search, binary search, jump search, and interpolation search with interactive visualizations.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      categories: ['searching'],
      timeComplexity: 'Varies',
      spaceComplexity: 'Varies',
      subcategory: 'searching'
    },
    {
      id: 'backtracking',
      name: 'Backtracking Algorithms',
      description: 'A collection of algorithms that systematically search for solutions by trying partial solutions and abandoning them if they cannot lead to a complete solution.',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      categories: ['backtracking'],
      timeComplexity: 'Varies',
      spaceComplexity: 'Varies',
      subcategory: 'backtracking'
    },
    {
      id: 'graph',
      name: 'Graph Algorithms',
      description: 'Comprehensive collection of graph algorithms including DFS, BFS, Dijkstra\'s shortest path, topological sorting, and minimum spanning tree algorithms.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2034&q=80',
      categories: ['graph'],
      timeComplexity: 'Varies',
      spaceComplexity: 'Varies',
      subcategory: 'graph'
    },
    {
      id: 'dynamic-programming',
      name: 'Dynamic Programming',
      description: 'Master dynamic programming with classic problems like Fibonacci, Knapsack, Longest Common Subsequence, and more with step-by-step visualizations.',
      image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
      categories: ['dynamic'],
      timeComplexity: 'Varies',
      spaceComplexity: 'Varies',
      subcategory: 'dynamic-programming'
    }
  ];
  
  const filteredAlgorithms = algorithms.filter(algo => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || algo.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleAlgorithmClick = (algo: Algorithm) => {
    if (algo.subcategory === 'backtracking') {
      navigate('/algorithms/backtracking');
    } else if (algo.subcategory === 'sorting') {
      navigate('/algorithms/sorting');
    } else if (algo.subcategory === 'searching') {
      navigate('/algorithms/searching');
    } else if (algo.subcategory === 'graph') {
      navigate('/algorithms/graph');
    } else if (algo.subcategory === 'dynamic-programming') {
      navigate('/algorithms/dynamic-programming');
    } else {
      // Handle other algorithm types
      navigate(`/documentation/${algo.id}`);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Algorithms
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-80 px-4">
            Explore various algorithms and learn how they work through interactive visualizations.
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
                  placeholder="Search algorithms..."
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
              className="card card-glass overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAlgorithmClick(algo)}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src={algo.image} 
                  alt={algo.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-lg sm:text-xl font-bold">{algo.name}</h3>
                </div>
                {algo.subcategory && (
                  <div className="absolute top-4 right-4">
                    <ArrowRight size={20} className="text-white" />
                  </div>
                )}
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
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {algo.categories.map(category => (
                    <span 
                      key={`${algo.id}-${category}`}
                      className={`text-xs px-2 py-1 rounded-full
                               ${theme === 'dark'
                                 ? 'bg-dark-primary/20 text-dark-primary'
                                 : 'bg-light-primary/20 text-light-primary'}`}
                    >
                      {categories.find(c => c.id === category)?.name}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  {!algo.subcategory && <VisualizerButton algorithm={algo.id} />}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/documentation/${algo.id}`);
                    }}
                    className={`flex items-center justify-center text-sm font-medium
                              ${theme === 'dark'
                                ? 'text-dark-primary hover:text-dark-primary/80'
                                : 'text-light-primary hover:text-light-primary/80'}`}
                  >
                    <BookOpen size={16} className="mr-1" /> Learn
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/practice');
                    }}
                    className={`flex items-center justify-center text-sm font-medium
                              ${theme === 'dark'
                                ? 'text-dark-primary hover:text-dark-primary/80'
                                : 'text-light-primary hover:text-light-primary/80'}`}
                  >
                    Practice
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl opacity-80">No algorithms found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={`mt-4 flex items-center mx-auto text-sm font-medium
                        ${theme === 'dark'
                          ? 'text-dark-primary'
                          : 'text-light-primary'}`}
            >
              Reset filters <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmsPage;