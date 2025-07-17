import HomeButton from "@/components/ui/home-button";
import { Card } from "@/components/ui/card";
import ContinueCard from "@/components/ui/continue-card";
import CommunityCard from "@/components/ui/community-card";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto py-12 px-8">
      <HomeButton />

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Pick up where you left off</h2>

        <div className="flex mt-4 gap-4">
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold">Explore community blocks</h2>
        <h3 className="text-sm font-medium text-zinc-400">Browse and join learning tracks created by the community</h3>

        <div className="flex mt-4 gap-4">
          <CommunityCard
            title="Learn Next.js with the community"
            description="Join us to explore the latest features of Next.js and build amazing applications together. We share resources, tips, and support each other in our coding journey."
            creator="goat"
            members="150"
            time="30min"
            variant="large"
            showMascot={true}
          />
          <CommunityCard
            title="Placeholder"
            description="This is a placeholder for a community block."
            creator="placeholder"
            members="0"
            time="--"
          />
          <CommunityCard
            title="Placeholder"
            description="This is a placeholder for a community block."
            creator="placeholder"
            members="0"
            time="--"
          />
        </div>
        <div className="flex mt-4 gap-4">
          <CommunityCard
            title="Placeholder"
            description="This is a placeholder for a community block."
            creator="placeholder"
            members="0"
            time="--"
          />
          <CommunityCard
            title="Placeholder"
            description="This is a placeholder for a community block."
            creator="placeholder"
            members="0"
            time="--"
          />
          <CommunityCard
            title="Learn Next.js with the community"
            description="Join us to explore the latest features of Next.js and build amazing applications together. We share resources, tips, and support each other in our coding journey."
            creator="goat"
            members="150"
            time="30min"
            variant="large"
          />
        </div>
      </div>
    </main>
  );
}
