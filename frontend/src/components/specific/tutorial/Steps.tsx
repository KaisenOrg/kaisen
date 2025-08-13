// src/tutorial/steps.tsx
import type { TutorialStep } from "@/hooks/useTutorial";

export const basicSteps: TutorialStep[] = [
  {
    id: "welcome",
    content: (
      <div>
        <h4 className="font-semibold mb-1">Bem-vindo(a) 👋</h4>
        <p className="text-sm">Vamos fazer um tour bem curto.</p>
      </div>
    ),
  },
  {
    id: "menu",
    content: <p className="text-sm">Aqui você encontra o menu lateral com as seções principais.</p>,
  },
  {
    id: "done",
    content: (
      <div>
        <h4 className="font-semibold mb-1">Fim 🎉</h4>
        <p className="text-sm">Pronto! Você pode refazer este tutorial nas Configurações.</p>
      </div>
    ),
  },
];
