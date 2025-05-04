import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"

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

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar/>
      <div className="absolute top-5 right-4.75">
        <ThemeToggleButton />
      </div>
      <main className="flex w-full min-h-screen">
        <SidebarTrigger className="absolute left-4.75 top-5 z-50" />
        {children}
      </main>
    </SidebarProvider>
  ) 
}