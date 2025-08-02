import axios from 'axios';

// Configuration des clients API
export const originalityClient = axios.create({
  baseURL: import.meta.env.VITE_ORIGINALITY_API_URL || 'https://api.originality.ai/api/v1',
  headers: {
    'X-OAI-API-KEY': import.meta.env.VITE_ORIGINALITY_API_KEY,
    'Content-Type': 'application/json',
  },
});

export const winstonClient = axios.create({
  baseURL: import.meta.env.VITE_WINSTON_API_URL || 'https://api.gowinston.ai/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_WINSTON_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Types pour les réponses API
export interface OriginalityResponse {
  score: {
    ai: number;
    original: number;
  };
  sentences: Array<{
    text: string;
    ai_score: number;
    start_index: number;
    end_index: number;
  }>;
  model_used: string;
}

export interface WinstonResponse {
  result: {
    score: number;
    is_human: boolean;
    sentences: Array<{
      text: string;
      score: number;
      index: number;
    }>;
  };
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}