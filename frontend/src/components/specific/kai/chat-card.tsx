  import { Card } from "@/components/ui/card";
  import {
    AcademicCapIcon,
    DocumentPlusIcon,
    KeyIcon,
  } from "@heroicons/react/24/outline";
  import type { ElementType } from "react";

  interface ChatCardData {
    title: string;
    description: string;
    prompt: string;
    Icon: ElementType;
  }

  const cards: ChatCardData[] = [
    {
      title: "Create a study plan",
      description: "Organize your tasks and prepare for exams",
      prompt: "I need to prepare for an upcoming exam. Help me build a weekly study plan.",
      Icon: AcademicCapIcon,
    },
    {
      title: "Break down this PDF to me",
      description: "Organize your tasks and prepare for exams",
      prompt: "Summarize the key points and concepts from this document for me.",
      Icon: DocumentPlusIcon,
    },
    {
      title: "Lorem ipsum dolor sit amet",
      description: "Lorem ipsum dolor sit amet",
      prompt: "Lorem ipsum",
      Icon: KeyIcon,
    },
  ];

  interface ChatCardProps {
    onSelectPrompt: (prompt: string) => void;
  };

  export function ChatCard( {onSelectPrompt}: ChatCardProps) {

    return (
      <div className="grid gap-5 grid-cols-3 w-full hover:bg-blend-hard-light">
        {/* Fila de cards com prompts feitos */}
        {cards.map((card, index) => (
          <Card
            onClick={ () => onSelectPrompt(card.prompt) }
            className="flex w-full h-full cursor-pointer flex-row items-center gap-4 border-zinc-800 p-3 transition-colors hover:bg-zinc-900"
            key={index}
          >
            <div className="flex-shrink-0">
              <card.Icon className="text-orange-500" width={32} height={32} />
            </div>

            <div className="flex flex-col">
              <strong className="text-base text-white">{card.title}</strong>
              <span className="text-sm text-zinc-400">{card.description}</span>
            </div>
          </Card>
        ))}
      </div>
    );
  }
