import React from 'react';
import { type Message } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <div className={cn(
      "flex",
      message.sender === 'user' ? "justify-end" : "justify-start"
    )}>
      <div
        className={cn(
          "max-w-[90%] p-4 rounded-lg",
          message.sender === 'user' 
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white border border-gray-200 rounded-bl-none"
        )}
      >
        <div className={message.sender === 'user' ? "text-white" : "text-gray-700"}>
          <ReactMarkdown>
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};