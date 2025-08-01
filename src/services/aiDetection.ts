import { AnalysisResult } from '../types';

// Simulation d'une API d'analyse IA sophistiquée
export class AIDetectionService {
  private static analyzeText(text: string, analysisType: 'quick' | 'advanced'): AnalysisResult {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Simulation d'indicateurs sophistiqués
    const indicators = {
      lexicalDiversity: this.calculateLexicalDiversity(text),
      syntaxComplexity: this.analyzeSyntaxComplexity(text),
      semanticCoherence: this.analyzeSemanticCoherence(text),
      repetitivePatterns: this.detectRepetitivePatterns(text),
      vocabularyRichness: this.analyzeVocabularyRichness(text),
      sentenceVariation: this.analyzeSentenceVariation(text),
      naturalFlow: this.analyzeNaturalFlow(text),
      frenchSpecific: this.analyzeFrenchSpecificPatterns(text)
    };

    const overallScore = Object.values(indicators).reduce((sum, score) => sum + score, 0) / Object.keys(indicators).length;
    
    const suspectedAI = this.determineSuspectedAI(overallScore, indicators);
    const sectionAnalysis = this.analyzeSections(text, analysisType);

    return {
      id: crypto.randomUUID(),
      text,
      analysisType,
      overallScore: Math.round(overallScore),
      suspectedAI,
      indicators,
      sectionAnalysis,
      createdAt: new Date().toISOString()
    };
  }

  private static calculateLexicalDiversity(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const diversity = (uniqueWords.size / words.length) * 100;
    
    // Les IA tendent à avoir une diversité lexicale plus faible
    if (diversity < 30) return 75 + Math.random() * 20;
    if (diversity < 50) return 40 + Math.random() * 30;
    return 10 + Math.random() * 25;
  }

  private static analyzeSyntaxComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    
    // IA tend à produire des phrases de longueur similaire
    const variation = this.calculateVariation(sentences.map(s => s.length));
    
    if (variation < 20) return 60 + Math.random() * 30;
    return 20 + Math.random() * 40;
  }

  private static analyzeSemanticCoherence(text: string): number {
    // Simulation basée sur la répétition de concepts
    const commonFrenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour'];
    const words = text.toLowerCase().split(/\s+/);
    const conceptDensity = words.filter(w => !commonFrenchWords.includes(w)).length / words.length;
    
    // IA tend à avoir une cohérence artificielle
    if (conceptDensity > 0.7) return 55 + Math.random() * 35;
    return 25 + Math.random() * 40;
  }

  private static detectRepetitivePatterns(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const patterns = new Map<string, number>();
    
    sentences.forEach(sentence => {
      const structure = sentence.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim().split(/\s+/).slice(0, 3).join(' ');
      patterns.set(structure, (patterns.get(structure) || 0) + 1);
    });
    
    const repetitions = Array.from(patterns.values()).filter(count => count > 1).length;
    return Math.min(90, repetitions * 15 + Math.random() * 20);
  }

  private static analyzeVocabularyRichness(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const complexWords = words.filter(w => w.length > 7).length;
    const richness = (complexWords / words.length) * 100;
    
    // IA peut utiliser un vocabulaire sophistiqué de manière artificielle
    if (richness > 25) return 50 + Math.random() * 40;
    return 20 + Math.random() * 30;
  }

  private static analyzeSentenceVariation(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const lengths = sentences.map(s => s.length);
    const variation = this.calculateVariation(lengths);
    
    if (variation < 25) return 65 + Math.random() * 25;
    return 15 + Math.random() * 35;
  }

  private static analyzeNaturalFlow(text: string): number {
    // Analyse des transitions et connecteurs logiques
    const connectors = ['cependant', 'néanmoins', 'toutefois', 'ainsi', 'par conséquent', 'en effet', 'd\'ailleurs'];
    const connectorCount = connectors.reduce((count, conn) => {
      return count + (text.toLowerCase().match(new RegExp(conn, 'g')) || []).length;
    }, 0);
    
    const sentences = text.split(/[.!?]+/).length;
    const connectorDensity = connectorCount / sentences;
    
    // IA tend à sur-utiliser les connecteurs logiques
    if (connectorDensity > 0.3) return 70 + Math.random() * 20;
    return 25 + Math.random() * 35;
  }

  private static analyzeFrenchSpecificPatterns(text: string): number {
    // Patterns spécifiques au français qui peuvent indiquer une génération IA
    const patterns = [
      /\b(il est important de noter que|il convient de souligner|il faut noter|en outre)\b/gi,
      /\b(en conclusion|pour conclure|en définitive|somme toute)\b/gi,
      /\b(d'une part.*d'autre part|premièrement.*deuxièmement)\b/gi
    ];
    
    let score = 0;
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) score += matches.length * 20;
    });
    
    return Math.min(90, score + Math.random() * 15);
  }

  private static calculateVariation(numbers: number[]): number {
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }

  private static determineSuspectedAI(score: number, indicators: any): string {
    if (score > 70) {
      if (indicators.frenchSpecific > 60) return 'ChatGPT (GPT-4)';
      if (indicators.syntaxComplexity > 65) return 'Claude (Anthropic)';
      if (indicators.vocabularyRichness > 70) return 'Gemini (Google)';
      return 'IA Non Identifiée';
    } else if (score > 40) {
      return 'Possible assistance IA';
    }
    return 'Probablement humain';
  }

  private static analyzeSections(text: string, analysisType: 'quick' | 'advanced'): any[] {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    const sectionsToAnalyze = analysisType === 'advanced' ? paragraphs : paragraphs.slice(0, 3);
    
    return sectionsToAnalyze.map(section => {
      const sectionScore = Math.random() * 100;
      const reasons = [];
      
      if (sectionScore > 70) {
        reasons.push('Structure artificielle détectée');
        reasons.push('Vocabulaire trop sophistiqué');
        reasons.push('Transitions mécaniques');
      } else if (sectionScore > 40) {
        reasons.push('Quelques patterns suspects');
        reasons.push('Style possiblement généré');
      } else {
        reasons.push('Style naturel');
        reasons.push('Variations humaines détectées');
      }
      
      return {
        text: section.slice(0, 150) + (section.length > 150 ? '...' : ''),
        suspicionLevel: sectionScore > 70 ? 'high' : sectionScore > 40 ? 'medium' : 'low',
        score: Math.round(sectionScore),
        reasons
      };
    });
  }

  static async analyzeText(text: string, analysisType: 'quick' | 'advanced' = 'quick'): Promise<AnalysisResult> {
    // Simulation d'un délai d'analyse
    await new Promise(resolve => setTimeout(resolve, analysisType === 'advanced' ? 3000 : 1500));
    
    const result = this.analyzeText(text, analysisType);
    
    // Sauvegarde en base de données (simulation)
    try {
      // await supabase.from('analyses').insert([result]);
    } catch (error) {
      console.warn('Erreur sauvegarde DB:', error);
    }
    
    return result;
  }
}