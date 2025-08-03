import jsPDF from 'jspdf';
import { AnalysisResult } from '../types';

export class ReportGenerator {
  static generatePDF(analysis: AnalysisResult): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = 30;

    // Couleurs du design web
    const colors = {
      primary: [37, 99, 235], // blue-600
      purple: [124, 58, 237], // purple-600
      red: [239, 68, 68], // red-500
      yellow: [245, 158, 11], // yellow-500
      green: [34, 197, 94], // green-500
      gray: [107, 114, 128], // gray-500
      lightGray: [243, 244, 246], // gray-100
      darkGray: [31, 41, 55] // gray-800
    };

    // Fonction pour ajouter une nouvelle page si nécessaire
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 30) {
        doc.addPage();
        yPosition = 30;
        return true;
      }
      return false;
    };

    // En-tête avec gradient simulé
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setFillColor(...colors.purple);
    doc.rect(pageWidth * 0.6, 0, pageWidth * 0.4, 60, 'F');

    // Titre principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Detection Pro', margin, 25);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Rapport d\'Analyse de Détection IA', margin, 40);
    
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date(analysis.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, margin, 50);

    yPosition = 80;

    // Informations du fichier
    if (analysis.filename) {
      doc.setTextColor(...colors.gray);
      doc.setFontSize(12);
      doc.text(`Fichier analysé: ${analysis.filename}`, margin, yPosition);
      yPosition += 15;
    }

    doc.text(`Type d'analyse: ${analysis.analysisType === 'advanced' ? 'Approfondie' : 'Rapide'}`, margin, yPosition);
    yPosition += 10;

    if (analysis.apiSources) {
      const activeSources = Object.entries(analysis.apiSources)
        .filter(([_, active]) => active)
        .map(([source, _]) => source.charAt(0).toUpperCase() + source.slice(1))
        .join(', ');
      doc.text(`Sources API: ${activeSources || 'Analyse locale uniquement'}`, margin, yPosition);
    }
    yPosition += 25;

    // Score global avec design amélioré
    checkPageBreak(80);
    
    // Boîte colorée pour le score
    const scoreColor = analysis.overallScore > 70 ? colors.red : 
                      analysis.overallScore > 40 ? colors.yellow : colors.green;
    
    doc.setFillColor(...scoreColor);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 50, 5, 5, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SCORE GLOBAL', margin + 10, yPosition + 20);
    
    doc.setFontSize(36);
    doc.text(`${analysis.overallScore}%`, pageWidth - margin - 60, yPosition + 35);
    
    yPosition += 60;

    // Interprétation du score
    doc.setTextColor(...colors.darkGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    
    const interpretation = analysis.overallScore >= 80 ? 'Très probable utilisation d\'IA' :
                          analysis.overallScore >= 60 ? 'Utilisation d\'IA probable' :
                          analysis.overallScore >= 40 ? 'Possible assistance IA' :
                          analysis.overallScore >= 20 ? 'Probable travail humain' :
                          'Très probablement humain';
    
    doc.text(interpretation, margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Agent IA suspecté: ${analysis.suspectedAI}`, margin, yPosition);
    yPosition += 30;

    // Indicateurs détaillés avec barres de progression
    checkPageBreak(200);
    
    doc.setTextColor(...colors.darkGray);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Indicateurs Détaillés', margin, yPosition);
    yPosition += 20;
    
    const indicators = [
      { name: 'Diversité lexicale', value: analysis.indicators.lexicalDiversity },
      { name: 'Complexité syntaxique', value: analysis.indicators.syntaxComplexity },
      { name: 'Cohérence sémantique', value: analysis.indicators.semanticCoherence },
      { name: 'Patterns répétitifs', value: analysis.indicators.repetitivePatterns },
      { name: 'Richesse vocabulaire', value: analysis.indicators.vocabularyRichness },
      { name: 'Variation des phrases', value: analysis.indicators.sentenceVariation },
      { name: 'Fluidité naturelle', value: analysis.indicators.naturalFlow },
      { name: 'Spécificité française', value: analysis.indicators.frenchSpecific }
    ];

    indicators.forEach(indicator => {
      checkPageBreak(25);
      
      const barWidth = 120;
      const barHeight = 8;
      const value = Math.round(indicator.value);
      const fillWidth = (value / 100) * barWidth;
      
      // Nom de l'indicateur
      doc.setTextColor(...colors.darkGray);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(indicator.name, margin, yPosition);
      
      // Barre de fond
      doc.setFillColor(...colors.lightGray);
      doc.rect(margin + 80, yPosition - 6, barWidth, barHeight, 'F');
      
      // Barre de progression colorée
      const barColor = value > 70 ? colors.red : value > 40 ? colors.yellow : colors.green;
      doc.setFillColor(...barColor);
      doc.rect(margin + 80, yPosition - 6, fillWidth, barHeight, 'F');
      
      // Valeur numérique
      doc.setTextColor(...colors.darkGray);
      doc.setFont('helvetica', 'bold');
      doc.text(`${value}%`, margin + 80 + barWidth + 10, yPosition);
      
      yPosition += 18;
    });

    yPosition += 20;

    // Analyse par sections
    checkPageBreak(100);
    
    doc.setTextColor(...colors.darkGray);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Analyse par Sections', margin, yPosition);
    yPosition += 20;

    analysis.sectionAnalysis.slice(0, 4).forEach((section, index) => {
      checkPageBreak(80);

      // En-tête de section avec couleur
      const sectionColor = section.suspicionLevel === 'high' ? colors.red : 
                          section.suspicionLevel === 'medium' ? colors.yellow : colors.green;
      
      doc.setFillColor(...sectionColor);
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Section ${index + 1} - ${section.suspicionLevel.toUpperCase()} (${section.score}%)`, margin + 5, yPosition + 8);
      
      yPosition += 25;
      
      // Texte de la section
      doc.setTextColor(...colors.darkGray);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(`"${section.text}"`, pageWidth - 2 * margin - 10);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 4 + 10;
      
      // Raisons
      doc.setTextColor(...colors.gray);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      section.reasons.slice(0, 3).forEach(reason => {
        checkPageBreak(15);
        doc.text(`• ${reason}`, margin + 10, yPosition);
        yPosition += 12;
      });
      
      yPosition += 15;
    });

    // Recommandations avec design amélioré
    checkPageBreak(120);
    
    doc.setFillColor(59, 130, 246, 0.1); // blue-500 avec transparence
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 100, 'F');
    
    doc.setTextColor(...colors.primary);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommandations', margin + 10, yPosition + 20);
    
    yPosition += 35;
    
    doc.setTextColor(...colors.darkGray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    let recommendations: string[] = [];
    
    if (analysis.overallScore >= 70) {
      recommendations = [
        '• Investigation approfondie recommandée - forte probabilité d\'utilisation d\'IA',
        '• Vérifier les sources et demander des explications à l\'étudiant',
        '• Considérer une réévaluation orale du sujet traité',
        '• Sensibilisation aux règles académiques sur l\'usage de l\'IA'
      ];
    } else if (analysis.overallScore >= 40) {
      recommendations = [
        '• Analyse modérée - possible assistance IA détectée',
        '• Recommandé de discuter avec l\'étudiant des méthodes utilisées',
        '• Sensibilisation aux règles d\'utilisation des outils IA',
        '• Surveillance renforcée pour les prochains travaux'
      ];
    } else {
      recommendations = [
        '• Le texte présente des caractéristiques principalement humaines',
        '• Travail probablement original de l\'étudiant',
        '• Aucune action particulière requise',
        '• Continuer la surveillance habituelle'
      ];
    }
    
    recommendations.forEach(rec => {
      checkPageBreak(15);
      const recLines = doc.splitTextToSize(rec, pageWidth - 2 * margin - 20);
      doc.text(recLines, margin + 10, yPosition);
      yPosition += recLines.length * 12 + 5;
    });

    // Note sur la fiabilité des APIs
    if (analysis.apiSources && Object.values(analysis.apiSources).some(Boolean)) {
      yPosition += 10;
      checkPageBreak(25);
      
      doc.setFillColor(...colors.green);
      doc.rect(margin + 10, yPosition - 5, pageWidth - 2 * margin - 20, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ Cette analyse utilise des APIs professionnelles pour une fiabilité maximale', margin + 15, yPosition + 8);
    }

    // Pied de page avec design
    const footerY = pageHeight - 20;
    doc.setFillColor(...colors.lightGray);
    doc.rect(0, footerY - 10, pageWidth, 30, 'F');
    
    doc.setTextColor(...colors.gray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Rapport généré automatiquement par AI Detection Pro', margin, footerY);
    doc.text(`Page 1 - ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin - 50, footerY);
    
    // Logo simulé
    doc.setFillColor(...colors.primary);
    doc.circle(pageWidth - 30, footerY - 5, 3, 'F');

    // Sauvegarde avec nom descriptif
    const filename = `rapport-detection-ia-${analysis.overallScore}pct-${Date.now()}.pdf`;
    doc.save(filename);
  }
}