import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  isFirstMessage: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  isFirstMessage = true,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");

    const textarea = event.currentTarget.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  const useEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const isDisabled = !input.trim() || isLoading;

  return (
    <form
      onSubmit={submitMessage}
      className={clsx(
        "flex w-full flex-col items-end rounded-xl border border-zinc-700  bg-zinc-900 p-2 mb-10",
        isFirstMessage ? "" : "sticky bottom-0 max-w-5xl mb-5"
      )}
    >
      <Textarea
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        onKeyDown={useEnter}
        placeholder="Type your message here..."
        className="h-full w-full resize-none border-none !bg-transparent p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={1}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
        disabled={isLoading}
      />

      <div className="flex w-full flex-row justify-between">
        <Button variant="ghost" type="button" className="font-bold">
          <PaperClipIcon className="h-6 w-6 text-zinc-400" />
          <span className="ml-2 font-bold">Attach</span>
        </Button>

        <Button
          type="submit"
          variant="ghost"
          className="text-center"
          disabled={isDisabled}
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </Button>
      </div>
    </form>
  );
}
