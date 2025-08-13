import type { TutorialStep } from "@/hooks/useTutorial";

export const basicSteps: TutorialStep[] = [
  {
    id: "welcome",
    content: (
      <div>
        <h4 className="font-semibold mb-1">Bem-vindo(a) 👋</h4>
        <p className="text-sm">Tour rápido. Clique em “Próximo”.</p>
      </div>
    ),
    placement: "center",
  },
  {
    id: "sidebar",
    selector: '[data-tour="sidebar"]',
    content: "Este é o menu lateral com as principais seções.",
    placement: "right",
  },

  {
    id: "go-discover",
    route: "/discover",
    content: "Vamos abrir a página Discover para ver as trilhas.",
    placement: "center",
  },

  {
    id: "discover-link",
    selector: "#discover-link",
    content: "Aqui você acessa o Discover pelo menu.",
    placement: "bottom",
  },

  {
    id: "track-card",
    selector: '[data-tour="track-card"]',
    content: "Estas são as trilhas. Clique para ver detalhes e começar.",
    placement: "bottom",
  },
];
