export enum LLMProvider {
    GEMINI = 'gemini',
    OPENAI = 'openai'
  };
  
  export interface ChatMessage {
    role: 'user' | 'model' | 'system';
    content: string;
  }