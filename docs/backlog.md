# Areej (أريج) — Backlog

Companion to `project-spec.md`. Items here were deliberately scoped out of the MVP, or are still awaiting client input.

---

## Post-MVP

| Item | Reasoning |
|---|---|
| **Google Auth (Sign in with Google)** | Email/password is sufficient for MVP login; OAuth setup adds integration overhead without changing the core purchase flow. |
| **Wishlist** | Not part of the core browse → cart → checkout path. |
| **Coupon system** (cart discount codes + admin management) | Requires its own code-generation and management flow in the admin panel — a self-contained feature better suited to a later phase. |
| **Admin dashboard charts** | Not essential until there's meaningful order volume/history to visualize. |
| **Animated Testimonials & Featured Products carousels** (auto-advance + arrow navigation) | MVP ships static grid versions of both sections; the animated, auto-rotating carousel is a polish feature, not core functionality. |
| **Forgot Password (customer)** | Requires email-sending integration, which may carry ongoing cost; deferred until justified. |
| **Change/Reset Password (admin)** | Same reasoning as above — admin credentials are provisioned directly via Supabase for MVP. |
| **Shipping fee calculation** (by Governorate/Markaz) | Blocked on a real shipping-company partnership; currently Alaa delivers manually and coordinates fees outside the system. |
| **Real-time notifications for new reviews** | Order notifications (WhatsApp/Email) were pulled into MVP, but review notifications were not — Alaa will continue checking the admin Reviews page directly for now. |

---

## Borderline — Needs Client Input

No borderline items remain open at this time. All items originally flagged during scoping (product photo requirements, Testimonials data source, discount/Featured logic, admin order notifications) were resolved through direct discussion with the client (Alaa) and are documented in `project-spec.md`'s Assumptions & Decisions Log.

One informational, non-blocking item remains noted in the spec's Open Questions section: Alaa's sourcing model (bulk source vs. pre-made sizes) is still undecided on her end, but it does not affect the MVP build since there's no inventory system either way.
