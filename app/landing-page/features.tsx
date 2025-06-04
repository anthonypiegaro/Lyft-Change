import {
  Dumbbell,
  ListChecks,
  BarChart2,
  FileText,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

const featureSet = [
  {
    icon: <Dumbbell />,
    title: "Custom Workouts & Exercises",
    description: "Create your own exercises, workouts, and full training programs tailored to your goals.",
  },
  {
    icon: <ListChecks />,
    title: "Intuitive Program Builder",
    description: "Easily design and organize your training plans with Lyft Change's powerful, user-friendly program builder.",
  },
  {
    icon: <BarChart2 />,
    title: "Advanced Analytics",
    description: "Track your progress with in-depth analytics and visualizations.",
  },
  {
    icon: <FileText />,
    title: "Comprehensive Reports",
    description: "Generate detailed reports to review your performance and milestones.",
  },
  {
    icon: <CalendarDays />,
    title: "Integrated Calendar",
    description: "Plan workouts, view your training history, and schedule programs that automatically populate your calendar.",
  },
  {
    icon: <Sparkles />,
    title: "Starter Pack Included",
    description: "Get instant access to a curated set of exercises, workouts, and programs when you sign up.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 lg:px-12 py-20 bg-black/20 backdrop-blur-sm">
      <div className="mb-16">
        <h2 className="text-center mx-auto text-4xl lg:text-5xl font-bold mb-4">
          Everything A <span className="text-neutral-500">Data Driven</span> Athlete <span className="text-neutral-500">Needs</span>
        </h2>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
          Lyft Change gives you complete control to customize your fitness program, with powerful tools and ready-to-use workouts so you can start strong and stay on track.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureSet.map(feature => <Feature key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />)}
      </div>
    </section>
  )
}

function Feature({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-600 group-hover:w-full"></div>
    </div>
  )
}