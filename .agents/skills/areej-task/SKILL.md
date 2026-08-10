---
name: areej-task
description: >-
  Runs the Areej MVP task workflow under the company-style FE/BE split: explain
  the task, split frontend vs backend in chat, wait for go-ahead before backend
  work, ship get* helpers + an API-only chat usage contract (no FE recipes),
  give a FE start signal, review after the developer's draft, whole-task review,
  check off tasks.md, then commit commands from the real diff. Use when the
  developer invokes areej-task, says "يلا التاسك" / "يلا التاسك X.Y", starts a
  new MVP task by id, or asks to run the task workflow.
  DO NOT USE for ad-hoc reviews only (areej-review), clean-code-only passes
  (clean-code-guard), docs-only edits (docs-guard), or test-code review
  (test-guard). Manual invoke only — do not auto-start this skill.
disable-model-invocation: true
---

# areej-task

Orchestrate one MVP task end-to-end under the locked company-style team split in
`docs/ai-interactions.md` and `.cursor/rules/mentor-behavior.mdc`.

- **Human (frontend team)** = feature `types.ts` from the usage contract, TanStack
  `use*` wrappers, UI, components, wiring, Zustand UI state, RHF+Zod client.
- **AI (backend team)** = Supabase + pure `get*` / mutate helpers in
  `features/*/api/` (not the `use*` hooks). Always hand FE a chat usage contract.

Talk to the developer in Egyptian Arabic. Code, usage contracts, commit messages,
and `tasks.md` edits stay in English. `tasks.md` describes **what**, never who.

Do **not** invent product scope. Authoritative sources (re-read as needed):

- `tasks.md`
- `docs/backlog.md`
- `docs/ai-interactions.md` (team split)
- `docs/coding-standards.md`
- `docs/project-spec.md` (when the task text is thin)
- `.cursor/rules/git-conventions.mdc`

Do not add `references/` that restate those files — link/read them instead.

## When this skill activates

Only when explicitly invoked (e.g. `areej-task`, «يلا التاسك 3.4», «يلا التاسك»).
`disable-model-invocation: true` — never self-start from ambient context.

## Hard rules

1. Follow the steps **in order**. Do not skip gates.
2. Do not implement **frontend** unprompted. Developer drafts FE; you review/teach unless they explicitly ask you to write FE code.
3. Do not implement **backend/DB** until the developer gives go-ahead **when BE work exists**. If the task is FE-only, skip the BE gate and go to the start signal after explain + split + guards.
4. Never rewrite the developer's FE from scratch unless they explicitly ask.
5. Do not build deferred backlog items. If the task would pull one in, stop and flag.
6. Do not commit unless the developer explicitly asks. Step 8 = commands only.
7. Hand off deep checklists: after FE is ready for review, run **clean-code-guard** on their code and **areej-review** on the feature — do not re-copy those checklists into this skill.

## Workflow (mandatory sequence)

### 0 — Orient

- Confirm task id (e.g. `3.4`) from the user message; read that entry in `tasks.md`.
- Check git branch: prefer a `feature/...` branch, not accidental work on `main`. If a new branch is needed, **give commands** and wait — do not create/switch without approval.
- Note parent `[branch: ...]` from `tasks.md` when present.

### 1 — Explain the task

In Egyptian Arabic, explain what the task requires, why it exists, and what “done” looks like. Use `tasks.md` (+ spec if needed). Keep it concrete; no implementation yet.

### 2 — Split FE vs BE (chat only — not in `tasks.md`)

Present two lists in chat:

| Track | Owner | Concrete work items |
|---|---|---|
| Frontend | Human | types from contract, `use*` hooks, UI, wiring, … |
| Backend | AI | Supabase, pure `get*` / mutate helpers, types regen, … |

If BE is empty, say so explicitly (FE-only task). Do not put owner names into `tasks.md`.

### Guards (before any implementation)

**Backlog / scope:** Cross-check against `docs/backlog.md` and the task’s 🚩 notes. If scope creep → stop and tell the developer.

**NEW CONCEPT (frontend only):** If the FE work needs a concept they have not used in real project code, give a small standalone example **before** the FE start signal. Do not teach by dumping the real feature first.

### 3 — Backend gate (only if BE work exists)

- Tell the developer BE should ship first and **wait for an explicit go-ahead** (e.g. «ابدأ الباك»).
- On go-ahead: implement BE/DB from scratch as the backend teammate.
- Verify when possible (migration applied, SQL smoke, types, lint on touched api files).
- Deliver a **usage contract in chat** (English) — API surface only: function
  name + path, params, return shape (incl. null/empty), errors, minimal call
  example. Do **not** write a docs file unless they ask. Do **not** include FE
  implementation recipes (`queryKey`, hook structure, where to put types, etc.).

### 4 — Frontend start signal

Clear signal that FE can begin. Include **only**:

- That the usage contract above is the API they consume
- Out of scope / backlog flags (if any)
- Reminder that `tasks.md` sub-tasks are the acceptance checklist

Do **not** prescribe how to write types, `use*`, or smoke UI. Then stop. Wait
for their draft (or an explicit ask for help).

### 5 — Review their frontend

When they signal ready («خلصت»، «راجع»، etc.):

- Review with explanations (**why**, not only what).
- Prefer guidance/fixes they apply; write FE code only if they ask.
- Invoke **clean-code-guard** on their production changes.
- Do not whole-rewrite.

### 6 — Whole-task review

Review FE + BE together against the task acceptance bar. Invoke **areej-review** for the Areej feature checklist (Performance → … → Git). Fix BE issues you own; for FE, guide or fix only if asked.

### 7 — Check off `tasks.md`

Only after you and the developer **agree** the task is done:

- Mark the specific task / sub-tasks `[x]` in `tasks.md`.
- Do not check an entire phase or unrelated items.

### 8 — Commit commands

From the **actual diff** (and recent commit style), propose `git add` + `git commit -m` following `.cursor/rules/git-conventions.mdc`.

- Message reflects what changed in this work, not a vague copy of the `tasks.md` title alone.
- Do **not** run commit unless they explicitly ask.

## FE-only shortcut

If step 2 finds no BE work: after explain + split + guards → go directly to step 4 (start signal). Skip step 3.

## Anti-patterns

- Starting BE without go-ahead when BE is needed
- Giving FE start signal with implementation recipes (hook/`queryKey`/file how-tos) before their draft
- Giving FE start signal before BE contract/verification when BE was required
- Auto-committing or expanding into backlog items
- Replacing areej-review / clean-code-guard with a vague “looks good”
- Checking off tasks before mutual agreement
