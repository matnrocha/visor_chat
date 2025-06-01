// src/pages/ChatPage.tsx
import { useEffect, useState } from "react";
import { ChatAPI } from "@/api/chat";
import { ChatSession, Message } from "@/types/chat";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { useToast } from "@/components/ui/use-toast";

export function ChatPage() {
  const { toast } = useToast();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Carregar sessões no mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await ChatAPI.getSessions();
        setSessions(data);
        if (data.length && !activeSessionId) {
          setActiveSessionId(data[0].id);
        }
      } catch {
        toast({
          title: "Erro",
          description: "Falha ao carregar sessões",
          variant: "destructive",
        });
      }
    };

    loadSessions();
  }, []);

  // Carregar mensagens da sessão ativa
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const data = await ChatAPI.getMessages(activeSessionId);
        setMessages(data);
      } catch {
        toast({
          title: "Erro",
          description: "Falha ao carregar mensagens",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeSessionId]);

  // Criar nova sessão
  const handleCreateSession = async () => {
    setIsCreatingSession(true);
    try {
      const newSession = await ChatAPI.createSession("default");
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao criar sessão",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    try {
      console.log("Renomear id:", sessionId, "com título:", newTitle.trim());
      const updatedSession = await ChatAPI.renameSession(sessionId, newTitle);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? updatedSession : s))
      );
      toast({
        title: "Sucesso",
        description: "Sessão renomeada com sucesso",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao renomear sessão",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await ChatAPI.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));

      // Se sessão ativa for a deletada, muda para outra ou null
      if (activeSessionId === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
      }

      toast({
        title: "Sucesso",
        description: "Sessão deletada com sucesso",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao deletar sessão",
        variant: "destructive",
      });
    }
  };

  // Enviar mensagem
  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) return;

    setIsSendingMessage(true);

    // Cria mensagem do usuário temporária para renderização imediata
    const tempId = `temp-${Date.now()}`;
    const userMessage: Message = {
      id: tempId,
      sessionId: activeSessionId,
      content,
      role: "user",
      modelType: "default",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const aiResponse = await ChatAPI.sendMessage(activeSessionId, content);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempId),
        userMessage,
        {
          id: `ai-${Date.now()}`,
          sessionId: activeSessionId,
          content: aiResponse.content,
          role: "model",
          modelType: "default",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Renomear e deletar funções podem ficar simples, você pode incluir se quiser.

  return (
    <div className="flex w-screen h-screen bg-background">
      <ChatSidebar
        sessions={sessions}
        activeSession={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onRename={handleRenameSession}
        onDelete={handleDeleteSession}
        onCreateSession={handleCreateSession}
        isCreatingSession={isCreatingSession}
      />

      <main className="flex flex-col flex-1">
        {activeSessionId ? (
          <ChatWindow
            messages={messages}
            onSend={handleSendMessage}
            isLoading={isSendingMessage || isLoadingMessages}
          />
        ) : (
          <div className="flex items-center justify-center flex-1 text-muted-foreground">
            Selecione ou crie uma nova conversa.
          </div>
        )}
      </main>
    </div>
  );
}
