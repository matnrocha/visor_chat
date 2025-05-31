// src/api/chat.ts
import apiClient from './client';

export const ChatAPI = {
  createSession: async (modelType: string) => {
    const response = await apiClient.post('/sessions', { modelType });
    return response.data;
  },
  
  sendMessage: async (sessionId: string, content: string) => {
    const response = await apiClient.post(`/sessions/${sessionId}/messages`, { content });
    return response.data;
  },
  
  getMessages: async (sessionId: string) => {
    const response = await apiClient.get(`/sessions/${sessionId}/messages`);
    return response.data;
  },
  
  getSessions: async () => {
    const response = await apiClient.get('/sessions');
    return response.data;
  }
};