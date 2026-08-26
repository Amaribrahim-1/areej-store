# Areej — CV / LinkedIn writeup

Paste-ready copy. Name on the public README is **Amar** until a final form is chosen. Live site: [areej-store-kappa.vercel.app](https://areej-store-kappa.vercel.app/). Repo: [github.com/Amaribrahim-1/areej-store](https://github.com/Amaribrahim-1/areej-store).

---

## LinkedIn / CV — short (≈ 80 words)

Built **Areej**, a production Arabic/RTL e-commerce MVP for a real fragrance shop: catalog, persisted guest cart, cash-on-delivery checkout, order history, reviews, and a server-guarded admin panel (orders, products, reviews, contact inbox). Next.js 16, TypeScript, Supabase (Postgres + Auth + Storage) with default-deny RLS. Order totals are recalculated in a Postgres RPC — the client never submits a price. Profile `role` cannot be self-promoted (column-level grants). Shipped on Vercel; WhatsApp/email notifies the owner on each order without failing checkout if notify fails.

---

## LinkedIn — project bullets

- Shipped a full COD storefront + admin for a live client, Arabic-only, mobile-first.
- Split server state (TanStack Query) from UI/cart state (Zustand); forms are React Hook Form + Zod, re-validated before every write.
- Postgres `place_order` RPC is the only path that inserts orders; prices and totals are read server-side.
- RLS + column grants: customers cannot update `profiles.role`; admins can update `orders.status` only.
- Product images compressed to WebP client-side against Supabase’s 1GB free-tier cap; one photo per product by design.
- Feature-based Next.js structure with a documented API surface (`getProduct` / `placeOrder`) instead of `supabase.from` inside components.

---

## “About this project” (interview / README-adjacent)

Areej is not a tutorial cart. Constraints came from the business: COD only, no stock system (orders first, supplier after), shipping handled by hand, Arabic UI only. Those constraints are in `docs/project-spec.md` and `docs/backlog.md` so deferred work (coupons, Google Auth, wishlist, shipping fees, charts) stays deferred.

The interesting engineering is at the database boundary: `SECURITY DEFINER` RPCs with empty `search_path`, an unexposed `private.is_admin()` helper, and grants that close holes row policies cannot. The frontend is a consumer of that contract — the same split a company uses when FE and BE are different teams.

---

## One-line headline (CV project title)

**Areej** — Arabic/RTL e-commerce MVP (Next.js, Supabase RLS, server-side order totals) for a real fragrance shop.
