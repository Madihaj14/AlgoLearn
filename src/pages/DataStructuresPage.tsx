import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Database, List, Box, Layers, GitBranch, Hash, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DataStructure {
  id: string;
  name: string;
  description: string;
  categories: string[];
  icon: React.ReactNode;
}

const DataStructuresPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'linear', name: 'Linear' },
    { id: 'non-linear', name: 'Non-Linear' },
    { id: 'primitive', name: 'Primitive' },
    { id: 'advanced', name: 'Advanced' },
  ];
  
  const dataStructures: DataStructure[] = [
    {
      id: 'arrays',
      name: 'Arrays',
      description: 'A collection of elements stored at contiguous memory locations.',
      categories: ['linear', 'primitive'],
      icon: <Box size={32} />
    },
    {
      id: 'linked-list',
      name: 'Linked Lists',
      description: 'Linear data structure where elements are not stored at contiguous locations.',
      categories: ['linear'],
      icon: <List size={32} />
    },
    {
      id: 'stack',
      name: 'Stacks',
      description: 'Linear data structure that follows the LIFO (Last-In-First-Out) principle.',
      categories: ['linear'],
      icon: <Layers size={32} />
    },
    {
      id: 'queue',
      name: 'Queues',
      description: 'Linear data structure that follows the FIFO (First-In-First-Out) principle.',
      categories: ['linear'],
      icon: <List size={32} />
    },
    {
      id: 'tree',
      name: 'Trees',
      description: 'Hierarchical data structure with a root value and subtrees of children.',
      categories: ['non-linear'],
      icon: <GitBranch size={32} />
    },
    {
      id: 'graph',
      name: 'Graphs',
      description: 'Non-linear data structure consisting of vertices and edges connecting them.',
      categories: ['non-linear'],
      icon: <Grid size={32} />
    },
    {
      id: 'hash-table',
      name: 'Hash Tables',
      description: 'Data structure that implements an associative array abstract data type.',
      categories: ['advanced'],
      icon: <Hash size={32} />
    },
    {
      id: 'heap',
      name: 'Heaps',
      description: 'Specialized tree-based data structure that satisfies the heap property.',
      categories: ['non-linear', 'advanced'],
      icon: <Database size={32} />
    },
  ];
  
  const filteredDataStructures = selectedCategory === 'all'
    ? dataStructures
    : dataStructures.filter(ds => ds.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-4xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Data Structures
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-80">
            Explore various data structures and learn how they work through interactive visualizations.
          </p>
        </motion.div>
        
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-full transition-all duration-300
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
        
        {/* Data Structures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDataStructures.map((ds, index) => (
            <motion.div
              key={ds.id}
              className="card card-glass overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-4 rounded-full
                                ${theme === 'dark' 
                                  ? 'bg-dark-primary/20 text-dark-primary' 
                                  : 'bg-light-primary/20 text-light-primary'}`}>
                    {ds.icon}
                  </div>
                  <h3 className="text-xl font-bold ml-4">{ds.name}</h3>
                </div>
                
                <p className="mb-6 opacity-80">{ds.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ds.categories.map(category => (
                    <span 
                      key={`${ds.id}-${category}`}
                      className={`text-xs px-2 py-1 rounded-full
                               ${theme === 'dark'
                                 ? 'bg-dark-primary/20 text-dark-primary'
                                 : 'bg-light-primary/20 text-light-primary'}`}
                    >
                      {categories.find(c => c.id === category)?.name}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={() => navigate(`/documentation#${ds.id}`)}
                    className={`flex items-center text-sm font-medium
                              ${theme === 'dark'
                                ? 'text-dark-primary'
                                : 'text-light-primary'}`}
                  >
                    <BookOpen size={16} className="mr-1" /> Learn
                  </button>
                  <button 
                    onClick={() => navigate('/practice')}
                    className={`flex items-center text-sm font-medium
                              ${theme === 'dark'
                                ? 'text-dark-primary'
                                : 'text-light-primary'}`}
                  >
                    Practice
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredDataStructures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl opacity-80">No data structures found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataStructuresPage;