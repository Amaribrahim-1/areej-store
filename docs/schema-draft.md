# Areej — Schema Column Draft (Phase 1.1 → 1.2)

> **⚠️ Frozen historical record — not a living document.**
> This file captured the pre-migration design discussion and was superseded once task 1.2 shipped. It is kept only to preserve the reasoning behind key decisions (e.g. why `sort_order` was retained, why `contact_messages` is phone-only). For the actual current schema, the SQL files in `supabase/migrations/` are the **single source of truth** — always check there first, and if this file and the migrations ever disagree, the migrations win.

Pre-migration draft. Decisions from Phase 1.1 are locked; columns below are the agreed shape for task 1.2.

**Status:** Approved — ready for 1.2 migration. (1.2 has since been implemented — see `supabase/migrations/`.)

Do not write migration SQL until explicitly requested. Task 1.2 is a separate next step.

---

## Locked rules (not columns)

- Prices live only on `product_variants`; every product has ≥1 variant row.
- One required product photo on `products` (shared across sizes). No per-variant images in MVP.
- Soft-delete products via `status = 'inactive'` only — no hard delete.
- `orders` snapshots customer name / phone / address at checkout.
- `order_items` snapshots product name, variant label, and unit price at purchase.
- English enum/check values in DB; Arabic labels in the UI.
- Categories fixed for MVP: `Perfumes` | `Musk` | `Fermentation` | `Hair Oil`.
- Place-order totals via Postgres RPC (task 1.5).
- Average rating computed in query/view — no cached rating columns on `products`.
- Contact form is phone-only (no email column on `contact_messages`).
- `product_variants.sort_order` is kept for admin-controlled display order.

---

## Proposed columns

### `profiles`

| Column | Type (approx.) | Notes |
| --- | --- | --- |
| `id` | uuid PK | Same as `auth.users.id` |
| `full_name` | text | |
| `phone` | text | |
| `governorate` | text | |
| `markaz` | text | |
| `address_text` | text | Free-text location description |
| `role` | text | `DEFAULT 'customer'`; `CHECK (role IN ('customer', 'admin'))` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Profile row created by trigger on `auth.users` insert.

---

### `products`

| Column | Type (approx.) | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `name` | text | |
| `slug` | text unique | URL-friendly |
| `description` | text | |
| `category` | text | Check: the four MVP categories |
| `image_url` | text | One required product photo |
| `status` | text | `active` \| `inactive` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

No price columns. No stock columns.

---

### `product_variants`

| Column | Type (approx.) | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `product_id` | uuid FK → `products` | |
| `volume_label` | text nullable | e.g. `5ml`; null when size is irrelevant |
| `original_price` | numeric(10,2) | |
| `current_price` | numeric(10,2) | Must be `<= original_price` and `> 0` |
| `sort_order` | int | Display order (kept — Alaa can control 5ml before 100ml, etc.) |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Storefront size selector only when `variants.length > 1`.

**FK note:** `order_items.variant_id` references this table with `ON DELETE RESTRICT`, so a variant referenced by past order lines cannot be hard-deleted at the DB level (enforces task 13.8 “deleted only when safe”).

---

### `orders`

| Column | Type (approx.) | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `user_id` | uuid FK → `profiles` | |
| `status` | text | `Pending` \| `Shipping` \| `Delivered` \| `Cancelled` |
| `payment_method` | text | Default `cod`; check-constrained |
| `total` | numeric(10,2) | Server-computed by RPC |
| `customer_name` | text | Snapshot at checkout |
| `customer_phone` | text | Snapshot at checkout |
| `governorate` | text | Snapshot at checkout |
| `markaz` | text | Snapshot at checkout |
| `address_text` | text | Snapshot at checkout |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

New checkouts prefill from the current profile, then snapshot onto the order.

---

### `order_items`

| Column | Type (approx.) | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `order_id` | uuid FK → `orders` | |
| `product_id` | uuid FK → `products` | Reference (history kept via snapshots) |
| `variant_id` | uuid FK → `product_variants` | `ON DELETE RESTRICT` (see `product_variants` note) |
| `product_name` | text | Snapshot |
| `variant_label` | text nullable | Snapshot of `volume_label` |
| `unit_price` | numeric(10,2) | Snapshot of `current_price` at purchase; `CHECK (unit_price > 0)` |
| `quantity` | int | `CHECK (quantity > 0)` |
| `line_total` | numeric(10,2) | `unit_price * quantity` |

---

### `reviews`

| Column | Type (approx.) | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `product_id` | uuid FK → `products` | |
| `user_id` | uuid FK → `profiles` | |
| `rating` | int | Check: 1..5 |
| `comment` | text nullable | Sanitize before store/render |
| `created_at` | timestamptz | |

Constraint: `unique (product_id, user_id)` — one review per customer per product.

---

### `contact_messages`

| Column | Type (approx.) | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `name` | text | |
| `phone` | text | Required; phone-only contact (no email column) |
| `message` | text | Sanitize before store/render |
| `created_at` | timestamptz | |

Insert-only for anyone; read admin-only (RLS in 1.3).

---

## Next step

Proceed to task **1.2** — write the migration SQL (explicit request required before touching Supabase).
