# Areej (أريج) — Backlog

Companion to `project-spec.md`. Items here were deliberately scoped out of the MVP, or are still awaiting client input.

---

## Post-MVP

| Item | Reasoning |
|---|---|
| **Google Auth (Sign in with Google)** | Email/password is sufficient for MVP login; OAuth setup adds integration overhead without changing the core purchase flow. |
| **Wishlist** | Not part of the core browse → cart → checkout path. |
| **Coupon system** (cart discount codes + admin management) | Requires its own code-generation and management flow in the admin panel — a self-contained feature better suited to a later phase. |
| **Admin dashboard charts** | Not essential until there's meaningful order volume/history to visualize. |
| **Animated Testimonials & Featured Products carousels** (auto-advance + arrow navigation) | MVP ships static grid versions of both sections; the animated, auto-rotating carousel is a polish feature, not core functionality. |
| **Forgot Password (customer)** | Requires email-sending integration, which may carry ongoing cost; deferred until justified. |
| **Change/Reset Password (admin)** | Same reasoning as above — admin credentials are provisioned directly via Supabase for MVP. |
| **Shipping fee calculation** (by Governorate/Markaz) | Blocked on a real shipping-company partnership; currently Alaa delivers manually and coordinates fees outside the system. |
| **Real-time notifications for new reviews** | Order notifications (WhatsApp/Email) were pulled into MVP, but review notifications were not — Alaa will continue checking the admin Reviews page directly for now. |
| **Per-variant product photos** | MVP uses one photo per product (shared across sizes). Per-size photos can be added later if packaging visuals matter enough to justify storage and admin UX cost. |
| **Admin-managed categories** | MVP ships four fixed categories in code + DB check. Adding a fifth later is a small change (`features/products/` + migration). A categories table / admin CRUD is unnecessary until Alaa regularly invents new category labels. |
| **TanStack Query server prefetch + hydrate** (Server Component `prefetchQuery` → `dehydrate` → `HydrationBoundary`, same `queryKey` / `get*` as client `use*`) | MVP fetches catalog/detail data on the client via TanStack Query only; route `page.tsx` files compose UI and do not prefetch. Prefetching on the server improves first paint / SEO without replacing client cache, invalidation, or interactive filters — polish after the purchase flow is solid. |
| **Product bundles / packages** (admin creates a package product composed of several items — e.g. perfume + مخمرية + extras — sold at one package/offer price) | MVP products are single catalog items with size variants only. Bundles need a composition model (which products/variants are included), pricing rules vs buying items separately, cart/line-item snapshots, and admin UX to assemble the package — a self-contained commerce feature after the core catalog and checkout are stable. |

---

## Borderline — Needs Client Input

No borderline items remain open at this time. Product photo scope, Testimonials data source, discount/Featured logic, admin order notifications, variant representation, and related Phase 1 schema agreements are documented in `project-spec.md`'s Assumptions & Decisions Log.

---

## Open questions (decide after MVP)

Parked on purpose. Current MVP behavior stays as-is until we revisit with real usage.

| Question | Current MVP stance | Why revisit later |
|---|---|---|
| **Require email confirmation before first session?** (Supabase Confirm email) | Leave as currently configured in the Supabase project. The app already handles both paths via `needsEmailConfirmation`. | After real checkout friction is visible: confirm ON = better email quality / fewer fake signups; confirm OFF = smoother register → checkout (critical guest path). Decide from live UX + spam/data quality, not during feature build. |
