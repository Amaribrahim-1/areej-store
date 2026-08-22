# full-task — Execute Phase 13 review fixes

> This file is a **self-contained execution plan**. Open a new chat, say "بص
> على current.md وتنفذه", and the agent should be able to do the whole thing
> — code fixes, commits, merge, push, branch cleanup — with no other context.
> Branch: `feature/admin-products` (current branch when this was written).
> Base: `main`.

## Why (one line each)

- `SelectedFilePreview` uses `useMemo` to run a side effect
  (`URL.createObjectURL`) — fragile under StrictMode re-invocation; belongs in
  `useEffect`.
- The status field is a hand-rolled checkbox while the exact same concept
  (`active`/`inactive`) is a shadcn `Switch` everywhere else — unify it.
- `PRODUCT_CATEGORIES` is dead in production code since 13.13 moved categories
  to the `categories` table; the one test using it no longer asserts anything
  real.
- 13.12 (variant price-resolution tests) is already covered by existing
  tests — just check it off, no new test code.
- `prepareProductWrite.ts` re-validates in the browser right before calling
  the RPC, not inside the RPC itself. Decision (documented, not changed):
  keep as-is — only an authenticated admin can call `create_admin_product`/
  `update_admin_product`, and React escapes rendered text — but leave a
  comment recording the tradeoff and its revisit trigger so it isn't silently
  re-discovered later.

## Steps

### 1. Fix the object-URL side effect

File: `src/features/products/components/admin/AdminProductImageField.tsx`

Replace:

```tsx
function SelectedFilePreview({ file }: { file: File }) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
```

with:

```tsx
function SelectedFilePreview({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) return null;

  return (
```

- Remove `useMemo` from the `react` import at the top of the file (no longer
  used anywhere else in it) — keep `useEffect`, `useRef`, `useState`.
- Leave the rest of `SelectedFilePreview`'s JSX (the `<Image src={previewUrl} ...>`
  block) unchanged — `previewUrl` is now `string` inside that branch since the
  early return handles `null`.

### 2. Unify the status control on `Switch`

File: `src/features/products/components/admin/AdminProductForm.tsx`

- Add `import { Switch } from "@/components/ui/switch";` near the other UI
  imports.
- Delete the now-unused `checkboxClassName` constant and the `cn` import
  (both become dead once the checkbox is gone — confirm with a search for
  `cn(` and `checkboxClassName` in this file before deleting; nothing else in
  the file uses either).
- Replace the status `Controller` block:

```tsx
<Controller
  name="status"
  control={control}
  render={({ field }) => (
    <input
      id="admin-product-status"
      type="checkbox"
      ref={field.ref}
      name={field.name}
      className={checkboxClassName}
      checked={field.value === "active"}
      aria-invalid={!!errors.status}
      aria-describedby="admin-product-status-hint"
      onBlur={field.onBlur}
      onChange={(event) =>
        field.onChange(event.target.checked ? "active" : "inactive")
      }
    />
  )}
/>
```

with:

```tsx
<Controller
  name="status"
  control={control}
  render={({ field }) => (
    <Switch
      id="admin-product-status"
      ref={field.ref}
      name={field.name}
      checked={field.value === "active"}
      aria-invalid={!!errors.status}
      aria-describedby="admin-product-status-hint"
      onBlur={field.onBlur}
      onCheckedChange={(checked) =>
        field.onChange(checked ? "active" : "inactive")
      }
    />
  )}
/>
```

- Keep the `<Label htmlFor="admin-product-status">` and the hint `<p>` exactly
  as they are — only the control itself changes.
- After editing, run `ReadLints` on this file to confirm `Switch`'s prop types
  accept `ref`/`name`/`aria-invalid`/`aria-describedby` (it wraps
  `@base-ui/react/switch`, `Root.Props` — these should pass through). If TS
  complains about any one of those props, drop only that prop rather than
  reworking the whole control.

### 3. Drop the stale category enum

File: `src/features/products/constants.ts`

- Delete the `PRODUCT_CATEGORIES` export (and its doc comment) — it is
  superseded by `getCategories()` / the `categories` table since 13.13.
- Keep the `ProductCategory` type alias (`export type ProductCategory =
  string;`) — that one is still used.

