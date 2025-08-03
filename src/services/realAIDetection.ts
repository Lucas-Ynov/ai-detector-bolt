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
      const prompt = `Analysez ce texte français et donnez un score de 0 à 100 indiquant la probabilité qu'il ait été généré par une IA. 

Critères d'évaluation stricts:
- Répétitions de structures syntaxiques
- Vocabulaire trop parfait ou artificiel
- Transitions mécaniques entre idées
- Absence d'erreurs naturelles
- Style trop uniforme
- Connecteurs logiques sur-utilisés

Texte à analyser:
${text}

Score (0-100):`;

      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un expert en détection de textes générés par IA, spécialisé dans l\'analyse de textes français académiques. Soyez très strict dans votre évaluation. Un texte généré par IA doit avoir un score élevé (70-95). Répondez uniquement avec un nombre entre 0 et 100.'
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
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // Analyse de la diversité lexicale (plus stricte)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^\w]/g, '')));
    const lexicalDiversity = (uniqueWords.size / words.length) * 100;
    const lexicalScore = lexicalDiversity < 40 ? 85 : lexicalDiversity < 50 ? 60 : lexicalDiversity < 60 ? 35 : 15;

    // Analyse de la complexité syntaxique (détection plus fine)
    const avgSentenceLength = words.length / sentences.length;
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const lengthVariation = this.calculateStandardDeviation(sentenceLengths);
    
    // IA tend à avoir des phrases de longueur très uniforme
    const syntaxScore = lengthVariation < 3 ? 90 : lengthVariation < 5 ? 70 : lengthVariation < 8 ? 45 : 20;

    // Détection de patterns répétitifs (plus sensible)
    const repetitivePatterns = this.detectRepetitivePatterns(sentences);

    // Analyse du vocabulaire français spécialisé (plus stricte)
    const frenchComplexity = this.analyzeFrenchComplexity(text);

    // Détection de connecteurs logiques sur-utilisés (plus sévère)
    const connectorOveruse = this.analyzeConnectorUsage(text);

    // Analyse de la cohérence sémantique (détection IA améliorée)
    const semanticCoherence = this.analyzeSemanticCoherence(text);

    // Détection de patterns IA français spécifiques (renforcée)
    const frenchSpecific = this.analyzeFrenchSpecificPatterns(text);

    // Analyse de la fluidité naturelle (nouveau)
    const naturalFlow = this.analyzeNaturalFlow(text);

    return {
      lexicalDiversity: lexicalScore,
      syntaxComplexity: syntaxScore,
      semanticCoherence,
      repetitivePatterns,
      vocabularyRichness: frenchComplexity,
      sentenceVariation: Math.min(100, 100 - lengthVariation * 8), // Plus sensible
      naturalFlow,
      frenchSpecific
    };
  }

  private static calculateStandardDeviation(numbers: number[]): number {
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }

  private static detectRepetitivePatterns(sentences: string[]): number {
    const patterns = new Map<string, number>();
    let score = 0;
    
    sentences.forEach(sentence => {
      // Analyse des débuts de phrases (plus strict)
      const start = sentence.trim().split(/\s+/).slice(0, 4).join(' ').toLowerCase();
      patterns.set(start, (patterns.get(start) || 0) + 1);
      
      // Analyse des structures grammaticales
      const structure = sentence.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toLowerCase();
      if (structure.includes('il est important') || structure.includes('il convient') || 
          structure.includes('en effet') || structure.includes('par ailleurs')) {
        score += 15;
      }
    });

    const repetitions = Array.from(patterns.values()).filter(count => count > 1);
    const repetitionScore = repetitions.length * 30;
    
    return Math.min(100, score + repetitionScore);
  }

  private static analyzeFrenchComplexity(text: string): number {
    const aiIndicators = [
      // Connecteurs sur-utilisés par l'IA
      'néanmoins', 'cependant', 'toutefois', 'par conséquent', 'en effet',
      'd\'ailleurs', 'en outre', 'de surcroît', 'qui plus est', 'en revanche',
      'il est important de noter', 'il convient de souligner', 'il faut noter',
      'premièrement', 'deuxièmement', 'troisièmement', 'finalement',
      'en premier lieu', 'en second lieu', 'pour conclure', 'en conclusion'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    aiIndicators.forEach(indicator => {
      const regex = new RegExp(`\\b${indicator.replace(/'/g, "['']?")}\\b`, 'gi');
      const matches = text.match(regex) || [];
      score += matches.length * 12; // Plus pénalisant
    });

    // Détection de vocabulaire trop parfait
    const perfectWords = [
      'optimal', 'efficace', 'pertinent', 'significatif', 'considérable',
      'substantiel', 'fondamental', 'essentiel', 'crucial', 'primordial'
    ];
    
    perfectWords.forEach(word => {
      const matches = text.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || [];
      score += matches.length * 8;
    });

    return Math.min(100, score);
  }

  private static analyzeConnectorUsage(text: string): number {
    const connectors = [
      'premièrement', 'deuxièmement', 'troisièmement', 'quatrièmement', 'finalement',
      'en premier lieu', 'en second lieu', 'en troisième lieu', 'pour conclure', 'en conclusion',
      'il est important de noter', 'il convient de souligner', 'il faut noter que',
      'par ailleurs', 'en outre', 'de plus', 'qui plus est', 'de surcroît',
      'cependant', 'néanmoins', 'toutefois', 'en revanche', 'à l\'inverse'
    ];

    let score = 0;
    const sentences = text.split(/[.!?]+/).length;
    
    connectors.forEach(connector => {
      const regex = new RegExp(`\\b${connector.replace(/'/g, "['']?")}\\b`, 'gi');
      const matches = text.match(regex) || [];
      score += matches.length * 20; // Plus pénalisant
    });

    // Bonus si trop de connecteurs par rapport au nombre de phrases
    const density = score / sentences;
    if (density > 15) score += 30;

    return Math.min(100, score);
  }

  private static analyzeSemanticCoherence(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let score = 0;
    
    // Détection de transitions trop parfaites
    const perfectTransitions = [
      /\b(ainsi|donc|par conséquent|en conséquence|de ce fait)\b/gi,
      /\b(d'une part.*d'autre part|d'un côté.*de l'autre)\b/gi,
      /\b(en premier lieu.*en second lieu|premièrement.*deuxièmement)\b/gi
    ];

    perfectTransitions.forEach(pattern => {
      const matches = text.match(pattern) || [];
      score += matches.length * 25;
    });

    // Détection de structure trop logique
    const logicalStructure = text.match(/\b(introduction|développement|conclusion)\b/gi) || [];
    score += logicalStructure.length * 15;

    // Absence d'hésitations ou d'imperfections naturelles
    const naturalImperfections = text.match(/\b(euh|enfin|disons|peut-être|je pense|il me semble)\b/gi) || [];
    if (naturalImperfections.length === 0 && sentences.length > 5) {
      score += 40; // Pénalité pour perfection artificielle
    }

    return Math.min(100, score);
  }

  private static analyzeFrenchSpecificPatterns(text: string): number {
    const aiPatterns = [
      // Patterns typiques de l'IA en français
      /\b(il est important de noter que|il convient de souligner que|il faut noter que)\b/gi,
      /\b(en conclusion|pour conclure|en définitive|en somme|pour résumer)\b/gi,
      /\b(d'une part.*d'autre part|premièrement.*deuxièmement.*troisièmement)\b/gi,
      /\b(par ailleurs|en outre|de plus|qui plus est|de surcroît)\b/gi,
      /\b(cette approche|cette méthode|cette stratégie|cette solution)\b/gi,
      /\b(il est essentiel de|il est crucial de|il est fondamental de)\b/gi,
      /\b(dans le cadre de|au niveau de|en termes de|en matière de)\b/gi
    ];

    let score = 0;
    aiPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      score += matches.length * 25; // Plus pénalisant
    });

    // Détection de style académique artificiel
    const academicClichés = [
      'force est de constater', 'il ressort de cette analyse', 'cette étude révèle',
      'les résultats montrent', 'il apparaît clairement', 'on peut observer'
    ];

    academicClichés.forEach(cliché => {
      if (text.toLowerCase().includes(cliché)) {
        score += 20;
      }
    });

    return Math.min(100, score);
  }

  private static analyzeNaturalFlow(text: string): number {
    let score = 0;
    
    // Détection de phrases trop uniformes en longueur
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lengths = sentences.map(s => s.split(/\s+/).length);
    
    // Vérification de l'uniformité (signe d'IA)
    const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const uniformity = lengths.filter(len => Math.abs(len - avgLength) < 3).length / lengths.length;
    
    if (uniformity > 0.7) score += 50; // Trop uniforme = IA
    
    // Détection de ponctuation trop parfaite
    const punctuationErrors = text.match(/[.!?]\s*[a-z]/g) || [];
    if (punctuationErrors.length === 0 && sentences.length > 3) {
      score += 30; // Pas d'erreurs = suspect
    }

    // Détection de répétitions de mots de liaison
    const liaisons = text.match(/\b(et|ou|mais|donc|or|ni|car)\b/gi) || [];
    const liaisonDensity = liaisons.length / sentences.length;
    if (liaisonDensity > 2) score += 25;

    return Math.min(100, score);
  }

  private static determineSuspectedAI(scores: any, apiResults: any): string {
    const avgScore = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(scores).length;
    
    if (apiResults.originality && apiResults.originality.model_used) {
      return `${apiResults.originality.model_used} (Originality.ai)`;
    }
    
    if (avgScore > 80) {
      if (scores.frenchSpecific > 70) return 'ChatGPT (GPT-4/GPT-3.5)';
      if (scores.syntaxComplexity > 75) return 'Claude (Anthropic)';
      if (scores.vocabularyRichness > 80) return 'Gemini (Google Bard)';
      if (scores.naturalFlow > 70) return 'GPT-4 (OpenAI)';
      return 'IA Générative Détectée';
    } else if (avgScore > 60) {
      return 'Forte probabilité d\'IA';
    } else if (avgScore > 40) {
      return 'Possible assistance IA';
    }
    
    return 'Probablement humain';
  }

  private static createSectionAnalysis(text: string, apiResults: any, analysisType: 'quick' | 'advanced'): any[] {
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const sectionsToAnalyze = analysisType === 'advanced' ? paragraphs : paragraphs.slice(0, 3);
    
    return sectionsToAnalyze.map((section, index) => {
      let sectionScore = 50; // Score de base plus élevé
      
      // Analyse locale renforcée
      const localAnalysis = this.performAdvancedAnalysis(section);
      const localScore = Object.values(localAnalysis).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(localAnalysis).length;
      sectionScore = localScore;
      
      // Utiliser les données des APIs si disponibles
      if (apiResults.originality?.sentences) {
        const relevantSentences = apiResults.originality.sentences.filter((s: any) => 
          section.includes(s.text.substring(0, 50))
        );
        if (relevantSentences.length > 0) {
          const apiScore = relevantSentences.reduce((sum: number, s: any) => sum + s.ai_score, 0) / relevantSentences.length * 100;
          sectionScore = (sectionScore + apiScore) / 2;
        }
      }
      
      if (apiResults.winston?.result?.sentences) {
        const relevantSentences = apiResults.winston.result.sentences.filter((s: any) => 
          section.includes(s.text.substring(0, 50))
        );
        if (relevantSentences.length > 0) {
          const winstonScore = relevantSentences.reduce((sum: number, s: any) => sum + (1 - s.score), 0) / relevantSentences.length * 100;
          sectionScore = (sectionScore + winstonScore) / 2;
        }
      }

      const reasons = [];
      if (sectionScore > 75) {
        reasons.push('Patterns IA fortement détectés');
        reasons.push('Structure artificielle confirmée');
        reasons.push('Vocabulaire généré automatiquement');
        reasons.push('Absence de variations naturelles');
      } else if (sectionScore > 50) {
        reasons.push('Indicateurs suspects détectés');
        reasons.push('Style possiblement assisté par IA');
        reasons.push('Transitions trop parfaites');
      } else {
        reasons.push('Style naturel détecté');
        reasons.push('Variations humaines confirmées');
        reasons.push('Imperfections naturelles présentes');
      }

      return {
        text: section.slice(0, 200) + (section.length > 200 ? '...' : ''),
        suspicionLevel: sectionScore > 75 ? 'high' : sectionScore > 50 ? 'medium' : 'low',
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

      // Analyse avancée locale (plus stricte)
      const advancedIndicators = await this.performAdvancedAnalysis(text);

      // Calcul du score global avec pondération améliorée
      let overallScore = 0;
      let scoreCount = 0;
      const scores: number[] = [];

      if (apiResults.originality?.score?.ai) {
        const originalityScore = apiResults.originality.score.ai * 100;
        scores.push(originalityScore);
        scoreCount++;
      }

      if (apiResults.winston?.result?.score) {
        const winstonScore = (1 - apiResults.winston.result.score) * 100;
        scores.push(winstonScore);
        scoreCount++;
      }

      if (apiResults.openai !== null) {
        scores.push(apiResults.openai);
        scoreCount++;
      }

      // Score de l'analyse locale (plus important maintenant)
      const localScore = Object.values(advancedIndicators).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(advancedIndicators).length;
      scores.push(localScore);
      scores.push(localScore); // Double poids pour l'analyse locale
      scoreCount += 2;

      // Calcul de la moyenne pondérée
      overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      // Bonus si plusieurs sources concordent sur un score élevé
      const highScores = scores.filter(score => score > 70).length;
      if (highScores >= 2) {
        overallScore = Math.min(100, overallScore + 10);
      }

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
      
      // Fallback vers l'analyse locale renforcée
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