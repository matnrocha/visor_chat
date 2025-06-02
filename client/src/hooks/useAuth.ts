import { useState, useEffect, useCallback } from 'react';
import { ChatAPI } from '../api/chat';
import { type User } from '../types/chat';

export const useAuth = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await ChatAPI.getCurrentUser();
      setUser(res);
    } catch (error) {
      console.error('Error fetching user', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem('token');
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  return {
    user,
    isLoading,
    fetchUser,
    handleLogout
  };
};