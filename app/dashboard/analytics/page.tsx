import { MetaData } from "./main-page-components/meta-data/meta-data"
import { mockWorkouts } from "./main-page-components/meta-data/mock-data"

export default function AnalyticsPage() {
  return (
    <div className="w-full h-full grid gap-4 grid-cols-1 md:grid-cols-3 md:grid-rows-2 px-2 max-sm:mt-15 md:py-5 md:py-20">
      <MetaData className="md:col-span-2" workouts={mockWorkouts} exercises={mockWorkouts} />
      <div className="bg-card rounded-xl">Place holder</div>
      <div className="bg-card rounded-xl">Place holder</div>
      <div className="bg-card rounded-xl md:col-span-2">Place holder</div>
    </div>
  )
}