import React, { useState } from 'react';
import { Type, AlertCircle } from 'lucide-react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  isAnalyzing: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ onTextSubmit, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (text.trim().length < 50) {
      setError('Le texte doit contenir au moins 50 caractères.');
      return;
    }
    
    if (text.trim().length > 10000) {
      setError('Le texte ne peut pas dépasser 10 000 caractères.');
      return;
    }

    setError('');
    onTextSubmit(text.trim());
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez ici le texte à analyser..."
          className="w-full h-64 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          disabled={isAnalyzing}
        />
        <div className="absolute top-3 right-3">
          <Type className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{wordCount} mots</span>
          <span>{charCount} caractères</span>
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>Min. 50 caractères</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={text.trim().length < 50 || isAnalyzing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isAnalyzing ? 'Analyse...' : 'Analyser le Texte'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};