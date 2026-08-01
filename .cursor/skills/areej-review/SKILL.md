---
name: areej-review
description: >-
  Runs the Areej-specific per-feature review checklist from code-quality-security.mdc
  — Performance → Security → Accessibility (RTL/Arabic) → UX/UI → Testing needed? →
  Scalability → Git action needed? — after a feature or task is completed, before it
  is presented or committed. Trigger when the developer indicates a feature/task is
  done (e.g. "done", "review this", "ready to check"). Invoke on your own initiative
  the moment a feature/task is complete — don't wait to be asked by name, same
  self-invocation pattern as clean-code-guard. Focuses on Areej performance
  conventions, the project security checklist, RTL/Arabic accessibility, UX/UI
  against project sources, whether tests are needed (not test-code quality),
  scalability markers, and whether a commit/branch is due. DO NOT USE for general
  Clean Code/SOLID/DRY/KISS/YAGNI/AI-failure-mode checks (use clean-code-guard),
  reviewing test code once written (use test-guard), or documentation accuracy
  (use docs-guard).
---

# areej-review

You are running the Areej per-feature review after a feature or task is complete.
This is a **review-only** pass: flag issues and suggest fixes; **never rewrite the
developer's code** unless they explicitly ask. For every finding, explain **why**,
not just what to change — keep answering "why" if asked until the principle is clear.

The authoritative sources are project files, not this skill's memory. Before the
walk, re-read as needed:

- `.cursor/rules/code-quality-security.mdc`
- `.cursor/rules/accessibility-rtl.mdc`
- `docs/coding-standards.md` (esp. §5–10, §8 for testing priority)
- `.cursor/rules/git-conventions.mdc`

Do not invent rules. If something is not in those sources, it is out of scope.
Do not add extra `references/*.md` files that restate those sources — depth already
lives there; a parallel copy would drift.

## When this skill activates

- The developer signals a feature/task is done ("done", "review this", "ready to check",
  "finished", similar)
- A feature/task just completed in the session and you are about to present or suggest
  committing — invoke yourself; do not wait to be named
- Explicit invocation: "areej-review", "run the feature checklist"

## How to use this skill

**Review mode only** (default and only mode): follow the execution script in
[references/review-checklist.md](references/review-checklist.md) against the changed
or completed feature. Produce a structured findings report. Do not edit code unless
the developer explicitly asks after the review.

**Clean-code handoff (mandatory report line):** The full project order starts with
Clean code → …. That pass belongs to `clean-code-guard`, not this skill. Every
areej-review report **must** begin with exactly this first line (never omit,
rephrase, or bury it):

`Clean code: not covered by this pass — see clean-code-guard`

Then continue the walk from Performance onward.

## Checklist (apply in order)

### 1. Performance

Source: `code-quality-security.mdc` Performance; `coding-standards.md` §5.

Why this section exists: shipping a fragrance storefront on free-tier storage and
Compiler-enabled React means unnecessary images, memoization cargo-cult, and
sequential fetches become real cost and latency — not style nits.

- Product images use `next/image` — no raw `<img>` for product photos (1GB Supabase
  storage budget).
- Manual `useMemo` / `useCallback` / `React.memo` are rare exceptions (React Compiler
  is on). If present, flag and ask whether a Rules-of-React break is being papered
  over — do not silently "fix" by adding more memoization.
- TanStack Query: sensible `staleTime` per resource (catalog can be minutes-stale;
  admin order status more aggressive).
- No request waterfalls — parallel fetch where a page needs multiple independent
  resources.

### 2. Security

Source: `code-quality-security.mdc` Non-Negotiable; `coding-standards.md` §7.

Why: guest checkout + admin surfaces + client-held anon keys mean the browser is
hostile. Client totals, missing RLS, and client-only admin hides are exploit paths,
not "later hardening."

- RLS: default-deny; explicit policies per role (guest/customer/admin) for touched
  tables.
- Order totals/line prices recalculated server-side before insert — never trust
  client totals.
- Zod validated client-side **and** again before the Supabase write.
- Admin routes guarded server-side (middleware / server component), not only hidden
  client-side.
- Free-text user input (reviews, contact) sanitized before storage/render.
- Only anon key (`NEXT_PUBLIC_`) client-side — never service role key.

### 3. Accessibility (RTL/Arabic)

Source: `accessibility-rtl.mdc`; `coding-standards.md` §6.

Why: the product is Arabic-only with no English toggle (`project-spec.md`). A broken
RTL or a11y issue is a broken product for every user — treat it like Security, not
polish.

