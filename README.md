# Areej (أريج)

Arabic-only storefront and admin panel for **Areej**, a small Egyptian fragrance shop (perfumes, musk, مخمرية, hair oils) owned by Alaa.

Built by [Amar](https://github.com/Amaribrahim-1) as a real client MVP and as a portfolio project: browse → cart → cash-on-delivery checkout, plus an admin panel Alaa can actually run the business from.

**Live:** [areej-store-kappa.vercel.app](https://areej-store-kappa.vercel.app/)

---

## Why the stack looks like this

| Choice | Why it is this, not the tutorial default |
| --- | --- |
| **Next.js 16** (App Router) + TypeScript + **React Compiler** | App Router for RSC layouts, metadata, and a server-side admin guard. Compiler is on (`reactCompiler: true` in `next.config.ts`) so memoization is not a hand-rolled habit. |
| **Supabase** (Postgres, Auth, Storage) | One free-tier backend for a solo-run shop. Schema, RLS, RPCs, and storage live in `supabase/migrations/` — not “RLS later”. |
| **TanStack Query vs Zustand** | Server data (products, orders, reviews) only in Query. Cart, drawers, and filter UI only in Zustand. Mixing the two was an explicit non-goal. |
| **React Hook Form + Zod** | Every form has a schema. The same rules run again before a Supabase write — client validation is UX, not a security boundary. |
| **shadcn/ui · Base UI · Maia** | As of mid-2026 shadcn’s default primitive is Base UI (not Radix). **Maia** is the soft, rounded preset — a better fit for a consumer fragrance brand than denser Nova. Icons are **Lucide** only (Maia wanted Hugeicons; that was reverted). Toasts: **Sonner**. |
| **Arabic / RTL first** | `dir="rtl"` `lang="ar"`, Cairo, logical Tailwind properties. No English toggle in MVP. Customer copy is feminine (اختاري، أضيفي). |

There is no separate REST server. The “API” is a pure function (`getProduct`, `placeOrder`, …) in `src/features/*/api/`. UI talks to TanStack `use*` hooks; hooks call those functions. Components never call `supabase.from(...)`.

---

## What shipped

**Customers:** catalog (search, filters, URL-driven pagination), product details with size variants, persisted guest cart, register/login (Egypt governorate → markaz), COD checkout, order history, reviews, contact, about.

**Admin (server-guarded `/admin`):** KPI cards, orders + status updates, product CRUD with compressed WebP upload, reviews inbox + delete, contact-message inbox.

**Payments:** cash on delivery only. Shipping fees are coordinated outside the app (Alaa delivers nearby areas by hand). **No inventory/stock** — orders are placed first, then sourced.

---

## Highlights a reviewer can inspect

These are decisions that show up in git history and in migration comments, not a generic “we used RLS” line.

### 1. Order totals are never trusted from the client

`place_order` is a `SECURITY DEFINER` Postgres RPC. It re-reads variant prices, computes the total, and inserts `orders` + `order_items` atomically. The client sends `{ variant_id, quantity }` plus an address snapshot — no price, no total. `user_id` comes from `auth.uid()`, not a parameter.

`orders` / `order_items` have **no insert policy**. The RPC is the only writer.

### 2. Column grants, not just row policies

RLS says *which rows*. Grants say *which columns*.

- A customer can update their own profile row, but **`profiles.role` is not granted**. Otherwise `WITH CHECK (id = auth.uid())` would still allow `role = 'admin'` (self-promotion). Role changes stay a Studio/service-role operation — matching “no self-service admin signup”.
- Admin order updates are granted **`status` only**. Totals and the checkout address snapshot stay immutable.

### 3. `private.is_admin()` and empty `search_path`

Admin checks cannot `SELECT` from `profiles` inside another table’s policy without hitting `profiles` RLS (and risking recursion). `private.is_admin()` is `SECURITY DEFINER`, lives in an unexposed `private` schema (not callable via PostgREST), and uses `set search_path = ''` with fully-qualified names.

The same `search_path = ''` pattern is on `place_order` and `set_updated_at` so a caller cannot plant a fake `products` relation earlier in the path and have a definer function write to it.

### 4. Variants and “featured” are data, not flags

Every product has ≥1 `product_variants` row. Prices live only on variants. `volume_label` is nullable. The storefront size picker shows only when `variants.length > 1`.

Home **Featured / Top Sales** is products with any variant `current_price < original_price`, sorted by discount depth — no `is_featured` column. Testimonials are top-rated reviews that include a comment, not a separate CMS table.

### 5. Images vs a 1GB storage cap

One product photo (shared across sizes). Client compress/resize to WebP before upload. A 2026-08-23 audit of bucket `product-images` was **4 objects / ~555 KB**. Per-variant photos were deferred on purpose.

### 6. Order notification must not fail the order

After checkout, `POST /api/orders/notify` tries WhatsApp (CallMeBot) then email (Resend). Secrets stay server-only. A failed notify is logged; the order row already exists.

---

## Deliberately not in MVP

Recorded in [`docs/backlog.md`](docs/backlog.md) so they are omissions, not TODOs:

Google Auth · wishlist · coupons · shipping-fee calculation · dashboard charts · carousels · forgot/reset password · review push notifications · per-variant photos · product bundles · English UI.

TanStack **server prefetch + hydrate** is in place for home, catalog, and product detail. Account, cart, checkout, and admin still fetch on the client.

---

## Screenshots

Production captures from [the live shop](https://areej-store-kappa.vercel.app/).

### Storefront

![Areej home — overlay navbar on the hero, CTA to the catalog](docs/screenshots/home.png)

![Catalog with category filters and product cards](docs/screenshots/catalog.png)

![Product details with variant prices](docs/screenshots/product.png)

### Admin

![Admin orders list — status filter, totals, details links](docs/screenshots/admin-orders.png)

![Admin order details — address snapshot, line items, status control](docs/screenshots/admin-order-details.png)

---

## Setup

You need **Node 20+** and npm. Copy env from the example; never put a Supabase **service role** key in `NEXT_PUBLIC_*`.

```bash
git clone https://github.com/Amaribrahim-1/areej-store.git
cd areej-store
npm install
cp .env.example .env.local
```

Minimum to run the storefront against an existing project:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Checkout notifications also need the server-only CallMeBot / Resend keys documented in `.env.example`.

```bash
npm run dev          # http://localhost:3000
npm test             # Vitest — Zod, cart math, checkout payload
npm run lint
npm run gen:types    # supabase gen types typescript --linked
```

Schema changes are SQL files under `supabase/migrations/`. Regenerating `src/lib/supabase/types.ts` is required after a migration.

---

## Repo map

```
src/app/                 # routes only — no business rules
src/features/<name>/     # api/ (get*/mutate), hooks/, components/, schema
src/components/ui/       # shadcn primitives
src/components/shared/   # Navbar, Footer, PriceTag, …
src/lib/supabase/        # browser + server clients, generated types
docs/                    # spec, backlog, coding standards, decision trail
supabase/migrations/     # schema, RLS, RPCs — read the section comments
```

Spec and constraints: [`docs/project-spec.md`](docs/project-spec.md). Scope that was cut: [`docs/backlog.md`](docs/backlog.md). How the work was split (frontend vs backend API): [`docs/ai-interactions.md`](docs/ai-interactions.md).

A short CV/LinkedIn blurb lives in [`docs/portfolio-writeup.md`](docs/portfolio-writeup.md).

---

## License

No `LICENSE` file is published. This is client work for Areej; ask before reusing it.
