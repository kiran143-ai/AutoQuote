# AutoQuote Design System

Design reference for the NYL AutoQuote Pricing Portal. A live version with interactive specimens and copyable AWS Quick App prompts is at `/design-system`. When the two disagree, the code in `tailwind.config.js`, `src/index.css` and `src/components/ui/` wins.

## 1. Principles

- **Professional and precise.** This is a data-dense B2B pricing tool. Prefer clarity over decoration.
- **Scannable first.** Labels are small and muted, values are large and bold, cards group related facts.
- **One accent.** The primary blue marks action, selection and focus. Status colors mark state only.
- **Accessible by default.** Visible focus rings, AA contrast, every control labelled, state never conveyed by color alone.
- **Consistent surfaces.** White cards with a 2px primary top border on a light gray canvas.

## 2. Themes

Two themes switch via the `data-theme` attribute on `<html>` (toggle in the top bar). Components use token classes (`bg-primary`, `text-nav-text`), never raw hex, so both themes work automatically. Tokens are CSS variables in `src/index.css`, mapped in `tailwind.config.js`, with a typed copy in `src/utils/theme.ts`.

| Token | Client (default) | Current |
|---|---|---|
| Primary | `#005991` | `#1D4ED8` |
| Primary hover | `#00456F` | `#1A44BC` |
| Primary tint | `#E6F4FB` | `#EFF6FF` |
| Nav background | `#005991` | `#1F2937` |
| Nav hover | `#0A6FA8` | `#374151` |
| Nav text | `#D6E9F2` | `#9CA3AF` |
| Nav active background | `#00A3E0` | `#1D4ED8` |
| Nav active text | `#06283D` | `#FFFFFF` |

Client accent `#00A3E0` is reserved for the active sidebar item. Do not use it for button hover (white text on it fails contrast).

## 3. Color

Shared across both themes:

| Token | Hex | Use |
|---|---|---|
| Ink | `#111827` | Body and heading text |
| Muted | `#6B7280` | Secondary and helper text |
| Canvas | `#F1F3F5` | Page background, table headers, disabled fields |
| Line | `#E5E7EB` | Borders and dividers |

NYL status palette:

| Status | Base | Tint | Readable text on tint |
|---|---|---|---|
| Success | `#28A745` | `#F2FAF4` | `#15803D` |
| Warning | `#F0A500` | `#FEFAF0` | `#92400E` |
| Danger | `#DC3545` | `#FDF3F4` | `#B91C1C` |

Rules:
- Use the base color for borders, fills and large icons. Use the "readable text" shade for any text or small icon on a tint.
- Warning base on white is 2.1:1. Never put white text on a solid warning fill, and use `#92400E` for warning icons.
- Success base on white is 3.1:1. Fine for icons and fills, not for body text.
- Chart series colors are a fixed categorical palette, except income/expense/claims and trend lines, which follow success/warning/danger and the theme primary.

## 4. Typography

Font: Inter, falling back to Segoe UI, system-ui, sans-serif. Numbers use tabular figures (`.tnum`) so columns align.

| Role | Size / weight |
|---|---|
| Page title | 22px bold |
| Card title | 15px semibold |
| Body | 14px regular |
| Buttons and secondary text | 13px medium |
| Field labels and meta | 12px regular, muted |
| Micro label / section tag | 11px semibold, uppercase, 0.06em tracking, muted |
| KPI number | 28 to 34px bold |

## 5. Shape, spacing, elevation

- Card radius `10px`, controls `6px` (`rounded-md`), pills `rounded-full`.
- Card shadow `0 1px 3px rgba(0,0,0,0.08)`. Popovers and modals `0 8px 24px rgba(0,0,0,0.12)`.
- Space between cards `20px`. Card padding `20px`. Page padding `24px`. Content max width `1440px`.
- Control height `36px` (`h-9`), small `32px`.

## 6. Layout shell