- Custom components respect root `dir="rtl"` / `lang="ar"`.
- Tailwind logical properties (`ps`/`pe`/`text-start`), not physical `pl`/`pr`/
  `text-left`.
- Directional icons (arrows, chevrons) visually flip in RTL — Lucide does not
  auto-flip.
- Meaningful Arabic `alt` on images.
- Form inputs have associated `<label>` — no placeholder-as-label.
- Custom controls (e.g. star rating) have proper Arabic `aria-label`.
- Visible focus states — never strip outlines without a replacement.

### 4. UX/UI

Source: non-negotiables + stack conventions already in project docs (no separate UX
rule file).

Why: consistency with Shadcn/Maia, RHF+Zod, and `next/image` keeps the storefront
coherent; inventing one-off UI patterns fights the stack decisions already locked.

- Product imagery and form patterns match project conventions (`next/image`,
  RHF + Zod).
- UI uses established stack (Shadcn/Maia, Sonner, Lucide) rather than one-off
  patterns.
- Flag only clear breaks from documented conventions — do not invent visual design
  rules.

### 5. Testing needed?

Source: `coding-standards.md` §8; `code-quality-security.mdc` Testing.

Why: testing is progressive, not upfront. The job here is triage — what deserves a
test now — not writing or judging test code (that is `test-guard` later).

Decide **whether** this feature needs a test and **what kind**, using priority
order:

1. Zod schemas / pure business logic (discount calc, variant price resolution)
2. Critical flows (checkout, add-to-cart)
3. Full E2E later — not an MVP requirement

Do **not** review test implementation quality — that is `test-guard` after tests
exist.

### 6. Scalability

Source: `code-quality-security.mdc` Scalability; `coding-standards.md` §10.

Why: MVP shortcuts that couple features (deep imports, payment baked into checkout
shape, categories leaking outside products) make the next real change expensive.

- New category should only touch `features/products/` (+ DB check migration); admin
  category CRUD out of MVP.
- Checkout stays payment-method-agnostic even if COD is hardcoded for MVP.
- No feature deep-imports another feature's internals — use `types/` or
  `components/shared/`.

### 7. Git action needed?

Source: `git-conventions.mdc`; `coding-standards.md` §9.

Why: checkpoint commits and feature branches are habits for hire-ready workflow,
not bureaucracy — flag them in the moment with a concrete reason.

- Flag if a commit is due at a logical checkpoint (schema+types → UI → Supabase
  wiring).
- Flag if work belongs on a feature branch (`feature/<name>`) vs sitting
  uncommitted on the wrong branch.
- Suggest message shape `type(scope): description` with allowed types — do not
  create the commit unless asked.
- Explain **why now**, not a generic "remember to commit."

## Reporting format

Every report **must** start with this exact first line:

`Clean code: not covered by this pass — see clean-code-guard`

Then group findings by checklist section (Performance → … → Git). Use:

```
### <Section>

**Finding** in `path/to/file.ext`[:line or symbol]
- Why: <principle from the source — teach, don't just prescribe>
- Fix: <concrete suggestion only — do not apply it unless asked>
```

Severity:

- **Must fix:** Security items; Accessibility (RTL/Arabic) items; missing
  server-side price recalc; service-role exposure; admin client-only guards
- **Should fix:** Performance waterfalls / missing staleTime; scalability
  boundary breaks
- **Worth noting:** Testing recommendation; Git commit/branch due; UX convention
  nits

If a section is clean, one short line: `Performance: clean` (etc.). Do not skip
sections.

End with one summary line:

`areej-review: <N> findings (<M> must-fix, <K> should-fix, <W> worth noting) — <one-line verdict>`

Or: `areej-review: clean — <git note if any>`

## What this skill does NOT do

- General Clean Code / SOLID / DRY / KISS / YAGNI / AI failure-mode review →
  `clean-code-guard`
- Review of test file quality after tests are written → `test-guard`
- Documentation accuracy / docs-vs-code drift → `docs-guard`
- Rewrite or implement fixes unprompted (mentor hard boundary)
- Invent rules beyond the listed source files
- Duplicate project rules into extra reference files
- Run linters, create commits, or push — flag only; act only if the developer asks

## Success criteria

The skill is working when every completed feature gets this walk before
present/commit, every report starts with the clean-code handoff line, findings
always include **why**, code is not rewritten unless asked, and sibling skills
are not duplicated.
