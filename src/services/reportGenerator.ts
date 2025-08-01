import jsPDF from 'jspdf';
import { AnalysisResult } from '../types';

export class ReportGenerator {
  static generatePDF(analysis: AnalysisResult): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // En-tête
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text('Rapport de Détection IA', margin, yPosition);
    
    yPosition += 20;
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text(`Généré le ${new Date(analysis.createdAt).toLocaleDateString('fr-FR')}`, margin, yPosition);
    
    yPosition += 20;

    // Score global
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Score Global', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(14);
    const scoreColor = analysis.overallScore > 70 ? [239, 68, 68] : 
                      analysis.overallScore > 40 ? [245, 158, 11] : [34, 197, 94];
    doc.setTextColor(...scoreColor);
    doc.text(`${analysis.overallScore}% de probabilité d'utilisation d'IA`, margin, yPosition);
    
    yPosition += 10;
    doc.setTextColor(0, 0, 0);
    doc.text(`Agent suspecté: ${analysis.suspectedAI}`, margin, yPosition);
    
    yPosition += 25;

    // Indicateurs détaillés
    doc.setFontSize(16);
    doc.text('Indicateurs Détaillés', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
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
      const color = indicator.value > 70 ? [239, 68, 68] : 
                   indicator.value > 40 ? [245, 158, 11] : [34, 197, 94];
      doc.setTextColor(...color);
      doc.text(`${indicator.name}: ${Math.round(indicator.value)}%`, margin, yPosition);
      yPosition += 8;
    });

    // Nouvelle page si nécessaire
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    yPosition += 10;

    // Analyse par sections
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Analyse par Sections', margin, yPosition);
    yPosition += 15;

    analysis.sectionAnalysis.slice(0, 3).forEach((section, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(12);
      doc.text(`Section ${index + 1}:`, margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(section.text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 5;
      
      const levelColor = section.suspicionLevel === 'high' ? [239, 68, 68] : 
                        section.suspicionLevel === 'medium' ? [245, 158, 11] : [34, 197, 94];
      doc.setTextColor(...levelColor);
      doc.text(`Niveau de suspicion: ${section.suspicionLevel.toUpperCase()} (${section.score}%)`, margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(107, 114, 128);
      section.reasons.forEach(reason => {
        doc.text(`• ${reason}`, margin + 5, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
      doc.setTextColor(0, 0, 0);
    });

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Rapport généré automatiquement - AI Detection Pro', margin, doc.internal.pageSize.getHeight() - 10);

    doc.save(`rapport-detection-ia-${Date.now()}.pdf`);
  }
}