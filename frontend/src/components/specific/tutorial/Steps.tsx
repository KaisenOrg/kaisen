import type { TutorialStep } from "@/hooks/useTutorial";

export const basicSteps: TutorialStep[] = [
  // 1) Boas-vindas
  {
    id: "welcome",
    placement: "center",
    content: (
      <div className="flex flex-col gap-2 text-center">
        <h4 className="text-lg leading-none font-semibold">Bem-vindo(a) 👋</h4>
        <p>Vamos te apresentar rapidamente os principais pontos do Kaisen.</p>
      </div>
    ),
    badgeSrc: "/kai-sitting-off.svg",
  },

  // 2) Topbar (visão geral)
  {
    id: "topbar-overview",
    selector: '[data-tour="topbar"]',
    placement: "bottom",
    content: "Aqui no topo ficam a busca, filtros rápidos e atalhos do seu perfil.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-search",
    selector: '[data-tour="topbar-search"]',
    placement: "bottom",
    content: "Use a barra de pesquisa para encontrar trilhas, pessoas e conteúdos rapidamente.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-coins",
    selector: '[data-tour="topbar-coins"]',
    placement: "bottom",
    content: "Moedas Kai: você ganha ao completar trilhas e ajudar a comunidade.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-notifications",
    selector: '[data-tour="topbar-notifications"]',
    placement: "bottom",
    content: "Notificações: acompanhe curtidas, comentários e menções.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-profile",
    selector: '[data-tour="topbar-profile"]',
    placement: "left",
    content: "Perfil: edite suas informações e acesse suas trilhas.",
    badgeSrc: "/kai-hidding.svg",
  },

  // 3) Sidebar (visão geral e itens)
  {
    id: "sidebar-overview",
    selector: '[data-tour="sidebar"]',
    placement: "right",
    content: "Este é o menu lateral com os acessos principais do Kaisen.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "go-home",
    selector: '[data-tour="sidebar-home"]',
        route: "/",
    placement: "right",
    content: "Home: aqui você vê destaques e recomendações para começar.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "sidebar-create-track",
    selector: '[data-tour="sidebar-create-track"]',
    placement: "top",
    content: "Crie uma nova trilha a partir de um tema ou objetivo.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "sidebar-suggestions",
    selector: '[data-tour="sidebar-suggestions"]',
    placement: "bottom",
    content: "Sugestões personalizadas com base no seu uso e interesses.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "sidebar-kai-agent",
    selector: '[data-tour="sidebar-kai-agent"]',
        route: "/kai",

    placement: "right",
    content: "Agente Kai: assistente para aprender, criar e tirar dúvidas.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "sidebar-community",
    selector: '[data-tour="sidebar-community"]',
        route: "/community",

    placement: "right",
    content: "Comunidade: interaja, compartilhe trilhas e colabore.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "sidebar-shop",
    selector: '[data-tour="sidebar-shop"]',
    placement: "right",
        route: "/store",

    content: "Lojinha do Kai: troque suas moedas por itens e benefícios.",
    badgeSrc: "/kai-hidding.svg",
  },

  
  // 4) Navegar para Discover
  {
    id: "go-discover",
    route: "/discover",
    placement: "center",
    content: "Vamos abrir a página Discover para explorar trilhas.",
  },

  // 5) Discover (filtros e cards)
  {
    id: "discover-filters",
    selector: '[data-tour="discover-filters"]',
    placement: "bottom",
    content: "Pesquise por tema e ajuste os filtros para refinar os resultados.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "discover-track-card",
    selector: '[data-tour="track-card"]',
    placement: "top",
    content: "Cada card mostra criador, duração e engajamento. Clique para ver a trilha.",
  },

  {
    id: "sidebar-settings",
    selector: '[data-tour="sidebar-settings"]',
    placement: "right",
    content: "Configurações e ajuda: personalize a experiência e tire dúvidas.",
    badgeSrc: "/kai-hidding.svg",
  },

  // 6) Encerramento
  {
    id: "finish",
    placement: "center",
    content: (
      <div className="flex flex-col gap-2 text-center">
        <h4 className="text-lg leading-none font-semibold">Tudo pronto! 🚀</h4>
        <p>Agora é só explorar e começar sua jornada no Kaisen.</p>
      </div>
    ),
  },
];

