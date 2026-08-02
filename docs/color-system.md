# Areej — Brand Color System

Base color approved by the client: `#B8874A` (warm amber gold). Everything below is derived from it — same hue (≈33°), lightness/saturation varied per step. This is the single source of truth for any color used in the UI; don't introduce new hex values ad hoc while building a feature.

## Full scale

| Step | Hex | vs white | vs dark text | Typical use |
|---|---|---|---|---|
| 50  | `#FAF5F0` | — | 17.1:1 | Tinted backgrounds (badges, selected chip fill) |
| 100 | `#F3E9DD` | — | 15.5:1 | Hover fill on tinted surfaces |
| 200 | `#E6D3BC` | — | 12.7:1 | Subtle dividers, skeleton loaders |
| 300 | `#D6B994` | — | 9.9:1  | Decorative only — not for borders needing to read as "interactive" |
| 400 | `#C7A070` | — | 7.7:1  | Icons on light surfaces |
| **500** | **`#B8874A`** | 3.18:1 | 5.8:1 | **The approved brand color.** Hero sections, logo, illustrations, large non-text surfaces. Also the minimum step usable for borders/UI outlines that need to read as accented (3:1 non-text contrast). |
| 600 | `#99703D` | 4.43:1 | 4.2:1 | Borderline for text — use only for large/bold text, not body copy |
| 700 | `#7B5B32` | 6.20:1 | — | **Primary button fill.** White text passes AA comfortably here. |
| 800 | `#5D4528` | 8.95:1 | — | Button hover state; text-on-white accent color (links, discount price) |
| 900 | `#3F301C` | 12.7:1 | — | Button active/pressed state |
| 950 | `#292014` | 16.0:1 | — | Reserved — rarely needed at this size of project |

**Why the button isn't the exact approved 500 hex:** `#B8874A` against white text is only 3.18:1 — fine for large UI elements, not reliable for a button label at normal size. `700` is the same hue and reads as "the same brand color" to the eye, but is the step that's actually safe for text-bearing buttons. This is normal — the color people approve visually and the exact value used for small text rarely match 1:1 in any real system.

## Semantic tokens

Wired into `src/app/globals.css` (hex kept as approved — Shadcn accepts any CSS color in variables). Tailwind theme mirrors the same names (`bg-brand`, `text-text-accent`, `bg-primary`, etc.).

```css
:root {
  --brand: #B8874A;           /* true brand color — hero, logo, large surfaces */
  --brand-50: #FAF5F0;
  --brand-100: #F3E9DD;
  --brand-200: #E6D3BC;
  --brand-300: #D6B994;
  --brand-400: #C7A070;
  --brand-500: #B8874A;
  --brand-600: #99703D;
  --brand-700: #7B5B32;
  --brand-800: #5D4528;
  --brand-900: #3F301C;
  --brand-950: #292014;

  --primary: var(--brand-700);
  --primary-hover: var(--brand-800);
  --primary-active: var(--brand-900);
  --primary-foreground: #FFFFFF;

  --bg-accent: var(--brand-50);
  --text-accent: var(--brand-800);
  --border-accent: var(--brand-500);
}
```

## Usage rules

- **Buttons / CTAs** (Add to cart, Confirm order): `--primary` fill, `--primary-foreground` text, `--primary-hover` on hover, `--primary-active` on press.
- **Discount price, accent links, "new" labels on white background**: `--text-accent` (800) — never 500 or 600 for small text on white, contrast isn't reliable.
- **Badges / tags** (e.g. "خصم 20%"): `--bg-accent` fill with `--text-accent` text.
- **Selected state** (chosen size/variant, active filter): `--border-accent` (500) as the border — this is the one case where the exact approved brand color is the right choice, since it's a border, not text.
- **Disabled buttons/inputs**: use a neutral gray, not a diluted brand step. A washed-out brand color still reads as "still branded, just faint"; gray reads as "unavailable," which is the actual intent.

## Scope note

No dark-mode variants included. `project-spec.md` doesn't call for a dark mode and it's not in `backlog.md` either — adding one now would be scope creep beyond what was actually agreed with the client. If it's ever requested post-MVP, the scale above is the base to build a dark-mode ramp from.
