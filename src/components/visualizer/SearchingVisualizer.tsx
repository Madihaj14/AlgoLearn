import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Code, Settings, X, Search, Target, Zap, Shuffle } from 'lucide-react';
import { VisualizationStep, VisualizerState } from '../../lib/visualizer/types';
import { LinearSearchVisualizer } from '../../lib/visualizer/searching/linearSearch';
import { BinarySearchVisualizer } from '../../lib/visualizer/searching/binarySearch';
import { JumpSearchVisualizer } from '../../lib/visualizer/searching/jumpSearch';
import { InterpolationSearchVisualizer } from '../../lib/visualizer/searching/interpolationSearch';

interface SearchingVisualizerProps {
  algorithm: string;
  onClose: () => void;
}

const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({ algorithm, onClose }) => {
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
      category: 'Searching',
      description: '',
      timeComplexity: '',
      spaceComplexity: '',
      difficulty: 'Medium',
      code: ''
    }
  });

  const [customArray, setCustomArray] = useState<string>('10, 23, 45, 70, 11, 15, 30, 55, 88, 99');
  const [targetValue, setTargetValue] = useState<number>(30);
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

  const parseArray = (arrayString: string): number[] => {
    try {
      return arrayString
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
    } catch {
      return [10, 23, 45, 70, 11, 15, 30, 55, 88, 99];
    }
  };

  const initializeAlgorithm = (inputArray?: number[], target?: number) => {
    const array = inputArray || parseArray(customArray);
    const searchTarget = target !== undefined ? target : targetValue;
    let visualizer: any;
    let algorithmInfo: any;
    let steps: VisualizationStep[] = [];

    switch (algorithm) {
      case 'linear-search':
        visualizer = new LinearSearchVisualizer(array, searchTarget);
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'binary-search':
        visualizer = new BinarySearchVisualizer(array, searchTarget);
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'jump-search':
        visualizer = new JumpSearchVisualizer(array, searchTarget);
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'interpolation-search':
        visualizer = new InterpolationSearchVisualizer(array, searchTarget);
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

  const generateRandomArray = () => {
    const size = 8 + Math.floor(Math.random() * 5); // 8-12 elements
    const array = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b);
    const randomTarget = array[Math.floor(Math.random() * array.length)];
    setCustomArray(array.join(', '));
    setTargetValue(randomTarget);
    initializeAlgorithm(array, randomTarget);
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
      case 'linear-search':
        return <Search size={24} />;
      case 'binary-search':
        return <Target size={24} />;
      case 'jump-search':
        return <Zap size={24} />;
      case 'interpolation-search':
        return <Target size={24} />;
      default:
        return <Search size={24} />;
    }
  };

  const getCurrentCode = () => {
    if (typeof state.algorithm.code === 'string') {
      return state.algorithm.code;
    }
    return state.algorithm.code?.[selectedLanguage] || '';
  };

  const renderArrayVisualization = () => {
    if (state.steps.length === 0) return null;

    const currentStepData = state.steps[state.currentStep];
    const array = currentStepData.data.array;
    const target = currentStepData.data.target;

    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-center">
          <span className="text-sm font-medium mr-2">Searching for:</span>
          <span className={`text-xl font-bold px-3 py-1 rounded-lg
                          ${theme === 'dark' 
                            ? 'bg-dark-primary/20 text-dark-primary' 
                            : 'bg-light-primary/20 text-light-primary'}`}>
            {target}
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-2 p-4">
          {array.map((value: number, index: number) => {
            const isHighlighted = currentStepData.highlights.includes(index);
            const isComparing = currentStepData.comparisons.includes(index);
            const isFound = currentStepData.completed.includes(index);
            const isInRange = currentStepData.data.searchRange && 
                             index >= currentStepData.data.searchRange[0] && 
                             index <= currentStepData.data.searchRange[1];
            
            let backgroundColor = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';
            let textColor = 'text-white';
            
            if (isFound) {
              backgroundColor = 'bg-green-500';
              textColor = 'text-white';
            } else if (isComparing) {
              backgroundColor = theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary';
              textColor = 'text-white';
            } else if (isHighlighted) {
              backgroundColor = 'bg-yellow-500';
              textColor = 'text-black';
            } else if (isInRange) {
              backgroundColor = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400';
              textColor = 'text-white';
            }

            return (
              <motion.div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-sm
                          ${backgroundColor} ${textColor} border-2 border-transparent`}
                animate={{
                  scale: isHighlighted || isComparing ? 1.1 : 1,
                  borderColor: isFound ? '#10b981' : 'transparent'
                }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.div>
            );
          })}
        </div>

        {/* Array indices */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
          {array.map((_: number, index: number) => (
            <div key={index} className="w-12 text-center text-xs opacity-60">
              {index}
            </div>
          ))}
        </div>
      </div>
    );
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

          {/* Array and Target Input */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Array (comma-separated)</label>
                <input
                  type="text"
                  value={customArray}
                  onChange={(e) => setCustomArray(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border
                            ${theme === 'dark'
                              ? 'bg-dark-surface border-dark-primary/30 text-dark-text'
                              : 'bg-light-surface border-light-primary/30 text-light-text'}`}
                  placeholder="e.g., 10, 23, 45, 70, 11, 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Value</label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 rounded-lg border
                            ${theme === 'dark'
                              ? 'bg-dark-surface border-dark-primary/30 text-dark-text'
                              : 'bg-light-surface border-light-primary/30 text-light-text'}`}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => initializeAlgorithm()}
                className={`px-4 py-2 rounded-lg font-medium
                          ${theme === 'dark'
                            ? 'bg-dark-primary text-dark-background'
                            : 'bg-light-primary text-white'}`}
              >
                Apply
              </button>
              <button
                onClick={generateRandomArray}
                className={`p-2 rounded-lg
                          ${theme === 'dark'
                            ? 'bg-dark-surface hover:bg-dark-primary/20'
                            : 'bg-light-surface hover:bg-light-primary/20'}`}
                title="Generate Random Array"
              >
                <Shuffle size={20} />
              </button>
            </div>
          </div>

          {/* Visualization Area */}
          <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
            {renderArrayVisualization()}
          </div>

          {/* Statistics */}
          {state.steps[state.currentStep] && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {state.steps[state.currentStep].data.comparisons !== undefined && (
                <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
                  <div className="text-sm font-medium mb-1">Comparisons</div>
                  <div className="text-xl font-bold">{state.steps[state.currentStep].data.comparisons}</div>
                </div>
              )}
              {state.steps[state.currentStep].data.position !== undefined && (
                <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
                  <div className="text-sm font-medium mb-1">Position</div>
                  <div className="text-xl font-bold">
                    {state.steps[state.currentStep].data.position === -1 ? 'Not Found' : state.steps[state.currentStep].data.position}
                  </div>
                </div>
              )}
              {state.steps[state.currentStep].data.jumpSize !== undefined && (
                <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
                  <div className="text-sm font-medium mb-1">Jump Size</div>
                  <div className="text-xl font-bold">{state.steps[state.currentStep].data.jumpSize}</div>
                </div>
              )}
              {state.steps[state.currentStep].data.searchRange && (
                <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}>
                  <div className="text-sm font-medium mb-1">Search Range</div>
                  <div className="text-xl font-bold">
                    [{state.steps[state.currentStep].data.searchRange[0]}, {state.steps[state.currentStep].data.searchRange[1]}]
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm justify-center">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              <span>Unvisited</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
              <span>Search Range</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'}`}></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-yellow-500"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-green-500"></div>
              <span>Found</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchingVisualizer;