

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { InformationCircleIcon, ArrowsPointingOutIcon, XMarkIcon, PaperClipIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ChatSuggestionCard } from "./chat-suggestion-card";


export function ChatPanel() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([] as { role: "user" | "kai"; content: string }[]);
  const [showChat, setShowChat] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setChat((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setShowChat(true);
    // Optionally, add a fake Kai response for demo:
    setTimeout(() => {
      setChat((prev) => [...prev, { role: "kai", content: "I'm here to help!" }]);
    }, 500);
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
              <XMarkIcon className="h-6 w-6 text-zinc-500 transition-colors cursor-pointer hover:text-zinc-700" onClick={() => setShowChat(false)} />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {chat.map((msg, idx) => (
              msg.role === "kai" ? (
                <div key={idx} className="flex gap-2 self-start max-w-[80%] items-center justify-center">
                  <Image
                    src="/kai-sitting.svg"
                    alt="Kai"
                    width={48}
                    height={48}
                    className="mb-1"
                  />
                  <div className="bg-zinc-300 text-zinc-900 px-4 py-2 rounded-xl">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={idx} className="self-end bg-zinc-800 text-white px-4 py-2 rounded-xl max-w-[70%]">
                  {msg.content}
                </div>
              )
            ))}
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
          <Image
            src="/kai-hidding.svg"
            alt="Kai"
            width={100}
            height={100}
            className="-mt-6"
          />
          <h1 className="font-semibold text-lg">Kai</h1>
          <p className="text-zinc-400 text-base mb-6">Your AI study partner right here</p>
          <div className="w-full flex flex-col gap-3">
            <ChatSuggestionCard
              title="Explain this concept"
              description="Get a simple explanation for any topic"
            />
            <ChatSuggestionCard
              title="Quiz me on this lesson"
              description="Test your knowledge with a quick quiz"
            />
          </div>
        </div>
      )}

      <div className="relative mt-4">
        <div className="absolute right-3 inset-y-0 flex items-center gap-2">
          <PaperClipIcon className="h-5 w-5 text-zinc-400 cursor-pointer" />
          <PaperAirplaneIcon
            className="h-5 w-5 text-zinc-400 cursor-pointer"
            onClick={handleSend}
          />
        </div>
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="How can I help you?"
          className="pr-16 !bg-transparent h-12"
        />
      </div>
    </main>
  );
}