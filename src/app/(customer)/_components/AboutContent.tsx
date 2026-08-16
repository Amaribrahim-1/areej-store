import Link from "next/link";
import {
  DropletsIcon,
  Flower2Icon,
  SparklesIcon,
  WindIcon,
  type LucideIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CatalogLine = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const CATALOG: readonly CatalogLine[] = [
  {
    title: "عطور",
    description: "روائح مختارة بأحجام مختلفة — من التجربة الصغيرة لحد الزجاجة الكاملة.",
    icon: SparklesIcon,
  },
  {
    title: "مسك",
    description: "مسك بطابع دافئ وثابت، بنفس فكرة المقاسات والأسعار الواضحة.",
    icon: Flower2Icon,
  },
  {
    title: "مخمرية",
    description: "مخمرية للّي بتحب الريحة تبقى أعمق وأقرب للبشرة.",
    icon: WindIcon,
  },
  {
    title: "زيوت الشعر",
    description: "زيوت عناية بالشعر ضمن نفس المتجر، من غير تعقيد في الطلب.",
    icon: DropletsIcon,
  },
];

export default function AboutContent() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3 text-start">
        <p className="text-sm font-medium text-text-accent">قصتنا</p>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          عن أريج
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          أريج متجر صغير للمنتجات العطرية: عطور، مسك، مخمرية، وزيوت شعر. الفكرة
          مش كتالوج ضخم — منتجات مختارة بعناية، والطلب بيتأكد ويتجهّز بعد ما
          توصّلينا، مش من مخزون معروض على الموقع.
        </p>
      </header>

      <section
        aria-labelledby="about-catalog-heading"
        className="mt-10 space-y-4 sm:mt-12"
      >
        <h2
          id="about-catalog-heading"
          className="font-heading text-xl font-semibold text-foreground"
        >
          إيه اللي بنبيعه؟
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {CATALOG.map((item) => (
            <CatalogItem key={item.title} item={item} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="about-how-heading"
        className="mt-10 space-y-3 sm:mt-12"
      >
        <h2
          id="about-how-heading"
          className="font-heading text-xl font-semibold text-foreground"
        >
          الطلب عندنا بيتم إزاي؟
        </h2>
        <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <li>تصفّحي المنتجات واختاري المقاس اللي يناسبكِ لو في أكتر من حجم.</li>
          <li>الدفع عند الاستلام — مفيش دفع أونلاين في الوقت الحالي.</li>
          <li>
            التوصيل بيتنسّق معاكي يدويًا، وحاليًا للمناطق القريبة. مفيش رسوم
            شحن محسوبة داخل الطلب.
          </li>
          <li>
            بعد تأكيد الطلب بنجهّز المنتج من المورّد — عشان كده مش عارضين كمية
            متاحة على كل صنف.
          </li>
        </ul>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center">
        <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
          تسوّقي المنتجات
        </Link>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          تواصلي معنا
        </Link>
      </div>
    </article>
  );
}

function CatalogItem({ item }: { item: CatalogLine }) {
  const Icon = item.icon;

  return (
    <li className="flex flex-col items-start gap-3 rounded-3xl border border-border bg-brand-50/40 p-4 text-start sm:p-5">
      <div
        className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"
        aria-hidden
      >
        <Icon className="size-5" />
      </div>
      <div className="space-y-1">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </li>
  );
}
