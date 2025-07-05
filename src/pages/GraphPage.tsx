import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, GitBranch, Route, Shuffle, Play, BookOpen, ArrowLeft, Network, MapPin, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GraphVisualizer from '../components/visualizer/GraphVisualizer';

interface GraphAlgorithm {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  category: 'Traversal' | 'Shortest Path' | 'Minimum Spanning Tree' | 'Topological';
  icon: React.ReactNode;
}

const GraphPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const algorithms: GraphAlgorithm[] = [
    {
      id: 'dfs',
      name: 'Depth First Search (DFS)',
      description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking. Uses a stack-based approach.',
      difficulty: 'Medium',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      category: 'Traversal',
      icon: <GitBranch size={32} />
    },
    {
      id: 'bfs',
      name: 'Breadth First Search (BFS)',
      description: 'A graph traversal algorithm that explores all vertices at the current depth before moving to vertices at the next depth level.',
      difficulty: 'Medium',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      category: 'Traversal',
      icon: <Network size={32} />
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      description: 'Finds the shortest path between nodes in a weighted graph with non-negative edge weights using a greedy approach.',
      difficulty: 'Hard',
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V)',
      category: 'Shortest Path',
      icon: <MapPin size={32} />
    },
    {
      id: 'bellman-ford',
      name: 'Bellman-Ford Algorithm',
      description: 'Computes shortest paths from a single source vertex to all other vertices in a weighted graph, can handle negative weights.',
      difficulty: 'Hard',
      timeComplexity: 'O(VE)',
      spaceComplexity: 'O(V)',
      category: 'Shortest Path',
      icon: <Route size={32} />
    },
    {
      id: 'floyd-warshall',
      name: 'Floyd-Warshall Algorithm',
      description: 'Finds shortest paths between all pairs of vertices in a weighted graph with positive or negative edge weights.',
      difficulty: 'Hard',
      timeComplexity: 'O(V³)',
      spaceComplexity: 'O(V²)',
      category: 'Shortest Path',
      icon: <Network size={32} />
    },
    {
      id: 'kruskal',
      name: "Kruskal's Algorithm",
      description: 'Finds a minimum spanning tree for a connected weighted graph using a greedy algorithm that sorts edges by weight.',
      difficulty: 'Medium',
      timeComplexity: 'O(E log E)',
      spaceComplexity: 'O(V)',
      category: 'Minimum Spanning Tree',
      icon: <TreePine size={32} />
    },
    {
      id: 'prim',
      name: "Prim's Algorithm",
      description: 'Finds a minimum spanning tree for a weighted undirected graph by growing the tree one vertex at a time.',
      difficulty: 'Medium',
      timeComplexity: 'O(E log V)',
      spaceComplexity: 'O(V)',
      category: 'Minimum Spanning Tree',
      icon: <TreePine size={32} />
    },
    {
      id: 'topological-sort',
      name: 'Topological Sort',
      description: 'Linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge, the source comes before the destination.',
      difficulty: 'Medium',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      category: 'Topological',
      icon: <Shuffle size={32} />
    }
  ];

  const categories = [
    { id: 'all', name: 'All Algorithms' },
    { id: 'Traversal', name: 'Graph Traversal' },
    { id: 'Shortest Path', name: 'Shortest Path' },
    { id: 'Minimum Spanning Tree', name: 'MST' },
    { id: 'Topological', name: 'Topological' }
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
            Graph Algorithms
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-80 px-4">
            Explore graph algorithms including traversal, shortest path, minimum spanning tree, and topological sorting with interactive visualizations.
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
                  placeholder="Search graph algorithms..."
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
          <GraphVisualizer
            algorithm={selectedAlgorithm}
            onClose={() => setSelectedAlgorithm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default GraphPage;