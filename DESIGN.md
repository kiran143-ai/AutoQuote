# AutoQuote Design System

Design guide for the NYL AutoQuote Pricing Portal, written to be implementation-agnostic so it can drive a build in AWS Quick App or any other tool. It describes how the product should look and behave, not how it is built. Interactive specimens and copyable Quick App prompts for each component are on the Design System page.

## 1. Principles

- **Professional and precise.** This is a data-dense B2B pricing tool. Prefer clarity over decoration.
- **Scannable first.** Labels are small and muted, values are large and bold, cards group related facts.
- **One accent.** The primary blue marks action, selection and focus. Status colors mark state only.
- **Accessible by default.** Visible focus indicators, AA contrast, every control labelled, state never conveyed by color alone.
- **Consistent surfaces.** White cards with a 2px primary top border on a light gray page background.

## 2. Themes

Two themes share the same layout and components and differ only in brand colors. Client is the default.

| Role | Client | Current |
|---|---|---|
| Primary | `#005991` | `#1D4ED8` |
| Primary hover | `#00456F` | `#1A44BC` |
| Primary tint (light backgrounds) | `#E6F4FB` | `#EFF6FF` |
| Sidebar background | `#005991` | `#1F2937` |
| Sidebar item hover | `#0A6FA8` | `#374151` |
| Sidebar text | `#D6E9F2` | `#9CA3AF` |
| Active sidebar item background | `#00A3E0` | `#1D4ED8` |
| Active sidebar item text | `#06283D` | `#FFFFFF` |

The Client accent `#00A3E0` is reserved for the active sidebar item. Do not use it as a button hover color, because white text on it fails contrast.

## 3. Color

Shared across both themes:

| Role | Hex | Use |
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
- Use the base color for borders, fills and large icons. Use the "readable text" shade for text or small icons on a tint.
- Warning base on white is 2.1:1. Never put white text on a solid warning fill, and use `#92400E` for warning icons.
- Success base on white is 3.1:1. Fine for icons and fills, not for body text.
- Charts use a fixed categorical palette, except income, expense and claims series and trend lines, which follow success, warning, danger and the theme primary.

## 4. Typography

Font: Inter, falling back to Segoe UI or the system font. Numbers use tabular figures so columns align.

| Role | Size / weight |
|---|---|
| Page title | 22px bold |
| Card title | 15px semibold |
| Body | 14px regular |
| Buttons and secondary text | 13px medium |
| Field labels and meta | 12px regular, muted |
| Micro label / section tag | 11px semibold, uppercase, 0.06em letter-spacing, muted |
| KPI number | 28 to 34px bold |

## 5. Shape, spacing, elevation

- Card corner radius 10px, controls 6px, pills fully rounded.
- Card shadow `0 1px 3px rgba(0,0,0,0.08)`. Popovers and modals `0 8px 24px rgba(0,0,0,0.12)`.
- Space between cards 20px. Card padding 20px. Page padding 24px. Content max width 1440px.
- Control height 36px, small controls 32px.

## 6. Layout shell

- Left sidebar 248px, collapsible to 80px. Top bar 56px with theme switch, notifications and user.
- Only the main content area scrolls. The page frame stays fixed.
- Case workspace: case header, then a sticky tab strip, then single-column full-width cards. Every tab uses the same card width.

## 7. Components

**Button.** Five variants: primary (solid primary, white text), secondary (white, gray border), outline (primary border and text on white), ghost (primary text, no border), danger (red text on white). Use one primary button per view for the main action. Disabled is 50% opacity.

**Card.** Optional title, meta line and right-aligned action. Content cards carry the 2px primary top border. Use a warning or danger top border only to flag state.

**Badges and chips.** Pills with a tinted background, the readable text shade and a 40% border. Used for case status, data readiness (HAVE, PARTIAL, BLOCKED) and validation (pass, pending).

**Metrics.** Metric tile (label above value, optional hint), KPI card (large number with caption and top border) and progress ring.

**Forms.** 12px muted label above a 36px input with a Line border. Focus shows a primary border plus a soft primary glow. Required fields show a red asterisk after the label. Errors show a danger border and a helper line. Disabled uses the canvas background.

**Navigation.** Underline tabs (primary text and 2px underline when active), segmented button groups, filter pills, an inline back link and a ghost back button.

**Overlays.** Modals and the command menu use a 50% ink backdrop and a centered white panel. They close on Escape or backdrop click, and focus moves into the panel.

**Tables.** Canvas header with uppercase muted labels, Line row dividers, canvas row hover, right-aligned tabular numbers, pagination below.

## 8. Signature patterns

- **Page header.** Title and subtitle on the left, actions on the right.
- **Case header.** Case name, status badge, round, one-line summary, inline MVP, Break-even and Strain metrics, validation chips. Re-run and New Round sit on the right, with Send for Review added on the Evidence tab.
- **Approval stepper.** Five steps on a white panel inside a tinted card. Completed is a solid success circle with a check, current is a primary ring with a clock, upcoming is a gray numbered circle, joined by thin connector lines.
- **Readiness checks.** Rows tinted by state (pass, fail, warn), each with an icon, label and value.
- **Census selector.** Search and an Upload outline button above a radio list with file metadata.
- **Workflow versions.** Version 1 uses the full tab set. Version 2 groups it into Overview, Setup (Census, Configuration), Pricing (Pricing Inputs, Results, Rounds), Illustration and Evidence, with History as a secondary link.

## 9. Accessibility checklist

- Every interactive element shows a visible 2px primary focus indicator.
- Text meets 4.5:1 contrast, large text and icons 3:1. Check any new color pair.
- Icon-only buttons need an accessible name. Decorative icons are hidden from assistive tech.
- Inputs have visible, associated labels. Errors are announced and linked to their field.
- Use real buttons and links for anything clickable.
- Never rely on color alone for state. Pair it with an icon or text.
- Alerts and status messages are announced. Selected tabs, filters and the current page are exposed to assistive tech.

## 10. Do and don't

- Do reuse the same card, button and badge styles everywhere. Don't invent one-off variants.
- Do use the primary accent for one main action per view. Don't use status colors for decoration.
- Do keep cards full width in the workspace. Don't give individual tabs their own narrower width.
- Do explain why a metric is unavailable. Don't show a bare "N/A".
