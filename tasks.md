# Areej (أريج) — MVP Task Breakdown

Ordered breakdown of the full MVP, derived from `docs/project-spec.md` and constrained by `docs/backlog.md`, `docs/coding-standards.md`, and `docs/ai-interactions.md`.

## How to read this file

- Tasks are grouped into **phases**. Phases are ordered by dependency and by learning gradient (read-only data fetching before client state, small forms before the heavy variant form, mutations last).
- Within a phase, tasks are ordered. Across phases, later phases assume earlier ones are done.
- `[branch: ...]` marks the feature branch for that group, per `git-conventions.mdc` (one branch per MVP feature/page).
- `[commit: ...]` marks a suggested logical commit checkpoint inside a feature — not a rule, a starting point.
- **Backend vs frontend ownership** is defined in `docs/ai-interactions.md` (company-style: pure `getProduct`-style helpers vs feature `types` + `use*` hooks + UI). This file lists **what** to build only — not who. Owner split happens in chat during the task workflow.
- **`NEW CONCEPT`** = the developer has not used this in real code before. A small standalone teaching example comes first, then the real implementation.
- 🚩 **Backlog guard** = a point where a deferred feature would naturally creep in. Do not build it. Listed so the omission is deliberate, not forgotten.
- **Phase C / Phase A (MVP gaps)** = catch-up phases for essential MVP work that surfaced during building but was not planned in the numbered feature phases. They are **not** a dumping ground for `backlog.md` items.
  - **Phase C — Customer MVP gaps:** after the last customer-facing phase (Phase 10), before Admin. Close customer UX holes before starting the admin panel.
  - **Phase A — Admin MVP gaps:** after the last admin feature phase (Phase 14), before Hardening & Launch. Close admin MVP holes before launch polish / backlog.
  - **Entry rule:** only add a task here if the customer/admin experience is clearly incomplete without it. Nice-to-haves stay in `backlog.md`.

## Ordering rationale (why not spec order)

`project-spec.md` lists the Admin Panel first, but building it first would mean starting with the heaviest form in the MVP (multi-variant product + image upload) before React Hook Form + Zod have been used once. Instead: seed a few products manually in Supabase Studio, build the read-only storefront (teaches TanStack Query), then cart (teaches Zustand), then small forms (auth, review, contact), then **Phase C** (customer MVP gaps), then the admin panel, then **Phase A** (admin MVP gaps), then hardening.

---

## Phase 0 — Foundation & Setup Cleanup

`[branch: chore/foundation]`

The existing scaffold has three concrete deviations from the agreed standards. Fix them before writing feature code, because every component built after this inherits them.

- [x] **0.1 — Fix RTL + Arabic root layout.**
      `src/app/layout.tsx` currently ships `lang="en"` with no `dir`. Set `<html dir="rtl" lang="ar">` per `accessibility-rtl.mdc`. Replace the Latin-only fonts (Geist / Geist Mono / Figtree, all `subsets: ['latin']`) with an Arabic-capable font (e.g. Cairo, Tajawal, or IBM Plex Sans Arabic) wired to `--font-sans`. Update `metadata` (still `"Create Next App"`) to the Areej title/description in Arabic.
      Also flip `"rtl": false` → `true` in `components.json` so future generated Shadcn components come out RTL-aware.

- [x] **0.2 — Resolve the icon library conflict.**
      `package.json` has **both** `lucide-react` and `@hugeicons/*`, and `components.json` has `"iconLibrary": "hugeicons"`. `coding-standards.md` §1 and `stack-conventions.mdc` both say Lucide React only, no second icon library. Decide (Lucide, per the standard), switch `components.json`, and uninstall the loser. Two icon libraries means two bundle costs and two visual languages.
      🚩 This is exactly the "confirm explicitly if the icon library prompt defaults to something else" case flagged in `stack-conventions.mdc` — it defaulted to hugeicons via the Maia style preset.

- [x] **0.3 — Environment variables.**
      `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Add a committed `.env.example` documenting required keys with empty values. Confirm `.env*.local` is gitignored.
      🚩 The service role key must **not** get a `NEXT_PUBLIC_` prefix, ever (`coding-standards.md` §7). If a later task needs it, it stays server-only.

- [x] **0.4 — Supabase clients.** **`SUPABASE`** **`NEW CONCEPT`** (`@supabase/ssr` in App Router)
      `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server components / route handlers), using `@supabase/ssr` — already installed. Cookie-based session handling so auth works across server and client.

- [x] **0.5 — TanStack Query provider.** **`NEW CONCEPT`**
      A client `Providers` component holding `QueryClientProvider`, mounted in the root layout. Set global defaults (`staleTime`, `retry`) and document the reasoning; per-resource `staleTime` gets tuned in the feature tasks.

- [x] **0.6 — Mount Sonner `<Toaster />`** in the root layout, with RTL-correct positioning.

