import ChatApresentation from "@/components/specific/kai/chat-apresentation";
import { ChatBox } from "@/components/specific/kai/chat-box";
import { ChatCard } from "@/components/specific/kai/chat-card";
import { ChatInput } from "@/components/specific/kai/chat-input";
import { useActor } from "@/lib/agent";
import type { Message } from "@/types";
import clsx from "clsx";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function KaiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const chatActor = useActor("chats_backend");
  const kaiActor = useActor("kai_backend");

  const sendMessage = async (content: string) => {
    if (!chatActor || !kaiActor || isLoading) {
      console.error("Atores do backend não estão prontos.");
      return;
    }

    setIsLoading(true);

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
    };

    const loadingMessage: Message = {
      id: uuidv4(),
      role: "model",
      content: "",
      isLoading: true,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);

    const updatedMessages = [...messages, userMessage];

    const showMessages = [...updatedMessages, loadingMessage];

    //Motsrar as mensagens
    setMessages(showMessages);

    //Formatar o histórico
    const historyForAI = updatedMessages
      .map(
        (m) =>
          `{"role": "${m.role}", "parts": [{"text": "${m.content.replace(
            /"/g,
            '\\"'
          )}"}]}`
      )
      .join(", ");

    try {
      //Iniciar a sessão de um chat
      let currentChatId = chatId;

      if (!currentChatId) {
        const newChatResult = await chatActor.createChatSession(content);
        if ("err" in newChatResult) {
          throw new Error(JSON.stringify(newChatResult.err));
        }
        currentChatId = newChatResult.ok;
        setChatId(currentChatId);
      }

      const result = await kaiActor.generateChatResponse(
        content,
        historyForAI ? [historyForAI] : []
      );
      if ("err" in result) {
        throw new Error(JSON.stringify(result.err));
      }

      //Obter a resposta da IA
      const aiResponseText = JSON.parse(result.ok).candidates[0].content
        .parts[0].text;

      await chatActor.addInteraction(currentChatId!, content, aiResponseText);

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "model",
        content: aiResponseText,
      };

      //Mudar o loading para a resposta da IA
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = assistantMessage;
        return newMessages;
      });

      //Tratamento de erros
    } catch (error) {
      console.error("Ocorreu um erro ao enviar a mensagem:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: "model",
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col flex-grow justify-center items-center min-h-full gap-5 mx-32 mb-5"
      )}
    >
      {messages.length === 0 ? (
        <div>
          <ChatApresentation />
          <ChatCard
            onSelectPrompt={sendMessage}
          />
        </div>
      ) : (
        <ChatBox messages={messages} />
      )}

      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        isFirstMessage={messages.length === 0}
      />
    </div>
  );
}