- Left sidebar `248px` (collapsible to `80px`), top bar `56px` with theme toggle, notifications and user.
- Main content scrolls inside `<main>`. The body itself never scrolls.
- Case workspace: case header, then a sticky tab strip, then single-column full-width cards. All tabs use the same card width.

## 7. Components

Source files are in `src/components/ui/` unless noted.

**Button** (`Button.tsx`): variants `primary`, `secondary`, `outline`, `ghost`, `danger`. Primary is solid primary with white text. Outline is a primary border and text on white. Danger is red text on white. Disabled is 50% opacity and not-allowed. Use primary for the single main action per view.

**Card** (`Card.tsx`): optional `title`, `meta`, `action`. `accent="primary"` adds the 2px top border and is the default for content cards. Use `warning` or `danger` accents only to flag state.

**Badges and chips**: `StatusBadge` for case status, `StatusChip` (`analytics/`) for HAVE / PARTIAL / BLOCKED, `CheckChip` for validation pass or pending. All are pills with a tinted background, readable text shade and a 40% border.

**Metrics**: `MetricTile` (label above value, optional hint and emphasis), `KpiCard` (`analytics/`, large number with caption and top border), `ProgressRing`.

**Forms**: 12px muted label above a 36px input with `Line` border. Focus is a primary border plus a 20% primary ring. Required marks a red asterisk after the label. Errors use a danger border and a helper line. Disabled uses the canvas background.

**Navigation**: underline tabs (primary text and 2px underline when active), segmented button groups with `aria-pressed`, filter pills, inline back link and ghost back button.

**Overlays**: modals and command menu use a 50% ink backdrop, centered white panel, Escape to close, backdrop click to close, focus moved into the panel.

**Tables**: canvas header with uppercase muted labels, `Line` row dividers, canvas hover, right-aligned tabular numbers.

## 8. Signature patterns

- **Page header** (`layout/PageHeader.tsx`): title and subtitle left, actions right.
- **Case header**: name, status badge, round, summary line, inline MVP / Break-even / Strain metrics, validation chips. Re-run and New Round on the right, Send for Review on the Evidence tab.
- **Approval stepper** (`workspace/ApprovalStepsCard.tsx`): five steps on a white panel inside a tinted card. Completed is solid success with a check, current is a primary ring with a clock, upcoming is a gray numbered circle.
- **Readiness checks**: rows tinted by state (pass, fail, warn) with an icon, label and value.
- **Census selector**: search plus Upload outline button above a radio list with metadata.
- **Workflow versions**: Version 1 is the current tab set. Version 2 groups tabs into Overview, Setup, Pricing, Illustration, Evidence, with History as a secondary link. Both reuse the same panels.

## 9. Accessibility checklist

- Every interactive element has a visible 2px primary focus ring (`focus-visible`).
- Text meets 4.5:1, large text and icons 3:1. Check new color pairs before shipping.
- Icon-only buttons need `aria-label`. Decorative icons get `aria-hidden`.
- Inputs have associated labels. Errors use `aria-invalid` and `aria-describedby`.
- Use real buttons and links, never clickable `div`s.
- State is never color alone: pair color with an icon or text.
- Dynamic regions use `role="alert"` or `role="status"`. Selected tabs and filters expose `aria-selected` or `aria-pressed`. The current nav link uses `aria-current`.

## 10. Do and don't

- Do reuse `Card`, `Button` and the token classes. Don't hardcode hex in components.
- Do use the primary accent for one main action per view. Don't use status colors for decoration.
- Do keep cards full width in the workspace. Don't add per-tab max widths.
- Do explain why a metric is unavailable. Don't show a bare "N/A".
- Don't set `overflow-x` without `overflow-y` on a container; the browser promotes it and shows a stray scrollbar.

## 11. Where things live

- Tokens: `tailwind.config.js`, `src/index.css`, `src/utils/theme.ts`
- Shared UI: `src/components/ui/`, layout: `src/components/layout/`
- Case workspace: `src/components/workspace/`, tab pages: `src/pages/workspace/`
- Live reference and AWS Quick App prompts: `src/pages/DesignSystemPage.tsx`
