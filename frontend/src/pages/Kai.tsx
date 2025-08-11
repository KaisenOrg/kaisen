import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AcademicCapIcon,
  DocumentPlusIcon,
  KeyIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";

interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const cards : InfoCardProps[] = [
  {
    title: "Create a study plan",
    description: "Organize your tasks and prepare for exams",
    icon: AcademicCapIcon,
  },
  {
    title: "Break down this PDF to me",
    description: "Organize your tasks and prepare for exams",
    icon: DocumentPlusIcon,
  },
  {
    title: "Lorem ipsum dolor sit amet",
    description: "Lorem ipsum dolor sit amet",
    icon: KeyIcon,
  },
];


export default function KaiPage( _props : InfoCardProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-full gap-5 mx-32">
      <div className="flex flex-col items-center">
        <img src="/kai-waiting.svg" width={140} height={140} />
        <h1 className="text-3xl font-semibold">Kai</h1>
        <p className="text-zinc-400 text-base">
          Your Ai study partner right here{" "}
        </p>
      </div>

      <div className="grid gap-5 grid-cols-3 w-full">
        {/* Cards de perguntas rápidas */}
        {cards.map((card, i) => (
          <Card className="border-zinc-800 p-3 flex-row items-center gap-4" key={i}>
            {/* Container do Ícone */}
            < card.icon className="flex-shrink-0 text-orange-500"
            width={32}
            height={32}/>
            {/* Container do Texto */}
            <div className="flex flex-col">
              <strong className="text-base">{card.title}</strong>
              <span className="text-sm text-zinc-400">{card.description}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ChatInput */}
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
          <Button variant="ghost" className="text-bold">
            <PaperAirplaneIcon className="" width={32} height={32} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