- [x] **0.7 — Shared constants and cross-feature types.**
      Only `button.tsx` exists in `components/ui/` so far. Create `src/types/` entries for genuinely cross-feature shapes only. Magic strings (`coding-standards.md` §4) live in per-feature `constants.ts`: product categories (`Perfumes / Musk / Fermentation / Hair Oil`) and order statuses (`Pending / Shipping / Delivered / Cancelled`).
      🚩 Do not add a `Coupon` type, a `shipping_fee` field, or a `stock`/`quantity_available` field to any shared type. Coupons and shipping-fee calculation are backlog items; inventory tracking is out of MVP entirely (spec decision #5).

- [x] **0.8 — Pull the Shadcn primitives the MVP needs** (input, label, form, select, dialog, table, card, badge, textarea, skeleton, dropdown-menu, tabs). Generated files stay untouched in `components/ui/`.

`[commit: chore(setup): rtl arabic layout + providers, chore(setup): supabase clients, chore(deps): single icon library]`

---

## Phase 1 — Data Model & Security

`[branch: feature/db-schema]` — **all of Phase 1 is `SUPABASE`: only on explicit request.**

- [x] **1.1 — Schema design review before any SQL.**
      Tables (`snake_case` plural per `coding-standards.md` §3): `profiles`, `products`, `product_variants`, `orders`, `order_items`, `reviews`, `contact_messages`.

  **Agreed model (do not re-litigate in 1.2):**
  - **Always ≥1 `product_variants` row per product.** Prices (`original_price` / `current_price` as `numeric(10,2)`) live only on variants. `volume_label` is nullable. Category does not control variant shape — Alaa picks 1..N size rows per product. Storefront size selector only when `variants.length > 1`.
  - **One required `image_url` on `products`** (shared across all sizes). No per-variant photos in MVP (backlog).
  - `products.status` (`active`/`inactive`) controls storefront visibility; soft-delete only — no hard delete of products.
  - `products.slug` unique for URLs; categories are the fixed four English check values (Arabic labels in UI map).
  - `order_items` snapshots product name, variant label, and unit price at purchase time.
  - `orders` snapshots customer name, phone, and address at checkout; new checkouts re-read the current profile to prefill.
  - `orders.payment_method` with default `cod` + check constraint.
  - `profiles` holds Name, Phone, Address (governorate / markaz / free-text), `role` (`customer`/`admin`), linked to `auth.users`; profile row via trigger on signup.
  - Reviews: `unique(product_id, user_id)`; average rating computed in query/view (no cached columns on products).
  - Place-order: Postgres RPC recalculates totals server-side (task 1.5).
    🚩 No `stock` / `quantity_available` column (spec decision #5). No `coupons` table, no `orders.coupon_id`, no `orders.shipping_fee` (backlog). No `is_featured` flag — Featured is derived from any variant with `current_price < original_price` (spec decision #10). No `testimonials` table (spec decision #9). No admin category CRUD / no per-variant images (backlog).

- [x] **1.2 — Write the migration** for the agreed schema, with constraints (`current_price <= original_price`, rating `1..5`, status enums/checks).

- [x] **1.3 — RLS: enable + default deny on every table**, then explicit policies per role (`coding-standards.md` §7):
  - `products` / `product_variants`: public read where `status = 'active'`; write admin-only.
  - `orders` / `order_items`: customer reads only their own rows; admin reads all; only admin updates status.
  - `reviews`: public read; insert only by an authenticated customer; admin read-all.
  - `profiles`: owner reads/updates own row; admin reads all.
  - `contact_messages`: insert-only for anyone; read admin-only.

- [x] **1.4 — Storage bucket for product images** with policies: public read, admin-only write. One image per product. Agree upload caps now: client-side compress/resize to WebP before upload (Alaa should not need to pick dimensions manually); accept common image MIME types; note the 1GB free-tier ceiling.

- [x] **1.5 — Server-side total recalculation.** **`SUPABASE`**
      A Postgres RPC that takes cart line items, re-reads prices from the DB, computes the order total server-side, and inserts the order + items atomically. Client-submitted totals are display values only (`coding-standards.md` §7).
      🚩 No shipping fee and no coupon discount enter this calculation. Keep it as `sum(line totals)` — but structure it so a fee/discount could be added later without a rewrite.

- [x] **1.6 — Generate TypeScript DB types** into `src/lib/supabase/types.ts` and confirm the generation command is repeatable (it re-runs after every migration).

- [x] **1.7 — Seed data**: 6–8 products via Supabase Studio, covering all four categories, at least two multi-variant products, and at least two with an active discount (so Home's Featured section has real data). This unblocks the entire storefront before the admin panel exists.

- [x] **1.8 — Run Supabase advisors** (security + performance) and read the output. This is the habit, not a one-off. Fixed: `set_updated_at` search_path, revoke `place_order` from anon, drop product-images SELECT listing policy. Accepted intentional WARNs: `contact_messages` insert-anyone, `authenticated` execute on `place_order`.

`[commit: feat(db): products and variants schema, feat(db): rls policies, feat(db): server-side order total function]`

---

## Phase 2 — Shared Shell

`[branch: feature/app-shell]`

- [x] **2.1 — Brand color tokens.** Wire the approved Areej amber scale (`#B8874A` base) into `globals.css` as CSS variables + Tailwind theme tokens (`--brand-*`, semantic `--primary` / `--text-accent` / `--bg-accent` / `--border-accent`). Source of truth for the _why_ and usage rules: `docs/color-system.md`. No ad-hoc hex in feature components after this. No dark-mode ramp (out of MVP).
- [x] **2.2 — Route group skeleton**: `app/(customer)/` and `app/(admin)/` with their own layouts. Route files stay thin (`coding-standards.md` §2).
- [x] **2.3 — `Navbar`** (`components/shared/`): logo, nav links, cart icon with item count, auth-state-aware account link. Mobile-first: drawer/sheet on small screens. RTL-correct, directional icons flipped.
      🚩 No wishlist icon in the navbar (backlog). No language toggle (Arabic-only MVP, spec decision #1).
      Live cart badge count wired in **4.8** (replaces the Phase 2 stub).
- [x] **2.4 — `Footer`** (`components/shared/`): brand blurb, nav links, contact/social links.
- [x] **2.5 — `PriceTag`** (`components/shared/`): renders a single price, or original-strikethrough + highlighted current price when discounted. One component, used by product card, product details, cart, and admin. Getting this right once prevents four inconsistent price renderings.
- [x] **2.6 — `StarRating`** (`components/shared/`): display mode + interactive mode (used by the review form). Needs `aria-label` like `"4 من 5 نجوم"` — custom non-native control (`accessibility-rtl.mdc`).
- [x] **2.7 — Loading / empty / error primitives**: skeletons, empty-state block, error block. Every list in the app reuses these.
- [x] **2.8 — `not-found` and `error` boundaries** for both route groups.

`[commit: feat(shell): brand color tokens, feat(shell): route groups and layouts, feat(shell): navbar and footer, feat(shared): price tag and star rating]`

---

## Phase 3 — Products: Catalog & Details (read-only)

`[branch: feature/products-catalog]`, then `[branch: feature/product-details]`

Read-only path first: it teaches TanStack Query against real seeded data with no mutation risk.

- [x] **3.1 — `features/products/` skeleton**: `api/`, `components/`, `hooks/`, `schema.ts`, `constants.ts` (DB English category keys + Arabic `PRODUCT_CATEGORY_LABELS` map).
- [x] **3.2 — Catalog list query** (`getProducts` + `useProducts`): paginated list with search / category / price / rating / sort. Filtering, sorting, and pagination happen in the Supabase query, not in JS after fetching everything. Catalog `staleTime`: 5 minutes (`coding-standards.md` §5). Read model: `catalog_products` view (security_invoker) for display price + rating aggregates.
      **Locked contract (decide once — UI in 3.6/3.7 only feeds this object):**
  - Params: `search?` (name `ilike`), `category?`, `minPrice?` / `maxPrice?` (against the product’s min variant `current_price`), `minRating?` (avg rating; products with no reviews excluded when set), `sort` (`newest` default | `price-asc` | `price-desc` | `rating-desc`), `page` (1-based), `pageSize` default `12`.
  - List row shape: product fields + display price pair from the lowest-`current_price` variant (tie-break: lowest `sort_order`) + average rating + review count.
  - Files: pure `api/getProducts.ts` + thin `api/useProducts.ts` (`queryKey: ['products', params]`). Types live in feature-local `features/products/types.ts` — not `src/types/` (cross-feature only) and not inside the hook file.
  - [x] **3.2.1** — `ProductsQueryParams` + list result types in `features/products/types.ts`.
  - [x] **3.2.2** — `api/getProducts.ts` (Supabase query; active products only).
  - [x] **3.2.3** — `api/useProducts.ts` wraps `getProducts` with TanStack Query + 5 min `staleTime`.
  - [x] **3.2.4** — Smoke call with defaults (`page: 1`, `sort: 'newest'`) against seeded data (`/products` + `CatalogSmoke`).
- **3.3 — Single product query (product + variants by id or slug).**
  Storefront detail read model: one active product with all variants (ordered by `sort_order`) plus rating aggregates for the details header. Lookup by `slug` (primary URL) or `id` (exactly one). Missing/inactive → empty result (not an error). No new migration — reuse `products`, `product_variants`, and `catalog_products` for rating fields.
  - [x] **3.3.1** — Detail query params + result types (`ProductQueryParams`, `ProductVariant`, `ProductDetail`) in `features/products/types.ts`.
  - [x] **3.3.2** — `api/getProduct.ts`: fetch active product + nested variants (ordered) + rating fields; return `ProductDetail | null`.
  - [x] **3.3.3** — `api/useProduct.ts`: TanStack Query wrapper (`queryKey: ['product', params]`, catalog `staleTime`).
  - [x] **3.3.4** — Smoke call against seeded data (by slug from seed) proving variants + rating shape.
- [x] **3.4 — `ProductCard`**: `next/image` (never a raw `<img>`, §5), name, `PriceTag`, rating, category. Meaningful Arabic `alt`. Add the Supabase storage domain to `next.config.ts` `images.remotePatterns`.
      🚩 No wishlist / heart button on the card (backlog).
- [x] **3.5 — `ProductGrid` + pagination**, with loading skeletons and an empty state.
      Pagination is URL-driven (`?page=`), reset when filters change; shared EmptyState / ErrorState.
- [x] **3.6 — Catalog filter UI**: category, price range, rating, sort. Filter state is client/UI state → Zustand or URL search params, never duplicated into a store alongside the server data (`coding-standards.md` §1). Prefer URL params so a filtered catalog is shareable and back-button-correct — decide explicitly.
- [x] **3.7 — Search input**, debounced, wired to the same query.
      🚩 Category filtering here **is** the "List by Categories" item from the original notes (spec decision #8) — no separate categories page is needed.
- [x] **3.8 — Product details page**: gallery, name, `PriceTag`, rating, description, category.
- [x] **3.9 — Variant selector**: show when `variants.length > 1`; selecting a size swaps the displayed price only (photo stays the product-level image). Single-variant products skip the selector. Variant price resolution is pure logic — a prime candidate for the first unit test (`coding-standards.md` §8).
- [x] **3.10 — Quantity selector + Add to Cart button** (wired in Phase 4).
- [x] **3.11 — Parallel fetching on the details page**: product, variants, and reviews must not run as a waterfall (§5).

`[commit: feat(products): list query hook, feat(products): product card and grid, feat(products): filters and search, feat(product-details): variant selector]`

---

## Phase 4 — Cart

`[branch: feature/cart]` — **`NEW CONCEPT`** (Zustand beyond a toy app)

- [x] **4.1 — Standalone Zustand teaching example first** (per `ai-interactions.md` New Concept Protocol): a tiny store with `persist`, outside the project, before touching real cart code.
- [x] **4.2 — `features/cart/store.ts`**: `useCartStore` with add / remove / update-quantity / clear. Cart lines are keyed by `product_id + variant_id` — the same perfume in 5ml and 100ml are two distinct lines. Persist to `localStorage` so a guest's cart survives a refresh (guests can add to cart per spec).
      🚩 Cart is pure client state. Do **not** mirror product data from TanStack Query into this store (`coding-standards.md` §1) — store identifiers + the quantity, and read display data from the query cache.
- [x] **4.3 — Add-to-Cart wiring** from product details (and card, if applicable) + Sonner success toast.
      **Card decision:** single-variant products add immediately from the card; multi-variant products toast + navigate to details to pick a size. Catalog view exposes `display_variant_id` + `variant_count` for this.
- [x] **4.4 — Cart page**: line list (image, name, variant label, quantity control, line total), remove action. Handlers inside `.map()` extracted into named functions (§4).
- [x] **4.5 — `CartTotals`**: subtotal and total (identical for MVP).
      🚩 No coupon code input (backlog). No shipping fee line (backlog, spec decision #4). No "estimated delivery" field. Total = sum of line totals, and this is a display value only — Phase 1.5 recalculates it server-side.
- [x] **4.6 — Empty cart state** with a link back to the catalog.
- [x] **4.7 — Price-drift handling**: a persisted cart can hold a price that changed since it was stored. Decide the behaviour (re-read current price on render, warn on change, or silently update) — this is a real correctness question, not a polish item.
      **Decision:** re-read live prices for display/totals, warn with an inline notice when a line’s `unitPriceSnapshot` differs, then sync the snapshot so the notice doesn’t repeat. Legacy lines missing a snapshot sync silently (no notice).
- [x] **4.8 — Cart UX polish (same `feature/cart` branch):** - Navbar cart badge reads live `sum(quantity)` from `useCartStore` (replaces Phase 2 stub). - Cart page “إفراغ السلة” clear action wired to store `clear()`. - Product card hover/focus actions: “معاينة” + “أضف” (mobile always visible).
- [x] **4.9 — Cart test tooling setup**
      Add a minimal unit-test runner for the app (prefer Vitest if it fits the Next setup). One shared config + `npm test` (or equivalent) script. No feature tests in this task — tooling only.
- [x] **4.10 — Cart pure-logic unit tests**
      Unit tests for cart helpers only (no UI / no E2E): - `computeCartSubtotal` - `resolveCartPriceDrift` (drift, no-drift, missing snapshot silent sync) - `getCartItemCount`
      Keep cases small: empty / one / many lines. Ship before merging `feature/cart` into `main`.

`[commit: feat(cart): zustand store with persist, feat(cart): cart page and totals]`

---

## Phase 5 — Auth: Login & Register

`[branch: feature/auth]` — **`NEW CONCEPT`** (React Hook Form + Zod + `zodResolver`)

- [x] **5.1 — Standalone RHF + Zod example first**: a two-field form with `zodResolver` and error rendering, isolated from the project.
- [x] **5.2 — `features/auth/schema.ts`**: `loginSchema` and `registerSchema` (Name, Phone, Password, Address = governorate + markaz + free-text description). Egyptian phone-format validation. Password rules agreed explicitly, not invented.
- [x] **5.3 — Governorate → Markaz data source**: a static local dataset (governorate list, and markaz list per governorate) under `features/auth/` or `lib/`. Decide upfront: full Egypt list, or only Alaa's delivery areas? Spec says she currently delivers to nearby areas only.
      **Decision:** full Egypt (27 governorates + markaz/districts). English keys for storage, Arabic labels for UI. Source: Open Admin Data (CC-BY-4.0). Shipping-fee-by-area stays backlog.
- [x] **5.4 — Register form**: dependent selects (markaz options depend on selected governorate), free-text location field with the spec's example as hint text (`"محافظة كفر الشيخ – مركز كفر الشيخ – قرية قراجة، جانب موقف الأتوبيس"`). Every input has a real `<label>` — no placeholder-as-label (`accessibility-rtl.mdc`).
- [x] **5.5 — Login form**.
      🚩 No "Sign in with Google" button (backlog). No "Forgot password?" link (backlog) — leaving the link visible-but-dead is worse than omitting it.
- [x] **5.6 — Signup mutation + profile row creation**. **`SUPABASE`** Keep `auth.users` and `profiles` in sync (trigger, or explicit insert after signup — decide and understand the trade-off).
- [x] **5.7 — Session handling**: auth state available server-side (layouts/server components) and client-side (Navbar). Sign-out action.
- [x] **5.8 — Re-validate `registerSchema` server-side before the insert** — client validation is UX, not a security boundary (`coding-standards.md` §7).
      **Done:** `registerWriteSchema` (shared field rules, no `confirmPassword`) runs via `safeParse` in `registerCustomer` before `auth.signUp`; invalid → `INVALID_REGISTER_PAYLOAD`, no Auth write.
- [x] **5.9 — Route protection for customer-only pages** (Order History, checkout confirm) with a redirect that returns the user to where they were.
      **Done:** `(protected)` layout calls `requireCustomer` (reads `x-pathname` from session proxy). Stubs at `/checkout` + `/orders`. Login/register honor safe `next` return path.

`[commit: feat(auth): zod schemas, feat(auth): register and login forms, feat(auth): session and route protection]`

---

## Phase 6 — Checkout & Order Confirmation

`[branch: feature/checkout]`

- [x] **6.1 — Checkout entry from Cart**: "Confirm Order" action. If not authenticated, route to login/register and return to checkout afterwards (spec decision #7).
      **Done:** Cart CTA links to `/checkout`; guest auth + return path already handled by `(protected)` + `requireCustomer` / login `next` (5.9).
- [x] **6.2 — Order review step**: line items, total, and the delivery address pulled from the customer's profile. Payment method: Cash on Delivery, displayed as fixed.
      🚩 Keep the payment method a swappable concept in the data model and UI copy even though COD is hardcoded (`coding-standards.md` §10) — hardcoding "COD" into control flow is what makes adding a second method a rewrite later.
      **Done:** Checkout review UI (lines + totals + profile address via `getMyProfile` + `PAYMENT_METHODS`/`cod` label). Place-order submit stays for 6.4.
- [x] **6.3 — `features/orders/schema.ts`**: `checkoutSchema` for the submitted payload (line items, address, contact) — no total field accepted from the client.
      **Done:** `checkoutSchema` + `CheckoutInput` — contact/address snapshot + `items[{ variantId, quantity }]`; no total/prices; Egypt location refine reused from auth data.
- [x] **6.4 — Place-order mutation** calling the Phase 1.5 server-side function. Guard against double submission (disable + in-flight state).
      **Done:** `placeOrder` + `usePlaceOrder`; checkout submit builds payload from profile + resolved lines; disable/`aria-busy` while in-flight; Sonner toasts on success/error.
- [x] **6.5 — Post-success**: clear the cart store, show the simple "تم استلام طلبك" confirmation, link to Order History.
      **Done:** On place-order success: clear cart store, show `CheckoutSuccess` («تم استلام طلبك») with link to `/orders`.
- [x] **6.6 — Admin notification: WhatsApp via CallMeBot + Email fallback.**
      A route handler (server-side — the CallMeBot key never reaches the client), triggered on successful order creation.
      ⚠️ **Validate this early, in isolation, before wiring it in.** Per spec note #11, CallMeBot needs a one-time phone verification and has rate limits — confirm it actually delivers with Alaa's number before building around it. Decide the email fallback provider and whether it's free at this volume.
      A failed notification must **not** fail the order. The order is committed; notification is best-effort with a logged failure.
      🚩 Order notifications are in MVP. Review notifications are **not** (backlog) — do not generalize this into a notification system.
      **Done:** `POST /api/orders/notify` + CallMeBot then Resend fallback; secrets server-only; `notifyOrderPlaced` fire-and-forget after place-order success. Isolated WA smoke verified.
- [x] **6.7 — Test the critical flow** (`coding-standards.md` §8 priority 2): add-to-cart → checkout → order row + items created with server-computed totals.
      **Done:** Vitest for `checkoutSchema` + `placeOrder` (no client prices/totals); SQL smoke that `place_order` writes order + items with server totals; manual UI smoke (guest→register→confirm→checkout→order + WhatsApp) verified.

`[commit: feat(checkout): order review step, feat(checkout): place order mutation, feat(checkout): admin whatsapp notification, test(checkout): cover critical place-order and checkoutSchema]`

---

## Phase 7 — Reviews (customer side)

`[branch: feature/reviews]`

- [x] **7.1 — `features/reviews/api/useProductReviews.ts`**: reviews for a product, paginated or capped.
- [x] **7.2 — Reviews list** on the product details page: rating, comment, author name, date. Empty state.
- [x] **7.3 — `reviewSchema`**: rating required (1–5), comment optional.
- [x] **7.4 — Add-review form**, authenticated customers only (guests see a prompt to log in). Interactive `StarRating` wired through RHF.
- [x] **7.5 — Submit mutation** + query invalidation so the new review appears without a reload.
- [x] **7.6 — Sanitize the free-text comment** before storage and before render (`coding-standards.md` §7) — this is the app's main stored-XSS surface, alongside the contact form.
      **Done:** `sanitizePlainText` (shared lib + unit tests); wired in `createReview` (before insert), `getProductReviews` (read path), and `ReviewItem` (render).
- [x] **7.7 — Decide: one review per customer per product?** Enforce in the DB with a unique constraint if yes — a client-side check alone is not enforcement.
      **Done:** Decision = yes (locked since Phase 1). DB: `reviews_one_per_customer_per_product`. `createReview` maps `23505` → `REVIEW_ALREADY_EXISTS`. `getMyProductReview` + form UI hide add form when the customer already reviewed (toast remains fallback).

`[commit: feat(reviews): reviews list, feat(reviews): add review form with sanitization]`

---

## Phase 8 — Order History

`[branch: feature/order-history]`

- [x] **8.1 — `api/useCustomerOrders.ts`**: the authenticated customer's orders, newest first. RLS enforces ownership; the query should not be the only guard.
      **Done:** `getCustomerOrders` (explicit `user_id` filter + RLS; `getUser()` error throws; no-session → `[]`) + `useCustomerOrders` (`customerOrdersQueryKey`, `CUSTOMER_ORDERS_STALE_TIME_MS`); `usePlaceOrder` invalidates the key on a successful order.
- [x] **8.2 — Orders list**: order number, date, total, status badge (shared status-badge component, reused by the admin orders table).
      **Done:** `CustomerOrdersPage` (`useCustomerOrders` + skeleton/empty/error, heading lives in the feature page like Cart/Checkout) renders `CustomerOrderCard` per order — collapsed summary (product preview thumbs, name(s), status, date, total) with a native `<details>` expand for full line items (image, variant, qty × price, line total). `OrderStatusBadge` shipped in `components/shared/` for Phase 12 reuse. `getCustomerOrders` also joins live `products.image_url` / `slug` for display (null-safe if a product went inactive).
- [x] **8.3 — Expandable line items or a details view** — decide based on how much the customer needs to see.
      **Done:** Locked **expandable on the list** (`CustomerOrderCard` native `<details>` from 8.2) — no customer `/orders/[id]` page. Expand shows line items, payment method, and totals only. Delivery-address snapshot stays off this screen (Alaa needs it on admin order details in Phase 12). No extra customer fields in `getCustomerOrders` for 8.3.
      🚩 No customer cancel / edit / reorder in MVP. Status changes stay admin-only. Whether a customer may cancel or edit later, and under what constraints, is parked in `docs/backlog.md` (Open questions).
- [x] **8.4 — Empty state** for a customer with no orders.
      **Done:** `CustomerOrdersPage` already renders shared `EmptyState` when `getCustomerOrders` returns `[]` (title + catalog CTA). Shipped with 8.2; no extra UI in this task.
      🚩 Same as 8.3: no cancel / reorder on the empty or filled list.

`[commit: feat(order-history): customer orders list]`

---

## Phase 9 — Home Page

`[branch: feature/home]`

Built after products and reviews exist, because every section on it is driven by their data.

- [x] **9.1 — Hero**: full-width brand image, `next/image` with `priority`, Arabic `alt`.
      **Done:** Full-bleed `Hero` in `app/(customer)/_components/` with `public/home_hero.jpg`, overlay copy + CTA, mobile/desktop washes, `priority` + Arabic `alt`. Wired on `/`. Overlay navbar (Home-at-top only) is parked at **C.3**.
- [x] **9.2 — Features section**: static value props (shipping, quality, COD) — content from Alaa.
      **Done:** Static three-item strip in `app/(customer)/_components/Features.tsx` (shipping / quality / COD), Lucide icons, RTL, placeholder copy until Alaa’s final text. Wired on `/` under Hero.
- [x] **9.3 — "Latest" section**: newest active products, reusing `ProductCard`.
      **Done:** `LatestProducts` on `/` under Features; `getProducts({ sort: "newest", pageSize: 4 })` via `useProducts`, reuses `ProductCard`, with loading/error/empty and a catalog link.
- [x] **9.4 — "Featured / Top Sales" section**: active products where `current_price < original_price`, sorted by discount depth or recency (spec decision #10). Static grid.
  **Done:** `catalog_products` now exposes `has_discount` (any variant `current_price < original_price`) and `discount_depth`. `getFeaturedProducts` returns active discounted products sorted by depth then recency. `FeaturedProducts` static grid on `/` reuses `ProductCard`, with loading/error/empty. No carousel; no `is_featured`.
  🚩 Static grid only — no auto-advancing carousel, no arrow navigation (backlog, spec decision #3). And no manual `is_featured` toggle in admin; the discount drives it.
- [x] **9.5 — Testimonials section**: top-rated reviews that contain a text comment, across all products, each labelled with its product (spec decision #9). Static grid.
  **Done:** `list_home_testimonials` RPC + `getHomeTestimonials` (comment required, active products, rating then recency). `HomeTestimonials` static grid on `/` reuses `StarRating`, labels each quote with a product link, with loading/error/empty. No carousel; no `testimonials` table.
  🚩 Static grid, no carousel (backlog). No separate admin testimonial-entry screen (spec decision #9).
- [x] **9.6 — Lazy-load Testimonials and Featured** if they pull extra data (`coding-standards.md` §5), and fetch Home's sections in parallel, not as a waterfall.
      **Done:** `next/dynamic` for `FeaturedProducts` and `HomeTestimonials` on `/`; Latest stays in the initial bundle. Both deferred sections render unconditionally so their queries start independently (no data waterfall). No carousel; no server prefetch (backlog).

`[commit: feat(home): hero and features, feat(home): latest and featured sections, feat(home): testimonials, feat(home): lazy-load featured and testimonials]`

---

## Phase 10 — Static Pages

`[branch: feature/static-pages]`

- [x] **10.1 — About page**: brand story. ⚠️ Blocked on content from Alaa (spec) — build the layout with placeholder copy, flag the dependency.
      **Done:** `/about` with `AboutContent` (catalog + how-we-work + CTAs). Interim copy in the brand voice until Alaa’s story lands. Navbar/Footer links already pointed here.
- [x] **10.2 — Contact page + form**: `contactSchema` (name, phone, message), insert into `contact_messages`.
      **Done:** `/contact` + `contactSchema` (phone-only — no email column) + `createContactMessage` / `useCreateContactMessage` calling `submit_contact_message`. Guest-accessible. No email delivery.
- [x] **10.3 — Sanitize the contact message** before storage/render (§7), and rate-limit or otherwise guard the endpoint — a public insert endpoint is a spam target.
      **Done:** `sanitizePlainText` before the RPC; RPC strips tags, re-validates, and rate-limits 3/phone/hour. Dropped `contact_messages_insert_anyone`; INSERT revoked from anon/authenticated. Honeypot on the form. No email send (backlog).
  🚩 The contact form stores messages for Alaa to read; it does not need to send email. Adding email delivery here pulls in the same integration that "Forgot Password" was deferred for (backlog).

`[commit: feat(pages): about page, feat(contact): contact form]`

---

## Phase C — Customer MVP gaps

After customer storefront work (Phases 2–10), before Admin. Park essential customer MVP items that were missed or decided mid-build — not backlog polish.

`[branch: feature/customer-mvp-gaps]` (or extend the relevant feature branch when the gap is tiny and still open)

- [x] **C.1 — Customer can edit their own review** (rating + optional comment). Owner-only; re-validate `reviewSchema` and sanitize comment before update. After success, invalidate product reviews (+ product rating aggregates as needed).
      **Done:** Owner-only `UPDATE` RLS + column grant (`rating`, `comment`); `updateReview` re-validates `reviewSchema` and sanitizes before write; `OwnedReviewPanel` edit/cancel on the product page; invalidates product reviews, my-review, product rating, and home testimonials.
- [x] **C.2 — Customer can delete their own review.** Owner-only, with a confirm step. After delete, the add-review form is available again for that product (unique constraint still applies while a row exists).
      **Done:** Owner-only `DELETE` RLS + revoke anon DELETE; `deleteReview` resolves from active slug + session (never a client review id); confirm dialog on `OwnedReviewPanel`; invalidates product reviews, my-review, product rating, and home testimonials so the add form returns.
  🚩 Guests still cannot review. No editing/deleting someone else’s review. Admin delete is Phase A — not here.
- [x] **C.3 — Overlay navbar on the Home Hero**: on `/` at the top of the page, the customer navbar sits over the Hero (transparent, no solid bar) so they read as one visual unit. After scroll, and on every other customer page, keep the current solid sticky bar (`bg-background` + blur + border). Navbar stays in the customer layout — do not duplicate a Home-only nav.
      **Done:** Home-at-top overlay from the shared customer navbar; solid sticky bar after scroll and on other pages. Full-viewport hero with a light top/copy wash so the photo stays vivid and nav/copy stay readable. Brand mark in nav, footer, and mobile menu, plus favicon.
  🚩 Overlay is Home-at-top only. Do not make the navbar transparent site-wide. Logo, links, cart badge, and mobile menu icon must stay readable on the photo (add a top wash on the Hero if needed). If Alaa swaps the Hero image, re-check contrast. Admin navbar (11.3) is out of scope.
- [x] **C.4 — Show/hide password toggle** on customer login and register (password + confirm password): an eye control so the customer can reveal the typed value. Shared control, Lucide eye icons, Arabic `aria-label` (e.g. «إظهار كلمة المرور» / «إخفاء كلمة المرور»), visible focus. Reuse the same control in admin login when **11.1** is built — do not fork a second toggle.
      **Done:** Shared `PasswordInput` (Lucide eye, Arabic aria-label, visible focus) on login + register password/confirm. Same control is ready for admin login in **11.1** — do not fork.
  🚩 Not Forgot Password / reset (backlog). Toggle visibility only; do not email or change the password.

`[commit: feat(reviews): customer edit and delete own review, feat(shell): overlay navbar on home hero, feat(auth): password visibility toggle]`

---

## Phase 11 — Admin: Auth Shell & Dashboard

`[branch: feature/admin-shell]`

- [x] **11.1 — Admin login page**: email + password, credentials provisioned directly in Supabase (spec).
  🚩 No password change/reset screen for admin (backlog). No self-service admin signup.
- [x] **11.2 — Server-side admin guard**: the `(admin)` layout or middleware verifies the admin role **server-side** — hiding the UI client-side is not protection (`coding-standards.md` §7). Verify a logged-in normal customer hitting `/admin` directly is rejected, not just unable to see the link.
- [x] **11.3 — Admin layout + navbar**: Dashboard / Orders / Products / Reviews.
- [x] **11.4 — KPI query hook**: Total Sales, Pending Orders, Total Products. Aggregate in the DB (Postgres aggregate or view), not by fetching all rows and summing in JS.
      **Done:** `get_admin_dashboard_kpis` + `getAdminDashboardKpis`. Total Sales = sum of `Delivered` totals (COD: money counts after delivery). Pending = `Pending` count. Total Products = all product rows including inactive.
- [x] **11.5 — KPI cards.**
  🚩 Cards only — no charts (backlog). No revenue-over-time graph, no sparklines.
      **Done:** Three cards on `/admin` (sales / pending / products) with loading/error. No charts.

`[commit: feat(admin): admin login, feat(admin): server-side role guard, feat(admin): dashboard kpis]`

---

## Phase 12 — Admin: Orders

`[branch: feature/admin-orders]`

- [x] **12.1 — `api/useAdminOrders.ts`**: all orders. Shorter `staleTime` / more aggressive refetch than the catalog — Alaa acts on these in near-real-time (`coding-standards.md` §5).
      **Done:** `list_admin_orders` + `getAdminOrders` / `useAdminOrders` (`adminOrdersQueryKey`, 30s staleTime). `/admin/orders` shows loading, error, and empty. Table UI stays **12.2**.
  🚩 If this hook (or an admin status-update mutation) needs to invalidate the customer's `customerOrdersQueryKey` (from 8.1) — or vice versa — that is the trigger to move `orders` feature query keys into a shared `queryKeys.ts` instead of hooks importing each other's key builders directly.
- **12.2 — Orders table**: Customer Name, Address, Total, Status, Date, Phone, Details button. Mobile-first: a table this wide needs a card layout or horizontal scroll on phones — decide, don't let it break.
- **12.3 — Order details page**: back button, line-items table (Product, Price, Quantity, Line Total), customer + address block.
- **12.4 — Update-status control**: `Pending → Shipping → Delivered → Cancelled`, values from `constants.ts`, never retyped inline (§4).
- **12.5 — Status mutation** with optimistic update or invalidation, plus a Sonner toast. Only admin can update — enforced by RLS (Phase 1.3), not just by the UI.
- **12.6 — Filter/sort orders by status** if the list grows — deferrable, note it rather than building it now.

`[commit: feat(admin-orders): orders table, feat(admin-orders): order details and status update]`

---

## Phase 13 — Admin: Products CRUD

`[branch: feature/admin-products]` — heaviest feature in the MVP. Split the branch into commits deliberately.

- **13.1 — `api/useAdminProducts.ts`**: all products including inactive ones (the storefront query filters to active only).
- **13.2 — Products table**: Name, Category, Price, Status, Edit button, "Add Product" button.
  🚩 No "available quantity" column — MVP has no inventory system (spec decision #5). If a stock column feels missing while building this, that's the deferred feature knocking.
- **13.3 — `productSchema`** — **`NEW CONCEPT`** (Zod array / `superRefine` for variants):
  - Every product: name, description, category, status, one required photo, and **at least one** variant row (optional `volume_label`, `original_price`, `current_price`).
  - `current_price <= original_price` on every price pair.
  - Category is a fixed enum for MVP — it does **not** change the form shape.
    Standalone Zod example first, then apply.
- **13.4 — Add-product form (shared with edit)**: name, description, category, status toggle, single image upload, and a variants block (always present; starts with one row).
- **13.5 — Variant repeater UI**: add/remove variant rows, each with volume label (optional) and price pair (`useFieldArray`). Cannot remove the last remaining row.
- **13.6 — Image upload to Supabase Storage**: one product image; client-side compress/resize to WebP + size validation before upload (1GB ceiling, §5), progress/error states, and cleanup of the orphaned file if create fails midway.
- **13.7 — Create mutation** + redirect + toast.
- **13.8 — Edit form prefill** from existing product + variants, and a diffed update (changed variants updated; removed variants deleted only when safe — e.g. not referenced by `order_items`). Replacing the product image cleans up the old storage object.
- **13.9 — Status toggle from the table** as a quick action (active/inactive controls storefront visibility).
- **13.10 — Soft delete only.** Deleting a product referenced by past `order_items` corrupts order history — deactivate via `status = 'inactive'` only (agreed in 1.1).
- **13.11 — Re-validate `productSchema` server-side before the write** (§7).
- **13.12 — Unit-test the discount and variant price-resolution logic** (§8 priority 1).

`[commit: feat(admin-products): products table, feat(admin-products): product schema, feat(admin-products): create form with image upload, feat(admin-products): edit and deactivate]`

---

## Phase 14 — Admin: Reviews

`[branch: feature/admin-reviews]`

- **14.1 — `api/useAllReviews.ts`**: all reviews across products, newest first, each joined with its product name.
- **14.2 — Reviews list**: product label, star rating, comment, customer, date.
- **14.3 — Decide the scope of "new"**: the spec says "new reviews." Either a read/unread flag on `reviews`, or simply newest-first with no state. Pick the simpler one that satisfies Alaa's actual need — she wants to avoid checking each product page.
  🚩 No real-time notifications for new reviews (backlog) — Alaa checks this page. Do not extend the Phase 6.6 notification channel to reviews.
- **14.4 — Admin review moderation (decided):** Alaa can **delete** any review; she cannot **edit** customer reviews (no rewriting someone else’s rating/comment). Wire the delete action in **Phase A** after this list UI exists — Phase 14 stays read/list-first.

`[commit: feat(admin-reviews): all reviews list]`

---

## Phase A — Admin MVP gaps

After admin feature work (Phases 11–14), before Hardening & Launch. Park essential admin MVP items decided mid-build — not backlog polish.

`[branch: feature/admin-mvp-gaps]` (or extend the relevant admin feature branch when the gap is tiny and still open)

- **A.1 — Admin can delete any review** (moderation). Delete only — no admin edit of rating/comment. RLS: admin-only delete (customers keep owner edit/delete from Phase C). Confirm step + toast; invalidate admin reviews list and affected product review queries.
  🚩 No hide/unread-only soft-moderation beyond what 14.3 already chose. No real-time review notifications (backlog).

`[commit: feat(admin-reviews): admin delete review]`

---

## Phase 15 — Hardening & Launch

`[branch: chore/hardening]`

- **15.1 — Full RTL/accessibility pass** against `accessibility-rtl.mdc`: logical properties everywhere (no `pl-`/`pr-`/`text-left`), directional icons flipped, every image has a meaningful Arabic `alt`, every input has a `<label>`, focus states visible, star ratings labelled.
- **15.2 — Mobile-first pass** on every page — spec says most customers are on mobile, so this is the primary target, not a final check.
- **15.3 — Security review**: run the checklist in `code-quality-security.mdc` end to end. Verify RLS by attempting cross-user reads (customer A reading customer B's order), confirm no service-role key in any client bundle, confirm admin routes reject a non-admin session server-side.
- **15.4 — Performance pass**: confirm every product image goes through `next/image`, check for query waterfalls, review `staleTime` per resource, check bundle size. Note where the React Compiler already handles memoization — manual `useMemo`/`useCallback` should be near-absent (`code-quality-security.mdc`).
- **15.5 — Supabase advisors re-run** + fix findings.
- **15.6 — Empty / loading / error states audit**: every list and every mutation has all three.
- **15.7 — SEO & metadata**: per-page Arabic metadata, Open Graph image, `robots`, sitemap.
- **15.8 — Storage audit**: measure actual usage against the 1GB budget and record the number, so the compression decision (spec decision #2) is data-driven.
- **15.9 — Deploy** (Vercel) with production env vars, then a real end-to-end order placed on production to confirm the WhatsApp notification actually fires.
- **15.10 — Handover to Alaa**: how to add a product, how to update an order status. Arabic.
- **15.11 — Portfolio README & project writeup.**
  A GitHub-facing `README.md` and a short project writeup usable for the
  CV/LinkedIn, written _from the accumulated project history_ — not
  generated from a fresh read of the final codebase alone. Source material
  to read, in this order: the git log (commit messages carry the real
  decision trail), `project-spec.md`'s Assumptions & Decisions Log, the
  Supabase migration files' section comments (the richest technical
  reasoning in the repo — e.g. why `private.is_admin()` exists, why
  `search_path = ''` on SECURITY DEFINER functions), and `backlog.md` (to
  accurately describe what was deliberately scoped out, not silently
  omit it).
  README covers: what the project is and for whom, the real stack
  decisions (not a generic list — the _why_ behind Base UI/Maia, TanStack
  Query vs Zustand split, RLS design), a few concrete technical
  highlights worth a reviewer's attention (server-side total
  recalculation, RLS column-level grants preventing self-promotion), setup
  instructions, and the live deploy link (15.9).
  Depends on 15.9 (deploy) being done first — the live link and a couple
  of real screenshots/GIFs belong in the README, and those should already
  exist from having been captured feature-by-feature during Phases 2–14
  (plus Phase C / Phase A gaps), not staged retroactively here.

`[commit: chore(a11y): rtl audit fixes, chore(security): rls verification fixes, chore(release): production deploy config, docs(readme): portfolio project writeup]`

---

## Backlog Guard Summary

Everything below is **deferred**. Each item is listed with the task where it would most likely creep in, so it gets refused at the right moment instead of discovered in review.

| Deferred item                                                        | Where it would creep in                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Coupon system                                                        | 0.7 (shared types), 1.1/1.5 (schema + total function), 4.5 (cart totals) |
| Google Auth                                                          | 5.5 (login form)                                                         |
| Wishlist                                                             | 2.3 (navbar icon), 3.4 (product card heart button)                       |
| Shipping fee calculation                                             | 1.1/1.5 (schema + total function), 4.5 (cart totals), 6.2 (checkout)     |
| Admin dashboard charts                                               | 11.5 (KPI cards)                                                         |
| Animated Testimonials / Featured carousels                           | 9.4, 9.5 (Home sections)                                                 |
| Forgot Password (customer)                                           | 5.5 (login form)                                                         |
| Change/Reset Password (admin)                                        | 11.1 (admin login)                                                       |
| Real-time notifications for new reviews                              | 6.6 (order notification), 14.3 (admin reviews)                           |
| Inventory / stock tracking (out of MVP entirely)                     | 1.1 (schema), 13.2 (products table)                                      |
| English / i18n toggle (out of MVP entirely)                          | 0.1 (root layout), 2.3 (navbar)                                          |
| Manual `is_featured` flag (replaced by discount logic)               | 1.1 (schema), 13.4 (product form)                                        |
| Separate `testimonials` table / admin entry screen                   | 1.1 (schema), 9.5 (Home testimonials)                                    |
| Standalone "List by Categories" page (covered by the catalog filter) | 3.7 (catalog filters)                                                    |
| Per-variant product photos                                           | 1.1 (schema), 1.4 (storage), 13.5–13.6 (admin form / upload)             |
| Admin-managed categories (CRUD)                                      | 1.1 (schema), 13.4 (product form category field)                         |
| TanStack Query server prefetch + hydrate                             | 3.x (product catalog/detail pages), Providers / QueryClient setup        |
| Product bundles / packages (multi-item offer at one price)           | 13.4–13.6 (admin product form), 3.x (catalog/detail), 4.x/6.x (cart/checkout line snapshots) |

## Open Dependencies (not blocked on code)

- **About page content** — from Alaa (10.1).
- **Home Features section copy** — from Alaa (9.2).
- **Hero + brand imagery** — interim image shipped in 9.1; Alaa may still swap the final brand photo. Overlay navbar contrast (C.3) must be re-checked if the photo changes.
- **CallMeBot phone verification** on Alaa's number, plus its rate limits — validate before 6.6 is built, not after.
- **Email fallback provider** for order notifications — choose and confirm it is free at this volume (6.6).
- **Delivery area scope** — decided in 5.3: full Egypt list (not delivery-area-only). Alaa still coordinates shipping manually; no fee calculation.
