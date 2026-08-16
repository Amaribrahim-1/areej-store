import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-50">
      <div className="relative h-[min(78svh,32rem)] w-full sm:h-[min(72svh,34rem)] md:h-[min(75svh,40rem)] lg:h-[min(72svh,44rem)]">
        <Image
          src="/home_hero.jpg"
          alt="زجاجة عطر أريج على رخام مع ورود وخشب مطعّم بالذهب"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[28%_center] md:object-[20%_40%]"
        />

        {/* Mobile: bottom wash so copy stays readable on the photo */}
        <div
          className="absolute inset-0 bg-linear-to-t from-brand-50 from-28% via-brand-50/80 to-transparent md:hidden"
          aria-hidden
        />
        {/* Desktop: wash from the reading side over the soft roses */}
        <div
          className="absolute inset-0 hidden bg-linear-to-l from-brand-50 from-12% via-brand-50/75 via-45% to-transparent to-75% md:block"
          aria-hidden
        />

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 md:py-0">
            <div className="max-w-md space-y-3 text-start sm:space-y-4 md:space-y-5">
              <h1 className="font-heading text-balance text-2xl font-bold leading-snug tracking-tight text-brand-900 sm:text-3xl md:text-4xl lg:text-5xl">
                عطور تلامس الحواس
              </h1>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-brand-800 sm:text-base md:text-lg">
                عطور ومسك ومخمرية وزيوت شعر بجودة تليق بكِ.
              </p>
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }))}
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
