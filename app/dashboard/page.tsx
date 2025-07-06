import { DayPlanWrapper } from "./dashboard/day-plan/day-plan-wrapper";
import { NavTabs } from "./dashboard/nav-tabs/nav-tabs";

export default function DashboardPage() {
  return (
      <div className="mx-auto container flex flex-col gap-y-6 w-full max-h-screen p-4 pt-15">
        <div className="max-md:hidden flex justify-between gap-x-4">
          <NavTabs />
        </div>
        <DayPlanWrapper />
      </div>
  )
}