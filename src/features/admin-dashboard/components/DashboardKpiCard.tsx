import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardKpiCardProps = {
  title: string;
  description: string;
  displayValue: string;
  icon: LucideIcon;
};

export default function DashboardKpiCard({
  title,
  description,
  displayValue,
  icon: Icon,
}: DashboardKpiCardProps) {
  return (
    <Card aria-label={`${title}: ${displayValue}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <Icon className="size-5 shrink-0 text-brand-700" aria-hidden />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-2xl font-bold tracking-tight text-brand-900">
          {displayValue}
        </p>
      </CardContent>
    </Card>
  );
}
