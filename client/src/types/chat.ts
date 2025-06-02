export interface ChatSession {
    id: string;
    title: string;
    model?: string;
    createdAt?: string;
  }
  
  export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp?: number;
  }
  
  export interface User {
    name: string;
    email: string;
    avatar?: string;
  }