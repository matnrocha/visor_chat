import { useState, useCallback } from 'react';
import { ChatAPI } from '../api/chat';
import { type Message} from '../types/chat';
import { type ChatSession } from '../types/chat';

export const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);



  const fetchSessions = useCallback(async () => {
    try {
      const res = await ChatAPI.getSessions();
      setSessions(res.reverse());
    } catch (error) {
      console.error('Error fetching sessions', error);
    }
  }, []);



  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await ChatAPI.getMessages(sessionId);
      const loadedMessages: Message[] = res.map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot'
      }));
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Error fetching messages", error);
      setMessages([]);
    }
  }, []);



  const selectSession = useCallback(async (session: ChatSession | null) => {
    setSelectedSession(session);
    
    if (session) {
      await fetchMessages(session.id);
      localStorage.setItem('selectedSessionId', session.id);
    } else {
      setMessages([]);
      localStorage.removeItem('selectedSessionId');
    }
  }, [fetchMessages]);



  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await ChatAPI.deleteSession(sessionId);
  
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
        localStorage.removeItem('selectedSessionId');
      }
  
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error("Error deleting session", error);
    }
  }, [selectedSession]);



  const renameSession = useCallback(async (sessionId: string, newTitle: string) => {
    if (!newTitle || !newTitle.trim()) return;

    try {
      await ChatAPI.renameSession(sessionId, newTitle.trim());

      setSessions(prev =>
        prev.map(session =>
          session.id === sessionId ? { ...session, title: newTitle.trim() } : session
        )
      );

      if (selectedSession?.id === sessionId) {
        setSelectedSession(prev => prev ? { ...prev, title: newTitle.trim() } : prev);
      }
    } catch (error) {
      console.error("Error renaming session", error);
    }
  }, [selectedSession]);



  const createNewChat = useCallback(async () => {
    try {
      const res = await ChatAPI.createSession('gemini');
      const newSession = res;
      setSessions(prev => [newSession, ...prev]);
      await selectSession(newSession);
      return newSession;
    } catch (error) {
      console.error("Error creating new session", error);
      throw error;
    }
  }, [selectSession]);



  const sendMessage = useCallback(async (input: string) => {
    if (!input || isLoading) return;
  
    let currentSession = selectedSession;
    
    if (!currentSession) {
      try {
        setIsLoading(true);
        currentSession = await createNewChat();
      } catch (error) {
        console.error('Error creating session', error);
        return;
      }
    }

    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };
    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);
  
    try {
      const res = await ChatAPI.sendMessage(currentSession.id, input);
      const botResponse: Message = {
        id: res.id || Date.now().toString() + 'bot',
        text: res.content || "no response.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'bot',
        text: "Error getting bot response",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSession, isLoading, createNewChat]);


  
  return {
    sessions,
    selectedSession,
    messages,
    isLoading,
    fetchSessions,
    selectSession,
    deleteSession,
    renameSession,
    createNewChat,
    sendMessage
  };
};