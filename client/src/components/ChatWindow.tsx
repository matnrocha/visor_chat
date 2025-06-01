// src/components/chat/ChatWindow.tsx
import {
  ScrollArea
} from "@/components/ui/scroll-area";
import {
  Input
} from "@/components/ui/input";
import {
  Button
} from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { Send } from "lucide-react";

interface Props {
  messages: Message[];
  onSend: (content: string) => void;
  isLoading: boolean;
}

export function ChatWindow({ messages, onSend, isLoading }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 max-w-[80%] whitespace-pre-wrap ${
              msg.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "mr-auto bg-muted"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4 border-t"
      >
        <Input
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
