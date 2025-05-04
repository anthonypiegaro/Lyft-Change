"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

const tabs = [
  { value: "exercise", label: "Exercises" },
  { value: "workout", label: "Workouts" },
  { value: "program", label: "Programs" },
];

export default function BuildTabs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const name = segments[segments.length - 1];

  return (
    <Tabs value={name}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={`./${tab.value}`}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}