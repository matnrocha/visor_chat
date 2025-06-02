import apiClient from '../lib/axios';

export const ChatAPI = {
  createSession: async (modelType: string) => {
    const response = await apiClient.post('/sessions', { modelType });
    return response.data;
  },

  renameSession: async (sessionId: string, newTitle: string) => {
    const response = await apiClient.patch(`/sessions/${sessionId}`, { title: newTitle });
    return response.data;
  },

  deleteSession: async (sessionId: string) => {
    const response = await apiClient.delete(`/sessions/${sessionId}`);
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
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
        return response.data;
  }
};