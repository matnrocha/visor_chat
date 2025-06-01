// src/components/chat/ChatSidebar.tsx
import {
    ScrollArea,
  } from "@/components/ui/scroll-area";
  import {
    Button
  } from "@/components/ui/button";
  import {
    Plus,
    MoreVertical,
    Trash,
    Pencil
  } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from "@/components/ui/dropdown-menu";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog";
  import {
    Input
  } from "@/components/ui/input";
  import { useState } from "react";
  import { ChatSession } from "@/types/chat";
  import clsx from "clsx";
  
  interface Props {
    sessions: ChatSession[];
    activeSession: string | null;
    onSessionSelect: (id: string) => void;
    onCreateSession: () => void;
    onDelete: (id: string) => void;
    onRename: (id: string, title: string) => void;
    isCreatingSession: boolean;
  }
  
  export function ChatSidebar({
    sessions,
    activeSession,
    onSessionSelect,
    onCreateSession,
    onDelete,
    onRename,
    isCreatingSession,
  }: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
  
    return (
      <div className="w-[260px] bg-muted h-full flex flex-col border-r">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Conversas</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={onCreateSession}
            disabled={isCreatingSession}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
  
        <ScrollArea className="flex-1">
          <ul className="p-2 space-y-1">
            {sessions.map((session) => (
              <li
                key={session.id}
                className={clsx(
                  "group rounded-md px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-accent",
                  {
                    "bg-accent": session.id === activeSession,
                  }
                )}
                onClick={() => onSessionSelect(session.id)}
              >
                <span className="w-full truncate">
                  {session.title || "Sem título"}
                </span>
  
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="transition-opacity opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        setEditingId(session.id);
                        setNewTitle(session.title);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Renomear
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => onDelete(session.id)}
                      className="text-red-600"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </ScrollArea>
  
        {/* Modal de renomear */}
        <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Renomear conversa</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingId && newTitle.trim()) {
                  onRename(editingId, newTitle.trim());
                }
                setEditingId(null);
                setNewTitle("");
              }}
              className="space-y-4"
            >
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end">
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  