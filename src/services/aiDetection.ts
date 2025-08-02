import { AnalysisResult } from '../types';
import { RealAIDetectionService } from './realAIDetection';

export class AIDetectionService {
  static async analyzeText(text: string, analysisType: 'quick' | 'advanced' = 'quick'): Promise<AnalysisResult> {
    // Délai d'analyse réaliste
    await new Promise(resolve => setTimeout(resolve, analysisType === 'advanced' ? 3000 : 1500));
    
    // Utilisation du service de détection IA réel
    const result = await RealAIDetectionService.analyzeText(text, analysisType);
    
    // Sauvegarde en base de données
    try {
      const { data, error } = await supabase.from('analyses').insert([{
        id: result.id,
        text: result.text,
        filename: result.filename,
        analysis_type: result.analysisType,
        overall_score: result.overallScore,
        suspected_ai: result.suspectedAI,
        indicators: result.indicators,
        section_analysis: result.sectionAnalysis,
        api_sources: result.apiSources,
        created_at: result.createdAt
      }]);
      
      if (error) {
        console.warn('Erreur sauvegarde DB:', error);
      }
    } catch (error) {
      console.warn('Erreur sauvegarde DB:', error);
    }
    
    return result;
  }
}