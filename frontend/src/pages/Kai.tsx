import ChatApresentation from "@/components/specific/kai/chat-apresentation";
import { ChatBox } from "@/components/specific/kai/chat-box";
import { ChatCard } from "@/components/specific/kai/chat-card";
import { ChatInput } from "@/components/specific/kai/chat-input";
import type { Message } from "@/types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function KaiPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Simulação da resposta da IA
    setTimeout(() => {
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `Esta é uma resposta simulada para: "${content}"`,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-full gap-5 mx-32">
      {messages.length === 0 ? (
        <div>
          <ChatApresentation />
          <ChatCard onSelectPrompt={handleSendMessage} />
        </div>
      ) : (
        <ChatBox messages={messages} />
      )}

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
