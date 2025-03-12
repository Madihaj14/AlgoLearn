import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronRight, ChevronDown, Clock, Database } from 'lucide-react';
import { dataStructuresContent, algorithmsContent } from '../data/documentationContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocSection {
  id: string;
  title: string;
  topics: DocTopic[];
}

interface DocTopic {
  id: string;
  title: string;
  description: string;
}

const DocumentationPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['data-structures']);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const docSections: DocSection[] = [
    {
      id: 'data-structures',
      title: 'Data Structures',
      topics: Object.entries(dataStructuresContent).map(([id, doc]) => ({
        id,
        title: doc.title,
        description: doc.description
      }))
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      topics: Object.entries(algorithmsContent).map(([id, doc]) => ({
        id,
        title: doc.title,
        description: doc.description
      }))
    }
  ];

  const handleTopicClick = (topicId: string) => {
    const doc = dataStructuresContent[topicId] || algorithmsContent[topicId];
    if (doc) {
      setSelectedDoc(doc);
    }
  };

  const filteredSections = searchQuery.trim() === '' 
    ? docSections 
    : docSections.map(section => ({
        ...section,
        topics: section.topics.filter(topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.topics.length > 0);

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
            Documentation
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-80">
            Comprehensive guides and resources for data structures and algorithms.
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className={`flex items-center p-2 rounded-full mb-4
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
              
              {filteredSections.map((section) => (
                <motion.div
                  key={section.id}
                  className="card card-glass mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div 
                    className={`p-4 flex justify-between items-center cursor-pointer
                              ${theme === 'dark' 
                                ? 'bg-dark-primary/10 hover:bg-dark-primary/20' 
                                : 'bg-light-primary/10 hover:bg-light-primary/20'}`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <h2 className="text-2xl font-semibold flex items-center">
                      <BookOpen size={20} className="mr-2" />
                      {section.title}
                    </h2>
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>
                  
                  {expandedSections.includes(section.id) && (
                    <div className="p-4">
                      {section.topics.map((topic) => (
                        <motion.button
                          key={`${section.id}-${topic.id}`}
                          className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-300
                                    ${selectedDoc?.id === topic.id
                                      ? theme === 'dark'
                                        ? 'bg-dark-primary/20 text-dark-primary'
                                        : 'bg-light-primary/20 text-light-primary'
                                      : theme === 'dark'
                                        ? 'hover:bg-dark-primary/10'
                                        : 'hover:bg-light-primary/10'
                                    }`}
                          onClick={() => handleTopicClick(topic.id)}
                        >
                          <h3 className="font-medium mb-1">{topic.title}</h3>
                          <p className="text-sm opacity-80">{topic.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-2">
              {selectedDoc ? (
                <motion.div
                  className="card card-glass"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-6">
                    <h2 className="text-3xl font-bold mb-4">{selectedDoc.title}</h2>
                    <p className="text-lg mb-6 opacity-80">{selectedDoc.description}</p>

                    {/* Complexity Information */}
                    {selectedDoc.timeComplexity && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Time Complexity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(selectedDoc.timeComplexity).map(([key, value]) => (
                            <div
                              key={`complexity-${key}`}
                              className={`p-4 rounded-lg
                                        ${theme === 'dark'
                                          ? 'bg-dark-surface'
                                          : 'bg-light-surface'}`}
                            >
                              <div className="flex items-center mb-2">
                                <Clock size={16} className="mr-2" />
                                <span className="capitalize">{key}</span>
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

                    {/* Space Complexity */}
                    {selectedDoc.spaceComplexity && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Space Complexity</h3>
                        <div className={`p-4 rounded-lg inline-block
                                      ${theme === 'dark'
                                        ? 'bg-dark-surface'
                                        : 'bg-light-surface'}`}>
                          <div className="flex items-center">
                            <Database size={16} className="mr-2" />
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

                    {/* Main Content */}
                    <div className={`prose max-w-none
                                  ${theme === 'dark'
                                    ? 'prose-invert'
                                    : 'prose-gray'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc.content}</ReactMarkdown>
                    </div>

                    {/* Applications */}
                    {selectedDoc.applications && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-3">Applications</h3>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                          {selectedDoc.applications.map((app, index) => (
                            <li key={`application-${index}`}>{app}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xl opacity-80">Select a topic to view its documentation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;