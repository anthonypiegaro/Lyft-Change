import { Card, CardContent } from "@/components/ui/card"

import { AnalyzeAndAssess } from "./visuals/analyze-and-asses";
import { BuildProgram } from "./visuals/build-program"
import { WorkoutTracker } from "./visuals/workout-tracker";
import { ReflectAndRefine } from "./visuals/reflect-and-refine";

const steps = [
  {
    step: "01",
    title: "Analyze & Assess",
    description:
      "Identify areas for improvement through initial testing and detailed reports.",
    component: <AnalyzeAndAssess />,
  },
  {
    step: "02",
    title: "Set Goals & Build Your Program",
    description:
      "Decide what you want to work on and create a personalized program tailored to your needs.",
    component: <BuildProgram />,
  },
  {
    step: "03",
    title: "Track Your Progress",
    description:
      "Log your workouts and monitor your progress as you follow your program.",
    component: <WorkoutTracker />,
  },
  {
    step: "04",
    title: "Reflect & Refine",
    description:
      "Analyze what worked and what didn’t, using analytics and reports to guide your next steps.",
    component: <ReflectAndRefine />,
  },
  // {
  //   step: "05",
  //   title: "Repeat & Progress",
  //   description:
  //     "Continue the cycle—set new goals, refine your program, and keep improving.",
  //   component: <RepeatProgress />,
  // },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 w-full px-2">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          How Lyft Change <span className="text-neutral-500">drives</span> your training
        </h2>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          The approach uses data driven principles to reach your goals
        </p>
      </div>
      <div className="relative mt-20 w-full max-w-7xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-border"></div>
        {steps.map((step, i) => (
          <div
            key={i}
            className={`relative grid px-2 items-center gap-8 ${i % 2 === 0 ? "md:grid-cols-[1fr_2fr]" : "md:grid-cols-[2fr_1fr]"} mb-24`}
          >
            <Card className={`relative z-10 ${i % 2 !== 0 && "md:order-last"}`}>
              <div className="absolute -left-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-card text-sm font-bold">
                {step.step}
              </div>
              <CardContent>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
            <div className={`relative ${i % 2 !== 0 && "md:order-first"}`}>
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 blur-xl"></div>
              <div className="relative">
                {step.component}
              </div>
            </div>
          </div>
        ))}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-24 w-1 bg-border"></div>
      </div>
      <Card className="relative z-10 w-fit mx-2 sm:mx-auto">
        <div className="absolute -left-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-card text-sm font-bold">
          05
        </div>
        <CardContent>
          <h3 className="text-2xl font-bold">Repeat & Progress</h3>
          <p className="mt-2 text-muted-foreground">Continue the cycle—set new goals, refine your program, and keep improving.</p>
        </CardContent>
      </Card>
    </section>
  )
}