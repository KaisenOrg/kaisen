import { useEffect, useRef } from 'react';
import { type Message } from '@/types';
import { ChatMessage } from './chat-message';

interface ChatBoxProps {
  messages: Message[];
}

export function ChatBox({ messages }: ChatBoxProps) {
  // Ref para o final da lista de mensagens, para o auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Efeito para rolar para baixo sempre que a lista de mensagens mudar
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    // `flex-1` faz com que o chatbox ocupe todo o espaço vertical disponível
    // `overflow-y-auto` adiciona a barra de rolagem quando necessário
    <div className="w-full overflow-y-auto">
      <div className=" space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {/* Elemento invisível no final da lista para a ref de scroll */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}