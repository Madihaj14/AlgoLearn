import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Code, Settings, ArrowLeft } from 'lucide-react';
import { algorithms, getAlgorithmTitle, getAlgorithmDescription, getAlgorithmCode } from '../../lib/algorithms';

interface VisualizerState {
  array: number[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
}

const AlgorithmVisualizerPage: React.FC = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [state, setState] = useState<VisualizerState>({
    array: [12, 29, 38, 27, 4, 9, 19, 36, 24, 22],
    currentStep: 0,
    isPlaying: false,
    speed: 1,
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: []
  });
  
  const [steps, setSteps] = useState<any[]>([]);
  const [codeVisible, setCodeVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!algorithmId || !algorithms[algorithmId]) {
      navigate('/algorithms');
      return;
    }
    
    generateSteps();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [algorithmId, state.array]);

  const generateSteps = () => {
    if (!algorithmId || !algorithms[algorithmId]) return;
    
    const algorithm = algorithms[algorithmId];
    const newSteps = algorithm(state.array);
    setSteps(newSteps);
    
    // Set initial state from first step
    if (newSteps.length > 0) {
      const initialStep = newSteps[0];
      setState(prev => ({
        ...prev,
        currentStep: 0,
        isPlaying: false,
        array: [...initialStep.array],
        comparingIndices: [...initialStep.comparing],
        swappingIndices: [...initialStep.swapping],
        sortedIndices: [...initialStep.sorted]
      }));
    }
  };

  const togglePlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const stepForward = () => {
    if (state.currentStep < steps.length - 1) {
      const nextStep = steps[state.currentStep + 1];
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        array: [...nextStep.array],
        comparingIndices: [...nextStep.comparing],
        swappingIndices: [...nextStep.swapping],
        sortedIndices: [...nextStep.sorted]
      }));
    } else {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const stepBackward = () => {
    if (state.currentStep > 0) {
      const prevStep = steps[state.currentStep - 1];
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        array: [...prevStep.array],
        comparingIndices: [...prevStep.comparing],
        swappingIndices: [...prevStep.swapping],
        sortedIndices: [...prevStep.sorted]
      }));
    }
  };

  const resetVisualization = () => {
    if (steps.length === 0) return;
    
    const initialStep = steps[0];
    setState(prev => ({
      ...prev,
      currentStep: 0,
      isPlaying: false,
      array: [...initialStep.array],
      comparingIndices: [...initialStep.comparing],
      swappingIndices: [...initialStep.swapping],
      sortedIndices: [...initialStep.sorted]
    }));
  };

  const generateNewArray = () => {
    const newArray = Array.from(
      { length: 10 }, 
      () => Math.floor(Math.random() * 50) + 5
    );
    setState(prev => ({ 
      ...prev, 
      array: newArray,
      currentStep: 0,
      isPlaying: false,
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: []
    }));
  };

  useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = setInterval(() => {
        stepForward();
      }, 1000 / state.speed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isPlaying, state.speed, state.currentStep]);

  const maxValue = Math.max(...state.array) * 1.2;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center text-sm font-medium
                      ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
        </div>

        {/* Visualization Area */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="card card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {algorithmId && getAlgorithmTitle(algorithmId)}
              </h2>
              <p className="text-lg mb-6 opacity-80">
                {algorithmId && getAlgorithmDescription(algorithmId)}
              </p>

              {/* Array Visualization */}
              <div className={`p-6 rounded-lg mb-6 
                            ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
                <div className="flex items-end justify-center h-64 gap-1">
                  {state.array.map((value, index) => (
                    <motion.div
                      key={index}
                      className={`w-12 rounded-t-lg flex items-end justify-center
                                ${state.sortedIndices.includes(index)
                                  ? 'bg-green-500'
                                  : state.comparingIndices.includes(index)
                                    ? theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'
                                    : state.swappingIndices.includes(index)
                                      ? 'bg-red-500'
                                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
                      style={{ 
                        height: `${(value / maxValue) * 100}%`,
                        transition: 'height 0.3s ease-in-out'
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="text-xs font-medium mb-1 text-white">
                        {value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetVisualization}
                    className={`p-2 rounded-full hover:bg-opacity-80
                              ${theme === 'dark' 
                                ? 'bg-dark-surface' 
                                : 'bg-light-surface'}`}
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button
                    onClick={stepBackward}
                    disabled={state.currentStep === 0}
                    className={`p-2 rounded-full hover:bg-opacity-80
                              ${state.currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                              ${theme === 'dark' 
                                ? 'bg-dark-surface' 
                                : 'bg-light-surface'}`}
                  >
                    <SkipBack size={20} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className={`p-2 rounded-full
                              ${theme === 'dark' 
                                ? 'bg-dark-primary text-dark-background' 
                                : 'bg-light-primary text-white'}`}
                  >
                    {state.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={stepForward}
                    disabled={state.currentStep === steps.length - 1}
                    className={`p-2 rounded-full hover:bg-opacity-80
                              ${state.currentStep === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
                              ${theme === 'dark' 
                                ? 'bg-dark-surface' 
                                : 'bg-light-surface'}`}
                  >
                    <SkipForward size={20} />
                  </button>
                  <button
                    onClick={generateNewArray}
                    className={`p-2 rounded-full hover:bg-opacity-80
                              ${theme === 'dark' 
                                ? 'bg-dark-surface' 
                                : 'bg-light-surface'}`}
                  >
                    <Settings size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Speed:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.5"
                      value={state.speed}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        speed: parseFloat(e.target.value) 
                      }))}
                      className="w-24"
                    />
                    <span className="text-sm ml-2">{state.speed}x</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm mr-2">Step:</span>
                    <span className="text-sm">
                      {state.currentStep} / {steps.length - 1}
                    </span>
                  </div>

                  <button
                    onClick={() => setCodeVisible(!codeVisible)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm
                              ${theme === 'dark' 
                                ? 'bg-dark-surface hover:bg-dark-primary/20' 
                                : 'bg-light-surface hover:bg-light-primary/20'}`}
                  >
                    <Code size={16} />
                    {codeVisible ? 'Hide Code' : 'Show Code'}
                  </button>
                </div>
              </div>

              {/* Code View */}
              {codeVisible && algorithmId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-6 rounded-lg p-4 overflow-auto max-h-80
                            ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
                >
                  <pre className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                    <code>{getAlgorithmCode(algorithmId)}</code>
                  </pre>
                </motion.div>
              )}
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm justify-center">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  <span>Unsorted</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-2 ${theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'}`}></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 bg-red-500"></div>
                  <span>Swapping</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 bg-green-500"></div>
                  <span>Sorted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizerPage;