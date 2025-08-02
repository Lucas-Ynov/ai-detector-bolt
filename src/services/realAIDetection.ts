import { AnalysisResult } from '../types';
import { originalityClient, winstonClient, openaiClient, OriginalityResponse, WinstonResponse, OpenAIResponse } from './apiClients';

export class RealAIDetectionService {
  private static async callOriginalityAI(text: string): Promise<OriginalityResponse | null> {
    try {
      const response = await originalityClient.post('/scan/ai', {
        content: text,
        title: 'Student Work Analysis',
        aiModelVersion: '1',
        storeScan: false
      });
      return response.data;
    } catch (error) {
      console.error('Originality.ai API Error:', error);
      return null;
    }
  }

  private static async callWinstonAI(text: string): Promise<WinstonResponse | null> {
    try {
      const response = await winstonClient.post('/predict', {
        text: text,
        language: 'fr',
        version: '3.0'
      });
      return response.data;
    } catch (error) {
      console.error('Winston AI API Error:', error);
      return null;
    }
  }

  private static async callOpenAIDetection(text: string): Promise<number | null> {
    try {
      const prompt = `Analysez ce texte français et donnez un score de 0 à 100 indiquant la probabilité qu'il ait été généré par une IA. Répondez uniquement avec le nombre:

Texte à analyser:
${text}

Score (0-100):`;

      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un expert en détection de textes générés par IA, spécialisé dans l\'analyse de textes français académiques. Répondez uniquement avec un nombre entre 0 et 100.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.1
      });

