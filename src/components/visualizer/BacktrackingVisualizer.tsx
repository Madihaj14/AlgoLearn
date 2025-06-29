import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Code, Settings, X, Grid, Crown, Hash, Route } from 'lucide-react';
import { VisualizationStep, VisualizerState } from '../../lib/visualizer/types';
import { NQueensVisualizer } from '../../lib/visualizer/backtracking/nQueens';
import { SudokuVisualizer } from '../../lib/visualizer/backtracking/sudoku';
import { HamiltonianPathVisualizer } from '../../lib/visualizer/backtracking/hamiltonianPath';
import { SubsetSumVisualizer } from '../../lib/visualizer/backtracking/subsetSum';

interface BacktrackingVisualizerProps {
  algorithm: string;
  onClose: () => void;
}

const BacktrackingVisualizer: React.FC<BacktrackingVisualizerProps> = ({ algorithm, onClose }) => {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'java'>('javascript');
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
      category: 'Backtracking',
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
  }, [algorithm]);

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
      case 'n-queens':
        visualizer = new NQueensVisualizer(8);
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'sudoku-solver':
        visualizer = new SudokuVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'hamiltonian-path':
        visualizer = new HamiltonianPathVisualizer(5);
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'subset-sum':
        visualizer = new SubsetSumVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
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

  const renderVisualization = () => {
    if (state.steps.length === 0) return null;

    const currentStepData = state.steps[state.currentStep];

    switch (algorithm) {
      case 'n-queens':
        return <NQueensBoard stepData={currentStepData} />;
      case 'sudoku-solver':
        return <SudokuBoard stepData={currentStepData} />;
      case 'hamiltonian-path':
        return <HamiltonianGraph stepData={currentStepData} />;
      case 'subset-sum':
        return <SubsetSumVisualization stepData={currentStepData} />;
      default:
        return null;
    }
  };

  const getAlgorithmIcon = () => {
    switch (algorithm) {
      case 'n-queens':
        return <Crown size={24} />;
      case 'sudoku-solver':
        return <Grid size={24} />;
      case 'hamiltonian-path':
        return <Route size={24} />;
      case 'subset-sum':
        return <Hash size={24} />;
      default:
        return <Hash size={24} />;
    }
  };

  const getCurrentCode = () => {
    if (typeof state.algorithm.code === 'string') {
      return state.algorithm.code;
    }
    return state.algorithm.code?.[selectedLanguage] || '';
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

          {/* Visualization Area */}
          <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
            {renderVisualization()}
          </div>

          {/* Step Description */}
          {state.config.showDescription && state.steps[state.currentStep] && (
            <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
              <div className="text-sm font-medium mb-2">Step {state.currentStep + 1} of {state.steps.length}</div>
              <div className="text-sm">{state.steps[state.currentStep].description}</div>
              {state.steps[state.currentStep].metadata?.backtrackCount > 0 && (
                <div className="text-xs mt-2 opacity-70">
                  Backtracks: {state.steps[state.currentStep].metadata.backtrackCount}
                </div>
              )}
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

// N-Queens Board Component
const NQueensBoard: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { board, queens, conflicts } = stepData.data;
  const n = board.length;

  return (
    <div className="flex justify-center">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {board.map((row: number[], i: number) =>
          row.map((cell: number, j: number) => {
            const isQueen = cell === 1;
            const isConflict = conflicts?.some(([r, c]: [number, number]) => r === i && c === j);
            const isHighlighted = stepData.highlights.includes(i * n + j);
            
            return (
              <motion.div
                key={`${i}-${j}`}
                className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-bold border
                          ${(i + j) % 2 === 0 
                            ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                            : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                          }
                          ${isHighlighted ? 'ring-2 ring-blue-500' : ''}
                          ${isConflict ? 'bg-red-500' : ''}`}
                animate={{
                  scale: isHighlighted ? 1.1 : 1,
                  backgroundColor: isConflict ? '#ef4444' : undefined
                }}
                transition={{ duration: 0.3 }}
              >
                {isQueen && <Crown size={16} className="text-yellow-500" />}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Sudoku Board Component
const SudokuBoard: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { board, currentCell, invalidCells } = stepData.data;

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-9 gap-1 p-2 border-2 border-gray-400">
        {board.map((row: number[], i: number) =>
          row.map((cell: number, j: number) => {
            const isCurrentCell = currentCell && currentCell[0] === i && currentCell[1] === j;
            const isInvalid = invalidCells?.some(([r, c]: [number, number]) => r === i && c === j);
            const isBoxBorder = (i % 3 === 2 && i < 8) || (j % 3 === 2 && j < 8);
            
            return (
              <motion.div
                key={`${i}-${j}`}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold border
                          ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
                          ${isCurrentCell ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
                          ${isInvalid ? 'bg-red-200 text-red-700' : ''}
                          ${isBoxBorder ? 'border-r-2 border-b-2 border-gray-800' : ''}`}
                animate={{
                  scale: isCurrentCell ? 1.1 : 1,
                  backgroundColor: isInvalid ? '#fecaca' : undefined
                }}
                transition={{ duration: 0.3 }}
              >
                {cell !== 0 && cell}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Hamiltonian Graph Component
const HamiltonianGraph: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { graph, path, visitedVertices, edges, currentVertex } = stepData.data;
  const vertices = graph.length;

  // Calculate positions for vertices in a circle
  const getVertexPosition = (index: number) => {
    const angle = (2 * Math.PI * index) / vertices;
    const radius = 80;
    const centerX = 150;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="flex justify-center">
      <svg width="300" height="300" className="border rounded-lg">
        {/* Draw edges */}
        {graph.map((row, i) =>
          row.map((connected, j) => {
            if (connected && i < j) {
              const pos1 = getVertexPosition(i);
              const pos2 = getVertexPosition(j);
              const isInPath = edges?.some(([a, b]) => (a === i && b === j) || (a === j && b === i));
              
              return (
                <line
                  key={`edge-${i}-${j}`}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke={isInPath ? '#3b82f6' : theme === 'dark' ? '#6b7280' : '#9ca3af'}
                  strokeWidth={isInPath ? 3 : 1}
                />
              );
            }
            return null;
          })
        )}

        {/* Draw vertices */}
        {Array.from({ length: vertices }, (_, i) => {
          const pos = getVertexPosition(i);
          const isVisited = visitedVertices?.includes(i);
          const isCurrent = currentVertex === i;
          
          return (
            <g key={`vertex-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isCurrent ? 18 : 15}
                fill={isVisited ? '#10b981' : isCurrent ? '#3b82f6' : theme === 'dark' ? '#374151' : '#e5e7eb'}
                stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                strokeWidth={2}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className={`text-sm font-bold ${theme === 'dark' ? 'fill-white' : 'fill-black'}`}
              >
                {i}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Subset Sum Visualization Component
const SubsetSumVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { numbers, target, currentSubset, currentSum, currentIndex, subsetIndices } = stepData.data;

  return (
    <div className="space-y-6">
      {/* Target and Current Sum */}
      <div className="text-center">
        <div className="flex justify-center items-center gap-8 mb-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <div className="text-sm font-medium mb-1">Target Sum</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
              {target}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <div className="text-sm font-medium mb-1">Current Sum</div>
            <div className={`text-2xl font-bold ${
              currentSum === target ? 'text-green-500' : 
              currentSum > target ? 'text-red-500' : 
              theme === 'dark' ? 'text-dark-text' : 'text-light-text'
            }`}>
              {currentSum}
            </div>
          </div>
        </div>
      </div>

      {/* Numbers Array */}
      <div>
        <div className="text-sm font-medium mb-3 text-center">Numbers Array</div>
        <div className="flex justify-center">
          <div className="flex gap-2 flex-wrap justify-center">
            {numbers.map((num, index) => {
              const isCurrentIndex = index === currentIndex;
              const isInSubset = subsetIndices?.includes(index);
              const isHighlighted = stepData.highlights.includes(index);
              
              return (
                <motion.div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg border-2
                            ${isInSubset 
                              ? 'bg-green-500 text-white border-green-600' 
                              : isCurrentIndex
                                ? theme === 'dark' 
                                  ? 'bg-dark-primary text-dark-background border-dark-primary'
                                  : 'bg-light-primary text-white border-light-primary'
                                : theme === 'dark'
                                  ? 'bg-dark-surface border-gray-600'
                                  : 'bg-light-surface border-gray-300'
                            }`}
                  animate={{
                    scale: isHighlighted || isCurrentIndex ? 1.1 : 1,
                    y: isInSubset ? -5 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {num}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Subset */}
      <div>
        <div className="text-sm font-medium mb-3 text-center">Current Subset</div>
        <div className="flex justify-center">
          <div className={`min-h-16 p-4 rounded-lg border-2 border-dashed
                        ${theme === 'dark' ? 'border-gray-600 bg-dark-surface' : 'border-gray-300 bg-light-surface'}`}>
            {currentSubset.length > 0 ? (
              <div className="flex gap-2 flex-wrap justify-center">
                {currentSubset.map((num, index) => (
                  <motion.div
                    key={`subset-${index}`}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold rounded-lg bg-green-500 text-white"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 italic">Empty subset</div>
            )}
          </div>
        </div>
        <div className="text-center mt-2 text-sm">
          Subset: [{currentSubset.join(', ')}] = {currentSum}
        </div>
      </div>

      {/* Status Indicator */}
      {stepData.completed.length > 0 && (
        <motion.div
          className="text-center p-4 rounded-lg bg-green-500 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-lg font-bold">✅ Solution Found!</div>
          <div>Subset [{currentSubset.join(', ')}] sums to {target}</div>
        </motion.div>
      )}
    </div>
  );
};

export default BacktrackingVisualizer;