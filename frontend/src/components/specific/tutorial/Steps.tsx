import type { TutorialStep } from "@/hooks/useTutorial";

export const basicSteps: TutorialStep[] = [
  {
    id: "welcome",
    placement: "center",
    content: (
      <div className="flex flex-col gap-2 text-center">
        <h4 className="text-lg leading-none font-semibold">Welcome to Kaisen</h4>
        <p>I'm Kai, and I'll give you a quick tour so you know where to find everything you need to get started.</p>
      </div>
    ),
    badgeSrc: "/kai-sitting-off.svg",
  },

  {
    id: "topbar-overview",
    selector: '[data-tour="topbar"]',
    placement: "bottom",
    content: "This is the top menu — here you'll find the main shortcuts.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-search",
    selector: '[data-tour="topbar-search"]',
    placement: "bottom",
    content: "Use the search bar to quickly find tracks, people, or content.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-coins",
    selector: '[data-tour="topbar-coins"]',
    placement: "bottom",
    content: "Here you can view your KOINs: earn them by completing tracks and engaging with the community.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-notifications",
    selector: '[data-tour="topbar-notifications"]',
    placement: "bottom",
    content: "Here you can keep up with interactions, updates, and mentions related to you.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "topbar-profile",
    selector: '[data-tour="topbar-profile"]',
    placement: "top",
    content: "Access your profile here. Manage personal information and view your tracks.",
  },

  {
    id: "sidebar-overview",
    selector: '[data-tour="sidebar"]',
    placement: "right",
    content: "This is the side menu — your starting point to access everything in Kaisen.",
    badgeSrc: "/kai-standing.svg",
  },
  {
    id: "go-home",
    selector: '#home-link',
    route: "/",
    placement: "right",
    content: "On the Home page, you'll find news, highlights, and ideas to advance your studies.",
    badgeSrc: "/kai-sitting-off.svg",
  },
  {
    id: "sidebar-create-track",
    selector: '[data-tour="sidebar-create-track"]',
    placement: "top",
    content: "Want to create something from scratch? Build a track from a topic or goal here.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "sidebar-suggestions",
    selector: '[data-tour="sidebar-suggestions"]',
    placement: "bottom",
    content: "Suggestions tailored for you, based on your activity and interests.",
    badgeSrc: "/kai-hidding.svg",
  },
  {
    id: "sidebar-kai-agent",
    selector: '#agent-link',
    route: "/kai",
    placement: "right",
    content: "Here you can talk directly to me — your assistant for learning and creation.",
    badgeSrc: "/kai-standing.svg",
  },

  {
    id: "sidebar-shop",
    selector: '#progress-link',
    placement: "right",
    route: "/profile/overview",
    content: "In your profile, you can see your progress, achievements, and manage your tracks.",
    badgeSrc: "/kai-standing.svg",
  },

  {
    id: "sidebar-shop",
    selector: '#store-link',
    placement: "right",
    route: "/store",
    content: "In Kai's Store, exchange your coins for items, resources, and benefits to help your journey.",
    badgeSrc: "/kai-standing.svg",
  },

  {
    id: "sidebar-community",
    selector: '[data-tour="sidebar-community"]',
    route: "/discover",
    placement: "center",
    content: "Let's go to the Discover page, where you can explore new tracks.",
    badgeSrc: "/kai-bike.svg",
  },

  {
    id: "discover-filters",
    selector: '#discover-filter',
    placement: "bottom",
    content: "Search by topic and refine results using filters.",
    badgeSrc: "/kai-bike.svg",
  },
  {
    id: "discover-track-card",
    selector: '#discover-cards',
    placement: "top",
    content: "Each card shows the creator, duration, and engagement. Click to view the track.",
    badgeSrc: "/kai-bike.svg",
  },
  {
    id: "sidebar-community",
    selector: '[data-tour="sidebar-community"]',
    route: "/community",
    placement: "right",
    content: "The Community is where you can exchange ideas, share your tracks, and collaborate.",
    badgeSrc: "/kai-standing.svg",
  },

  {
    id: "sidebar-settings",
    selector: '[data-tour="sidebar-settings"]',
    placement: "right",
    content: "Here you can customize your experience and get help.",
    badgeSrc: "/kai-waiting.svg",
  },

  {
    id: "finish",
    placement: "center",
    content: (
      <div className="flex flex-col gap-2 text-center">
        <h4 className="text-lg leading-none font-semibold">All set!</h4>
        <p>Now it's time to explore and make the most of your journey on Kaisen.</p>
      </div>
    ),
    badgeSrc: "/kai-music.svg",
  },
];
