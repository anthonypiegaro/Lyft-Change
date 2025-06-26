import { Button } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center px-6 lg:px-12 py-20">
      <div className="flex flex-col items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Interested in the app yet?
          </h2>
          <p className="mt-4 text-xl opacity-90 max-w-lg">
            Join Lyft Change and start maximizing your training.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" variant="default" className="text-lg">
          Watch Demo
        </Button>
        <Button size="lg" variant="outline" className="text-lg">
          Start Free Trail
        </Button>
      </div>
    </section>
  )
}