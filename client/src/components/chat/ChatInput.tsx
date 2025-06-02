import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import angleRight from '../../assets/angle-right.png';

interface ChatInputProps {
  onSend: (input: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="relative flex items-end">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full pr-12 min-h-[50px] rounded-lg py-3 px-4 border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-y-auto"
        rows={1}
        style={{
          maxHeight: '150px',
          transition: 'height 0.2s ease-out',
        }}
      />
      <Button 
        onClick={handleSend}
        disabled={!input || disabled}
        className="absolute p-0 bg-blue-500 rounded-md right-2 bottom-2 w-9 h-9 hover:bg-blue-600"
      >
        <img 
          src={angleRight} 
          alt="Send" 
          className="w-4 h-4 filter brightness-0 invert"
        />
      </Button>
    </div>
  );
};