---
trigger: always_on
---

# Stack Decisions (do not re-litigate)
- Server state (products, orders, reviews) → TanStack Query only. Client/UI state (cart, modals, filters) → Zustand only. Never mix the two.
- Forms → React Hook Form + Zod (`zodResolver`), always.
- UI → Shadcn/ui, initialized with **Base UI** as the underlying primitive library (shadcn's official default as of July 2026, replacing Radix), style preset **Maia** (soft, rounded, generous spacing — fits a consumer-facing fragrance brand better than the denser Nova default). Toasts → Sonner. Icons → **Lucide React** (confirm explicitly if the icon library prompt defaults to something else based on the style preset).

# Folder Structure (feature-based)
```
src/
  app/                    → routes only, thin, no business logic
  features/<name>/
    components/  hooks/  api/  schema.ts  store.ts (only if needed)
  components/ui/          → Shadcn primitives
  components/shared/      → cross-feature reusable components
  lib/supabase/           → client.ts, server.ts, generated types
  types/                  → cross-feature shared types only
```
Route files in `app/` compose feature components — they never contain query logic or business rules directly.

# Naming Conventions
- Folders: `kebab-case`. Component files: `PascalCase.tsx`. Hooks: `camelCase.ts` prefixed `use`.
- Zustand stores: `use<Feature>Store`. Zod schemas: `<name>Schema`. Types: `PascalCase`, no `I` prefix.
- Supabase tables: `snake_case` plural (DB convention, keep as-is when mapping to JS).

# Clean Code Rules
- No prop drilling past 2 levels — use a store or context instead.
- One component = one responsibility.
- Extract inline handlers out of `.map()` renders.
- No `any` — use `unknown` + narrowing, or fix the type.
- Every Supabase call goes through `features/*/api/`: components use `use*` hooks only; hooks call pure `get*` / mutate helpers — never `supabase.from(...)` inside a component.
