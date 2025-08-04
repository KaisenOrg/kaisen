import { AchievementsSection } from '@/components/specific/profile/section/achievementsSection'
import { ActivitiesSection } from '@/components/specific/profile/section/activitiesSection'
import { MetricsSection } from '@/components/specific/profile/section/metricsSection'
import { TracksCreatedSection } from '@/components/specific/profile/section/tracksCreatedSection'

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