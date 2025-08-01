import React from 'react';
import { Zap, Target, Clock, BarChart3 } from 'lucide-react';

interface AnalysisOptionsProps {
  selectedType: 'quick' | 'advanced';
  onTypeChange: (type: 'quick' | 'advanced') => void;
  disabled?: boolean;
}

export const AnalysisOptions: React.FC<AnalysisOptionsProps> = ({
  selectedType,
  onTypeChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        onClick={() => !disabled && onTypeChange('quick')}
        className={`
          p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
          ${selectedType === 'quick'
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 hover:border-blue-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${selectedType === 'quick' ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Analyse Rapide</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Analyse de base avec les indicateurs principaux pour une évaluation rapide.
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>~30 secondes</span>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-4 h-4" />
            <span>5 indicateurs</span>
          </div>
        </div>
      </div>

      <div
        onClick={() => !disabled && onTypeChange('advanced')}
        className={`
          p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
          ${selectedType === 'advanced'
            ? 'border-purple-500 bg-purple-50 shadow-lg'
            : 'border-gray-200 hover:border-purple-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${selectedType === 'advanced' ? 'bg-purple-500' : 'bg-gray-400'}`}>
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Analyse Avancée</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Analyse approfondie avec tous les indicateurs et analyse section par section.
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>~2 minutes</span>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-4 h-4" />
            <span>8 indicateurs</span>
          </div>
        </div>
      </div>
    </div>
  );
};