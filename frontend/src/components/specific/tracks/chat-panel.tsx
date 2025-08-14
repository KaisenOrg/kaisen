import { useState, useRef} from "react";
import { Input } from "@/components/ui/input";
import {
  InformationCircleIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { ChatSuggestionCard } from "./chat-suggestion-card";
import { useActor } from "@/lib/agent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";
import type { Message } from "@/types";
import { LoadingBubble } from "../kai/loading-bubble";

const card1Prompt = "Hi Kai! I'd like you to explain a concept to me. Please ask me what the concept is and then explain it in a simple and easy-to-understand way.";
const card2Prompt = "Let's do a quiz to test my knowledge. Ask me for the topic, and then create 5 multiple-choice questions about it. After I answer, tell me my score.";

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [__isLoading, setIsLoading] = useState(false);

  
  const inputRef = useRef<HTMLInputElement>(null);
  const kaiActor = useActor("kai_backend");
  
  const handleSend = (promptText? : string) => {
    const contentToSend = promptText || input;
    
    if (!contentToSend.trim()) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: contentToSend,
    };

    const newChatHistory = [...chat, userMessage];

    setChat(newChatHistory);
    setInput("");
    setShowChat(true);

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { id: uuidv4(), role: "model", content: "", isLoading: true },
      ]);
    }, 0);

    const historyForAI = newChatHistory
      .map(
        (m) =>
          `{"role": "${m.role.toLowerCase()}", "parts": [{"text": "${m.content.replace(
            /"/g,
            '\\"'
          )}"}]}`
      )
      .join(", ");

    kaiActor
      ?.generateChatResponse(input, chat.length > 0 ? [historyForAI] : [])
      .then((response) => {
        if ("err" in response) {
          console.error("API Error:", response.err); // Bom para debugar
          setChat((prev) => {
            const newMessages = [...prev];

            if (newMessages.length > 0) {
              newMessages[newMessages.length - 1] = {
                id: uuidv4(),
                role: "model",
                content: "Desculpe, ocorreu um erro.",
              };
            }
            return newMessages;
          });
        } else {
          setChat((prev) => {
            const newMessages = [...prev];
            if (newMessages.length > 0) {
              const responseContent =
                JSON.parse(response.ok)?.candidates?.[0]?.content?.parts?.[0]
                  ?.text ?? "Não consegui processar a resposta.";

              newMessages[newMessages.length - 1] = {
                id: uuidv4(),
                role: "model",
                content: responseContent,
              };
            }
            return newMessages;
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <main className="p-4 h-full flex flex-col justify-between">
      {showChat ? (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 text-zinc-500">
              <InformationCircleIcon className="h-6 w-6 transition-colors cursor-pointer hover:text-zinc-700" />
              <ArrowsPointingOutIcon className="h-6 w-6 transition-colors cursor-pointer hover:text-zinc-700" />
            </div>
            <div>
              <XMarkIcon
                className="h-6 w-6 text-zinc-500 transition-colors cursor-pointer hover:text-zinc-700"
                onClick={() => setShowChat(false)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {chat.map((msg, idx) =>
              msg.role === "model" ? (
                <div
                  key={idx}
                  className="flex gap-2 self-start max-w-[80%] items-center justify-center"
                >
                  <img
                    src="/kai-sitting.svg"
                    alt="Kai"
                    width={48}
                    height={48}
                    className="mb-1"
                  />
                  <div className="text-white bg-orange-500 px-4 py-2 rounded-xl">
                    {msg.isLoading ? (
                      <LoadingBubble />
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  key={idx}
                  className="self-end bg-zinc-800 text-white px-4 py-2 rounded-xl max-w-[70%]"
                >
                  {msg.content}
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex w-full justify-between">
            <div className="flex gap-2 text-zinc-500">
              <InformationCircleIcon className="h-6 w-6 transition-colors cursor-pointer hover:text-zinc-700" />
              <ArrowsPointingOutIcon className="h-6 w-6 transition-colors cursor-pointer hover:text-zinc-700" />
            </div>
            <div>
              <XMarkIcon className="h-6 w-6 text-zinc-500 transition-colors cursor-pointer hover:text-zinc-700" />
            </div>
          </div>
          <img
            src="/kai-hidding.svg"
            alt="Kai"
            width={100}
            height={100}
            className="-mt-6"
          />
          <h1 className="font-semibold text-lg">Kai</h1>
          <p className="text-zinc-400 text-base mb-6">
            Your AI study partner right here
          </p>
          <div className="w-full flex flex-col gap-3">
            <ChatSuggestionCard
              title="Explain this concept"
              description="Get a simple explanation for any topic"
              onClick={ () => handleSend(card1Prompt)}
            />
            <ChatSuggestionCard
              title="Quiz me on this lesson"
              description="Test your knowledge with a quick quiz"
              onClick={() => handleSend(card2Prompt)}

            />
          </div>
        </div>
      )}

      <div className="relative mt-4">
        <div className="absolute right-3 inset-y-0 flex items-center gap-2">
          <PaperClipIcon className="h-5 w-5 text-zinc-400 cursor-pointer" />
          <PaperAirplaneIcon
            className="h-5 w-5 text-zinc-400 cursor-pointer"
          />
        </div>
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="How can I help you?"
          className="pr-16 !bg-transparent h-12"
        />
      </div>
    </main>
  );
}
