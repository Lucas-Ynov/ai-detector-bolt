import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Brain, Shield, Zap, Target, Users, Award } from 'lucide-react';
import { AnalysisResult } from './types';
import { AIDetectionService } from './services/aiDetection';
import { FileUploader } from './components/FileUploader';
import { TextInput } from './components/TextInput';
import { AnalysisOptions } from './components/AnalysisOptions';
import { AnalysisReport } from './components/AnalysisReport';
import { LoadingAnimation } from './components/LoadingAnimation';

function App() {
  const [currentText, setCurrentText] = useState('');
  const [currentFilename, setCurrentFilename] = useState<string | undefined>();
  const [analysisType, setAnalysisType] = useState<'quick' | 'advanced'>('quick');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');

  const handleTextSubmit = async (text: string) => {
    setCurrentText(text);
    setCurrentFilename(undefined);
    await performAnalysis(text);
  };

  const handleFileProcessed = async (text: string, filename: string) => {
    setCurrentText(text);
    setCurrentFilename(filename);
    toast.success(`Fichier "${filename}" traité avec succès!`);
    await performAnalysis(text);
  };

  const performAnalysis = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const result = await AIDetectionService.analyzeText(text, analysisType);
      result.filename = currentFilename;
      setAnalysisResult(result);
      toast.success('Analyse terminée avec succès!');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse. Veuillez réessayer.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setCurrentText('');
    setCurrentFilename(undefined);
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <div className="container mx-auto px-4 py-8">
          <AnalysisReport 
            analysis={analysisResult} 
            onNewAnalysis={handleNewAnalysis}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {isAnalyzing && <LoadingAnimation analysisType={analysisType} />}

      {/* En-tête */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <Brain className="w-12 h-12" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">AI Detection Pro</h1>
            </div>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Plateforme professionnelle de détection d'utilisation d'IA dans les travaux d'étudiants,
              spécialisée pour les textes en langue française
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Fiabilité maximale</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Spécialisé français</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Usage direct</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Options d'analyse */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Choisissez votre type d'analyse
            </h2>
            <AnalysisOptions
              selectedType={analysisType}
              onTypeChange={setAnalysisType}
              disabled={isAnalyzing}
            />
          </section>

          {/* Onglets pour texte ou fichier */}
          <section>
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('text')}
                className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'text'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Saisir du Texte
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'file'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Importer un Fichier
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeTab === 'text' ? (
                <TextInput
                  onTextSubmit={handleTextSubmit}
                  isAnalyzing={isAnalyzing}
                />
              ) : (
                <FileUploader
                  onFileProcessed={handleFileProcessed}
                  onError={handleError}
                  isProcessing={isAnalyzing}
                />
              )}
            </div>
          </section>

          {/* Fonctionnalités */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Fonctionnalités Avancées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Analyse Intelligente</h3>
                <p className="text-gray-600 text-sm">
                  Algorithmes avancés basés sur les dernières recherches en détection IA
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Rapports Détaillés</h3>
                <p className="text-gray-600 text-sm">
                  Graphiques radar et analyse section par section avec export PDF
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Confidentialité</h3>
                <p className="text-gray-600 text-sm">
                  Vos données restent privées et sécurisées sur nos serveurs français
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 AI Detection Pro - Solution professionnelle de détection d'IA pour l'éducation
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;