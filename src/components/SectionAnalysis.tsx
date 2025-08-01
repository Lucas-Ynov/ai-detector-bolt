import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface SectionAnalysisProps {
  analysis: AnalysisResult;
}

export const SectionAnalysis: React.FC<SectionAnalysisProps> = ({ analysis }) => {
  const getSuspicionIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSuspicionColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSuspicionText = (level: string) => {
    switch (level) {
      case 'high':
        return 'Suspicion Élevée';
      case 'medium':
        return 'Suspicion Modérée';
      case 'low':
        return 'Suspicion Faible';
      default:
        return 'Indéterminé';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Analyse par Sections
      </h3>
      
      <div className="space-y-6">
        {analysis.sectionAnalysis.map((section, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-lg ${getSuspicionColor(section.suspicionLevel)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getSuspicionIcon(section.suspicionLevel)}
                <span className="font-medium text-gray-800">
                  Section {index + 1}
                </span>
                <span className="text-sm text-gray-500">
                  ({getSuspicionText(section.suspicionLevel)})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-700">
                  {section.score}%
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                "{section.text}"
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-gray-800 text-sm mb-2">
                Indicateurs détectés:
              </p>
              <div className="flex flex-wrap gap-2">
                {section.reasons.map((reason, reasonIndex) => (
                  <span
                    key={reasonIndex}
                    className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {analysis.sectionAnalysis.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Aucune section analysée</p>
        </div>
      )}
    </div>
  );
};