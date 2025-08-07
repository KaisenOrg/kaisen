import { SkeletonCommunityCard } from "@/components/specific/community/skeleton-community-card";
import CommunityCard from "@/components/specific/community/community-card";
import DiscoverFilter from "@/components/specific/discover/discover-filter";

import { useEffect, useState } from "react";

interface CommunityData {
  id: string;
  title: string;
  description: string;
  creator: string;
  members: string;
  time: string;
  variant?: "large" | "default";
  showMascot?: boolean;
}

const mockCardsSectionA: CommunityData[] = [
  {
    id: "1",
    title: "Learn Next.js with the community",
    description: "Join us to explore the latest features of Next.js...",
    creator: "goat",
    members: "150",
    time: "30min",
    variant: "large",
    showMascot: true,
  },
  {
    id: "2",
    title: "Placeholder",
    description: "This is a placeholder for a community block.",
    creator: "placeholder",
    members: "0",
    time: "--",
  },
  {
    id: "3",
    title: "Placeholder",
    description: "This is a placeholder for a community block.",
    creator: "placeholder",
    members: "0",
    time: "--",
  },
  {
    id: "4",
    title: "Placeholder",
    description: "This is a placeholder for a community block.",
    creator: "placeholder",
    members: "0",
    time: "--",
  },
];

export default function Discover() {
  const [isLoading, setIsLoading] = useState(true);
  const [communitySectionA, setCommunitySectionA] = useState<CommunityData[]>(
    []
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCommunitySectionA(mockCardsSectionA);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main
      className="max-w-7xl mx-auto px-8"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <div className="mt-2">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Discover community blocks
        </h2>
        <h3
          className="text-sm font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          Lorem ipsum dolor sit amet consectuor
        </h3>

        <DiscoverFilter />

        <div className="grid grid-cols-4 mt-4 gap-4">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCommunityCard key={`skeleton-${i}`} />)
            : communitySectionA.map((data) => (
                <CommunityCard key={data.id} {...data} />
              ))}
        </div>
      </div>
      <div className="mt-12">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Based on what you have been studying
        </h2>
        <h3
          className="text-sm font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          Lorem ipsum dolor sit amet consectuor
        </h3>

        <div className="grid grid-cols-4 mt-4 gap-4">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCommunityCard key={`skeleton-${i}`} />)
            : communitySectionA.map((data) => (
                <CommunityCard key={data.id} {...data} />
              ))}
        </div>
      </div>
    </main>
  );
}
