import { NavTabs } from "./dashboard/nav-tabs/nav-tabs";

export default async function DashboardPage() {
  return (
      <div className="w-full max-h-screen p-4 pt-15">
        <div className="max-md:hidden flex justify-between gap-x-4">
          <NavTabs />
        </div>
      </div>
  )
}