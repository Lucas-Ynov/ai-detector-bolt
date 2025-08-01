export interface AnalysisResult {
  id: string;
  text: string;
  filename?: string;
  analysisType: 'quick' | 'advanced';
  overallScore: number;
  suspectedAI: string;
  indicators: {
    lexicalDiversity: number;
    syntaxComplexity: number;
    semanticCoherence: number;
    repetitivePatterns: number;
    vocabularyRichness: number;
    sentenceVariation: number;
    naturalFlow: number;
    frenchSpecific: number;
  };
  sectionAnalysis: {
    text: string;
    suspicionLevel: 'low' | 'medium' | 'high';
    score: number;
    reasons: string[];
  }[];
  createdAt: string;
}

export interface FileUpload {
  file: File;
  type: 'pdf' | 'docx' | 'txt';
}