import Link from "next/link";
import { PhoneIcon } from "lucide-react";

import BrandLogo from "@/components/shared/BrandLogo";
import { cn } from "@/lib/utils";

const FOOTER_NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "عنّا" },
  { href: "/contact", label: "تواصل" },
] as const;

const FOOTER_LINK_CLASS =
  "inline-flex min-h-10 items-center text-sm text-muted-foreground transition-colors hover:text-text-accent";

const CONTACT = {
  phoneDisplay: "01xxxxxxxxx",
  phoneHref: "tel:+201000000000",
  whatsappHref: "https://wa.me/201000000000",
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-bg-accent pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <div className="flex flex-col items-center gap-6 text-center md:grid md:grid-cols-3 md:items-start md:gap-10 md:text-start">
          <div className="space-y-3">
            <BrandLogo className="mx-auto size-12 md:mx-0 md:size-16" />
            <div className="max-w-xs space-y-1 text-sm leading-relaxed text-muted-foreground md:max-w-sm">
              <p>متجر أريج للعطور والمسك والمخمرية وزيوت الشعر.</p>
              <p>عطور تلامس الحواس بجودة تليق بكِ.</p>
            </div>
          </div>

          <nav aria-label="روابط التذييل" className="space-y-2">
            <p className="hidden text-sm font-semibold text-foreground md:block">
              روابط سريعة
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 md:flex-col md:items-start md:gap-x-0 md:space-y-0.5">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-2">
            <p className="hidden text-sm font-semibold text-foreground md:block">
              تواصل معنا
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 md:flex-col md:items-start md:gap-x-0 md:space-y-0.5">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className={cn(FOOTER_LINK_CLASS, "gap-2")}
                >
                  <PhoneIcon className="size-4 shrink-0" aria-hidden />
                  <span dir="ltr">{CONTACT.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <Link href="/contact" className={FOOTER_LINK_CLASS}>
                  نموذج التواصل
                </Link>
              </li>
              <li>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={FOOTER_LINK_CLASS}
                >
                  واتساب
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
          © {year} أريج. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
