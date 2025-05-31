/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ChatList.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChatSession } from "@/types/chat";

interface ChatListProps {
  sessions: ChatSession[];
  activeSession: string | null;
  onSessionSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ChatList({
  sessions,
  activeSession,
  onSessionSelect,
  onRename,
  onDelete,
}: ChatListProps) {
  const { toast } = useToast();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRename = async (sessionId: string) => {
    if (!newTitle.trim()) {
      toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await onRename(sessionId, newTitle);
      setRenamingId(null);
      toast({
        title: "Success",
        description: "Chat renamed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename chat",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (sessionId: string) => {
    setDeletingId(sessionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await onDelete(deletingId);
        toast({
          title: "Success",
          description: "Chat deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete chat",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-1">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`flex items-center justify-between rounded-md ${
            activeSession === session.id ? "bg-secondary" : "hover:bg-accent"
          }`}
        >
          {renamingId === session.id ? (
            <div className="flex items-center w-full gap-2 p-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(session.id);
                  if (e.key === "Escape") setRenamingId(null);
                }}
                autoFocus
                className="h-8"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRename(session.id)}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRenamingId(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <button
                className="flex-1 px-3 py-2 text-left truncate"
                onClick={() => onSessionSelect(session.id)}
              >
                {session.title}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 hover:bg-transparent"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => {
                      setNewTitle(session.title);
                      setRenamingId(session.id);
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteClick(session.id)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete Confirmation Dialog */}
              <Dialog
                open={deleteDialogOpen && deletingId === session.id}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Chat</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this chat? This action cannot
                    be undone.
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDelete}
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      ))}
    </div>
  );
}