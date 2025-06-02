import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

import { Navbar } from "./landing-page/nav-bar/nav-bar";
import { Hero } from "./landing-page/hero/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted-foreground/50 to-background">
      <Navbar />
      <Hero />
      <div className="fixed bottom-10 right-10">
        <ThemeToggleButton />
      </div>
    </main>
  );
}
