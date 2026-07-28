# Coding Standards — Areej Project

Concrete, project-specific conventions. If a rule here can't be checked against actual code, it doesn't belong here — see `ai-interactions.md` for the "why" behind decisions and the review process.

---

## 1. Library Conventions (decisions, not options)

| Concern | Choice | Note |
|---|---|---|
| UI components | Shadcn/ui | Already in stack |
| Toasts | **Sonner** | Standard pairing with Shadcn; old shadcn `toast` is deprecated |
| Icons | **Lucide React** | Shadcn components are built around it — no second icon library |
| Server state (products, orders, reviews) | TanStack Query only | Never duplicate server data into Zustand |
| Client/UI state (cart, modals, filters UI state) | Zustand only | Never fetch/store server data here |
| Forms | React Hook Form + `zodResolver` | Every form has a Zod schema, no exceptions |
| Validation | Zod | One schema per entity, reused client-side and before any Supabase write |

**Rule:** if data comes from Supabase, it lives in a TanStack Query cache. If it's pure UI/session state with no server source of truth, it lives in Zustand. Never both.

---

## 2. Project Structure (feature-based)

```
src/
  app/                    → Next.js App Router routes only (thin — no business logic here)
    (customer)/
      _components/        → page-scoped presentational components for this route group
    (admin)/
    api/                  → route handlers if needed (webhooks, WhatsApp notify trigger)
  features/
    products/
      components/
      hooks/
      api/                → TanStack Query hooks (useProducts, useProduct)
      schema.ts           → Zod schemas for this feature
      store.ts            → Zustand store, only if this feature needs client state
    cart/
    orders/
    reviews/
    auth/
  components/
    ui/                   → Shadcn primitives, untouched/generated
    shared/                → Reusable, cross-feature components (Navbar, Footer, PriceTag)
  lib/
    supabase/              → client.ts, server.ts, types.ts (generated DB types)
    utils.ts
  types/                    → Cross-feature shared types only
```

Route files (`app/`) stay thin: they compose components from `features/`, they don't contain query logic or business rules directly.

**`_components/` (route-scoped, private):** presentational components that are page-scoped, non-reusable, have no domain, and no cross-feature reuse go in an underscore-prefixed `_components/` folder inside their route group (e.g. `app/(customer)/_components/Hero.tsx`). The `_` prefix makes Next.js treat the folder as private, so it is never routable. This is the deliberate third bucket between the other two: `features/*/components/` is for anything tied to a domain, `components/shared/` is for anything reused across features, and `_components/` is for the remainder — one-off layout/presentational pieces (a Home hero, a static features strip) that belong to exactly one page and would pollute either of the other two. If such a component later gains data-fetching or gets reused elsewhere, move it to the appropriate `features/*` or `components/shared/` folder at that point — do not let `_components/` accumulate logic.

---

## 3. Naming Conventions

- Folders: `kebab-case` (`product-details/`)
- Component files: `PascalCase.tsx` (`ProductCard.tsx`)
- Hooks: `camelCase.ts`, always prefixed `use` (`useCartStore.ts`, `useProducts.ts`)
- Zustand stores: exported hook named `use<Feature>Store` (`useCartStore`)
- Zod schemas: `camelCase` suffixed `Schema` (`productSchema`, `checkoutSchema`)
- Types/interfaces: `PascalCase`, no `I` prefix (`Product`, not `IProduct`)
- Supabase table names: `snake_case` plural (`products`, `order_items`) — this is a DB convention, not JS, keep as-is when mapping.

---

## 4. Clean Code — Concrete Rules (not vibes)

- No prop drilling past 2 levels — use a Zustand store or React context instead.
- One component = one responsibility. If a component both fetches data and renders a form and manages local UI toggles, split it.
- Extract inline handlers inside `.map()` renders into named functions — inline arrow functions in lists are a performance and readability flag.
- `any` is not allowed. Use `unknown` + narrowing, or fix the type.
- Every Supabase query and mutation goes through a `features/*/api/` hook — never call `supabase.from(...)` directly inside a component.
- Magic strings (order status values, category names) live in a single `constants.ts` per feature — not retyped inline across files.

---

## 5. Performance Checklist

- **Every product image uses `next/image`** — non-negotiable given the 1GB Supabase storage budget; no raw `<img>` for product photos.
- Lazy-load below-the-fold sections on Home (Testimonials, Featured) with dynamic import if they pull extra data.
- Don't reach for `useMemo`/`useCallback` by default — add them only when a real re-render problem is observed, not preemptively.
- TanStack Query: set sensible `staleTime` per resource (product catalog can tolerate a few minutes stale; order status in admin should refetch more aggressively).
- Avoid request waterfalls: if a page needs product + reviews + related products, fetch in parallel, not sequentially.

---

## 6. Accessibility Baseline (Arabic/RTL-specific)

- `<html dir="rtl" lang="ar">` at the root — verify every custom component respects RTL, not just Tailwind defaults.
- Use Tailwind logical properties (`ps-4`, `pe-4`, `text-start`) instead of `pl-4`/`pr-4`/`text-left` so spacing doesn't break in RTL.
- Directional icons (arrows, chevrons) must visually flip in RTL — check each one, don't assume Lucide auto-flips.
- Every image (product photos especially) needs a meaningful Arabic `alt`.
- All form inputs have associated `<label>`s — no placeholder-as-label.
- Star rating component needs proper `aria-label` (e.g., "4 من 5 نجوم") since it's likely a custom, non-native control.
- Visible focus states on every interactive element — don't strip outlines without replacing them.

---

## 7. Security Checklist

- **RLS enabled on every Supabase table, default deny.** Explicit policies per role (guest/customer/admin) — no table left open by default.
- Admin routes protected server-side (middleware or server component check), not just hidden via client-side conditional rendering.
- **Never trust client-submitted totals.** Order total and line-item prices must be recalculated server-side (Supabase function or route handler) before insert — the client price is a display value, not a source of truth.
- Every Zod schema validated **both** client-side (UX) and again server-side/before the Supabase write (security) — client validation alone is not a security boundary.
- Sanitize free-text user input (reviews, contact form) before storage/render to prevent stored XSS.
- Supabase service role key never ships to the client — only the anon key is exposed via `NEXT_PUBLIC_`.

---

## 8. Testing (introduced progressively, not upfront)

Per `ai-interactions.md`, testing tools/depth are taught as they come up, not front-loaded. Priority order when it does come up:

1. Zod schemas and pure business logic first (discount calculation, variant price resolution) — highest value, easiest to test.
2. Critical flows (checkout, add-to-cart) before decorative UI.
3. Full E2E (Playwright) is a later-stage addition, not an MVP requirement.

---

## 9. Git Conventions

- Commit format: `type(scope): description` — e.g., `feat(cart): add quantity selector`, `fix(checkout): prevent double order submit`.
- Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`.
- One feature branch per MVP feature/page: `feature/product-details`, `feature/admin-orders`. Merge to `main` when the feature is reviewed and working — even solo, this builds the habit for team environments later.
- Commit at logical checkpoints within a feature (e.g., "schema + types" then "UI" then "wired to Supabase"), not one giant commit per feature.

---

## 10. Scalability Markers (what "scalable" means concretely, here)

- Adding a new product category should only touch `features/products/` — not ripple into cart or checkout logic.
- Adding a new payment method later should be possible without rewriting the checkout flow — keep "payment method" as a swappable concept even though COD is hardcoded for MVP.
- No feature should reach into another feature's internal folder directly — cross-feature communication happens through shared types (`types/`) or shared components (`components/shared/`), not deep imports like `features/cart/components/InternalThing`.
