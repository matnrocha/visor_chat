export interface ChatSession {
    id: string;
    userId: string;
    modelType: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Message {
    id: string;
    sessionId: string;
    content: string;
    role: 'user' | 'model';
    modelType: string;
    timestamp?: string;
  }