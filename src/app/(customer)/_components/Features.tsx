import {
  BanknoteIcon,
  SparklesIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type HomeFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
};

const HOME_FEATURES: readonly HomeFeature[] = [
  {
    title: "شحن منسّق",
    description:
      "التوصيل بيتم يدويًا وبالتنسيق معاكي — حاليًا للمناطق القريبة.",
    icon: TruckIcon,
    iconClassName: "rtl:-scale-x-100",
  },
  {
    title: "جودة تليق بكِ",
    description: "عطور ومسك ومخمرية وزيوت شعر مختارة بعناية.",
    icon: SparklesIcon,
  },
  {
    title: "الدفع عند الاستلام",
    description: "ادفعي عند استلام طلبك — من غير دفع أونلاين.",
    icon: BanknoteIcon,
  },
];

export default function Features() {
  return (
    <section
      aria-labelledby="home-features-heading"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
        <h2 id="home-features-heading" className="sr-only">
          مميزات أريج
        </h2>
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6 md:gap-8">
          {HOME_FEATURES.map((feature) => (
            <FeatureItem key={feature.title} feature={feature} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeatureItem({ feature }: { feature: HomeFeature }) {
  const Icon = feature.icon;

  return (
    <li className="flex flex-col items-start gap-3 text-start">
      <div
        className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"
        aria-hidden
      >
        <Icon className={cn("size-5", feature.iconClassName)} />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </li>
  );
}
