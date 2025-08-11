import ChatApresentation from "@/components/specific/kai/chat-apresentation";
import { ChatCard } from "@/components/specific/kai/chat-card";
import ChatInput from "@/components/specific/kai/chat-input";

export default function KaiPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-full gap-5 mx-32">
      <ChatApresentation />
      
      <ChatCard />

      <ChatInput />
    </div>
  );
}
