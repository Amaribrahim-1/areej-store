import Link from "next/link";
import { PhoneIcon } from "lucide-react";

const FOOTER_NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "عنّا" },
  { href: "/contact", label: "تواصل" },
] as const;

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com",
    label: "إنستغرام أريج",
    icon: InstagramMark,
  },
] as const;

const CONTACT = {
  phoneDisplay: "01xxxxxxxxx",
  phoneHref: "tel:+201000000000",
  whatsappHref: "https://wa.me/201000000000",
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-bg-accent">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 md:gap-8 md:py-12">
        <div className="space-y-3">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight text-brand"
          >
            أريج
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            متجر أريج للعطور والمسك والمخمرية وزيوت الشعر — عطور تلامس الحواس
            بجودة تليق بكِ.
          </p>
        </div>

        <nav aria-label="روابط التذييل" className="space-y-3">
          <p className="text-sm font-semibold text-foreground">روابط سريعة</p>
          <ul className="space-y-2">
            {FOOTER_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">تواصل معنا</p>
          <ul className="space-y-2">
            <li>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-text-accent"
              >
                <PhoneIcon className="size-4 shrink-0" aria-hidden />
                <span dir="ltr">{CONTACT.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-text-accent"
              >
                نموذج التواصل
              </Link>
            </li>
            <li>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-text-accent"
              >
                واتساب
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2 pt-1">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-4xl text-brand-700 transition-colors hover:bg-brand-100 hover:text-text-accent"
              >
                <Icon className="size-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 sm:text-start">
          © {year} أريج. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
