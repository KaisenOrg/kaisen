'use client'

import { PageHeader } from "@/components/ui/track-header";
import { TabNavigation, Tab } from "@/components/ui/tab-navigation";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { CubeTransparentIcon, ShieldCheckIcon, BoltIcon, ArchiveBoxIcon } from "@heroicons/react/20/solid";

export default function TracksPage() {
  const tabs: Tab[] = [
    { value: "track", label: "Track", icon: CubeTransparentIcon },
    { value: "practice", label: "Practice", icon: BoltIcon },
    { value: "proof", label: "Proof of Learning", icon: ShieldCheckIcon },
    { value: "knowledge", label: "Knowledge", icon: ArchiveBoxIcon },
  ];

  return (
    <div className="w-full px-8 pt-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-8">
        <Tabs defaultValue="track">
          <PageHeader
            title="Lorem ipsum"
            subtitle="Lorem ipsum dolor sit amet"
          />
          <div className="mt-4">
            <TabNavigation tabs={tabs} value="track" />
            <TabsContent value="track" className="mt-6">
            </TabsContent>
            <TabsContent value="practice" className="mt-6">
            </TabsContent>
            <TabsContent value="proof" className="mt-6">
            </TabsContent>
            <TabsContent value="knowledge" className="mt-6">
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}