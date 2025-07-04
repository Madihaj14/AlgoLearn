import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Code, Settings, X, TreePine, GitBranch, Network } from 'lucide-react';
import { VisualizationStep, VisualizerState } from '../../lib/visualizer/types';
import { BinarySearchTreeVisualizer } from '../../lib/visualizer/searching/binarySearchTree';
import { TrieSearchVisualizer } from '../../lib/visualizer/searching/trieSearch';
import { BTreeSearchVisualizer } from '../../lib/visualizer/searching/bTreeSearch';

interface TreeSearchVisualizerProps {
  algorithm: string;
  onClose: () => void;
}

const TreeSearchVisualizer: React.FC<TreeSearchVisualizerProps> = ({ algorithm, onClose }) => {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'java'>('javascript');
  const [selectedOperation, setSelectedOperation] = useState<'search' | 'insert' | 'delete'>('search');
  const [searchValue, setSearchValue] = useState<string | number>(45);
  const [state, setState] = useState<VisualizerState>({
    steps: [],
    currentStep: 0,
    isPlaying: false,
    config: {
      speed: 1,
      autoPlay: false,
      showCode: false,
      showDescription: true
    },
    algorithm: {
      id: algorithm,
      name: '',
      category: 'Searching',
      description: '',
      timeComplexity: '',
      spaceComplexity: '',
      difficulty: 'Medium',
      code: ''
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeAlgorithm();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [algorithm, selectedOperation, searchValue]);

  useEffect(() => {
    if (state.isPlaying && state.currentStep < state.steps.length - 1) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.currentStep >= prev.steps.length - 1) {
            return { ...prev, isPlaying: false };
          }
          return { ...prev, currentStep: prev.currentStep + 1 };
        });
      }, 1000 / state.config.speed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isPlaying, state.config.speed, state.currentStep, state.steps.length]);

  const initializeAlgorithm = () => {
    let visualizer: any;
    let algorithmInfo: any;
    let steps: VisualizationStep[] = [];

    switch (algorithm) {
      case 'binary-search-tree':
        visualizer = new BinarySearchTreeVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps(selectedOperation, Number(searchValue));
        break;
      case 'trie-search':
        visualizer = new TrieSearchVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps(selectedOperation === 'delete' ? 'search' : selectedOperation, String(searchValue));
        break;
      case 'b-tree-search':
        visualizer = new BTreeSearchVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps(selectedOperation === 'delete' ? 'search' : selectedOperation, Number(searchValue));
        break;
      default:
        return;
    }

    setState(prev => ({
      ...prev,
      steps,
      currentStep: 0,
      algorithm: algorithmInfo,
      isPlaying: false
    }));
  };

  const togglePlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const stepForward = () => {
    if (state.currentStep < state.steps.length - 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const stepBackward = () => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const reset = () => {
    setState(prev => ({ ...prev, currentStep: 0, isPlaying: false }));
  };

  const updateConfig = (key: keyof typeof state.config, value: any) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const getAlgorithmIcon = () => {
    switch (algorithm) {
      case 'binary-search-tree':
        return <TreePine size={24} />;
      case 'trie-search':
        return <GitBranch size={24} />;
      case 'b-tree-search':
        return <Network size={24} />;
      default:
        return <TreePine size={24} />;
    }
  };

  const getCurrentCode = () => {
    if (typeof state.algorithm.code === 'string') {
      return state.algorithm.code;
    }
    return state.algorithm.code?.[selectedLanguage] || '';
  };

  const renderVisualization = () => {
    if (state.steps.length === 0) return null;

    const currentStepData = state.steps[state.currentStep];

    switch (algorithm) {
      case 'binary-search-tree':
        return <BinarySearchTreeVisualization stepData={currentStepData} />;
      case 'trie-search':
        return <TrieSearchVisualization stepData={currentStepData} />;
      case 'b-tree-search':
        return <BTreeVisualization stepData={currentStepData} />;
      default:
        return null;
    }
  };

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (algorithm === 'trie-search') {
      setSearchValue(value);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setSearchValue(numValue);
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={`w-full max-w-7xl max-h-[95vh] overflow-auto rounded-xl shadow-xl
                  ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-dark-primary/30' : 'border-light-primary/30'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full
                            ${theme === 'dark' 
                              ? 'bg-dark-primary/20 text-dark-primary' 
                              : 'bg-light-primary/20 text-light-primary'}`}>
                {getAlgorithmIcon()}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{state.algorithm.name}</h2>
                <p className="text-sm opacity-80">{state.algorithm.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Algorithm Info */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
              <div className="text-sm font-medium mb-1">Time Complexity</div>
              <div className={`text-lg font-mono ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
                {state.algorithm.timeComplexity}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
              <div className="text-sm font-medium mb-1">Space Complexity</div>
              <div className={`text-lg font-mono ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
                {state.algorithm.spaceComplexity}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
              <div className="text-sm font-medium mb-1">Difficulty</div>
              <div className={`text-lg font-semibold
                            ${state.algorithm.difficulty === 'Easy' ? 'text-green-500' :
                              state.algorithm.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                {state.algorithm.difficulty}
              </div>
            </div>
          </div>

          {/* Operation Selection */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedOperation('search')}
                className={`px-4 py-2 rounded-full transition-all duration-300
                          ${selectedOperation === 'search'
                            ? theme === 'dark'
                              ? 'bg-dark-primary text-dark-background'
                              : 'bg-light-primary text-white'
                            : theme === 'dark'
                              ? 'bg-dark-surface hover:bg-dark-primary/20'
                              : 'bg-light-surface hover:bg-light-primary/20'
                          }`}
              >
                Search
              </button>
              <button
                onClick={() => setSelectedOperation('insert')}
                className={`px-4 py-2 rounded-full transition-all duration-300
                          ${selectedOperation === 'insert'
                            ? theme === 'dark'
                              ? 'bg-dark-primary text-dark-background'
                              : 'bg-light-primary text-white'
                            : theme === 'dark'
                              ? 'bg-dark-surface hover:bg-dark-primary/20'
                              : 'bg-light-surface hover:bg-light-primary/20'
                          }`}
              >
                Insert
              </button>
              {algorithm === 'binary-search-tree' && (
                <button
                  onClick={() => setSelectedOperation('delete')}
                  className={`px-4 py-2 rounded-full transition-all duration-300
                            ${selectedOperation === 'delete'
                              ? theme === 'dark'
                                ? 'bg-dark-primary text-dark-background'
                                : 'bg-light-primary text-white'
                              : theme === 'dark'
                                ? 'bg-dark-surface hover:bg-dark-primary/20'
                                : 'bg-light-surface hover:bg-light-primary/20'
                            }`}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Search/Insert Value Input */}
          <div className="mb-6">
            <div className="flex justify-center gap-4">
              <div className="w-full max-w-xs">
                <label className="block text-sm font-medium mb-2">
                  {selectedOperation === 'search' ? 'Search Value' : 
                   selectedOperation === 'insert' ? 'Insert Value' : 'Delete Value'}
                </label>
                <input
                  type={algorithm === 'trie-search' ? 'text' : 'number'}
                  value={searchValue}
                  onChange={handleSearchValueChange}
                  className={`w-full px-3 py-2 rounded-lg border
                            ${theme === 'dark'
                              ? 'bg-dark-surface border-dark-primary/30 text-dark-text'
                              : 'bg-light-surface border-light-primary/30 text-light-text'}`}
                  placeholder={algorithm === 'trie-search' ? 'Enter prefix or word' : 'Enter a number'}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={initializeAlgorithm}
                  className={`px-4 py-2 rounded-lg font-medium
                            ${theme === 'dark'
                              ? 'bg-dark-primary text-dark-background'
                              : 'bg-light-primary text-white'}`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
            {renderVisualization()}
          </div>

          {/* Step Description */}
          {state.config.showDescription && state.steps[state.currentStep] && (
            <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
              <div className="text-sm font-medium mb-2">Step {state.currentStep + 1} of {state.steps.length}</div>
              <div className="text-sm">{state.steps[state.currentStep].description}</div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Main Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={reset}
                className={`p-2 sm:p-3 rounded-full
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <RefreshCw size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={stepBackward}
                disabled={state.currentStep === 0}
                className={`p-2 sm:p-3 rounded-full
                          ${state.currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <SkipBack size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={togglePlay}
                className={`p-2 sm:p-3 rounded-full
                          ${theme === 'dark' 
                            ? 'bg-dark-primary text-dark-background' 
                            : 'bg-light-primary text-white'}`}
              >
                {state.isPlaying ? <Pause size={16} className="sm:w-5 sm:h-5" /> : <Play size={16} className="sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={stepForward}
                disabled={state.currentStep === state.steps.length - 1}
                className={`p-2 sm:p-3 rounded-full
                          ${state.currentStep === state.steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
                          ${theme === 'dark' 
                            ? 'bg-dark-surface hover:bg-dark-primary/20' 
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
              >
                <SkipForward size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Speed:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={state.config.speed}
                    onChange={(e) => updateConfig('speed', parseFloat(e.target.value))}
                    className="w-20 sm:w-24"
                  />
                  <span className="text-sm ml-2">{state.config.speed}x</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateConfig('showDescription', !state.config.showDescription)}
                  className={`px-3 py-2 rounded-full text-sm
                            ${state.config.showDescription
                              ? theme === 'dark'
                                ? 'bg-dark-primary text-dark-background'
                                : 'bg-light-primary text-white'
                              : theme === 'dark'
                                ? 'bg-dark-surface hover:bg-dark-primary/20'
                                : 'bg-light-surface hover:bg-light-primary/20'
                            }`}
                >
                  Description
                </button>
                <button
                  onClick={() => updateConfig('showCode', !state.config.showCode)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm
                            ${state.config.showCode
                              ? theme === 'dark'
                                ? 'bg-dark-primary text-dark-background'
                                : 'bg-light-primary text-white'
                              : theme === 'dark'
                                ? 'bg-dark-surface hover:bg-dark-primary/20'
                                : 'bg-light-surface hover:bg-light-primary/20'
                            }`}
                >
                  <Code size={16} />
                  Code
                </button>
              </div>
            </div>
          </div>

          {/* Code View */}
          <AnimatePresence>
            {state.config.showCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-6 rounded-lg overflow-hidden
                          ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                {/* Language Selector */}
                {typeof state.algorithm.code === 'object' && (
                  <div className="flex border-b border-gray-600 dark:border-gray-700">
                    <button
                      onClick={() => setSelectedLanguage('javascript')}
                      className={`px-4 py-2 text-sm font-medium
                                ${selectedLanguage === 'javascript'
                                  ? theme === 'dark'
                                    ? 'bg-dark-primary text-dark-background'
                                    : 'bg-light-primary text-white'
                                  : theme === 'dark'
                                    ? 'text-gray-300 hover:text-white'
                                    : 'text-gray-600 hover:text-black'
                                }`}
                    >
                      JavaScript
                    </button>
                    <button
                      onClick={() => setSelectedLanguage('java')}
                      className={`px-4 py-2 text-sm font-medium
                                ${selectedLanguage === 'java'
                                  ? theme === 'dark'
                                    ? 'bg-dark-primary text-dark-background'
                                    : 'bg-light-primary text-white'
                                  : theme === 'dark'
                                    ? 'text-gray-300 hover:text-white'
                                    : 'text-gray-600 hover:text-black'
                                }`}
                    >
                      Java
                    </button>
                  </div>
                )}
                
                <div className="p-4 overflow-auto max-h-80">
                  <pre className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} whitespace-pre-wrap`}>
                    <code>{getCurrentCode()}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Binary Search Tree Visualization Component
const BinarySearchTreeVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { tree, currentNode, searchPath, target, found } = stepData.data;
  
  // Calculate positions for tree visualization
  const calculateNodePositions = () => {
    const positions: Record<number, { x: number; y: number }> = {};
    const nodeMap: Record<number, { value: number; left: number | null; right: number | null }> = {};
    
    // Build node map
    tree.nodes.forEach((node: any) => {
      nodeMap[node.id] = { value: node.value, left: null, right: null };
    });
    
    // Connect nodes
    tree.edges.forEach((edge: any) => {
      const sourceNode = nodeMap[edge.source];
      const targetNode = nodeMap[edge.target];
      
      if (sourceNode.left === null) {
        sourceNode.left = edge.target;
      } else {
        sourceNode.right = edge.target;
      }
    });
    
    // Calculate positions using a level-order traversal
    const rootId = tree.nodes[0]?.id;
    if (rootId !== undefined) {
      const queue: [number, number, number, number][] = [[rootId, 400, 50, 200]]; // [nodeId, x, y, width]
      
      while (queue.length > 0) {
        const [nodeId, x, y, width] = queue.shift()!;
        positions[nodeId] = { x, y };
        
        const node = nodeMap[nodeId];
        if (node.left !== null) {
          queue.push([node.left, x - width/2, y + 80, width/2]);
        }
        if (node.right !== null) {
          queue.push([node.right, x + width/2, y + 80, width/2]);
        }
      }
    }
    
    return { positions, nodeMap };
  };
  
  const { positions, nodeMap } = calculateNodePositions();
  
  return (
    <div className="flex justify-center overflow-auto">
      <svg width="800" height="400" className="border rounded-lg">
        {/* Draw edges */}
        {tree.edges.map((edge: any) => {
          const sourcePos = positions[edge.source];
          const targetPos = positions[edge.target];
          
          if (!sourcePos || !targetPos) return null;
          
          const isInPath = searchPath.includes(edge.source) && searchPath.includes(edge.target);
          
          return (
            <line
              key={`${edge.source}-${edge.target}`}
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              stroke={isInPath ? '#3b82f6' : theme === 'dark' ? '#6b7280' : '#9ca3af'}
              strokeWidth={isInPath ? 3 : 1}
            />
          );
        })}
        
        {/* Draw nodes */}
        {tree.nodes.map((node: any) => {
          const pos = positions[node.id];
          if (!pos) return null;
          
          const isCurrentNode = currentNode === node.id;
          const isInPath = searchPath.includes(node.id);
          const isTarget = node.value === target && found;
          
          let fillColor = theme === 'dark' ? '#374151' : '#e5e7eb';
          if (isTarget) fillColor = '#10b981';
          else if (isCurrentNode) fillColor = '#3b82f6';
          else if (isInPath) fillColor = '#f59e0b';
          
          return (
            <g key={node.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={25}
                fill={fillColor}
                stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                strokeWidth={2}
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className={`text-sm font-bold ${theme === 'dark' ? 'fill-white' : 'fill-black'}`}
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Trie Visualization Component
const TrieSearchVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { trie, currentNode, searchPath, prefix, matches } = stepData.data;
  
  // Calculate positions for trie visualization
  const calculateNodePositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    const levels: Record<number, string[]> = {};
    
    // Group nodes by level using BFS
    const queue: [string, number][] = [['root', 0]];
    while (queue.length > 0) {
      const [nodeId, level] = queue.shift()!;
      
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(nodeId);
      
      // Find children
      trie.edges.forEach((edge: any) => {
        if (edge.source === nodeId) {
          queue.push([edge.target, level + 1]);
        }
      });
    }
    
    // Calculate x positions based on level
    const maxLevel = Object.keys(levels).length;
    Object.entries(levels).forEach(([levelStr, nodes]) => {
      const level = parseInt(levelStr);
      const y = 50 + level * 80;
      const width = 700;
      const nodeSpacing = width / (nodes.length + 1);
      
      nodes.forEach((nodeId, index) => {
        positions[nodeId] = { 
          x: 50 + (index + 1) * nodeSpacing, 
          y 
        };
      });
    });
    
    return positions;
  };
  
  const positions = calculateNodePositions();
  
  // Find node label
  const getNodeLabel = (nodeId: string) => {
    const node = trie.nodes.find((n: any) => n.id === nodeId);
    return node ? node.label : '';
  };
  
  // Get edge label
  const getEdgeLabel = (edge: any) => {
    return edge.label || '';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <div className="flex justify-center gap-4">
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <div className="text-sm font-medium mb-1">Prefix</div>
            <div className={`text-xl font-mono ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
              {prefix || '""'}
            </div>
          </div>
          {matches && matches.length > 0 && (
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
              <div className="text-sm font-medium mb-1">Matches</div>
              <div className="text-xl font-mono">
                {matches.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-auto">
        <svg width="800" height="400" className="border rounded-lg">
          {/* Draw edges */}
          {trie.edges.map((edge: any) => {
            const sourcePos = positions[edge.source];
            const targetPos = positions[edge.target];
            
            if (!sourcePos || !targetPos) return null;
            
            const isInPath = searchPath.includes(edge.source) && searchPath.includes(edge.target);
            
            // Calculate midpoint for edge label
            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;
            
            return (
              <g key={`${edge.source}-${edge.target}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isInPath ? '#3b82f6' : theme === 'dark' ? '#6b7280' : '#9ca3af'}
                  strokeWidth={isInPath ? 3 : 1}
                />
                <circle
                  cx={midX}
                  cy={midY}
                  r={12}
                  fill={theme === 'dark' ? '#1f2937' : '#f3f4f6'}
                  stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className={`text-xs font-bold ${theme === 'dark' ? 'fill-white' : 'fill-black'}`}
                >
                  {getEdgeLabel(edge)}
                </text>
              </g>
            );
          })}
          
          {/* Draw nodes */}
          {trie.nodes.map((node: any) => {
            const pos = positions[node.id];
            if (!pos) return null;
            
            const isCurrentNode = currentNode === node.id;
            const isInPath = searchPath.includes(node.id);
            const isEndOfWord = node.isEndOfWord;
            
            let fillColor = theme === 'dark' ? '#374151' : '#e5e7eb';
            if (isCurrentNode) fillColor = '#3b82f6';
            else if (isInPath) fillColor = '#f59e0b';
            else if (isEndOfWord) fillColor = '#10b981';
            
            return (
              <g key={node.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={20}
                  fill={fillColor}
                  stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className={`text-xs font-bold ${theme === 'dark' ? 'fill-white' : 'fill-black'}`}
                >
                  {node.id === 'root' ? 'root' : ''}
                </text>
                {isEndOfWord && (
                  <circle
                    cx={pos.x}
                    cy={pos.y - 15}
                    r={3}
                    fill={theme === 'dark' ? '#10b981' : '#10b981'}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm justify-center">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <span>Regular Node</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2 bg-yellow-500"></div>
          <span>Path Node</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2 bg-blue-500"></div>
          <span>Current Node</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2 bg-green-500"></div>
          <span>End of Word</span>
        </div>
      </div>
    </div>
  );
};

// B-Tree Visualization Component
const BTreeVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { tree, currentNode, searchPath, target, found } = stepData.data;
  
  if (!tree || !tree.nodes) return <div>Loading tree data...</div>;
  
  // Calculate positions for B-Tree visualization
  const calculateNodePositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    const levels: Record<number, string[]> = {};
    
    // Group nodes by level using BFS
    const queue: [string, number][] = [['root', 0]];
    while (queue.length > 0) {
      const [nodeId, level] = queue.shift()!;
      
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(nodeId);
      
      // Find children
      tree.edges.forEach((edge: any) => {
        if (edge.source === nodeId) {
          queue.push([edge.target, level + 1]);
        }
      });
    }
    
    // Calculate positions based on level
    Object.entries(levels).forEach(([levelStr, nodes]) => {
      const level = parseInt(levelStr);
      const y = 50 + level * 100;
      const width = 700;
      const nodeSpacing = width / (nodes.length + 1);
      
      nodes.forEach((nodeId, index) => {
        positions[nodeId] = { 
          x: 50 + (index + 1) * nodeSpacing, 
          y 
        };
      });
    });
    
    return positions;
  };
  
  const positions = calculateNodePositions();
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
          <div className="text-sm font-medium mb-1">Target</div>
          <div className={`text-xl font-mono ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
            {target}
          </div>
        </div>
      </div>
      
      <div className="overflow-auto">
        <svg width="800" height="400" className="border rounded-lg">
          {/* Draw edges */}
          {tree.edges.map((edge: any, index: number) => {
            const sourcePos = positions[edge.source];
            const targetPos = positions[edge.target];
            
            if (!sourcePos || !targetPos) return null;
            
            const isInPath = searchPath.some((path: any) => 
              path.includes(edge.source) && path.includes(edge.target)
            );
            
            return (
              <line
                key={`${edge.source}-${edge.target}-${index}`}
                x1={sourcePos.x}
                y1={sourcePos.y + 20} // Adjust for node height
                x2={targetPos.x}
                y2={targetPos.y - 20} // Adjust for node height
                stroke={isInPath ? '#3b82f6' : theme === 'dark' ? '#6b7280' : '#9ca3af'}
                strokeWidth={isInPath ? 3 : 1}
              />
            );
          })}
          
          {/* Draw nodes */}
          {tree.nodes.map((node: any) => {
            const pos = positions[node.id];
            if (!pos) return null;
            
            const isCurrentNode = currentNode && node.keys.some((k: number) => currentNode.includes(k));
            const isInPath = searchPath.some((path: any) => path.some((k: number) => node.keys.includes(k)));
            const hasTarget = node.keys.includes(target) && found;
            
            const nodeWidth = Math.max(node.keys.length * 40, 60);
            
            let fillColor = theme === 'dark' ? '#374151' : '#e5e7eb';
            if (hasTarget) fillColor = '#10b981';
            else if (isCurrentNode) fillColor = '#3b82f6';
            else if (isInPath) fillColor = '#f59e0b';
            
            return (
              <g key={node.id}>
                <rect
                  x={pos.x - nodeWidth/2}
                  y={pos.y - 20}
                  width={nodeWidth}
                  height={40}
                  rx={5}
                  fill={fillColor}
                  stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className={`text-sm font-bold ${theme === 'dark' ? 'fill-white' : 'fill-black'}`}
                >
                  {node.keys.join(', ')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm justify-center">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <span>Regular Node</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded mr-2 bg-yellow-500"></div>
          <span>Path Node</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded mr-2 bg-blue-500"></div>
          <span>Current Node</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded mr-2 bg-green-500"></div>
          <span>Target Found</span>
        </div>
      </div>
    </div>
  );
};

export default TreeSearchVisualizer;