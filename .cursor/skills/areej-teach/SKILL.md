---
name: areej-teach
description: >-
  Writes a medium-length learner walkthrough of Areej work into
  docs/walkthroughs/current.md (overwrite each time; Egyptian Arabic teaching
  prose + English API contract). Problem and solution first, then pages/files
  (what they are, not internals), then flow, then key decisions. Reviews list
  only must/should/ذوق findings plus a bare change list. Use after finishing
  AI-owned backend, after a full task the developer asked the AI to implement,
  after a frontend/backend/feature review (areej-review, clean-code-guard,
  «راجع», «خلصت»), when the developer asks for شرح / تلخيص / walkthrough /
  "اشرح اللي اتعمل", or when the chat explanation would be long. DO NOT USE
  during the FE start signal, for one-line answers, mid-implementation chatter,
  or to rewrite the developer's frontend.
---

# areej-teach

The developer is an intern learning to walk, not a hire-ready senior. Chat
summaries were too shallow; the first walkthroughs were too long. Aim for the
middle: they can re-read `current.md` without drowning, and they can ask when
they want internals.

Authoritative audience (do not flatten):

- Solid: React, JS, HTML/CSS (Exam.io).
- New / toy-only: TypeScript, Zustand, Zod, React Hook Form, latest Next.js App
  Router, Supabase RLS, generated DB types.

Templates: [references/templates.md](references/templates.md)

## When this skill activates

- Backend just shipped (areej-task step 3, or any AI-owned BE/DB work).
- The developer asked the AI to implement a **full** task (FE included).
- A review just ran (FE review, areej-review, clean-code-guard) or they said
  «راجع» / «خلصت».
- They asked for شرح / تلخيص / walkthrough / "اشرح اللي اتعمل".
- The explanation would not fit in a short chat reply.

Do **not** activate: FE start signal, one-line answers, mid-coding chatter.

## Language split (this folder is the exception)

| Surface | Language |
|---|---|
| Teaching prose in `current.md` | Egyptian Arabic |
| Usage contract, code, paths, SQL, error names, types | English |
| Chat pointer after the file is written | Egyptian Arabic, **short** |
| All other project docs (`docs/*.md`, code comments, commits) | English, unchanged |

Never mix Arabic into the **usage contract** block.

## Output file

**Only** `docs/walkthroughs/current.md`. Overwrite it every time. Do not create
`archive/`, `INDEX.md`, or extra walkthrough files.

If the folder is missing, create `current.md` (and the short README).

`<kind>` goes in the heading only: `backend` | `full-task` | `review`.

## Kind → template

| Kind | When | Template |
|---|---|---|
| `backend` | AI shipped Supabase / `get*` / mutates | Backend |
| `full-task` | Developer asked AI to implement the whole task | Full-task |
| `review` | After reviewing their work or a whole-task pass | Review |

## Length

Not a file-by-file lecture. Not a three-line summary. Follow the template
headings and stop. Internals of a page or helper wait until they ask.

## Hard rules

1. **File is the lesson; chat is the pointer.** After writing, chat gets a few
   lines: path to `current.md`, 2–3 bullets of the highest-stakes *why*, and
   "لو جملة وقفتك، ظللها وابعتها". Do not paste the walkthrough into chat.
2. **Pages/files: what, not how.** Path (or URL), one or two lines: what it is
   and what the user/content is. Do not walk the function body, RLS line by
   line, or hook internals. If they want that, they ask.
3. **No "مش في الشحنة" section.** Omit backlog/out-of-scope lists. **Exception:**
   if they implemented something deferred or out of time, tell them clearly in
   chat and in a short warning at the top of `current.md`.
4. **تحقق بنفسك** only when it is worth it (security, a redirect they can
   click, a contract they will call). Skip it for docs-only or tiny changes.
5. **No FE recipes in `backend` kind.** How to **call** `getProduct` is
   required in the usage contract. `queryKey`, `staleTime`, hook internals,
   where to put `types.ts` — forbidden. `full-task` may name FE files they
   asked the AI to write, still without internals.
6. **Reviews: problems only.** must / should / ذوق. One line each: where,
   what is wrong, what to change. No praise of clean sections. End with a
   bare checklist of changes, no extra explanation.
7. **Document actual code.** Walk the diff. Paths and function names must
   exist. If spec and code disagree, say so — code is the truth.
8. **Do not rewrite their frontend** in order to explain it.

## Severity language (reviews — mandatory)

Do not invent a fourth. Use these labels in `current.md`:

| Label | Means |
|---|---|
| **must** | Security, correctness, broken RTL/a11y, trust-the-client |
| **should** | Performance, scalability boundary, maintainability |
| **ذوق** | Convention, naming, structure preference — they may disagree |

## Voice

- Short sentences. One idea per paragraph.
- Forbidden: "simply", "just", "obviously", "as you know", dumping five new
  terms in one sentence.
- Define a term only if the section cannot be understood without it.

## Chat pointer (after the file exists)

Egyptian Arabic, short:

1. Kind + task id in one sentence.
2. Path: `docs/walkthroughs/current.md`.
3. Two or three bullets that actually matter.
4. For `backend`: "عقد الاستخدام في الملف — إنجليزي عمداً."
5. Invite: ظلل أي جملة مش واضحة.

Still allowed in chat (keep tiny): function names + one-liners.

## Self-check

- [ ] Overwrote `current.md` only — no archive/INDEX.
- [ ] Paths/symbols exist in the diff.
- [ ] Pages/files have no internals dump.
- [ ] No "مش في الشحنة" unless they built something out of time.
- [ ] `backend` kind has **no** `use*` / `queryKey` recipes.
- [ ] Review: problems only + bare change list at the end.
- [ ] Chat is a pointer, not a second copy.

## What this skill does NOT do

- Replace areej-task / areej-review / clean-code-guard.
- Accuracy-audit of `docs/project-spec.md` etc. → `docs-guard`.
- Pre-solve FE in the start signal.
- Commit unless they asked.

## Success

They can open `current.md` in Notepad, see the problem and the solution, know
which pages exist, follow the flow, and (on review) know only what to change.
