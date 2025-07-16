import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import { PopupProvider } from "@/components/pop-up-context"
import { AppSidebar } from "@/components/app-sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { MobileWarningBanner } from "@/components/mobile-warning-banner"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const { id, name, email} = session.user

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PopupProvider>
        <MobileWarningBanner />
        <AppSidebar id={id} name={name} email={email} />
        <div className="fixed top-5 right-4.75">
          <ThemeToggleButton className="max-md:hidden z-50" />
        </div>
        <main className="flex w-full min-h-screen">
          <div className="max-md:bg-muted-foreground/30 max-md:backdrop-blur-sm rounded-sm fixed left-4.75 top-5 z-50">
            <SidebarTrigger />
          </div>
          {children}
        </main>
        <Toaster />
      </PopupProvider>
    </SidebarProvider>
  ) 
}