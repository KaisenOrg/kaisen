import HomeButton from "@/components/ui/home-button";
import { Card } from "@/components/ui/card";
import ContinueCard from "@/components/ui/continue-card";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-8">
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
        <h3 className="text-sm font-medium text-zinc-400">Lorem ipsum dolor sit amet consectuor</h3>

        <div className="flex mt-4 gap-4">
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
        </div>
        <div className="flex mt-4 gap-4">
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
        </div>
      </div>
    </main>
  );
}
