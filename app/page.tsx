import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1">
      <main className="flex flex-1">
        <div>ToDo: Landing Page</div>
        <div>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
          <ThemeToggleButton />
        </div>
      </main>
    </div>
  );
}
