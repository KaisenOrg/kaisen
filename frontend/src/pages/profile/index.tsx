import { AchievementsSection } from '@/components/specific/profile/achievementsSection'
import { ActivitiesSection } from '@/components/specific/profile/activitiesSection'
import { MetricsSection } from '@/components/specific/profile/metricsSection'
import { TracksCreatedSection } from '@/components/specific/profile/tracksCreatedSection'

export default function ProfilePage() {
  return (
    <main className="flex flex-col gap-12 items-center w-full">
      <ActivitiesSection />
      <MetricsSection />
      <AchievementsSection />
      <TracksCreatedSection />
    </main>
  )
}