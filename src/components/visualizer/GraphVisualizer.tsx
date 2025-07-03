import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Code, Settings, X, GitBranch, Network, MapPin, Shuffle } from 'lucide-react';
import { VisualizationStep, VisualizerState } from '../../lib/visualizer/types';
import { DFSVisualizer } from '../../lib/visualizer/graph/dfs';
import { BFSVisualizer } from '../../lib/visualizer/graph/bfs';
import { DijkstraVisualizer } from '../../lib/visualizer/graph/dijkstra';
import { BellmanFordVisualizer } from '../../lib/visualizer/graph/bellmanFord';
import { FloydWarshallVisualizer } from '../../lib/visualizer/graph/floydWarshall';
import { KruskalVisualizer } from '../../lib/visualizer/graph/kruskal';
import { PrimVisualizer } from '../../lib/visualizer/graph/prim';
import { TopologicalSortVisualizer } from '../../lib/visualizer/graph/topologicalSort';

interface GraphVisualizerProps {
  algorithm: string;
  onClose: () => void;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ algorithm, onClose }) => {
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
      category: 'Graph',
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
      case 'dfs':
        visualizer = new DFSVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'bfs':
        visualizer = new BFSVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'dijkstra':
        visualizer = new DijkstraVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'bellman-ford':
        visualizer = new BellmanFordVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'floyd-warshall':
        visualizer = new FloydWarshallVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'kruskal':
        visualizer = new KruskalVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'prim':
        visualizer = new PrimVisualizer();
        algorithmInfo = visualizer.getAlgorithmInfo();
        steps = visualizer.generateSteps();
        break;
      case 'topological-sort':
        visualizer = new TopologicalSortVisualizer();
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
      case 'dfs':
        return <GitBranch size={24} />;
      case 'bfs':
        return <Network size={24} />;
      case 'dijkstra':
      case 'bellman-ford':
      case 'floyd-warshall':
        return <MapPin size={24} />;
      case 'kruskal':
      case 'prim':
        return <Network size={24} />;
      case 'topological-sort':
        return <Shuffle size={24} />;
      default:
        return <Network size={24} />;
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
      case 'dfs':
      case 'bfs':
        return <GraphTraversalVisualization stepData={currentStepData} />;
      case 'dijkstra':
      case 'bellman-ford':
        return <ShortestPathVisualization stepData={currentStepData} />;
      case 'floyd-warshall':
        return <AllPairsShortestPathVisualization stepData={currentStepData} />;
      case 'kruskal':
      case 'prim':
        return <MSTVisualization stepData={currentStepData} />;
      case 'topological-sort':
        return <TopologicalSortVisualization stepData={currentStepData} />;
      default:
        return <GraphTraversalVisualization stepData={currentStepData} />;
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

// Graph Traversal Visualization Component
const GraphTraversalVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { graph, visited, queue, stack, currentNode, path } = stepData.data;

  // Calculate positions for vertices in a circle
  const getVertexPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = 120;
    const centerX = 200;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="flex justify-center">
      <svg width="400" height="300" className="border rounded-lg">
        {/* Draw edges */}
        {graph && graph.map((row: number[], i: number) =>
          row.map((connected: number, j: number) => {
            if (connected && i < j) {
              const pos1 = getVertexPosition(i, graph.length);
              const pos2 = getVertexPosition(j, graph.length);
              const isInPath = path?.some(([a, b]: [number, number]) => 
                (a === i && b === j) || (a === j && b === i)
              );
              
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
        {graph && Array.from({ length: graph.length }, (_, i) => {
          const pos = getVertexPosition(i, graph.length);
          const isVisited = visited?.includes(i);
          const isCurrent = currentNode === i;
          const isInQueue = queue?.includes(i);
          const isInStack = stack?.includes(i);
          
          let fillColor = theme === 'dark' ? '#374151' : '#e5e7eb';
          if (isCurrent) fillColor = '#3b82f6';
          else if (isVisited) fillColor = '#10b981';
          else if (isInQueue || isInStack) fillColor = '#f59e0b';
          
          return (
            <g key={`vertex-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isCurrent ? 18 : 15}
                fill={fillColor}
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

// Shortest Path Visualization Component
const ShortestPathVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { graph, distances, currentNode, shortestPath, visited } = stepData.data;

  const getVertexPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = 120;
    const centerX = 200;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="flex justify-center">
      <svg width="400" height="300" className="border rounded-lg">
        {/* Draw edges with weights */}
        {graph && graph.map((row: any[], i: number) =>
          row.map((edge: any, j: number) => {
            if (edge && edge.weight && i < j) {
              const pos1 = getVertexPosition(i, graph.length);
              const pos2 = getVertexPosition(j, graph.length);
              const isInPath = shortestPath?.some(([a, b]: [number, number]) => 
                (a === i && b === j) || (a === j && b === i)
              );
              
              const midX = (pos1.x + pos2.x) / 2;
              const midY = (pos1.y + pos2.y) / 2;
              
              return (
                <g key={`edge-${i}-${j}`}>
                  <line
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
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
                    y={midY + 3}
                    textAnchor="middle"
                    className={`text-xs font-bold ${theme === 'dark' ? 'fill-white' : 'fill-black'}`}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            }
            return null;
          })
        )}

        {/* Draw vertices with distances */}
        {graph && Array.from({ length: graph.length }, (_, i) => {
          const pos = getVertexPosition(i, graph.length);
          const isVisited = visited?.includes(i);
          const isCurrent = currentNode === i;
          const distance = distances?.[i];
          
          let fillColor = theme === 'dark' ? '#374151' : '#e5e7eb';
          if (isCurrent) fillColor = '#3b82f6';
          else if (isVisited) fillColor = '#10b981';
          
          return (
            <g key={`vertex-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isCurrent ? 18 : 15}
                fill={fillColor}
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
              {distance !== undefined && (
                <text
                  x={pos.x}
                  y={pos.y - 25}
                  textAnchor="middle"
                  className={`text-xs font-bold ${theme === 'dark' ? 'fill-cyan-400' : 'fill-blue-600'}`}
                >
                  {distance === Infinity ? '∞' : distance}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// All Pairs Shortest Path Visualization Component
const AllPairsShortestPathVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { distanceMatrix, currentK, currentI, currentJ } = stepData.data;

  return (
    <div className="flex justify-center">
      <div className="overflow-auto">
        <table className="border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                From/To
              </th>
              {distanceMatrix && distanceMatrix[0].map((_: any, j: number) => (
                <th key={j} className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  {j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {distanceMatrix && distanceMatrix.map((row: number[], i: number) => (
              <tr key={i}>
                <th className={`border border-gray-400 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  {i}
                </th>
                {row.map((distance: number, j: number) => {
                  const isCurrentCell = currentI === i && currentJ === j;
                  const isCurrentK = currentK === i || currentK === j;
                  
                  return (
                    <td
                      key={j}
                      className={`border border-gray-400 p-2 text-center
                                ${isCurrentCell ? 'bg-blue-500 text-white' :
                                  isCurrentK ? 'bg-yellow-200' :
                                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                    >
                      {distance === Infinity ? '∞' : distance}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// MST Visualization Component
const MSTVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { graph, mstEdges, currentEdge, visited } = stepData.data;

  const getVertexPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = 120;
    const centerX = 200;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="flex justify-center">
      <svg width="400" height="300" className="border rounded-lg">
        {/* Draw all edges */}
        {graph && graph.map((row: any[], i: number) =>
          row.map((edge: any, j: number) => {
            if (edge && edge.weight && i < j) {
              const pos1 = getVertexPosition(i, graph.length);
              const pos2 = getVertexPosition(j, graph.length);
              const isInMST = mstEdges?.some(([a, b]: [number, number]) => 
                (a === i && b === j) || (a === j && b === i)
              );
              const isCurrent = currentEdge && 
                ((currentEdge[0] === i && currentEdge[1] === j) || 
                 (currentEdge[0] === j && currentEdge[1] === i));
              
              const midX = (pos1.x + pos2.x) / 2;
              const midY = (pos1.y + pos2.y) / 2;
              
              return (
                <g key={`edge-${i}-${j}`}>
                  <line
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={
                      isCurrent ? '#f59e0b' :
                      isInMST ? '#10b981' : 
                      theme === 'dark' ? '#6b7280' : '#9ca3af'
                    }
                    strokeWidth={isInMST || isCurrent ? 3 : 1}
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
                    y={midY + 3}
                    textAnchor="middle"
                    className={`text-xs font-bold ${theme === 'dark' ? 'fill-white' : 'fill-black'}`}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            }
            return null;
          })
        )}

        {/* Draw vertices */}
        {graph && Array.from({ length: graph.length }, (_, i) => {
          const pos = getVertexPosition(i, graph.length);
          const isVisited = visited?.includes(i);
          
          return (
            <g key={`vertex-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={15}
                fill={isVisited ? '#10b981' : theme === 'dark' ? '#374151' : '#e5e7eb'}
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

// Topological Sort Visualization Component
const TopologicalSortVisualization: React.FC<{ stepData: VisualizationStep }> = ({ stepData }) => {
  const { theme } = useTheme();
  const { graph, visited, stack, currentNode, topologicalOrder } = stepData.data;

  const getVertexPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = 120;
    const centerX = 200;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="space-y-6">
      {/* Graph Visualization */}
      <div className="flex justify-center">
        <svg width="400" height="300" className="border rounded-lg">
          {/* Draw directed edges */}
          {graph && graph.map((row: number[], i: number) =>
            row.map((connected: number, j: number) => {
              if (connected) {
                const pos1 = getVertexPosition(i, graph.length);
                const pos2 = getVertexPosition(j, graph.length);
                
                // Calculate arrow position
                const dx = pos2.x - pos1.x;
                const dy = pos2.y - pos1.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const unitX = dx / length;
                const unitY = dy / length;
                
                const arrowStart = {
                  x: pos1.x + unitX * 15,
                  y: pos1.y + unitY * 15
                };
                const arrowEnd = {
                  x: pos2.x - unitX * 15,
                  y: pos2.y - unitY * 15
                };
                
                return (
                  <g key={`edge-${i}-${j}`}>
                    <line
                      x1={arrowStart.x}
                      y1={arrowStart.y}
                      x2={arrowEnd.x}
                      y2={arrowEnd.y}
                      stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                      strokeWidth={1}
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              }
              return null;
            })
          )}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={theme === 'dark' ? '#6b7280' : '#9ca3af'}
              />
            </marker>
          </defs>

          {/* Draw vertices */}
          {graph && Array.from({ length: graph.length }, (_, i) => {
            const pos = getVertexPosition(i, graph.length);
            const isVisited = visited?.includes(i);
            const isCurrent = currentNode === i;
            const isInStack = stack?.includes(i);
            
            let fillColor = theme === 'dark' ? '#374151' : '#e5e7eb';
            if (isCurrent) fillColor = '#3b82f6';
            else if (isVisited) fillColor = '#10b981';
            else if (isInStack) fillColor = '#f59e0b';
            
            return (
              <g key={`vertex-${i}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isCurrent ? 18 : 15}
                  fill={fillColor}
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

      {/* Topological Order */}
      {topologicalOrder && topologicalOrder.length > 0 && (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3">Topological Order:</h3>
          <div className="flex justify-center items-center gap-2">
            {topologicalOrder.map((vertex: number, index: number) => (
              <React.Fragment key={vertex}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                              ${theme === 'dark' ? 'bg-dark-primary text-dark-background' : 'bg-light-primary text-white'}`}>
                  {vertex}
                </div>
                {index < topologicalOrder.length - 1 && (
                  <div className="text-2xl">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;