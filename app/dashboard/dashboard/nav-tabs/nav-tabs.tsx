import Link from "next/link"
import { Calendar, ChartArea, Hammer } from "lucide-react";

import { 
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const navTabs = [
  {
    name: "Build",
    description: "Build your exercises, workouts, and programs",
    icon: Hammer,
    url: "/dashboard/build/workout"
  },
  {
    name: "Schedular",
    description: "View and schedule workouts and programs",
    icon: Calendar,
    url: "/dashboard/schedular"
  },
  {
    name: "Analytics",
    description: "Analyze past performance",
    icon: ChartArea,
    url: "/dashboard/analytics/exercise"
  }
]

export function NavTabs() {
  return (
    <>
      {navTabs.map(tab => (
        <Link key={tab.name} href={tab.url} className="group flex-1">
          <Card className="h-full transition-all group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800">
            <CardHeader>
              <CardTitle className="flex gap-x-2 items-center">
                {<tab.icon />}
                <h2 className="text-xl">{tab.name}</h2>
              </CardTitle>
              <CardDescription>
                {tab.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </>
  )
}