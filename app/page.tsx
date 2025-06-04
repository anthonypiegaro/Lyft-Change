import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

import { Navbar } from "./landing-page/nav-bar/nav-bar";
import { Hero } from "./landing-page/hero/hero";
import { Features } from "./landing-page/features";
import { HowItWorks } from "./landing-page/how-it-works/how-it-works";
import { Pricing } from "./landing-page/pricing";
import { CallToAction } from "./landing-page/call-to-action";
import { Footer } from "./landing-page/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted-foreground/50 to-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CallToAction />
      <Footer />
      <div className="fixed bottom-5 left-5 z-100">
        <ThemeToggleButton />
      </div>
    </main>
  );
}
