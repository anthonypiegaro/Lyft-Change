import { MoveRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import { MobileReportCard } from "./mobile-report-chart"
import { DesktopAnalyticsChart } from "./desktop-analytics-chart"
import { MobileCards } from "./mobile-cards"

export function Hero() {
  return (
    <section id="hero" className="px-6 lg:px-12 pt-30 pb-20 lg:pb-32 lg:pt-42">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-7xl font-black leading-none">
              For <span className="text-neutral-500">Atheltes</span><br />
              Who Want <span className="text-neutral-500">More</span>
            </h1>
            <p className="text-lg max-w-md">
              The all-in-one platform for athletes to build, track, 
              and analyze their training programs with precision and insight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Free Trail
                <MoveRight />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Watch Demo
              </Button>
            </div>
            <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">150+</div>
                <div className="text-muted-foreground">Exercises In Library</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-muted-foreground">Workouts To Build On</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-muted-foreground">Prebuilt Programs</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative h-full min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-500/20 to-stone-500/20 rounded-3xl blur-3xl"></div>
            <div className="absolute top-0 right-0 z-1 w-19/20 h-4/5">
              <DesktopAnalyticsChart />
            </div>
            <div className="absolute bottom-0 left-0 z-2 w-1/3 h-3/4 lg:h-4/5">
              <MobileCards />
            </div>
          </div>
          <div className="lg:hidden mx-auto max-w-xs w-full">
            <MobileReportCard />
          </div>
        </div>
      </div>
    </section>
  )
}