/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { Message } from '../../types/chat';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChatAPI } from '../../api/chat';
import { useToast } from '../ui/use-toast';

interface ChatWindowProps {
  sessionId: string;
  initialMessages?: Message[];
  modelType?: string;
}

export function ChatWindow({ 
  sessionId, 
  initialMessages = [], 
  modelType = 'default' 
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Carrega mensagens ao montar o componente
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const loadedMessages = await ChatAPI.getMessages(sessionId);
        setMessages(loadedMessages);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive',
        });
      }
    };
    loadMessages();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Cria ID temporário para a mensagem do usuário
    const tempId = Date.now().toString();
    const userMessage: Message = {
      id: tempId,
      sessionId,
      content: input,
      role: 'user',
      modelType,
      timestamp: new Date().toISOString(),
    };

    // Atualização otimista - mostra a mensagem do usuário imediatamente
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Envia a mensagem e recebe a resposta da AI
      const aiResponse = await ChatAPI.sendMessage(sessionId, input);
      
      // Atualiza o estado com ambas as mensagens
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId), // Remove a temporária
        {
          ...userMessage,
          id: `user-${Date.now()}`, // Novo ID para a mensagem do usuário
        },
        {
          id: `ai-${Date.now()}`,
          sessionId,
          content: aiResponse.content,
          role: 'model',
          modelType,
          timestamp: new Date().toISOString(),
        }
      ]);
    } catch (error) {
      // Remove a mensagem temporária em caso de erro
      setMessages(prev => prev.filter(m => m.id !== tempId));
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="w-6 h-6 mt-1 mr-2">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <p className="break-words whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center px-4 py-2 rounded-lg bg-muted">
                <div className="flex space-x-2 animate-pulse">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
            className="min-w-[80px]"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}