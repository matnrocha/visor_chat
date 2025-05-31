// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Usa o proxy no desenvolvimento
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;