/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { ChatSession } from '../types/chat';
import { ChatAPI } from '../api/chat';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Button } from '../components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../components/ui/resizable';
import { PlusIcon } from '@radix-ui/react-icons';
import { useToast } from '../components/ui/use-toast';

export function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await ChatAPI.getSessions();
        setSessions(data);
        if (data.length > 0 && !activeSession) {
          setActiveSession(data[0].id);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load chat sessions',
          variant: 'destructive',
        });
      }
    };

    fetchSessions();
  }, []);

  const handleCreateSession = async () => {
    setIsCreatingSession(true);
    try {
      const newSession = await ChatAPI.createSession('default');
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create new chat session',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <div className="h-full p-4 border-r">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chats</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCreateSession}
                disabled={isCreatingSession}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {sessions.map((session) => (
                <Button
                  key={session.id}
                  variant={activeSession === session.id ? 'secondary' : 'ghost'}
                  className="justify-start w-full"
                  onClick={() => setActiveSession(session.id)}
                >
                  <span className="truncate">{session.title}</span>
                </Button>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className="h-full">
            {activeSession ? (
              <ChatWindow sessionId={activeSession} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-medium">No active chat</h3>
                  <p className="text-muted-foreground">
                    Select a chat or create a new one
                  </p>
                  <Button
                    onClick={handleCreateSession}
                    disabled={isCreatingSession}
                  >
                    New Chat
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}