import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, Crown, Grid, Route, Hash, Play, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BacktrackingVisualizer from '../components/visualizer/BacktrackingVisualizer';

interface BacktrackingAlgorithm {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  icon: React.ReactNode;
}

const BacktrackingPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);

  const algorithms: BacktrackingAlgorithm[] = [
    {
      id: 'n-queens',
      name: 'N-Queens Problem',
      description: 'Place N queens on an NxN chessboard so that no two queens attack each other. A classic backtracking problem that demonstrates constraint satisfaction.',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Hard',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      icon: <Crown size={20} />
    },
    {
      id: 'sudoku-solver',
      name: 'Sudoku Solver',
      description: 'Solve a 9x9 Sudoku puzzle using backtracking. Fill the grid so that every row, column, and 3x3 box contains digits 1-9.',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Hard',
      timeComplexity: 'O(9^(n*n))',
      spaceComplexity: 'O(n*n)',
      icon: <Grid size={20} />
    },
    {
      id: 'hamiltonian-path',
      name: 'Hamiltonian Path',
      description: 'Find a path in a graph that visits every vertex exactly once. This is a fundamental problem in graph theory and computational complexity.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2034&q=80',
      difficulty: 'Hard',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      icon: <Route size={20} />
    },
    {
      id: 'subset-sum',
      name: 'Subset Sum Problem',
      description: 'Find if there exists a subset of given numbers that sum to a target value. Uses backtracking to explore all possible combinations systematically.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      difficulty: 'Medium',
      timeComplexity: 'O(2^n)',
      spaceComplexity: 'O(n)',
      icon: <Hash size={20} />
    }
  ];

  const filteredAlgorithms = algorithms.filter(algo =>
    algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    algo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Backtracking Algorithms
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-80 px-4">
            Explore backtracking algorithms that systematically search for solutions by trying partial solutions and abandoning them if they cannot lead to a complete solution.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className={`flex items-center p-3 rounded-full
                        ${theme === 'dark'
                          ? 'bg-dark-surface border border-dark-primary/30'
                          : 'bg-light-surface border border-light-primary/30'}`}>
            <Search size={20} className="ml-2 mr-3 opacity-60 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search backtracking algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-2 py-1 bg-transparent focus:outline-none
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
            />
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

                {/* Difficulty Badge */}
                <div className="mb-6">
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
          <BacktrackingVisualizer
            algorithm={selectedAlgorithm}
            onClose={() => setSelectedAlgorithm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BacktrackingPage;