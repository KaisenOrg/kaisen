import { AchievementsSection } from "@/components/specific/profile/section/achievementsSection";
import { ActivitiesSection } from "@/components/specific/profile/section/activitiesSection";
import { MetricsSection } from "@/components/specific/profile/section/metricsSection";
import { TrailsCreatedSection } from "@/components/specific/profile/section/trailsCreatedSection";

export default function ProfilePage() {
  return (
    <main className="flex flex-col gap-12 items-center w-full ">
      <ActivitiesSection />
      <MetricsSection />
      <AchievementsSection />
      <TrailsCreatedSection />
    </main>

  )
}