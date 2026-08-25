export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "عنّا" },
  { href: "/contact", label: "تواصل" },
] as const;

/** Exact match for home; prefix match for nested routes (e.g. /products/[slug]). */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
