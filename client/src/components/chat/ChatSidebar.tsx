import React from 'react';
import { LogOutIcon, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { type ChatSession, type User } from '../../types/chat';
import logo from '../../assets/logo.jpg';

interface ChatSidebarProps {
  user: User;
  sessions: ChatSession[];
  selectedSession: ChatSession | null;
  onSelectSession: (session: ChatSession | null) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onCreateNewChat: () => void;
  onLogout: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  user,
  sessions,
  selectedSession,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onCreateNewChat,
  onLogout
}) => {
  const handleRenameClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const newTitle = prompt("Digite o novo título da sessão:");
    if (newTitle && newTitle.trim()) {
      onRenameSession(sessionId, newTitle);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja deletar esta sessão?")) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <aside className="flex flex-col w-64 h-screen p-4 bg-white border-r border-gray-200">
      {/* User Card with Logout */}
      <Card className="p-3 mt-6 mb-10 rounded-lg bg-gray-50">
        <CardContent className="flex items-center justify-between p-0">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={logo} />
            </Avatar>
            <div className="overflow-hidden">
                <h3 className="font-medium text-gray-800 truncate">
                  {(() => {
                    const firstName = user.name.split(' ')[0];
                    if (firstName.length <= 12) {
                      return firstName;
                    } else {
                      return firstName.slice(0, 9) + '...';
                    }
                  })()}
                </h3>
              <p className="text-xs text-gray-500 truncate">
                  {(() => {
                    const email = user.email.split('@')[0];
                    if (email.length <= 15) {
                      return email;
                    } else {
                      return email.slice(0, 15) + '...';
                    }
                  })()}
              </p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-1 text-gray-500 rounded-md hover:bg-gray-200 hover:text-gray-700"
            title="Logout"
          >
            <LogOutIcon className='w-4 h-4'></LogOutIcon>
          </button>
        </CardContent>
      </Card>
        
      {/* Top Content */}
      <div className="mb-8 space-y-4">
        <Button 
          onClick={onCreateNewChat} 
          className="justify-start w-full gap-2 px-4 py-2 text-sm font-normal text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Plus size={16} className="text-gray-600" />
          New Chat
        </Button>
      </div>

      <div className="flex items-center gap-3 pl-2">
        <p className="text-center text-gray-500 text-s">Chats</p>
      </div>
            
      {/* Sessions List */}
      <div className="flex-1 py-4 mb-4 overflow-y-auto">
        {sessions.map(session => (
          <Card
            key={session.id}
            onClick={() => onSelectSession(session)}
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
                      onClick={(e) => handleRenameClick(e, session.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200"/>
                    <DropdownMenuItem
                      onClick={(e) => handleDeleteClick(e, session.id)}
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

      {/* Fixed bottom area */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-3 pl-2 cursor-pointer">
              <p className="text-xs text-center text-gray-500 hover:underline">developed by Mateus Rocha</p>
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
  );
};