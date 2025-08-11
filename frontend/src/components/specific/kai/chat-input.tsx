import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/outline";

export default function ChatInput(){
    return(
        <Card className="flex-col w-full items-end rounded-xl border border-zinc-700 p-2 bg-transparent">
        {/* Botão de Anexar Arquivo */}
        {/* O Textarea em si */}
        <Textarea
          placeholder="Type your message here..."
          className=" resize-none border-none !bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-full w-full p-2 flex"
          //fazer o textarea crescer com o texto
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        <div className="flex flex-row justify-between w-full text-bold">
          <Button variant="ghost" className="font-bold flex-row">
            <PaperClipIcon
              className=" text-zinc-400 w-6 h-6"
              width={32}
              height={32}
            />
            <span className="font-bold">Attach</span>
          </Button>
          {/* Botão de Enviar */}
          <Button variant="ghost" className="text-center ">
            <PaperAirplaneIcon 
            className="w-full h-full" 
            width={32} 
            height={32} />
          </Button>
        </div>
      </Card>
    );
}