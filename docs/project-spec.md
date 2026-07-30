# Areej (أريج) — MVP Project Spec

**Brand:** Areej — owned and operated by Alaa
**Store type:** Full-stack e-commerce (perfumes, musk, fermentation "مخمرية", and hair oils)
**Prepared by:** [Amar]
**Status:** Confirmed — ready for task/sprint breakdown (separate phase)

---

## Overview & Goal

Areej is a small, real business selling perfumes, musk, "مخمرية" (fermented fragrance products), and hair oils. This MVP is being built by a solo developer, both as a genuine deliverable for the client and as a structured learning project for professional AI-assisted development workflows.

No single, narrow "prove one thing" goal was defined for this MVP up front. Instead, the deliberate strategy for this first version was to **cover the essential functionality of a complete, working online store** — browse, cart, checkout, and order tracking on the customer side, plus a functional admin panel to manage products, orders, and reviews — while leaving refinements and nice-to-haves for a later pass (see `backlog.md`).

**Key operating constraints baked into this spec:**

- Cash on Delivery is the only payment method — no online payment integration.
- The business currently has no inventory/stock system — orders are placed first, and Alaa sources products afterward through her supplier. Stock/quantity tracking is intentionally absent from this MVP.
- Shipping is currently handled manually by Alaa (nearby areas only) and coordinated outside the system — no shipping-fee calculation in this MVP.
- Arabic-only interface for MVP; no English toggle.
- Hosted on Supabase's free tier (1GB storage) — monitored as photo volume grows.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase
- **Styling:** Tailwind CSS V4
- **UI Components:** Shadcn/ui
- **State Management:** Zustand
- **Data Fetching & Caching:** TanStack Query (React Query)
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Version Control:** Git / GitHub

Design priority: **mobile-first** (most customers shop from mobile devices).

---

## User Roles

| Role                      | Description                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Guest**                 | Can browse the catalog, view product details, and add items to cart. Must register/log in to complete checkout or view order history.    |
| **Customer (Registered)** | Everything a Guest can do, plus: complete checkout (Cash on Delivery), view Order History, and submit product reviews.                   |
| **Admin (Alaa)**          | Single admin account. Manages products, views and updates order status, views dashboard KPIs, and reviews all incoming customer reviews. |

---

## MVP Pages & Features

### Admin Panel

**1. Admin Login**

- Purpose: secure entry point to the admin panel.
- Elements: email + password fields, login button. Credentials are provisioned directly in Supabase — no self-service password reset/change in MVP.

**2. Dashboard**

- Purpose: at-a-glance snapshot of store activity.
- Elements: Navbar, KPI cards (Total Sales, Pending Orders, Total Products). No charts in MVP.

**3. Orders (List)**

- Purpose: central place to see and manage incoming orders.
- Elements: Orders table — Customer Name, Address, Total, Status, Date, Phone Number, "Details" button.

**4. Order Details**

- Purpose: view and manage a single order.
- Elements: Back to Orders button, order line-items table (Product, Price, Quantity, Line Total), Update Status control.
- Order statuses: **Pending, Shipping, Delivered, Cancelled.**

**5. Products (List)**

- Purpose: manage the product catalog.
- Elements: "Add Product" button, Products table — Name, Category, Price, Status (active/inactive), Edit button.
- Note: no "available quantity" column — MVP has no inventory tracking (see Assumptions & Decisions Log).

**6. Add / Edit Product**

- Purpose: create or update a product.
- Elements:
  - Name, Description, Category (**Perfumes / Musk / Fermentation / Hair Oil** — fixed list for MVP)
  - **One required product photo** (product-level — shared across all sizes of that product).
  - **Variants (1..N):** every product has at least one variant row. Each variant has an optional volume label (e.g. 2ml, 5ml, 100ml, or null when size is irrelevant) and its own Original Price / Current Price pair. Alaa chooses how many size rows a product needs; category does not force the shape.
  - Status toggle (active/inactive — controls storefront visibility).

**7. Reviews**

- Purpose: let Alaa see new customer reviews without checking each product page individually.
- Elements: list of all new reviews across all products, each clearly labeled with the product it belongs to (star rating + optional comment).

---

### Customer-Facing Store

**1. Home**

- Purpose: brand introduction and entry point to shopping.
- Elements: Navbar, full-width Hero image, Features section, "Latest" section (newest products), "Featured / Top Sales" section (data-driven grid featuring active discount items where Current Price < Original Price, sorted by highest discount or recency), Testimonials section (pulls top-rated customer product reviews that include text comments across all products), Footer.

**2. Products (Catalog)**

- Purpose: browse and discover products.
- Elements: Search, Filters (Category, Price, Rating), Sort, paginated product grid.

**3. Product Details**

- Purpose: view a specific product and add it to cart.
- Elements: product photo, Name, Price display (shows original price with strikethrough alongside the highlighted current price if a discount is active), Rating, Description, Category.
  - **One product photo** for all sizes; selecting a size changes the displayed price only.
  - **Size/volume selector** when the product has more than one variant; skipped when there is only one (price + quantity only).
  - Add to Cart with quantity.
  - Reviews section: existing reviews + "Add a Review" (star rating required, comment optional).

**4. Cart**

- Purpose: review items before ordering.
- Elements: cart list (product, variant if applicable, quantity, price), Cart Totals. No coupon field, no shipping fee in MVP (see backlog).

**5. Checkout / Order Confirmation**

