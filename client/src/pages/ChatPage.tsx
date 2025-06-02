import React, { useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { 
  ChatSidebar,
  ChatBubble,
  ChatInput,
  EmptyState
 } from '../components/chat/index';

const ChatPage = () => {
  const {
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
  } = useChat();
  
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        user={user}
        sessions={sessions}
        selectedSession={selectedSession}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onRenameSession={(sessionId, newTitle) => renameSession(sessionId, newTitle)}
        onCreateNewChat={createNewChat}
        onLogout={handleLogout}
      />

      <main className="flex flex-col flex-1">
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          {messages.length === 0 || !selectedSession ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col mx-auto space-y-4" style={{ width: '85%' }}>
              {messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 pt-2 bg-transparent">
          <div className="max-w-3xl p-4 mx-auto">
            <ChatInput 
              onSend={sendMessage} 
              disabled={isLoading} 
            />
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