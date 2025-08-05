import { DonutChartCard } from '@/components/specific/profile/donutChartCard'
import { HoursLineChart } from '@/components/specific/profile/hoursLineChart'
import ContinueCard from '@/components/general/continue-card'

export const MetricsSection = () => {
  const quantity = 2
  const cards = Array.from({ length: quantity }, (_, i) => i)

  return (
    <section id="metrics" className="w-full bg-[#1A1A1E] border border-[#27272A] rounded-xl p-5 flex flex-col">
      <h1 className="text-2xl font-semibold mb-10">General</h1>

      <div className="flex justify-between gap-5">
        <div className="w-1/3">
            <DonutChartCard />
        </div>

        <div className="pt-2 px-5 pb-5 border border-[#27272A] rounded-xl flex flex-col gap-5">
          <h2 className="text-zinc-400 font-semibold text-base">
            Last Recorded Progress
          </h2>
          {cards.map((index) => (
            <ContinueCard
              key={index}
              cardClassName="pt-4 max-w-full"
              descriptionClassName="text-xs pb-1"
            />
          ))}
        </div>
      </div>

      <div className="my-5">
        <HoursLineChart />
      </div>
    </section>
  )
}
