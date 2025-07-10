import HomeButton from "@/components/ui/home-button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-8">
      <HomeButton />
      <div className="mt-6">
        <h2 className="text- font-semibold">Pick up where you left off</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          <Card className="py-16 px-36">goat</Card>
          <Card className="py-16 px-36">goat</Card>
        </div>
      </div>
    </main>
  );
}
