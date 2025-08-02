import React from 'react';
import { Download, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';
import { RadarChart } from './RadarChart';
import { SectionAnalysis } from './SectionAnalysis';
import { ReportGenerator } from '../services/reportGenerator';

interface AnalysisReportProps {
  analysis: AnalysisResult;
  onNewAnalysis: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({
  analysis,
  onNewAnalysis,
}) => {
  const handleDownloadReport = () => {
    ReportGenerator.generatePDF(analysis);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100 border-red-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <AlertTriangle className="w-8 h-8" />;
    if (score >= 40) return <TrendingUp className="w-8 h-8" />;
    return <Brain className="w-8 h-8" />;
  };

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return 'Très probable utilisation d\'IA';
    if (score >= 60) return 'Utilisation d\'IA probable';
    if (score >= 40) return 'Possible assistance IA';
    if (score >= 20) return 'Probable travail humain';
    return 'Très probablement humain';
  };

  return (
    <div className="space-y-8">
      {/* En-tête du rapport */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Rapport d'Analyse</h2>
            <p className="opacity-90">
              Analyse {analysis.analysisType === 'advanced' ? 'approfondie' : 'rapide'} - 
              {analysis.filename && ` Fichier: ${analysis.filename}`}
              {analysis.apiSources && (
                <span className="block text-sm mt-1">
                  Sources: {Object.entries(analysis.apiSources)
                    .filter(([_, active]) => active)
                    .map(([source, _]) => source.charAt(0).toUpperCase() + source.slice(1))
                    .join(', ') || 'Analyse locale uniquement'}
                </span>
              )}
            </p>
            <p className="text-sm opacity-75 mt-1">
              Généré le {new Date(analysis.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={onNewAnalysis}
              className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Nouvelle Analyse
            </button>
          </div>
        </div>
      </div>

      {/* Score global */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className={`p-6 rounded-xl border-2 ${getScoreColor(analysis.overallScore)}`}>
            <div className="flex items-center space-x-4 mb-4">
              {getScoreIcon(analysis.overallScore)}
              <div>
                <h3 className="text-lg font-semibold">Score Global</h3>
                <p className="text-3xl font-bold">{analysis.overallScore}%</p>
              </div>
            </div>
            <p className="font-medium mb-2">{getScoreInterpretation(analysis.overallScore)}</p>
            <p className="text-sm opacity-75">Agent suspecté: {analysis.suspectedAI}</p>
          </div>
        </div>

        {/* Indicateurs détaillés */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Indicateurs Détaillés
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(analysis.indicators).map(([key, value]) => {
                const labels: Record<string, string> = {
                  lexicalDiversity: 'Diversité lexicale',
                  syntaxComplexity: 'Complexité syntaxique',
                  semanticCoherence: 'Cohérence sémantique',
                  repetitivePatterns: 'Patterns répétitifs',
                  vocabularyRichness: 'Richesse vocabulaire',
                  sentenceVariation: 'Variation des phrases',
                  naturalFlow: 'Fluidité naturelle',
                  frenchSpecific: 'Spécificité française',
                };

                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      {labels[key]}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, value)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-10 text-right">
                        {Math.round(value)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Graphique radar */}
      <RadarChart analysis={analysis} />

      {/* Analyse par sections */}
      <SectionAnalysis analysis={analysis} />

      {/* Recommandations */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          Recommandations {analysis.apiSources && Object.values(analysis.apiSources).some(Boolean) && '(Basées sur APIs professionnelles)'}
        </h3>
        <div className="space-y-3 text-blue-700">
          {analysis.overallScore >= 70 && (
            <>
              <p>• Investigation approfondie recommandée - forte probabilité d'utilisation d'IA</p>
              <p>• Vérifier les sources et demander des explications à l'étudiant</p>
              <p>• Considérer une réévaluation orale du sujet traité</p>
            </>
          )}
          {analysis.overallScore >= 40 && analysis.overallScore < 70 && (
            <>
              <p>• Analyse modérée - possible assistance IA détectée</p>
              <p>• Recommandé de discuter avec l'étudiant des méthodes utilisées</p>
              <p>• Sensibilisation aux règles d'utilisation des outils IA</p>
            </>
          )}
          {analysis.overallScore < 40 && (
            <>
              <p>• Le texte présente des caractéristiques principalement humaines</p>
              <p>• Travail probablement original de l'étudiant</p>
              <p>• Aucune action particulière requise</p>
            </>
          )}
          {analysis.apiSources && Object.values(analysis.apiSources).some(Boolean) && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm font-medium">
                ✓ Cette analyse utilise des APIs professionnelles de détection IA pour une fiabilité maximale
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};