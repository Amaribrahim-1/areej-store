import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative isolate -mt-14 h-svh overflow-hidden bg-brand-50 sm:-mt-16">
      <div className="relative h-full w-full">
        <Image
          src="/hero.jpeg"
          alt="زجاجة عطر أريج على رخام مع ورود وخشب مطعّم بالذهب"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[28%_center] md:object-[20%_40%] md:contrast-[1.08] md:saturate-[1.12]"
        />

        {/* Top wash so the overlay navbar stays readable on the photo */}
        <div
          className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-brand-50/90 via-brand-50/40 to-transparent sm:h-32 md:from-brand-50/65 md:via-brand-50/20"
          aria-hidden
        />
        {/* Mobile: bottom wash so copy stays readable on the photo */}
        <div
          className="absolute inset-0 bg-linear-to-t from-brand-50 from-28% via-brand-50/80 to-transparent md:hidden"
          aria-hidden
        />
        {/* Desktop: light wash on the copy side only — keep the bottle vivid */}
        <div
          className="absolute inset-0 hidden bg-linear-to-l from-brand-50/75 from-4% via-brand-50/35 via-28% to-transparent to-48% md:block"
          aria-hidden
        />

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="mx-auto w-full max-w-6xl px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16 sm:px-6 sm:pb-12 md:pt-20 md:pb-0">
            <div className="max-w-md space-y-3 text-start sm:space-y-4 md:space-y-5">
              <h1 className="font-heading text-balance text-2xl font-bold leading-snug tracking-tight text-brand-900 sm:text-3xl md:text-4xl lg:text-5xl">
                عطور تلامس الحواس
              </h1>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-brand-800 sm:text-base md:text-lg">
                عطور ومسك ومخمرية وزيوت شعر بجودة تليق بكِ.
              </p>
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }), "min-h-11")}
              >
                تسوّقي المنتجات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
