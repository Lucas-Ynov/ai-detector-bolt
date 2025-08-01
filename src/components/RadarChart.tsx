import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { AnalysisResult } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  analysis: AnalysisResult;
}

export const RadarChart: React.FC<RadarChartProps> = ({ analysis }) => {
  const data = {
    labels: [
      'Diversité lexicale',
      'Complexité syntaxique',
      'Cohérence sémantique',
      'Patterns répétitifs',
      'Richesse vocabulaire',
      'Variation phrases',
      'Fluidité naturelle',
      'Spécificité française',
    ],
    datasets: [
      {
        label: 'Score de suspicion IA',
        data: [
          analysis.indicators.lexicalDiversity,
          analysis.indicators.syntaxComplexity,
          analysis.indicators.semanticCoherence,
          analysis.indicators.repetitivePatterns,
          analysis.indicators.vocabularyRichness,
          analysis.indicators.sentenceVariation,
          analysis.indicators.naturalFlow,
          analysis.indicators.frenchSpecific,
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(37, 99, 235, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#6B7280',
        },
        grid: {
          color: '#E5E7EB',
        },
        pointLabels: {
          color: '#374151',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${Math.round(context.parsed.r)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Graphique Radar des Indicateurs
      </h3>
      <div className="h-80">
        <Radar data={data} options={options} />
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Plus les valeurs sont élevées, plus la probabilité d'utilisation d'IA est forte
      </p>
    </div>
  );
};