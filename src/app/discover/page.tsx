import CommunityCard from "@/components/ui/community-card";
import DiscoverFilter from "@/components/ui/discover-filter";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-8">
      <div className="mt-2">
        <h2 className="text-lg font-semibold">Discover community blocks</h2>
        <h3 className="text-sm font-medium text-zinc-400">
          Lorem ipsum dolor sit amet consectuor
        </h3>

        <DiscoverFilter />

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
      <div className="mt-12">
        <h2 className="text-lg font-semibold">
          Based on what you have been studying
        </h2>
        <h3 className="text-sm font-medium text-zinc-400">
          Lorem ipsum dolor sit amet consectuor
        </h3>

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
