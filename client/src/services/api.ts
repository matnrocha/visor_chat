import axios from "axios";
import { authService } from "./authService";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Ajuste conforme seu backend
});

// Interceptor para enviar token em toda requisição
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
