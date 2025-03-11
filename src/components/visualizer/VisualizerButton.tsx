import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Play } from 'lucide-react';

interface VisualizerButtonProps {
  algorithm: string;
}

const VisualizerButton: React.FC<VisualizerButtonProps> = ({ algorithm }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Only show button for algorithms that have visualizations
  const visualizableAlgorithms = [
    'bubble-sort',
    'quick-sort',
    'merge-sort',
    'insertion-sort',
    'selection-sort',
    'heap-sort',
    'binary-search',
    'linear-search'
  ];
  
  if (!visualizableAlgorithms.includes(algorithm)) {
    return null;
  }
  
  return (
    <button 
      onClick={() => navigate(`/visualization/${algorithm}`)}
      className={`flex items-center text-sm font-medium
                ${theme === 'dark'
                  ? 'text-dark-primary hover:text-dark-primary/80'
                  : 'text-light-primary hover:text-light-primary/80'}`}
    >
      <Play size={16} className="mr-1" /> Visualize
    </button>
  );
};

export default VisualizerButton;