"use client"

import Link from "next/link";
import { Blocks, Calendar, Home } from "lucide-react";

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

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    subItems: []
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
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <h1 className={cn("flex h-8 shrink-0 items-center justify-center text-lg font-semibold transition-opacity duration-75 delay-0", 
          state == "collapsed" ? "opacity-0" : "opacity-100 delay-100"
        )}>
          <Link href="/dashboard">Lyft Change</Link>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.subItems.length > 0 && (
                      <SidebarMenuSub>
                        {item.subItems.map(subItem => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
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
        {/* Add the users account here, with a dropdown to choose account details or to logout */}
      </SidebarFooter>
    </Sidebar>
  )
}