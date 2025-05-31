/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      navigate('/');
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // src/contexts/AuthContext.tsx
const register = async (name: string, email: string, password: string) => {
    try {
      // 1. Primeiro faz o registro
      const registerResponse = await apiClient.post('/auth/register', {
        name,
        email,
        password
      });
  
      if (!registerResponse.data.success) {
        throw new Error(registerResponse.data.message || 'Registration failed');
      }
  
      // 2. Depois faz o login automático
      const loginResponse = await apiClient.post('/auth/login', {
        email,
        password
      });
  
      if (!loginResponse.data.token) {
        throw new Error('Login after registration failed');
      }
  
      // 3. Armazena o token e atualiza o estado
      localStorage.setItem('accessToken', loginResponse.data.token);
      setUser(loginResponse.data.user);
      setIsAuthenticated(true);
  
      // 4. Feedback e redirecionamento
      toast({
        title: 'Success',
        description: 'Registration and login successful!',
      });
      navigate('/');
  
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      toast({
        title: 'Logout error',
        description: 'There was an error logging out',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}