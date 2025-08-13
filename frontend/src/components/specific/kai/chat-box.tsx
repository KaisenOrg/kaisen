import { useEffect, useRef } from 'react';
import { type Message } from '@/types';
import { ChatMessage } from './chat-message';

interface ChatBoxProps {
  messages: Message[];
}

export function ChatBox({ messages }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto mt-10 mb-4">
      <div className=" space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}