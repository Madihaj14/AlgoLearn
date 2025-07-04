import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronRight, ChevronDown, Clock, Database, Code, ArrowRight, Filter, Tag, BookMarked, X, Bookmark, Award, Cpu, BarChart2, GitBranch, Layers, Zap } from 'lucide-react';
import { dataStructuresContent, algorithmsContent } from '../data/documentationContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation, useNavigate } from 'react-router-dom';

const DocumentationPage: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'complexity' | 'applications'>('overview');
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Topics', icon: <BookOpen size={18} /> },
    { id: 'data-structures', name: 'Data Structures', icon: <Database size={18} /> },
    { id: 'algorithms', name: 'Algorithms', icon: <Code size={18} /> }
  ];

  // Combined content for easier filtering
  const allContent = {
    ...dataStructuresContent,
    ...algorithmsContent
  };

  // Check for hash in URL to select a document on load
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const doc = allContent[hash];
      if (doc) {
        setSelectedDoc(doc);
      }
    }
  }, [location]);
  
  const handleTopicClick = (topicId: string) => {
    const doc = allContent[topicId];
    if (doc) {
      setSelectedDoc(doc);
      // Update URL hash without navigating
      window.history.replaceState(null, '', `#${topicId}`);
    }
  };

  // Filter topics based on search query and category
  const getFilteredTopics = () => {
    return Object.values(allContent).filter(doc => {
      const matchesSearch = searchQuery.trim() === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'data-structures' && dataStructuresContent[doc.id]) ||
        (selectedCategory === 'algorithms' && algorithmsContent[doc.id]);
      
      return matchesSearch && matchesCategory;
    });
  };

  const filteredTopics = getFilteredTopics();

  // Group topics by category
  const dataStructuresTopics = Object.values(dataStructuresContent);
  const algorithmsTopics = Object.values(algorithmsContent);

  // Get icon for a topic
  const getTopicIcon = (topicId: string) => {
    const iconMap: Record<string, JSX.Element> = {
      // Data Structures
      'arrays': <Layers size={24} />,
      'linked-list': <GitBranch size={24} />,
      'stack': <Layers size={24} />,
      'queue': <Layers size={24} />,
      'tree': <GitBranch size={24} />,
      'graph': <GitBranch size={24} />,
      'hash-table': <Database size={24} />,
      'heap': <Database size={24} />,
      
      // Algorithms
      'bubble-sort': <BarChart2 size={24} />,
      'quick-sort': <BarChart2 size={24} />,
      'merge-sort': <BarChart2 size={24} />,
      'insertion-sort': <BarChart2 size={24} />,
      'selection-sort': <BarChart2 size={24} />,
      'heap-sort': <BarChart2 size={24} />,
      'binary-search': <Zap size={24} />,
      'linear-search': <Zap size={24} />
    };
    
    return iconMap[topicId] || <Bookmark size={24} />;
  };

  // Get background image for a topic
  const getTopicImage = (topicId: string) => {
    const imageMap: Record<string, string> = {
      // Data Structures
      'arrays': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1036&q=80',
      'linked-list': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2034&q=80',
      'stack': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
      'queue': 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
      'tree': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      'graph': 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'hash-table': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'heap': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      
      // Algorithms
      'bubble-sort': 'https://images.unsplash.com/photo-1518281420975-50db6e5d0a97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'quick-sort': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'merge-sort': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2034&q=80',
      'insertion-sort': 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'selection-sort': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
      'heap-sort': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'binary-search': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'linear-search': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    };
    
    return imageMap[topicId] || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-4xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            DSA Documentation
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-80">
            Comprehensive guides and resources for data structures and algorithms.
          </p>
        </motion.div>
        
        {/* Search and Filter Bar */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className={`flex items-center p-2 rounded-full
                           ${theme === 'dark' 
                             ? 'bg-dark-surface border border-dark-primary/30' 
                             : 'bg-light-surface border border-light-primary/30'}`}>
                <Search size={20} className="ml-2 mr-1 opacity-60" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-3 py-2 bg-transparent focus:outline-none
                            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center
                            ${selectedCategory === category.id
                              ? theme === 'dark'
                                ? 'bg-dark-primary text-dark-background'
                                : 'bg-light-primary text-white'
                              : theme === 'dark'
                                ? 'bg-dark-surface hover:bg-dark-primary/20'
                                : 'bg-light-surface hover:bg-light-primary/20'
                            }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Selected Document Detail View */}
          <AnimatePresence>
            {selectedDoc && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className={`w-full max-w-5xl max-h-[90vh] overflow-auto rounded-xl shadow-xl
                            ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  {/* Header with background image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getTopicImage(selectedDoc.id)} 
                      alt={selectedDoc.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 flex items-center">
                      <div className={`p-3 rounded-full mr-4
                                    ${theme === 'dark' 
                                      ? 'bg-dark-primary/30 text-dark-primary' 
                                      : 'bg-light-primary/30 text-light-primary'}`}>
                        {getTopicIcon(selectedDoc.id)}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedDoc.title}</h2>
                        <p className="text-white/80">{selectedDoc.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedDoc(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  {/* Content Tabs */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 text-sm font-medium
                                  ${activeTab === 'overview'
                                    ? theme === 'dark'
                                      ? 'border-b-2 border-dark-primary text-dark-primary'
                                      : 'border-b-2 border-light-primary text-light-primary'
                                    : theme === 'dark'
                                      ? 'text-gray-300 hover:text-white'
                                      : 'text-gray-600 hover:text-black'
                                  }`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveTab('complexity')}
                        className={`px-6 py-3 text-sm font-medium
                                  ${activeTab === 'complexity'
                                    ? theme === 'dark'
                                      ? 'border-b-2 border-dark-primary text-dark-primary'
                                      : 'border-b-2 border-light-primary text-light-primary'
                                    : theme === 'dark'
                                      ? 'text-gray-300 hover:text-white'
                                      : 'text-gray-600 hover:text-black'
                                  }`}
                      >
                        Complexity Analysis
                      </button>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-6 py-3 text-sm font-medium
                                  ${activeTab === 'applications'
                                    ? theme === 'dark'
                                      ? 'border-b-2 border-dark-primary text-dark-primary'
                                      : 'border-b-2 border-light-primary text-light-primary'
                                    : theme === 'dark'
                                      ? 'text-gray-300 hover:text-white'
                                      : 'text-gray-600 hover:text-black'
                                  }`}
                      >
                        Applications
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className={`prose max-w-none
                                    ${theme === 'dark'
                                      ? 'prose-invert'
                                      : 'prose-gray'}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc.content || "Detailed content coming soon."}</ReactMarkdown>
                      </div>
                    )}
                    
                    {activeTab === 'complexity' && (
                      <div>
                        {selectedDoc.timeComplexity && (
                          <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <Clock size={20} className="mr-2" />
                              Time Complexity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {Object.entries(selectedDoc.timeComplexity).map(([key, value]) => (
                                <div
                                  key={`complexity-${key}`}
                                  className={`p-4 rounded-lg
                                            ${theme === 'dark'
                                              ? 'bg-dark-background'
                                              : 'bg-light-background'}`}
                                >
                                  <div className="flex items-center mb-2">
                                    <span className="capitalize">{key} Case</span>
                                  </div>
                                  <span className={`text-lg font-mono
                                                ${theme === 'dark'
                                                  ? 'text-dark-primary'
                                                  : 'text-light-primary'}`}>
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedDoc.spaceComplexity && (
                          <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <Database size={20} className="mr-2" />
                              Space Complexity
                            </h3>
                            <div className={`p-4 rounded-lg
                                          ${theme === 'dark'
                                            ? 'bg-dark-background'
                                            : 'bg-light-background'}`}>
                              <div className="flex items-center justify-between">
                                <span>Auxiliary Space:</span>
                                <span className={`text-lg font-mono
                                              ${theme === 'dark'
                                                ? 'text-dark-primary'
                                                : 'text-light-primary'}`}>
                                  {selectedDoc.spaceComplexity}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeTab === 'applications' && (
                      <div>
                        {selectedDoc.applications ? (
                          <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <Tag size={20} className="mr-2" />
                              Real-world Applications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedDoc.applications.map((app, index) => (
                                <div
                                  key={`application-${index}`}
                                  className={`p-4 rounded-lg
                                            ${theme === 'dark'
                                              ? 'bg-dark-background'
                                              : 'bg-light-background'}`}
                                >
                                  <div className="flex items-start">
                                    <span className="mr-2 text-xl">•</span>
                                    <span>{app}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="opacity-80">No application data available for this topic.</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Related Topics */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-semibold mb-4">Related Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(allContent)
                          .filter(d => d.id !== selectedDoc.id)
                          .slice(0, 4)
                          .map(d => (
                            <button
                              key={d.id}
                              onClick={() => {
                                setSelectedDoc(d);
                                setActiveTab('overview');
                              }}
                              className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                                        ${theme === 'dark'
                                          ? 'bg-dark-background hover:bg-dark-primary/20'
                                          : 'bg-light-background hover:bg-light-primary/20'}`}
                            >
                              {d.title}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {searchQuery || selectedCategory !== 'all' ? (
            // Show filtered results in a grid layout
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-6">Search Results</h3>
              {filteredTopics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTopics.map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      className="card card-glass overflow-hidden group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={getTopicImage(topic.id)} 
                          alt={topic.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center mb-2">
                            <div className={`p-2 rounded-full mr-2 bg-white/20 text-white`}>
                              {getTopicIcon(topic.id)}
                            </div>
                          </div>
                          <h3 className="text-white text-lg font-bold">{topic.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="mb-4 opacity-80 text-sm line-clamp-2">{topic.description}</p>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded-full
                                        ${theme === 'dark'
                                          ? 'bg-dark-primary/20 text-dark-primary'
                                          : 'bg-light-primary/20 text-light-primary'}`}>
                            {dataStructuresContent[topic.id] ? 'Data Structure' : 'Algorithm'}
                          </span>
                          <span className="text-sm flex items-center">
                            View <ArrowRight size={14} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl opacity-80">No topics found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className={`mt-4 px-4 py-2 rounded-lg
                              ${theme === 'dark'
                                ? 'bg-dark-primary text-dark-background'
                                : 'bg-light-primary text-white'}`}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Show regular documentation layout with cards
            <div>
              {/* Data Structures Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Database size={24} className="mr-2" />
                    Data Structures
                  </h2>
                  <button
                    onClick={() => setSelectedCategory('data-structures')}
                    className={`text-sm flex items-center
                              ${theme === 'dark'
                                ? 'text-dark-primary'
                                : 'text-light-primary'}`}
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dataStructuresTopics.slice(0, 6).map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      className="card card-glass overflow-hidden group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={getTopicImage(topic.id)} 
                          alt={topic.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center mb-2">
                            <div className={`p-2 rounded-full mr-2 bg-white/20 text-white`}>
                              {getTopicIcon(topic.id)}
                            </div>
                          </div>
                          <h3 className="text-white text-lg font-bold">{topic.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="mb-4 opacity-80 text-sm line-clamp-2">{topic.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1 opacity-70" />
                            <span className="text-xs opacity-70">
                              {topic.timeComplexity?.average || 'Varies'}
                            </span>
                          </div>
                          <span className="text-sm flex items-center">
                            View <ArrowRight size={14} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Algorithms Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Code size={24} className="mr-2" />
                    Algorithms
                  </h2>
                  <button
                    onClick={() => setSelectedCategory('algorithms')}
                    className={`text-sm flex items-center
                              ${theme === 'dark'
                                ? 'text-dark-primary'
                                : 'text-light-primary'}`}
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {algorithmsTopics.slice(0, 6).map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      className="card card-glass overflow-hidden group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={getTopicImage(topic.id)} 
                          alt={topic.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center mb-2">
                            <div className={`p-2 rounded-full mr-2 bg-white/20 text-white`}>
                              {getTopicIcon(topic.id)}
                            </div>
                          </div>
                          <h3 className="text-white text-lg font-bold">{topic.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="mb-4 opacity-80 text-sm line-clamp-2">{topic.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1 opacity-70" />
                            <span className="text-xs opacity-70">
                              {topic.timeComplexity?.average || 'Varies'}
                            </span>
                          </div>
                          <span className="text-sm flex items-center">
                            View <ArrowRight size={14} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Learning Path */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Award size={24} className="mr-2" />
                  Recommended Learning Path
                </h2>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-1 
                                 ${theme === 'dark' ? 'bg-dark-primary/30' : 'bg-light-primary/30'}`} />
                  
                  {/* Steps */}
                  <div className="space-y-12">
                    {[
                      { title: 'Basic Data Structures', description: 'Start with fundamental data structures like arrays, linked lists, stacks, and queues.', topics: ['arrays', 'linked-list', 'stack', 'queue'] },
                      { title: 'Basic Algorithms', description: 'Learn simple sorting and searching algorithms to understand algorithmic thinking.', topics: ['bubble-sort', 'insertion-sort', 'selection-sort', 'linear-search'] },
                      { title: 'Advanced Data Structures', description: 'Move on to more complex data structures like trees, heaps, and hash tables.', topics: ['tree', 'heap', 'hash-table'] },
                      { title: 'Efficient Algorithms', description: 'Study more efficient algorithms with better time complexity.', topics: ['quick-sort', 'merge-sort', 'binary-search'] },
                      { title: 'Graph Data Structures', description: 'Learn about graphs and their representations.', topics: ['graph'] }
                    ].map((step, index) => (
                      <motion.div 
                        key={index}
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                      >
                        <div className={`flex flex-col md:flex-row items-center
                                       ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          {/* Timeline Dot */}
                          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                           ${theme === 'dark' 
                                             ? 'bg-dark-primary text-dark-background' 
                                             : 'bg-light-primary text-white'}`}>
                              {index + 1}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                            <div className="card card-glass p-6">
                              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                              <p className="opacity-80 mb-4">{step.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {step.topics.map(topicId => {
                                  const topic = allContent[topicId];
                                  return topic ? (
                                    <button
                                      key={topicId}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTopicClick(topicId);
                                      }}
                                      className={`px-3 py-1 rounded-full text-sm
                                                ${theme === 'dark'
                                                  ? 'bg-dark-primary/20 text-dark-primary hover:bg-dark-primary/30'
                                                  : 'bg-light-primary/20 text-light-primary hover:bg-light-primary/30'}`}
                                    >
                                      {topic.title}
                                    </button>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;