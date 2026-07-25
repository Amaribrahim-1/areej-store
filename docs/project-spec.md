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
  - Name, Description, Category (**Perfumes / Musk / Fermentation / Hair Oil**)
  - **Pricing & Discounts:** Dual price fields—**Original Price** and **Current Price** (if Current < Original, a discount display is triggered).
  - **Perfumes & Musk:** one or more size variants, each with its own volume label (e.g., 2ml, 5ml, 100ml), its own Original Price and Current Price pair, and its own required product photo.
  - **Fermentation & Hair Oil:** single Original/Current price pair and one required product photo — no variants (fixed 40ml size for Fermentation).
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
- Elements: product photo(s), Name, Price display (shows original price with strikethrough alongside the highlighted current price if a discount is active), Rating, Description, Category.
  - **Perfumes & Musk:** category → type → size/volume variant selector, each variant showing its own photo and price.
  - **Fermentation & Hair Oil:** single price, single photo, quantity selector.
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
2. **Product photos:** originally considered a single photo per product store-wide, to conserve Supabase's free-tier storage. Final decision: **required photo per size variant** for Perfumes & Musk (since each size is visually distinct), and a single required photo for Fermentation & Hair Oil (no variants). Storage usage will be monitored on the 1GB free tier; compression/optimization will be revisited if it becomes a real constraint.
3. **Testimonials & Featured Products display:** original notes described an auto-advancing carousel with left/right arrow navigation (similar to major e-commerce sites). MVP ships a **static grid/list** version instead; the animated, auto-rotating carousel is deferred (see backlog).
4. **Shipping fees:** original notes implied fees would be calculated by governorate/markaz and added to the order total. MVP **defers this entirely** — there is no shipping partner yet, so shipping is coordinated manually, outside the system.
5. **Inventory/stock tracking:** the original Products table draft included an "available quantity" column. Final decision: **MVP has no inventory/stock system at all** — orders are placed first, then sourced via Alaa's supplier on demand. The "available quantity" column has been removed from the Products table accordingly.
6. **Musk category:** originally unclear whether Musk was a sub-type of Perfumes or its own category. Decided: **Musk is a separate category**, but structurally follows the same product-per-type + size-variant model as Perfumes.
7. **Checkout flow:** originally the Cart page appeared to be the final step. MVP adds a required "Confirm Order" action after Cart, which requires the customer to be registered/logged in — **guests must create an account to complete checkout.** This is followed by a simple order-confirmation message (no online payment step, since COD is the only method).
8. **"List by Categories":** appeared as a separate item in the original notes (grouped near the Wishlist). It is **not a standalone page or a deferred feature** — it's covered by the existing category filter on the Products page.
9. **Testimonials Data Source:** Decided that Home page testimonials are automatically queried from the highest-rated product reviews that contain text comments, rather than introducing a separate admin testimonial entry system.
10. **Discount Pricing & Featured Section:** Implemented dual price fields (Original Price & Current Price) at the variant level for Perfumes/Musk and product level for Fermentation/Hair Oil. Products with active discounts (`Current Price < Original Price`) automatically populate the "Featured / Top Sales" section on the Home page, eliminating the need for a manual "isFeatured" toggle in MVP.
11. **Admin Order Notifications:** Confirmed that instant admin notifications via WhatsApp (CallMeBot) with Email fallback are included in the MVP scope to alert Alaa immediately when a new order is placed.

---

## 
