import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, BarChart2, Award, BookOpen, Code, Brain, Trophy, ArrowRight } from 'lucide-react';

interface ProgressTopic {
  id: string;
  name: string;
  completed: boolean;
  category: string;
}

interface ProgressCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const ProgressPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Define categories
  const categories: ProgressCategory[] = [
    { 
      id: 'data-structures', 
      name: 'Data Structures', 
      icon: <BookOpen size={18} />,
      color: 'bg-blue-500'
    },
    { 
      id: 'algorithms', 
      name: 'Algorithms', 
      icon: <Code size={18} />,
      color: 'bg-purple-500'
    },
    { 
      id: 'concepts', 
      name: 'Concepts', 
      icon: <Brain size={18} />,
      color: 'bg-green-500'
    },
    { 
      id: 'challenges', 
      name: 'Challenges', 
      icon: <Trophy size={18} />,
      color: 'bg-orange-500'
    }
  ];
  
  // Sample progress data
  const progressTopics: ProgressTopic[] = [
    { id: 'arrays', name: 'Arrays', completed: true, category: 'data-structures' },
    { id: 'linked-lists', name: 'Linked Lists', completed: true, category: 'data-structures' },
    { id: 'stacks', name: 'Stacks', completed: false, category: 'data-structures' },
    { id: 'queues', name: 'Queues', completed: false, category: 'data-structures' },
    { id: 'trees', name: 'Trees', completed: false, category: 'data-structures' },
    { id: 'graphs', name: 'Graphs', completed: false, category: 'data-structures' },
    { id: 'hash-tables', name: 'Hash Tables', completed: false, category: 'data-structures' },
    { id: 'heaps', name: 'Heaps', completed: false, category: 'data-structures' },
    
    { id: 'sorting', name: 'Sorting Algorithms', completed: true, category: 'algorithms' },
    { id: 'searching', name: 'Searching Algorithms', completed: true, category: 'algorithms' },
    { id: 'recursion', name: 'Recursion', completed: false, category: 'algorithms' },
    { id: 'dynamic-programming', name: 'Dynamic Programming', completed: false, category: 'algorithms' },
    { id: 'greedy', name: 'Greedy Algorithms', completed: false, category: 'algorithms' },
    { id: 'backtracking', name: 'Backtracking', completed: false, category: 'algorithms' },
    
    { id: 'time-complexity', name: 'Time Complexity', completed: true, category: 'concepts' },
    { id: 'space-complexity', name: 'Space Complexity', completed: true, category: 'concepts' },
    { id: 'bit-manipulation', name: 'Bit Manipulation', completed: false, category: 'concepts' },
    { id: 'math', name: 'Mathematical Concepts', completed: false, category: 'concepts' },
    
    { id: 'easy-challenges', name: 'Easy Challenges', completed: false, category: 'challenges' },
    { id: 'medium-challenges', name: 'Medium Challenges', completed: false, category: 'challenges' },
    { id: 'hard-challenges', name: 'Hard Challenges', completed: false, category: 'challenges' },
  ];
  
  // Toggle completion status
  const toggleCompletion = (topicId: string) => {
    // In a real app, this would update state or call an API
    console.log(`Toggling completion for ${topicId}`);
  };
  
  // Calculate progress statistics
  const calculateProgress = () => {
    const totalTopics = progressTopics.length;
    const completedTopics = progressTopics.filter(topic => topic.completed).length;
    const progressPercentage = Math.round((completedTopics / totalTopics) * 100);
    
    const categoryProgress = categories.map(category => {
      const categoryTopics = progressTopics.filter(topic => topic.category === category.id);
      const categoryCompleted = categoryTopics.filter(topic => topic.completed).length;
      const categoryPercentage = Math.round((categoryCompleted / categoryTopics.length) * 100);
      
      return {
        ...category,
        total: categoryTopics.length,
        completed: categoryCompleted,
        percentage: categoryPercentage
      };
    });
    
    return {
      totalTopics,
      completedTopics,
      progressPercentage,
      categoryProgress
    };
  };
  
  const progress = calculateProgress();
  
  // Filter topics based on active tab
  const filteredTopics = activeTab === 'overview' 
    ? progressTopics 
    : progressTopics.filter(topic => topic.category === activeTab);

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
            Your Learning Progress
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-80">
            Track your journey through data structures and algorithms.
          </p>
        </motion.div>
        
        {/* Progress Overview */}
        <div className="max-w-5xl mx-auto mb-12">
          <motion.div 
            className="card card-glass p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Overall Progress */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Overall Progress</h2>
                <p className="text-4xl font-bold mb-2">
                  <span className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}>
                    {progress.progressPercentage}%
                  </span>
                </p>
                <p className="opacity-80">
                  {progress.completedTopics} of {progress.totalTopics} topics completed
                </p>
                
                {/* Progress Bar */}
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              
              {/* Achievement Badge */}
              <div className="text-center">
                <motion.div 
                  className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto
                            ${theme === 'dark' 
                              ? 'bg-dark-primary/20 text-dark-primary' 
                              : 'bg-light-primary/20 text-light-primary'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Award size={64} />
                </motion.div>
                <p className="mt-4 font-medium">
                  {progress.progressPercentage < 25 
                    ? 'Beginner Explorer' 
                    : progress.progressPercentage < 50 
                      ? 'Rising Star' 
                      : progress.progressPercentage < 75 
                        ? 'Algorithm Adept' 
                        : 'DSA Master'}
                </p>
              </div>
            </div>
            
            {/* Category Progress */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
              {progress.categoryProgress.map((category) => (
                <motion.div 
                  key={category.id}
                  className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveTab(category.id)}
                >
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-full ${category.color} text-white mr-2`}>
                      {category.icon}
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 mb-2">
                    <div 
                      className={`h-full rounded-full ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm opacity-80">
                    {category.completed}/{category.total} completed
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Topic Tabs */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              className={`px-4 py-2 rounded-full transition-all duration-300
                        ${activeTab === 'overview'
                          ? theme === 'dark'
                            ? 'bg-dark-primary text-dark-background'
                            : 'bg-light-primary text-white'
                          : theme === 'dark'
                            ? 'bg-dark-surface hover:bg-dark-primary/20'
                            : 'bg-light-surface hover:bg-light-primary/20'
                        }`}
              onClick={() => setActiveTab('overview')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <BarChart2 size={16} className="mr-1" />
                Overview
              </div>
            </motion.button>
            
            {categories.map(category => (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-full transition-all duration-300
                          ${activeTab === category.id
                            ? theme === 'dark'
                              ? 'bg-dark-primary text-dark-background'
                              : 'bg-light-primary text-white'
                            : theme === 'dark'
                              ? 'bg-dark-surface hover:bg-dark-primary/20'
                              : 'bg-light-surface hover:bg-light-primary/20'
                          }`}
                onClick={() => setActiveTab(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center">
                  {category.icon}
                  <span className="ml-1">{category.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Topics List */}
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="card card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">
                {activeTab === 'overview' 
                  ? 'All Topics' 
                  : categories.find(c => c.id === activeTab)?.name || 'Topics'}
              </h2>
              
              <div className="space-y-4">
                {filteredTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    className={`p-4 rounded-lg flex items-center justify-between
                              ${theme === 'dark' 
                                ? 'bg-dark-surface hover:bg-dark-primary/10' 
                                : 'bg-light-surface hover:bg-light-primary/10'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center">
                      <button 
                        onClick={() => toggleCompletion(topic.id)}
                        className={`mr-3 transition-colors duration-300
                                  ${topic.completed
                                    ? theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'
                                    : 'text-gray-400'}`}
                      >
                        {topic.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                      </button>
                      <span className={topic.completed ? 'line-through opacity-70' : ''}>
                        {topic.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded-full mr-2
                                      ${categories.find(c => c.id === topic.category)?.color} text-white`}>
                        {categories.find(c => c.id === topic .category)?.name}
                      </span>
                      <a 
                        href={`/${topic.category}/${topic.id}`}
                        className={`flex items-center text-sm
                                  ${theme === 'dark' 
                                    ? 'text-dark-primary hover:text-dark-primary/80' 
                                    : 'text-light-primary hover:text-light-primary/80'}`}
                      >
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredTopics.length === 0 && (
                <div className="text-center py-8">
                  <p className="opacity-80">No topics found in this category.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;