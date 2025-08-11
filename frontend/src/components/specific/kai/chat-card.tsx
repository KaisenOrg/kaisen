import { Card } from "@/components/ui/card";
import {
  AcademicCapIcon,
  DocumentPlusIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import type { ElementType } from "react";

interface ChatCardProps {
  title: string;
  description: string;
  Icon: ElementType;
}

const cards: ChatCardProps[] = [
  {
    title: "Create a study plan",
    description: "Organize your tasks and prepare for exams",
    Icon: AcademicCapIcon,
  },
  {
    title: "Break down this PDF to me",
    description: "Organize your tasks and prepare for exams",
    Icon: DocumentPlusIcon,
  },
  {
    title: "Lorem ipsum dolor sit amet",
    description: "Lorem ipsum dolor sit amet",
    Icon: KeyIcon,
  },
];

export function ChatCard() {
  return (
    <div className="grid gap-5 grid-cols-3 w-full">
      {cards.map((card, index) => (
        <Card
          className="flex w-full cursor-pointer flex-row items-center gap-4 border-zinc-800 p-3 transition-colors hover:bg-zinc-900"
          key={index}
        >
          {/* Container do Ícone */}
          <div className="flex-shrink-0">
            <card.Icon className="text-orange-500" width={32} height={32} />
          </div>

          {/* Container do Texto */}
          <div className="flex flex-col">
            <strong className="text-base text-white">{card.title}</strong>
            <span className="text-sm text-zinc-400">{card.description}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
