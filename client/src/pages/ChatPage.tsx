/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { LogOutIcon, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../lib/utils";
import { ChatAPI } from '../api/chat';

import angleRight from '../assets/angle-right.png';
import logo from '../assets/logo.jpg';

import ReactMarkdown from 'react-markdown'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card"

import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

interface ChatSession {
  id: string;
  title: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const ChatPage = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);  

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchSessions(), 
        fetchUser()
      ]);
    };
    
    init();
  }, []);

  useEffect(() => {
    if (sessions.length === 0) {
      selectSession(null);
      localStorage.removeItem('selectedSessionId');
      return;
    }
  
    const savedSessionId = localStorage.getItem('selectedSessionId');
    const sessionExists = sessions.some(s => s.id === savedSessionId);
  
    if (!selectedSession && sessionExists) {
      const session = sessions.find(s => s.id === savedSessionId);
      if (session) selectSession(session);
    } else if (!sessionExists) {
      localStorage.removeItem('selectedSessionId');
    }
  }, [sessions]);
  
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end"
    });
  };

  const fetchSessions = async () => {
    try {
      const res = await ChatAPI.getSessions();
      setSessions(res.reverse());
    } catch (error) {
      console.error('Erro ao buscar sessões', error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await ChatAPI.getCurrentUser();
      setUser(res);
    } catch (error) {
      console.error('Erro ao buscar usuário', error);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      console.log('chamou mensagens aqui');
      const res = await ChatAPI.getMessages(sessionId);
      const loadedMessages: Message[] = res.map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot'
      }));
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Erro ao buscar mensagens da sessão", error);
      setMessages([]);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.clear();

      window.location.href = '/login';
    } catch (error) {
      console.error('Erro durante o logout:', error);
    }
  };

  const selectSession = React.useCallback((session: ChatSession | null) => {
    
    if (session?.id === selectedSession?.id) return;
    
    setSelectedSession(session);
    
    if (session) {
      fetchMessages(session.id);
      localStorage.setItem('selectedSessionId', session.id);
    } else {
      setMessages([]);
      localStorage.removeItem('selectedSessionId');
    }
  }, [selectedSession]);

  
  const deleteSession = async (sessionId: string) => {
    try {
      await ChatAPI.deleteSession(sessionId);
  
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
        localStorage.removeItem('selectedSessionId');
      }
  
      setSessions(prev => prev.filter(session => session.id !== sessionId));
  
    } catch (error) {
      console.error("Erro ao deletar sessão", error);
    }
  };
  
  
  

  const renameSession = async (sessionId: string) => {
    const newTitle = prompt("Digite o novo título da sessão:");
    if (!newTitle || !newTitle.trim()) return;

    try {
      await ChatAPI.renameSession(sessionId, newTitle.trim());

      setSessions(prev =>
        prev.map(session =>
          session.id === sessionId ? { ...session, title: newTitle.trim() } : session
        )
      );

      if (selectedSession?.id === sessionId) {
        console.log("trocou 2");
        setSelectedSession(prev => prev ? { ...prev, title: newTitle.trim() } : prev);
      }
    } catch (error) {
      console.error("Erro ao renomear sessão", error);
    }
  };

  const createNewChat = async () => {
    try {
      const res = await ChatAPI.createSession('gemini');
      const newSession = res;
      setSessions([newSession, ...sessions]);
      selectSession(newSession);
    } catch (error) {
      console.error("Erro ao criar nova sessão", error);
    }
  };

  const sendMessage = async () => {
    if (!input || isLoading) return;
  
    if (!selectedSession) {
      try {
        setIsLoading(true);
        const res = await ChatAPI.createSession('gemini');
        const newSession = res;
        setSessions([newSession, ...sessions]);
        selectSession(newSession);
        
        const newMsg: Message = {
          id: Date.now().toString(),
          text: input,
          sender: 'user'
        };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        
        const botRes = await ChatAPI.sendMessage(newSession.id, input);
        const botResponse: Message = {
          id: botRes.id || Date.now().toString() + '-bot',
          text: botRes.content || "🤖 (sem resposta)",
          sender: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('Erro ao criar sessão ou enviar mensagem', error);
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-bot',
          text: "Erro ao criar nova sessão",
          sender: 'bot'
        }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }
  
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);
  
    try {
      const res = await ChatAPI.sendMessage(selectedSession.id, input);
      const botResponse: Message = {
        id: res.id || Date.now().toString() + '-bot',
        text: res.content || "🤖 (sem resposta)",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-bot',
        text: "Erro ao obter resposta do bot",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <aside className="flex flex-col w-64 h-screen p-4 bg-white border-r border-gray-200">

        {/* Card do Usuário com Logout */}
        <Card className="p-3 mt-6 mb-10 rounded-lg bg-gray-50">
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={logo} />
              </Avatar>
              <div className="overflow-hidden">
                <h3 className="font-medium text-gray-800 truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-500 rounded-md hover:bg-gray-200 hover:text-gray-700"
              title="Logout"
            >
              <LogOutIcon className='w-4 h-4'></LogOutIcon>
            </button>
          </CardContent>
        </Card>
          
        {/* Conteúdo superior */}
        <div className="mb-8 space-y-4">
          <Button 
            onClick={createNewChat} 
            className="justify-start w-full gap-2 px-4 py-2 text-sm font-normal text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Plus size={16} className="text-gray-600" />
            New Chat
          </Button>
        </div>

        <div className="flex items-center gap-3 pl-2">
                <p className="text-center text-gray-500 text-s">Chats</p>
        </div>
              
        {/* Lista de sessões */}
        <div className="flex-1 py-4 mb-4 overflow-y-auto">
          {sessions.map(session => (
            <Card
              key={session.id}
              onClick={() => selectSession(session)}
              className={cn(
                "group cursor-pointer bg-transparent hover:bg-gray-100 transition-colors rounded-md border-0 mb-1",
                selectedSession?.id === session.id && "bg-gray-100"
              )}
            >
              <CardContent className="flex items-center justify-between px-3 py-2 text-sm text-gray-700">
                <span className="truncate">{session.title}</span>
            
                <div className="transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700"
                        aria-label="Menu da sessão"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-200 rounded-md shadow-md">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          renameSession(session.id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200"/>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Área fixa na parte inferior */}
        <div className="pt-4 mt-auto border-t border-gray-100">
          

          {/* Meu HoverCard */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-3 pl-2 cursor-pointer">
                <p className="text-xs text-center text-gray-500">developed by Mateus Rocha</p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-60" side="top" align="start">
              <div className="flex justify-between gap-4">
                <Avatar className='w-24 h-24'> 
                  <AvatarImage src="https://github.com/matnrocha.png" />
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@matnrocha</h4>
                  <p className="text-sm">Desenvolvedor</p>
                  <div className="flex items-center pt-1">
                    <a 
                      href="https://www.linkedin.com/in/mateusanroc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                  <div className="flex items-center pt-1">
                    <a 
                      href="https://github.com/matnrocha" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Github
                    </a>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </aside>

      {/* Area principal de chat */}
      <main className="flex flex-col flex-1">
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <h2 className="mb-2 text-xl font-medium text-gray-800">AI Powered Enterprise Solutions</h2>
              <p className="max-w-md text-gray-600">
                Explore the power of conversational AI for smarter business automation.
              </p>
            </div>
          )}

          <div className="flex flex-col mx-auto space-y-4" style={{ width: '85%' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[90%] p-4 rounded-lg",
                    msg.sender === 'user' 
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  )}
                >
                  <div className={msg.sender === 'user' ? "text-white" : "text-gray-700"}>
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Área de input */}
        <div className="sticky bottom-0 pt-2 bg-transparent">
          <div className="max-w-3xl p-4 mx-auto">
            <div className="relative flex items-end">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                }}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="w-full pr-12 min-h-[50px] rounded-lg py-3 px-4 border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-y-auto"
                rows={1}
                style={{
                  maxHeight: '150px',
                  transition: 'height 0.2s ease-out',
                }}
                ref={(el) => {
                  if (el && !input) {
                    el.style.height = 'auto';
                  }
                }}
              />
              <Button 
                onClick={sendMessage}
                disabled={!input || isLoading}
                className="absolute p-0 bg-blue-500 rounded-md right-2 bottom-2 w-9 h-9 hover:bg-blue-600"
              >
                <img 
                  src={angleRight} 
                  alt="Send" 
                  className="w-4 h-4 filter brightness-0 invert"
                />
              </Button>
            </div>
            <p className="mt-2 text-xs text-center text-gray-500">
              Visor Chat is not a Visor.ai product yet and any inaccurate information relies on Mateus Rocha.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;