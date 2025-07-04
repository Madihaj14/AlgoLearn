import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Code, Settings, X, Calculator, Grid, TrendingUp, Layers } from 'lucide-react';
import { VisualizationStep, VisualizerState } from '../../lib/visualizer/types';
import { FibonacciVisualizer } from '../../lib/visualizer/dp/fibonacci';
import { KnapsackVisualizer } from '../../lib/visualizer/dp/knapsack';
import { LCSVisualizer } from '../../lib/visualizer/dp/lcs';
import { LISVisualizer } from '../../lib/visualizer/dp/lis';
import { EditDistanceVisualizer } from '../../lib/visualizer/dp/editDistance';
import { CoinChangeVisualizer } from '../../lib/visualizer/dp/coinChange';
import { MatrixChainVisualizer } from '../../lib/visualizer/dp/matrixChain';
import { PalindromePartitioningVisualizer } from '../../lib/visualizer/dp/palindromePartitioning';

interface DynamicProgrammingVisualizerProps {
  algorithm: string;
  onClose: () => void;
}

const DynamicProgrammingVisualizer: React.FC<DynamicProgrammingVisualizerProps> = ({ algorithm, onClose }) => {
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
      category: 'Dynamic Programming',
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
      case 'fibonacci':
        visualizer = new FibonacciVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'knapsack-01':
        visualizer = new KnapsackVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'lcs':
        visualizer = new LCSVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'lis':
        visualizer = new LISVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'edit-distance':
        visualizer = new EditDistanceVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'coin-change':
        visualizer = new CoinChangeVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'matrix-chain':
        visualizer = new MatrixChainVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'palindrome-partitioning':
        visualizer = new PalindromePartitioningVisualizer();
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

  const getAlgorithmIcon = () => {
    switch (algorithm) {
      case 'fibonacci':
      case 'coin-change':
        return <Calculator size={24} />;
      case 'knapsack-01':
      case 'matrix-chain':
        return <Grid size={24} />;
      case 'lis':
        return <TrendingUp size={24} />;
      case 'lcs':
      case 'edit-distance':
      case 'palindrome-partitioning':
        return <Layers size={24} />;
      default:
        return <Calculator size={24} />;
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
      case 'fibonacci':
        return <FibonacciVisualization stepData={currentStepData} />;
      case 'knapsack-01':
        return <KnapsackVisualization stepData={currentStepData} />;
      case 'lcs':
        return <LCSVisualization stepData={currentStepData} />;
      case 'lis':
        return <LISVisualization stepData={currentStepData} />;
      case 'edit-distance':
        return <EditDistanceVisualization stepData={currentStepData} />;
      case 'coin-change':
        return <CoinChangeVisualization stepData={currentStepData} />;
      case 'matrix-chain':
        return <MatrixChainVisualization stepData={currentStepData} />;
      case 'palindrome-partitioning':
        return <PalindromePartitioningVisualization stepData={currentStepData} />;
      default:
        return null;
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

// Visualization Components for each DP algorithm
const FibonacciVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { n, dpTable, currentN, result } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Computing Fibonacci({n})</h3>
        <p className="text-sm opacity-80">Current: F({currentN}) = {result !== undefined ? result : '?'}</p>
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-6 gap-2">
          {dpTable.map((value: number, index: number) => (
            <div
              key={index}
              className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2
                        ${index === currentN
                          ? theme === 'dark'
                            ? 'bg-dark-primary text-dark-background border-dark-primary'
                            : 'bg-light-primary text-white border-light-primary'
                          : value !== -1
                            ? 'bg-green-500/20 border-green-500'
                            : theme === 'dark'
                              ? 'bg-dark-surface border-gray-600'
                              : 'bg-light-surface border-gray-300'
                        }`}
            >
              <div className="text-xs">F({index})</div>
              <div className="text-sm font-bold">{value === -1 ? '?' : value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const KnapsackVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { items, capacity, dpTable, currentItem, currentWeight } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Items</h3>
          <div className="space-y-2">
            {items.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border
                          ${index === currentItem
                            ? theme === 'dark'
                              ? 'bg-dark-primary/20 border-dark-primary'
                              : 'bg-light-primary/20 border-light-primary'
                            : theme === 'dark'
                              ? 'bg-dark-surface border-gray-600'
                              : 'bg-light-surface border-gray-300'
                          }`}
              >
                <div className="flex justify-between">
                  <span>Item {index + 1}</span>
                  <span>W: {item.weight}, V: {item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">DP Table</h3>
          <div className="overflow-auto">
            <table className="border-collapse border border-gray-400 text-sm">
              <thead>
                <tr>
                  <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    Item/Weight
                  </th>
                  {Array.from({ length: capacity + 1 }, (_, w) => (
                    <th key={w} className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dpTable.map((row: number[], i: number) => (
                  <tr key={i}>
                    <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {i}
                    </th>
                    {row.map((value: number, w: number) => {
                      const isCurrent = i === currentItem && w === currentWeight;
                      return (
                        <td
                          key={w}
                          className={`border border-gray-400 p-2 text-center
                                    ${isCurrent ? 'bg-blue-500 text-white' :
                                      value > 0 ? 'bg-green-200' :
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const LCSVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { str1, str2, dpTable, currentI, currentJ, lcsLength } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Longest Common Subsequence</h3>
        <div className="flex justify-center gap-4">
          <div>String 1: <span className="font-mono">{str1}</span></div>
          <div>String 2: <span className="font-mono">{str2}</span></div>
        </div>
        <div className="mt-2">LCS Length: {lcsLength}</div>
      </div>
      
      <div className="flex justify-center">
        <div className="overflow-auto">
          <table className="border-collapse border border-gray-400 text-sm">
            <thead>
              <tr>
                <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  
                </th>
                <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  ε
                </th>
                {str2.split('').map((char, j) => (
                  <th key={j} className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row: number[], i: number) => (
                <tr key={i}>
                  <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {i === 0 ? 'ε' : str1[i - 1]}
                  </th>
                  {row.map((value: number, j: number) => {
                    const isCurrent = i === currentI && j === currentJ;
                    return (
                      <td
                        key={j}
                        className={`border border-gray-400 p-2 text-center
                                  ${isCurrent ? 'bg-blue-500 text-white' :
                                    value > 0 ? 'bg-green-200' :
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LISVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { array, dpTable, currentIndex, lisLength } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Longest Increasing Subsequence</h3>
        <p className="text-sm opacity-80">LIS Length: {lisLength}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Array</h4>
          <div className="flex justify-center gap-2">
            {array.map((value: number, index: number) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2
                          ${index === currentIndex
                            ? theme === 'dark'
                              ? 'bg-dark-primary text-dark-background border-dark-primary'
                              : 'bg-light-primary text-white border-light-primary'
                            : theme === 'dark'
                              ? 'bg-dark-surface border-gray-600'
                              : 'bg-light-surface border-gray-300'
                          }`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">DP Table (LIS ending at each index)</h4>
          <div className="flex justify-center gap-2">
            {dpTable.map((value: number, index: number) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2
                          ${index === currentIndex
                            ? theme === 'dark'
                              ? 'bg-dark-primary text-dark-background border-dark-primary'
                              : 'bg-light-primary text-white border-light-primary'
                            : value > 0
                              ? 'bg-green-500/20 border-green-500'
                              : theme === 'dark'
                                ? 'bg-dark-surface border-gray-600'
                                : 'bg-light-surface border-gray-300'
                          }`}
              >
                {value || 0}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditDistanceVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { str1, str2, dpTable, currentI, currentJ, editDistance } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Edit Distance (Levenshtein)</h3>
        <div className="flex justify-center gap-4">
          <div>String 1: <span className="font-mono">{str1}</span></div>
          <div>String 2: <span className="font-mono">{str2}</span></div>
        </div>
        <div className="mt-2">Edit Distance: {editDistance}</div>
      </div>
      
      <div className="flex justify-center">
        <div className="overflow-auto">
          <table className="border-collapse border border-gray-400 text-sm">
            <thead>
              <tr>
                <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  
                </th>
                <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  ε
                </th>
                {str2.split('').map((char, j) => (
                  <th key={j} className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row: number[], i: number) => (
                <tr key={i}>
                  <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {i === 0 ? 'ε' : str1[i - 1]}
                  </th>
                  {row.map((value: number, j: number) => {
                    const isCurrent = i === currentI && j === currentJ;
                    return (
                      <td
                        key={j}
                        className={`border border-gray-400 p-2 text-center
                                  ${isCurrent ? 'bg-blue-500 text-white' :
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CoinChangeVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { coins, amount, dpTable, currentAmount, minCoins } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Coin Change Problem</h3>
        <div className="flex justify-center gap-4">
          <div>Coins: [{coins.join(', ')}]</div>
          <div>Target Amount: {amount}</div>
        </div>
        <div className="mt-2">Minimum Coins: {minCoins !== undefined ? minCoins : '?'}</div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">DP Table (Min coins needed for each amount)</h4>
        <div className="flex justify-center">
          <div className="overflow-auto">
            <div className="flex">
              {dpTable.map((value: number, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-8 flex items-center justify-center border-b
                                ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                    {index}
                  </div>
                  <div
                    className={`w-12 h-12 flex items-center justify-center border
                              ${index === currentAmount
                                ? theme === 'dark'
                                  ? 'bg-dark-primary text-dark-background border-dark-primary'
                                  : 'bg-light-primary text-white border-light-primary'
                                : value !== Infinity
                                  ? 'bg-green-500/20 border-green-500'
                                  : theme === 'dark'
                                    ? 'bg-dark-surface border-gray-600'
                                    : 'bg-light-surface border-gray-300'
                              }`}
                  >
                    {value === Infinity ? '∞' : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MatrixChainVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { matrices, dpTable, currentI, currentJ, minOperations } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Matrix Chain Multiplication</h3>
        <div className="flex justify-center gap-2">
          {matrices.map((matrix: any, index: number) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-lg border
                        ${theme === 'dark'
                          ? 'bg-dark-surface border-gray-600'
                          : 'bg-light-surface border-gray-300'}`}
            >
              <div className="text-sm">M{index}</div>
              <div className="text-xs opacity-80">{matrix.rows}×{matrix.cols}</div>
            </div>
          ))}
        </div>
        <div className="mt-2">Minimum Operations: {minOperations !== undefined ? minOperations : '?'}</div>
      </div>
      
      <div className="flex justify-center">
        <div className="overflow-auto">
          <table className="border-collapse border border-gray-400 text-sm">
            <thead>
              <tr>
                <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  i\j
                </th>
                {matrices.map((_, j) => (
                  <th key={j} className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {j}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row: number[], i: number) => (
                <tr key={i}>
                  <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {i}
                  </th>
                  {row.map((value: number, j: number) => {
                    const isCurrent = i === currentI && j === currentJ;
                    return (
                      <td
                        key={j}
                        className={`border border-gray-400 p-2 text-center
                                  ${isCurrent ? 'bg-blue-500 text-white' :
                                    value !== Infinity ? 'bg-green-200' :
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                      >
                        {value === Infinity ? '∞' : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PalindromePartitioningVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { string, dpTable, isPalindrome, currentI, currentJ, minCuts } = stepData.data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Palindrome Partitioning</h3>
        <div className="font-mono text-lg">{string}</div>
        <div className="mt-2">Minimum Cuts: {minCuts !== undefined ? minCuts : '?'}</div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">DP Table (Min cuts for each substring)</h4>
        <div className="flex justify-center">
          <div className="overflow-auto">
            <table className="border-collapse border border-gray-400 text-sm">
              <thead>
                <tr>
                  <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    i\j
                  </th>
                  {string.split('').map((char, j) => (
                    <th key={j} className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dpTable.map((row: number[], i: number) => (
                  <tr key={i}>
                    <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {string[i]}
                    </th>
                    {row.map((value: number, j: number) => {
                      const isCurrent = i === currentI && j === currentJ;
                      const isPal = isPalindrome && isPalindrome[i] && isPalindrome[i][j];
                      
                      return (
                        <td
                          key={j}
                          className={`border border-gray-400 p-2 text-center
                                    ${isCurrent ? 'bg-blue-500 text-white' :
                                      isPal ? 'bg-purple-200' :
                                      value !== Infinity ? 'bg-green-200' :
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                        >
                          {value === Infinity ? '∞' : value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProgrammingVisualizer;