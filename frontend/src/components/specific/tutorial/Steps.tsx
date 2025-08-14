import type { TutorialStep } from "@/hooks/useTutorial";

export const basicSteps: TutorialStep[] = [
  {
    id: "welcome",
    content: (
      <div>
        <h4 className="text-lg leading-none font-semibold pb-5">Bem-vindo(a) 👋</h4>
        <p className=" ">Voce é novo por aqui, vamos te localizar</p>
      </div>
    ),
    placement: "center",
    badgeSrc: "/kai-sitting-off.svg",
  },
  {
    id: "sidebar",
    selector: '[data-tour="sidebar"]',
    content: "Este é o menu lateral com as principais seções.",
    placement: "right",
        badgeSrc: "/kai-hidding.svg",

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
    id: "home-link",
    selector: "#home-link",
    content: "Aqui você acessa a Home pelo menu.",
    placement: "bottom",
  },

  {
    id: "progress-link",
    selector: "#progress-link",
    content: "Aqui você acessa o perfil pelo menu.",
    placement: "bottom",
  },

  {
    id: "track-card",
    selector: '[data-tour="track-card"]',
    content: "Estas são as trilhas. Clique para ver detalhes e começar.",
    placement: "bottom",
  },
];
