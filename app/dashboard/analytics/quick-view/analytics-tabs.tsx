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
  { value: "tag", label: "Tags" },
];

export default function AnalyticsTabs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  let name = ""
  
  for (const tab of tabs) {
    if (segments.includes(tab.value)) {
      name = tab.value
      break
    }
  }

  return (
    <Tabs value={name} className="flex flex-row justify-center">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={`/dashboard/analytics/${tab.value}`}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