- Purpose: finalize the order.
- Elements: "Confirm Order" action from Cart. If not logged in, registration/login is required before the order can be placed. On confirmation: a simple "Your order has been received" message. Payment is Cash on Delivery only. An instant notification is triggered to Alaa via WhatsApp (using CallMeBot) with an Email fallback upon every successful checkout. The order becomes visible to Admin and appears in the customer's Order History.

**6. Order History**

- Purpose: let registered customers see their past orders.
- Elements: list of the customer's previous orders with current status.

**7. Login / Register**

- Purpose: account access; required to complete checkout.
- Elements: email + password login/register (no Google Auth in MVP). Guest browsing is allowed for viewing products and adding to cart. Registration fields: Name, Phone Number, Password, Address (Governorate list → Markaz/district list → free-text location description, with an example shown as a hint, e.g., "Kafr El-Sheikh Governorate – Kafr El-Sheikh Markaz – Qaraga village, near the bus stop"). No Forgot Password flow in MVP.

**8. Contact**

- Purpose: let visitors reach the store directly.
- Elements: contact form.

**9. About**

- Purpose: introduce the Areej brand.
- Elements: brand story / info content (content to be provided by Alaa).

---

## Explicitly Out of MVP

A number of features were deliberately deferred to keep this first version lean. See **`backlog.md`** for the full list with reasoning, plus items that still need direct client input.

---

## Assumptions & Decisions Log

This log records every point where scope, structure, or an original note was corrected, clarified, or decided during planning — nothing below was assumed silently.

1. **Language:** original notes mentioned Arabic as primary with an English option "from day one." Final decision: **Arabic only** for MVP; English is fully deferred, not even scaffolded.
2. **Product photos:** MVP uses **one required photo per product** (product-level), shared across all size variants — sizes of the same scent are the same product; only the bottle/volume changes. Per-variant photos are deferred (see `backlog.md`). Client-side compress/resize to WebP before upload; storage usage monitored against the 1GB free tier.
3. **Testimonials & Featured Products display:** original notes described an auto-advancing carousel with left/right arrow navigation (similar to major e-commerce sites). MVP ships a **static grid/list** version instead; the animated, auto-rotating carousel is deferred (see backlog).
4. **Shipping fees:** original notes implied fees would be calculated by governorate/markaz and added to the order total. MVP **defers this entirely** — there is no shipping partner yet, so shipping is coordinated manually, outside the system.
5. **Inventory/stock tracking:** the original Products table draft included an "available quantity" column. Final decision: **MVP has no inventory/stock system at all** — orders are placed first, then sourced via Alaa's supplier on demand. The "available quantity" column has been removed from the Products table accordingly.
6. **Musk category:** originally unclear whether Musk was a sub-type of Perfumes or its own category. Decided: **Musk is a separate category** with the same variant model as every other category (1..N size rows decided per product, not by category).
7. **Checkout flow:** originally the Cart page appeared to be the final step. MVP adds a required "Confirm Order" action after Cart, which requires the customer to be registered/logged in — **guests must create an account to complete checkout.** This is followed by a simple order-confirmation message (no online payment step, since COD is the only method).
8. **"List by Categories":** appeared as a separate item in the original notes (grouped near the Wishlist). It is **not a standalone page or a deferred feature** — it's covered by the existing category filter on the Products page.
9. **Testimonials Data Source:** Decided that Home page testimonials are automatically queried from the highest-rated product reviews that contain text comments, rather than introducing a separate admin testimonial entry system.
10. **Discount Pricing & Featured Section:** Dual price fields (`original_price` / `current_price`) live **always on `product_variants`** (every product has ≥1 variant row). Products with an active discount on any variant (`current_price < original_price`) populate the Home "Featured / Top Sales" section — no manual `is_featured` toggle.
11. **Admin Order Notifications:** Confirmed that instant admin notifications via WhatsApp (CallMeBot) with Email fallback are included in the MVP scope to alert Alaa immediately when a new order is placed. *Technical note: CallMeBot has rate limits and a one-time phone verification step — this should be validated early during implementation, not assumed to work identically to a paid WhatsApp Business API.*
12. **Sourcing model (informational, confirmed with Alaa):** Alaa buys **pre-made sizes** directly rather than purchasing from a single bulk source and portioning it out herself. This doesn't change the MVP build (still no inventory/stock system either way — see item 5), but is recorded here in case stock tracking is introduced post-MVP, since pre-made sizes make per-variant stock counts a more natural fit than a shared bulk source would.
13. **Variant representation:** every product has at least one row in `product_variants` (including single-size / no-size products). `volume_label` is nullable. Storefront shows a size selector only when `variants.length > 1`. Category never dictates whether a product “has variants.”
14. **Categories fixed for MVP:** the four categories (`Perfumes`, `Musk`, `Fermentation`, `Hair Oil`) are a code + DB check-constraint list. Adding a fifth later is a small, deliberate change (`features/products/` constants + Arabic labels + migration). Admin category CRUD is deferred.
15. **Phase 1 schema agreements (pre-migration):** prices as `numeric(10,2)`; soft-delete products via `status = 'inactive'` only (no hard delete); `orders` snapshot customer name/phone/address at checkout; `order_items` snapshot product name, variant label, and unit price; `payment_method` column with `cod` default; admin via `profiles.role`; profile row created by trigger on `auth.users` insert; one review per customer per product (`unique`); product `slug`; average rating computed in query/view (not cached columns); place-order as Postgres RPC; English enum/check values in DB with Arabic UI maps.

---

## Open Questions

None remaining — all points raised during scoping were resolved with client input (see Assumptions & Decisions Log above).
