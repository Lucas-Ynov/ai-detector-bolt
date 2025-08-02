import React from 'react';
import { Brain, Zap, Search, BarChart3 } from 'lucide-react';

interface LoadingAnimationProps {
  analysisType: 'quick' | 'advanced';
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ analysisType }) => {
  const steps = analysisType === 'advanced' 
    ? [
        { icon: Brain, label: 'Connexion aux APIs professionnelles', duration: 800 },
        { icon: Search, label: 'Analyse Originality.ai + Winston AI', duration: 1000 },
        { icon: BarChart3, label: 'Détection OpenAI + analyse locale', duration: 700 },
        { icon: Zap, label: 'Synthèse et génération du rapport', duration: 500 },
      ]
    : [
        { icon: Brain, label: 'Appel aux APIs de détection', duration: 600 },
        { icon: Search, label: 'Analyse multi-sources', duration: 500 },
        { icon: Zap, label: 'Compilation des résultats', duration: 400 },
      ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Analyse en cours...
          </h3>
          <p className="text-gray-600">
            {analysisType === 'advanced' ? 'Analyse approfondie' : 'Analyse rapide'} du texte
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <step.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{step.label}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
                    style={{ 
                      width: '100%',
                      animation: `loading ${step.duration}ms ease-in-out infinite`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Utilisation des dernières techniques de détection IA
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0%, 100% { transform: scaleX(0.8); opacity: 0.8; }
          50% { transform: scaleX(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};