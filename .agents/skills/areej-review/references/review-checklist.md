# areej-review — Review mode execution script

Follow these steps in order. Do not rewrite code. Do not invent checks beyond
what SKILL.md and the project sources define. For rule meaning and "why", read
SKILL.md and the cited source files — do not expand this script into a parallel
rulebook.

## Step 0 — Open sources (read, don't memorize)

Open (or re-read) these files for the current pass:

1. `.cursor/rules/code-quality-security.mdc`
2. `.cursor/rules/accessibility-rtl.mdc`
3. `docs/coding-standards.md` (§5–10; §8 for testing triage)
4. `.cursor/rules/git-conventions.mdc`

Identify the feature scope: changed paths, new routes, touched `features/<name>/`,
and any Supabase/schema touchpoints in this task.

## Step 1 — Start the report (mandatory first line)

Write exactly:

`Clean code: not covered by this pass — see clean-code-guard`

Do not rephrase. Do not put anything above this line.

## Step 2 — Performance

Against the scoped files:

1. Grep/scan for product photo markup: raw `<img>` vs `next/image`.
2. Scan for `useMemo` / `useCallback` / `React.memo` — if found, flag and ask
   (Compiler is on); do not add memoization yourself.
3. Find TanStack Query hooks in scope — is `staleTime` set appropriately for the
   resource?
4. On pages/routes that need multiple independent resources — are fetches parallel
   or sequential (waterfall)?

Write findings under `### Performance`, or `Performance: clean`.

## Step 3 — Security

1. Tables touched this feature: RLS default-deny + role policies present?
2. Orders/checkout money path: server-side recalc of totals/line prices before
   insert?
3. Zod: client validation and again before Supabase write?
4. Admin routes: middleware or server-component guard (not only client hide)?
5. Free-text fields (reviews, contact): sanitize before store/render?
6. Client bundle / env usage: anon `NEXT_PUBLIC_` only — no service role key?

Write under `### Security`, or `Security: clean`. Severity: **Must fix**.

## Step 4 — Accessibility (RTL/Arabic)

1. Scoped components respect root RTL (`dir="rtl"` / `lang="ar"` expectations).
2. Scan for physical Tailwind (`pl-`/`pr-`/`ml-`/`mr-`/`text-left`/`text-right`) —
   prefer logical (`ps`/`pe`/`ms`/`me`/`text-start`/`text-end`).
3. Directional icons (arrows, chevrons): do they flip for RTL?
4. Images: meaningful Arabic `alt`?
5. Inputs: real `<label>` association (not placeholder-as-label)?
6. Custom controls: Arabic `aria-label` where needed (e.g. star rating)?
7. Interactive elements: visible focus (outline not stripped without replacement)?

Write under `### Accessibility (RTL/Arabic)`, or that section clean.
Severity: **Must fix** (Arabic-only product).

## Step 5 — UX/UI

1. Product images / forms match documented conventions (`next/image`, RHF + Zod).
2. UI primitives match stack (Shadcn/Maia, Sonner, Lucide) — flag one-offs that
   fight those conventions.
3. Only flag what is grounded in project sources — no invented design critique.

Write under `### UX/UI`, or `UX/UI: clean`. Severity: usually **Worth noting**.

## Step 6 — Testing needed?

Do not open or critique test files for quality (hand off to `test-guard`).

Ask, in priority order from `coding-standards.md` §8:

1. Did this add/change Zod schemas or pure business logic? → recommend unit tests.
2. Did this touch critical flows (checkout, add-to-cart)? → recommend flow tests.
3. Else → E2E not required for MVP; say so if relevant.

Write under `### Testing needed?` with a clear yes/no + kind, or "no new tests
required for this change." Severity: **Worth noting**.

## Step 7 — Scalability

1. Category work confined to `features/products/` (+ DB check migration)? Admin
   category CRUD creeping in?
2. Checkout still payment-method-agnostic (COD hardcoded OK; structure not locked
   to COD-only forever)?
3. Any deep import into another feature's internals? Should be `types/` or
   `components/shared/` instead.

Write under `### Scalability`, or `Scalability: clean`. Severity: **Should fix**.

## Step 8 — Git action needed?

1. Is there a logical checkpoint ready to commit (schema+types / UI / Supabase
   wiring)?
2. Is the work on an appropriate `feature/<name>` branch?
3. If the feature branch is complete: remind to merge to `main` with
   `git merge --no-ff` (explicit merge commit per `git-conventions.mdc`).
4. If committing is due: suggest `type(scope): description` — do not commit unless
   asked. Explain why **now**.

Write under `### Git action needed?` (even if "no action — already committed /
branch correct"). Severity: **Worth noting**.

## Step 9 — Close the report

1. Ensure every section above appears (clean line or findings).
2. Count Must fix / Should fix / Worth noting.
3. End with exactly one summary line:

`areej-review: <N> findings (<M> must-fix, <K> should-fix, <W> worth noting) — <one-line verdict>`

or:

`areej-review: clean — <git note if any>`
