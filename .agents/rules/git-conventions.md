---
trigger: model_decision
description: Git commit message format and branching conventions for the Areej project. Pull this in whenever a commit, branch, or version-control decision comes up.
---

# Git Conventions
- Commit format: `type(scope): description` — e.g., `feat(cart): add quantity selector`, `fix(checkout): prevent double order submit`.
- Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`.
- One feature branch per MVP feature/page: `feature/product-details`, `feature/admin-orders`. Do feature work on the branch, not directly on `main`.
- Commit at logical checkpoints within a feature (schema + types → UI → wired to Supabase), not one giant commit per feature.
- **Always merge finished feature branches into `main` with `--no-ff`** so Git always creates an explicit merge commit (e.g. `Merge branch 'feature/app-shell'`), even when a fast-forward would be possible. That keeps branch-based workflow visible in `git log --graph` for portfolio/reviewers — same habit teams use.
  - From `main`: `git merge --no-ff feature/<name>` then push `main` when ready.
  - Do not squash feature branches away unless explicitly asked; keep the checkpoint commits inside the branch.
- Proactively flag when a commit, new branch, or `--no-ff` merge to `main` is due, and why, in the moment — not as a generic reminder.
