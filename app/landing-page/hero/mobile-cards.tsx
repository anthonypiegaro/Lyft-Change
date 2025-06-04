import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ChevronsUp, Dumbbell, Flame } from "lucide-react";
import React from "react";

export function MobileCards() {
  return (
    <Card className="flex flex-col gap-2 w-full h-full p-2 overflow-hidden">
      <div className="text-base font-medium">Quick Stats</div>
      <StatCard
        icon={<ChevronsUp className="w-5 h-5 text-chart-6" />}
        label="Best 40 Yard Dash"
        value="4.87 sec"
      />
      <StatCard
        icon={<Dumbbell className="w-5 h-5 text-chart-7" />}
        label="Weekly Volume"
        value="5,756 lbs"
      />
      <StatCard
        icon={<Flame className="w-5 h-5 text-chart-8" />}
        label="Max Velocity"
        value="93 mph"
      />
    </Card>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <Card className="rounded-lg shadow-sm p-2 w-full gap-4">
      <CardHeader className="flex flex-row items-center gap-2 p-0 pb-1">
        {icon}
        <CardTitle className="text-xs font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-lg font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}