"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Blocks, Calendar, ChartArea, Home } from "lucide-react";

import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"

import { NavUser } from "./nav-user";
import { ThemeToggleButton } from "../ui/theme-toggle-button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    subItems: []
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics/quick-view/exercise",
    icon: ChartArea,
    subItems: [
      {
        title: "History",
        url: "/dashboard/analytics/history"
      }
    ]
  },
  {
    title: "Build",
    url: "/dashboard/build/exercise",
    icon: Blocks,
    subItems: [
      {
        title: "Exercises",
        url: "/dashboard/build/exercise"
      },
      {
        title: "Workouts",
        url: "/dashboard/build/workout"
      },
      {
        title: "Programs",
        url: "/dashboard/build/program"
      }
    ]
  },
  {
    title: "Schedular",
    url: "/dashboard/schedular",
    icon: Calendar,
    subItems: []
  }
]

export function AppSidebar({
  id,
  name,
  email
}: {
  id: string
  name: string
  email: string
}) {
  const { state, setOpenMobile, openMobile, isMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="relative">
        <h1 className={cn("flex h-8 shrink-0 items-center justify-center text-lg font-semibold transition-opacity duration-75 delay-0", 
          state == "expanded" || (isMobile && openMobile) ? "opacity-100 delay-100" : "opacity-0"
        )}>
          <Link href="/dashboard">Lyft Change</Link>
        </h1>
        <ThemeToggleButton 
          className={cn("absolute top-1/2 right-2 -translate-y-1/2", !isMobile && "hidden")}
          variant="ghost"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url && item.title != "Build"}
                      tooltip={{
                        children: item.title,
                        hidden: state === "expanded"
                      }}
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.subItems.length > 0 && (
                      <SidebarMenuSub>
                        {item.subItems.map(subItem => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url} onClick={() => setOpenMobile(false)}>
                              <Link href={subItem.url}>
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser id={id} name={name} email={email} />
      </SidebarFooter>
    </Sidebar>
  )
}