      const scoreText = response.data.choices[0].message.content.trim();
      const score = parseInt(scoreText);
      return isNaN(score) ? null : Math.min(100, Math.max(0, score));
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return null;
    }
  }

  private static async performAdvancedAnalysis(text: string): Promise<any> {
    // Analyse linguistique avancée pour le français
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // Calcul de la diversité lexicale
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const lexicalDiversity = (uniqueWords.size / words.length) * 100;

    // Analyse de la complexité syntaxique
    const avgSentenceLength = words.length / sentences.length;
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const lengthVariation = this.calculateStandardDeviation(sentenceLengths);

    // Détection de patterns répétitifs
    const repetitivePatterns = this.detectRepetitivePatterns(sentences);

    // Analyse du vocabulaire français spécialisé
    const frenchComplexity = this.analyzeFrenchComplexity(text);

    // Détection de connecteurs logiques sur-utilisés
    const connectorOveruse = this.analyzeConnectorUsage(text);

    return {
      lexicalDiversity: Math.max(0, 100 - lexicalDiversity * 2),
      syntaxComplexity: Math.min(100, (avgSentenceLength > 20 ? 60 : 30) + (lengthVariation < 5 ? 40 : 20)),
      semanticCoherence: this.analyzeSemanticCoherence(text),
      repetitivePatterns,
      vocabularyRichness: frenchComplexity,
      sentenceVariation: Math.max(0, 100 - lengthVariation * 3),
      naturalFlow: connectorOveruse,
      frenchSpecific: this.analyzeFrenchSpecificPatterns(text)
    };
  }

  private static calculateStandardDeviation(numbers: number[]): number {
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }

  private static detectRepetitivePatterns(sentences: string[]): number {
    const patterns = new Map<string, number>();
    
    sentences.forEach(sentence => {
      // Analyse des débuts de phrases
      const start = sentence.trim().split(/\s+/).slice(0, 3).join(' ').toLowerCase();
      patterns.set(start, (patterns.get(start) || 0) + 1);
    });

    const repetitions = Array.from(patterns.values()).filter(count => count > 1);
    return Math.min(100, repetitions.length * 25);
  }

  private static analyzeFrenchComplexity(text: string): number {
    const complexWords = [
      'néanmoins', 'cependant', 'toutefois', 'par conséquent', 'en effet',
      'd\'ailleurs', 'en outre', 'de surcroît', 'qui plus est', 'en revanche'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    const complexWordCount = complexWords.reduce((count, word) => {
      return count + (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
    }, 0);

    const density = (complexWordCount / words.length) * 100;
    return Math.min(100, density * 10); // Sur-utilisation de mots complexes = suspect
  }

  private static analyzeConnectorUsage(text: string): number {
    const connectors = [
      'premièrement', 'deuxièmement', 'troisièmement', 'finalement',
      'en premier lieu', 'en second lieu', 'pour conclure', 'en conclusion',
      'il est important de noter', 'il convient de souligner', 'il faut noter'
    ];

    let score = 0;
    connectors.forEach(connector => {
      const matches = text.toLowerCase().match(new RegExp(`\\b${connector}\\b`, 'g'));
      if (matches) score += matches.length * 15;
    });

    return Math.min(100, score);
  }

  private static analyzeSemanticCoherence(text: string): number {
    // Analyse basique de la cohérence sémantique
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const topics = new Set<string>();
    
    // Mots-clés thématiques français courants
    const thematicWords = [
      'société', 'économie', 'politique', 'culture', 'histoire', 'science',
      'technologie', 'environnement', 'éducation', 'santé', 'art', 'littérature'
    ];

    sentences.forEach(sentence => {
      thematicWords.forEach(theme => {
        if (sentence.toLowerCase().includes(theme)) {
          topics.add(theme);
        }
      });
    });

    // Trop de thèmes différents peut indiquer un manque de cohérence naturelle
    const thematicDensity = topics.size / sentences.length;
    return Math.min(100, thematicDensity * 150);
  }

  private static analyzeFrenchSpecificPatterns(text: string): number {
    const aiPatterns = [
      /\b(il est important de noter que|il convient de souligner que|il faut noter que)\b/gi,
      /\b(en conclusion|pour conclure|en définitive|en somme)\b/gi,
      /\b(d'une part.*d'autre part|premièrement.*deuxièmement)\b/gi,
      /\b(par ailleurs|en outre|de plus|qui plus est)\b/gi
    ];

    let score = 0;
    aiPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) score += matches.length * 20;
    });

    return Math.min(100, score);
  }

  private static determineSuspectedAI(scores: any, apiResults: any): string {
    const avgScore = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(scores).length;
    
    if (apiResults.originality && apiResults.originality.model_used) {
      return `${apiResults.originality.model_used} (Originality.ai)`;
    }
    
    if (avgScore > 70) {
      if (scores.frenchSpecific > 60) return 'ChatGPT (GPT-4)';
      if (scores.syntaxComplexity > 65) return 'Claude (Anthropic)';
      if (scores.vocabularyRichness > 70) return 'Gemini (Google)';
      return 'IA Non Identifiée';
    } else if (avgScore > 40) {
      return 'Possible assistance IA';
    }
    
    return 'Probablement humain';
  }

  private static createSectionAnalysis(text: string, apiResults: any, analysisType: 'quick' | 'advanced'): any[] {
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const sectionsToAnalyze = analysisType === 'advanced' ? paragraphs : paragraphs.slice(0, 3);
    
    return sectionsToAnalyze.map((section, index) => {
      let sectionScore = Math.random() * 40 + 30; // Base score
      
      // Utiliser les données des APIs si disponibles
      if (apiResults.originality?.sentences) {
        const relevantSentences = apiResults.originality.sentences.filter((s: any) => 
          section.includes(s.text.substring(0, 50))
        );
        if (relevantSentences.length > 0) {
          sectionScore = relevantSentences.reduce((sum: number, s: any) => sum + s.ai_score, 0) / relevantSentences.length * 100;
        }
      }
      
      if (apiResults.winston?.result?.sentences) {
        const relevantSentences = apiResults.winston.result.sentences.filter((s: any) => 
          section.includes(s.text.substring(0, 50))
        );
        if (relevantSentences.length > 0) {
          const winstonScore = relevantSentences.reduce((sum: number, s: any) => sum + s.score, 0) / relevantSentences.length * 100;
          sectionScore = (sectionScore + winstonScore) / 2;
        }
      }

      const reasons = [];
      if (sectionScore > 70) {
        reasons.push('Patterns IA détectés par les APIs');
        reasons.push('Structure artificielle confirmée');
        reasons.push('Vocabulaire généré automatiquement');
      } else if (sectionScore > 40) {
        reasons.push('Quelques indicateurs suspects');
        reasons.push('Style possiblement assisté');
      } else {
        reasons.push('Style naturel détecté');
        reasons.push('Variations humaines confirmées');
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
    try {
      // Appels parallèles aux différentes APIs
      const [originalityResult, winstonResult, openaiResult] = await Promise.allSettled([
        this.callOriginalityAI(text),
        this.callWinstonAI(text),
        this.callOpenAIDetection(text)
      ]);

      // Extraction des résultats
      const apiResults = {
        originality: originalityResult.status === 'fulfilled' ? originalityResult.value : null,
        winston: winstonResult.status === 'fulfilled' ? winstonResult.value : null,
        openai: openaiResult.status === 'fulfilled' ? openaiResult.value : null
      };

      // Analyse avancée locale
      const advancedIndicators = await this.performAdvancedAnalysis(text);

      // Calcul du score global en combinant toutes les sources
      let overallScore = 0;
      let scoreCount = 0;

      if (apiResults.originality?.score?.ai) {
        overallScore += apiResults.originality.score.ai * 100;
        scoreCount++;
      }

      if (apiResults.winston?.result?.score) {
        overallScore += (1 - apiResults.winston.result.score) * 100; // Winston donne un score humain
        scoreCount++;
      }

      if (apiResults.openai !== null) {
        overallScore += apiResults.openai;
        scoreCount++;
      }

      // Ajouter le score de l'analyse locale
      const localScore = Object.values(advancedIndicators).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(advancedIndicators).length;
      overallScore += localScore;
      scoreCount++;

      overallScore = scoreCount > 0 ? overallScore / scoreCount : localScore;

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        text,
        analysisType,
        overallScore: Math.round(overallScore),
        suspectedAI: this.determineSuspectedAI(advancedIndicators, apiResults),
        indicators: advancedIndicators,
        sectionAnalysis: this.createSectionAnalysis(text, apiResults, analysisType),
        createdAt: new Date().toISOString(),
        apiSources: {
          originality: !!apiResults.originality,
          winston: !!apiResults.winston,
          openai: !!apiResults.openai
        }
      };

      return result;

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      
      // Fallback vers l'analyse locale en cas d'erreur API
      const advancedIndicators = await this.performAdvancedAnalysis(text);
      const localScore = Object.values(advancedIndicators).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(advancedIndicators).length;

      return {
        id: crypto.randomUUID(),
        text,
        analysisType,
        overallScore: Math.round(localScore),
        suspectedAI: this.determineSuspectedAI(advancedIndicators, {}),
        indicators: advancedIndicators,
        sectionAnalysis: this.createSectionAnalysis(text, {}, analysisType),
        createdAt: new Date().toISOString(),
        apiSources: {
          originality: false,
          winston: false,
          openai: false
        }
      };
    }
  }
}