File: `src/features/products/schema.test.ts`

- Remove the `PRODUCT_CATEGORIES` import.
- Replace this test (it no longer asserts anything category-specific since
  `category` is just `z.string().trim().min(1)`):

```ts
it("accepts the same variant fields for every category", () => {
  for (const category of PRODUCT_CATEGORIES) {
    const result = productSchema.safeParse({ ...validProduct, category });
    expect(result.success).toBe(true);
  }
});
```

  with a test of the actual current contract (any non-empty category string
  is accepted, empty is rejected):

```ts
it("accepts any non-empty category slug and rejects an empty one", () => {
  expect(
    productSchema.safeParse({ ...validProduct, category: "Hair Oil" })
      .success,
  ).toBe(true);
  expect(
    productSchema.safeParse({ ...validProduct, category: "" }).success,
  ).toBe(false);
});
```

- Run the products test suite after this change (`npx vitest run
  src/features/products`) to confirm nothing else referenced
  `PRODUCT_CATEGORIES`.

### 4. Document the re-validation boundary decision

File: `src/features/products/api/admin/prepareProductWrite.ts`

Add this comment directly above the `prepareProductWrite` function (do not
change its behavior):

```ts
/**
 * Re-validation boundary: this runs in the browser immediately before the
 * `create_admin_product`/`update_admin_product` RPC call, not inside the RPC
 * itself. Accepted because only an authenticated admin can call those RPCs
 * and rendered text is React-escaped. Revisit if these RPCs are ever exposed
 * to a wider role, or if rendered admin content stops going through React's
 * default escaping (e.g. a future `dangerouslySetInnerHTML` on product name
 * or description).
 */
```

### 5. Update `tasks.md`

- Check off **13.12** with a done-note pointing at existing coverage, matching
  the style of the other done-notes in Phase 13 (e.g. see 13.9's `**Done:**`
  line): variant price-resolution priority-1 testing is already covered by
  `schema.test.ts`'s `superRefine` cases plus the pre-existing
  `resolveDisplayVariant.test.ts` / `resolveFeaturedDisplayVariant.test.ts` —
  no new test file needed.

### 6. Verify

- `npx vitest run src/features/products`
- `ReadLints` on the three edited component/lib files.
- Confirm the dev server still renders `/admin/products/new` and the status
  switch toggles visually (quick manual check is enough, not a full browser
  session).

## Git (do this after steps 1–6 pass)

Follow `.cursor/rules/git-conventions.mdc`. Commit at logical checkpoints, not
one giant commit:

```bash
git add src/features/products/components/admin/AdminProductImageField.tsx
git commit -m "fix(admin-products): create object URLs in an effect, not useMemo"

git add src/features/products/components/admin/AdminProductForm.tsx
git commit -m "fix(admin-products): unify status field on the shared Switch"

git add src/features/products/constants.ts src/features/products/schema.test.ts
git commit -m "chore(admin-products): drop the pre-categories-table category enum"

git add src/features/products/api/admin/prepareProductWrite.ts
git commit -m "docs(admin-products): record the re-validation boundary tradeoff"

git add tasks.md
git commit -m "docs(tasks): check off 13.12, variant pricing already covered"
```

Then merge into `main` with an explicit merge commit (never fast-forward),
push, and delete the finished branch:

```bash
git checkout main
git pull
git merge --no-ff feature/admin-products -m "Merge branch 'feature/admin-products'"
git push origin main
git branch -d feature/admin-products
git push origin --delete feature/admin-products
```

If `git push origin --delete feature/admin-products` fails because the branch
was never pushed to the remote, skip that line — it only matters if the
branch exists on `origin`.

## Self-check before calling this done

- [ ] All 5 code/doc edits applied exactly as shown above.
- [ ] `vitest run src/features/products` passes.
- [ ] No new lint errors in the 4 edited files.
- [ ] `tasks.md` 13.12 checked off.
- [ ] 5 commits exist on `feature/admin-products`, each scoped as shown.
- [ ] `main` has a `Merge branch 'feature/admin-products'` commit (`--no-ff`,
      not a fast-forward) and is pushed.
- [ ] `feature/admin-products` branch deleted locally (and on `origin` if it
      was pushed there).
