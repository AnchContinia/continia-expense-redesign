# Handoff: Continia Expense Management — mobile app + desktop portal

## Overview

A complete redesign of Continia's Expense Management product as two connected
surfaces:

- **Mobile app** (employee): capture a receipt, create an expense, register
  mileage and per diem, follow approvals, see settled history.
- **Desktop portal** (approver / controller): approval queue with bulk actions,
  side-by-side receipt-and-data approval view, all-expenses list, mileage,
  card-transaction reconciliation, reporting, setup.

Both are built on the **Contina 3.0 — Front end** design system and the Continia
brand (Tech Blue / Innovation Blue, Alliance No.2, Font Awesome light + the
Continia `fa-kit` module icons).

## About the design files

The files in this bundle are **design references created in HTML** — interactive
prototypes that show intended look and behaviour. They are **not production code
to copy**. The task is to **recreate these designs in the target codebase's
existing environment** (React, Vue, Blazor, .AL page extensions, native iOS /
Android — whatever the product already uses) with its established patterns,
component library and state layer. If no environment exists yet, pick the
framework that fits the product and implement the designs there.

Two implementation notes carried over from the prototypes:

- They use a small custom runtime (`support.js`) that renders an HTML template
  plus a logic class. **Do not port the runtime.** Read the templates as markup
  and the logic classes as behaviour specs.
- Styling is inline on purpose (a constraint of the prototype environment). In a
  real codebase, move these values into the existing token/theme layer — the
  Design Tokens section below lists every value used.

## Fidelity

**High fidelity.** Final colours, typography, spacing, copy, states and
interactions. Recreate pixel-accurately, but source colours, type and spacing
from the design system rather than hardcoding the hex values where a token
already exists.

Two things are intentionally *not* final:

- The receipt image in the portal's approval view is a **drawn HTML receipt**
  standing in for a real photo/PDF. Replace with the real receipt viewer
  (zoom, rotate, page navigation, download).
- The mileage map in the mobile app is a real **Leaflet + OpenStreetMap** map
  with a hardcoded route (`mileage-map.html`). Replace the fixed polyline with
  the real routing provider; keep the visual treatment (desaturated tiles, white
  casing under a Tech Blue route line, hollow origin dot, filled destination pin).

---

## Design tokens

All values come from the Contina 3.0 design system (`_ds/.../tokens/`). Names
below are the CSS custom properties used in the prototypes.

### Colour

| Token | Hex | Use |
| --- | --- | --- |
| `--c-tech-blue` | `#052975` | Dominant brand colour: nav, headers, primary buttons, chart bars, headlines |
| `--c-innovation-blue` | `#8FF8FF` | Accent on dark: eyebrows, badges, key figures, active markers |
| `--c-light-blue` | `#DEF5FF` | Info surfaces, icon tiles, row highlight, selected rows |
| `--c-smart-green` | `#5F9E8D` | Success icons, approved/matched state |
| `--c-smart-green-30` | 30% Smart Green | Success chip background |
| `--c-light-yellow` | `#FFF7E3` | Warning chip background (pending, no receipt) |
| `--c-performance-purple` | `#983EAE` | **Error / rejected / over-limit** (replaces red across the system) |
| `--c-performance-purple-15/-50` | tints | Danger surface / danger border |
| `--c-slate-50/-100/-300/-500/-700` | greys | Page background, tracks, disabled, secondary text, body text |
| `--color-border` | `#dde3ee` | Hairline borders on all cards, tables and lists |
| `--color-text` | slate 700 | Body copy |
| `--color-neutral-fg` / `--color-warning-fg` / `--color-info-fg` / `--color-success-fg` | | Chip foregrounds |

Semantic override applied in both surfaces (put this in the theme layer):

```css
--color-danger:    var(--c-performance-purple);
--color-danger-bg: var(--c-performance-purple-15);
--color-danger-fg: #7a318d;
```

Two background colours only: white / `--c-slate-50` for light surfaces,
`--c-tech-blue` for dark. Exactly one card breaks this — the Monthly spend panel,
which is `--c-innovation-blue` with Tech Blue content.

### Typography

**Alliance No.2** throughout (`--font-sans`). Weights: 700 headlines, 600
subheads and labels, 400 body, 300 large display lockups.

| Role | Size / weight | Notes |
| --- | --- | --- |
| Portal page title | 15px / 700 | Tech Blue, in top bar |
| Portal card title | 15px / 700 | Tech Blue |
| Portal KPI figure | 28px / 700, `letter-spacing: -0.01em` | `tabular-nums` |
| Portal hero figure (queue tile) | 40px / 700, `-0.02em` | white on Tech Blue |
| Table header | 11px / 700, `letter-spacing: 0.1em`, uppercase | slate 500 |
| Table cell | 13px / 400–600 | amounts 700 + `tabular-nums` |
| Table sub-cell | 11px / 400 | slate 500 |
| Chip / badge | 10px / 700, `letter-spacing: 0.04em`, uppercase | |
| Eyebrow (dark) | 10–11px / 700, `letter-spacing: 0.12–0.18em`, uppercase | Innovation Blue |
| Mobile screen title | 16px / 600 | white on Tech Blue |
| Mobile section heading | 22–24px / 700 | Tech Blue |
| Mobile row title | 15px / 600 | |
| Mobile row meta | 12px / 400 | slate 500 |
| Mobile amount figure | 32–42px / 700, `-0.02em` | `tabular-nums` |
| Body / help text | 12–14px, `line-height: 1.5–1.6` | |

**Every** number that can change length uses `font-variant-numeric: tabular-nums`.

### Spacing, radii, shadow

- Spacing: 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 22 / 24 / 26 / 32 px.
- Radii: cards 16px (`--radius-lg`), large panels 20–26px, inputs and inner
  boxes 12px (`--radius-md`), small boxes 8–10px, buttons/chips/avatars
  `999px` (pill).
- Shadows (soft, blue-tinted — never neutral grey):
  - `--shadow-sm` on cards, `--shadow-md` on raised panels
  - card hover: `0 14px 34px rgba(5,41,117,0.12)` + `translateY(-2px)`
  - sticky action bar (mobile): `0 -8px 24px rgba(5,41,117,0.05)`
  - FAB: `0 12px 28px rgba(5,41,117,0.34)`
  - receipt paper: `0 18px 44px rgba(5,41,117,0.16)`
  - toast: `0 16px 40px rgba(5,41,117,0.28)`
- Borders 1px `--color-border`; 1.5px for secondary-button and input outlines.

### Motion

Calm, short, ease-out. No bounce or spring.

| Effect | Spec |
| --- | --- |
| Hover colour / background | 140–200ms |
| Card lift | 220ms, shadow + `translateY(-2px)` |
| Press | `scale(0.985)`, 120ms |
| Bottom sheet in | `riseIn` 280ms `cubic-bezier(0.16,1,0.3,1)` — `opacity 0→1`, `translateY(10px)→0` |
| Toast / bulk bar in | `riseIn` 220–240ms ease-out |
| Skeleton shimmer | `shimmer` 1.4s linear infinite, 400px-wide gradient sweep |

```css
@keyframes riseIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
```

### Iconography

Font Awesome **classic light** only (`fa-light`), plus Continia's own kit icons
(`fa-kit`) for solutions and modules. Kit: `https://kit.fontawesome.com/c11880975e.js`.

Used kit icons:
`fa-expense-management-solution-em-icon`,
`fa-mileage-feature-module-expense-management-em-car-icon`,
`fa-per-diem-feature-module-expense-management-em-briefcase-icon`,
`fa-credit-card-transactions-feature-module-expense-management-em-icon`.

Category → icon map (use everywhere a category appears):

| Category | Icon |
| --- | --- |
| Meals / representation | `fa-light fa-utensils` |
| Airfare | `fa-light fa-plane-up` |
| Accommodation | `fa-light fa-bed-front` |
| Rail | `fa-light fa-train` |
| Local transport | `fa-light fa-taxi` |
| Fuel | `fa-light fa-gas-pump` |
| Software | `fa-light fa-laptop-code` / `fa-laptop` |
| Office | `fa-light fa-paperclip` |
| Mileage | kit car icon |
| Per diem | kit briefcase icon |
| Card transactions | kit credit-card icon |

No emoji anywhere.

---

## Status system (shared by both surfaces)

Status is **always a chip with an icon and a word** — colour is never the only
signal.

| Status | Background | Foreground | Icon |
| --- | --- | --- | --- |
| DRAFT | `--c-slate-100` | `--color-neutral-fg` | `fa-pen-line` |
| PENDING | `--c-light-yellow` | `--color-warning-fg` | `fa-clock` |
| ON HOLD | `--c-light-blue` | `--color-info-fg` | `fa-circle-pause` |
| APPROVED | `--c-smart-green-30` | `--color-success-fg` | `fa-check` |
| REJECTED | `--color-danger-bg` | `--color-danger-fg` | `fa-xmark` |
| POSTED | `--c-tech-blue` | `#fff` | `fa-lock` |
| MATCHED (card) | `--c-smart-green-30` | `--color-success-fg` | `fa-link` |
| NO EXPENSE (card) | `--color-danger-bg` | `--color-danger-fg` | `fa-link-slash` |
| NO RECEIPT (card) | `--c-light-yellow` | `--color-warning-fg` | `fa-image-slash` |

Chip geometry: `10px/700`, `letter-spacing: 0.04em`, `padding: 5px 10px`,
`border-radius: 999px`, icon at 10px, `gap: 6px`.

## Banned patterns (project rule — enforce in review)

1. **No quarter-circle / arc decorations** in product UI. No
   `border-radius: 0 0 0 Npx` corner fills, no arcs protruding from cards, no
   circular overlays on tiles or panels. The quarter circle stays a marketing
   motif for imagery crops only.
2. **No rounded container with a coloured left-border accent bar**
   (`border-left: 3px solid <accent>` + tinted background). For a callout, use a
   plain white card with a 1px `--color-border` border, or a divided list inside
   one bordered container, and let a coloured icon carry the meaning.
3. **No 5th element watermark** in product UI.
4. Active navigation state is background tone + weight, **not** an inset accent
   bar.

---

# Mobile app

`Expense Mobile.dc.html` — iPhone frame, 390 × 844, iOS status bar and home
indicator supplied by `ios-frame.jsx`.

The file is a **prototype harness**: a left rail lists the screens, plus toggles
for layout variants and data states. The rail and the device frame are review
scaffolding — do not build them.

## State model

```
screen   login | home | history | scan | result | create | mileage | perdiem | report | detail | receipts
dash     "b" (summary-led, default) | "a" (list-led)     — Home layout variant
create   "wizard" (default) | "single"                   — New-expense variant
data     normal | loading | empty | error | offline       — Home data state
wiz      1..4                                             — wizard step
hist     all | reimbursed | posted | rejected             — History filter
pdMeals  { breakfast, lunch, dinner: bool }               — per-diem deductions
lastWeek bool                                             — Home group collapsed
fab      bool                                             — plus-menu sheet
sheet    bool                                             — category picker sheet
detail   pending | rejected                               — which detail variant
toast    string | null                                    — auto-clears after 2.6s
```

Two layout variants (`dash`, `create`) exist so stakeholders can compare; ship
one each. **Defaults are the recommendation: summary-led Home, step-by-step
create.**

## Screens

### 1. Login

Full-bleed **video hero** (looping brand cloud footage, muted, `object-fit:
cover`) with a navy gradient over it:
`linear-gradient(180deg, rgba(4,30,88,0.34) 0%, rgba(5,41,117,0.20) 34%, rgba(5,41,117,0.92) 100%)`.

Bottom-left block (`left/right: 26px; bottom: 58px`), in order:
- eyebrow `BUILT INSIDE YOUR BUSINESS CENTRAL` — 10px/700, `0.18em`, Innovation Blue
- Expense Management lockup — `assets/em-logo-hourglass-white.png`, width 84%
- line — 18px/`1.45`, `rgba(255,255,255,0.86)`, max 22ch:
  "Photograph the receipt. The rest is already filled in."

White sheet over the bottom (`margin-top: -26px`, radius `26px 26px 0 0`,
`padding: 26px 24px 40px`, shadow `0 -14px 40px rgba(2,12,40,0.24)`):
- avatar (42px, Light Blue, "MS") + "Welcome back, Mette" (17px/600 Tech Blue) +
  "Nordic Consulting A/S · mette.s@nordic.dk" (12px slate 500)
- primary: **Sign in with Face ID** — 54px pill, Tech Blue, `fa-face-viewfinder`
- two 50px secondary pills side by side: **Microsoft 365** (4-square logo drawn
  as a 2×2 grid of 7px cells: `#f25022 #7fba00 #00a4ef #ffb900`) and **Email**
- footer row: `fa-shield-check` Smart Green + "Single sign-on via your company
  tenant" + "Help" link

Any button → Home.

**Video playback (important):** the hero video source is fetched as a Blob and
assigned as an object URL, then `play()` is called imperatively once the source
lands (a late-assigned `src` never triggers the browser's autoplay algorithm).
In production, serve the video normally with `autoplay muted loop playsinline`
and a `poster`; keep the imperative `play()` fallback.

### 2. Home — "My expenses"

**Header** (Tech Blue, `padding: 58px 20px 0`, `position: relative; overflow:
hidden`): in the summary-led variant the same cloud video runs as the header
background with `linear-gradient(180deg, rgba(4,30,88,0.62), rgba(5,41,117,0.72))`
over it. All header content sits `position: relative` above it.

Top row: 38px Innovation Blue avatar ("MS"), company (12px, 65% white) + name
(16px/600 white), bell with a 8px Innovation Blue dot.

**Summary-led (default):**
- eyebrow `TO BE REIMBURSED`
- **4.488,00 DKK** — 40px/700, `-0.02em`
- three tap tiles (`rgba(255,255,255,0.10)`, radius 12px): **3** Pending, **2**
  Drafts, **1** Rejected. The rejected tile is `rgba(152,62,174,0.34)` with a
  `1px rgba(226,201,238,0.5)` border.
- below the header: two quick-action cards (Scan receipt, Mileage)

**List-led:** an Open / History pill switch in the header instead of the figure,
and a Light Blue "Awaiting approval 4.488,00 DKK · 3 expenses · oldest 3 days"
summary card at the top of the list.

**List:** date-grouped sections (`TODAY`, `LAST WEEK`) with 11px/700 uppercase
headers. **`LAST WEEK` is collapsible** — the whole header is the hit target
(min-height 44px), chevron flips `fa-chevron-up` / `-down`, and when collapsed
the header shows "3 expenses · 3.564,86 DKK".

Row (min-height 72px, `padding: 14px 16px`, hairline divider): 40px round icon
tile (Light Blue / danger-bg for rejected) · title 15px/600 with ellipsis ·
status chip + category meta · right column amount 15px/700 `tabular-nums` +
currency 11px, and for foreign currency a third line with the DKK value in
slate 300.

**FAB** — 58px Tech Blue circle, `bottom: 96px; right: 18px`. Opens the
**plus-menu bottom sheet**; the glyph toggles `fa-plus` → `fa-xmark`.

**Plus-menu sheet:** scrim `rgba(4,20,52,0.5)`, white sheet radius `24px 24px 0
0`, 38×4px grab handle, title "New" (19px/700 Tech Blue) + "Everything ends up
in the same approval flow.", then four 68px rows (42px Light Blue icon tile,
label 15px/600, meta 12px slate 500, chevron):

| Row | Meta | Destination |
| --- | --- | --- |
| Scan receipt | Photograph it and let OCR fill in the fields | Scan |
| Mileage | Kilometres at the 2026 state rate | Mileage |
| Per diem | Days abroad at the standard allowance | Per diem |
| Expense report | Group expenses that settle as one | Report |

Plus a 50px outlined **Cancel**. Scrim tap closes.

**Tab bar** — 5 columns, `padding: 10px 0 30px`, 48px min hit targets, icon 19px
+ 10px label; active Tech Blue/700, idle slate 500/600:
Home · History · Receipts · Mileage · Reports.

**Data states:** `loading` shows shimmer rows; `empty` shows a Light Blue circle
with `fa-check`, "You're all caught up", a Scan CTA and a "See history" link;
`error` and `offline` show a banner above the list.

### 3. History

Answers what was paid and when — separate from Home, which holds what is still
moving. Card-paid expenses are excluded (the employee never fronted the money).

- Header: title, **2026** year pill, search; eyebrow `REIMBURSED THIS YEAR`,
  **38.412,60 DKK** (36px/700), "42 settled expenses · last payout 31 July"
- Filter row (white, hairline bottom, horizontally scrollable): **All /
  Reimbursed / Posted / Rejected** — 8px×15px pills, active Tech Blue filled
- Month groups: header shows month name + the **sum of the currently visible
  rows** (must follow the filter — a rejected-only view may not show the paid
  total), then rows in the Home row pattern with REIMBURSED / POSTED / REJECTED
  chips
- Payout card: "PAID OUT TO YOU" with the three most recent salary-account
  payouts, and the note "Card-paid expenses are settled by the company and never
  appear here."
- Footer: "Expenses older than 24 months live in Business Central."

Rows open the detail screen. Groups with no visible rows are dropped entirely.

### 4. Scan receipt

Full-bleed camera view: dark backdrop, four corner brackets marking the detected
document edge (these are functional viewfinder marks, not the banned motif), a
Tech Blue hint pill ("Hold still — edges detected"), a 72px shutter, thumbnail of
the last capture, torch and close. Copy states that nothing is saved yet.

Failure variant: brackets go Performance Purple with "Move closer / more light"
and a manual-entry escape hatch.

### 5. Scan result

OCR proposes, the employee confirms. Read fields are tinted `--c-light-blue` so
machine-filled values are obvious, each with a `fa-wand-magic-sparkles` marker
and a confidence line. Amount is the hero figure (42px). Actions: **Looks right**
(primary) / **Edit fields**.

### 6. New expense — step-by-step (default)

Header: back chevron, step title, **Cancel**; four segment bars + "Step N of 4".

1. **Amount** — "We read 1.240,00 from your receipt." 40px figure over a 2px Tech
   Blue underline, currency selector, provenance line "Read from
   Scandic_kvittering.jpg", and a card-match box ("Firmakort ···· 4127 · nothing
   to reimburse — the company already paid")
2. **Category** — 2-column grid of 108px tiles; the suggested tile is filled Tech
   Blue with an Innovation Blue icon and a "Suggested" label
3. **Purpose** — focused text field (Tech Blue border + `--shadow-focus`), three
   suggestion chips, then Project and Department rows
4. **Ready to send** — Light Blue summary card with the amount, a bordered
   detail list (date, paid with, project, VAT, receipt) and the routing line
   "Goes to Lars Bruun, then to Anne Kjeldsen in finance."

Sticky bottom CTA: **Continue** → on step 4 **Submit for approval**, which
returns Home and flashes "Expense submitted to Lars Bruun". Back on step 1 exits.

**One-screen variant** (`create: "single"`): the same fields as one scrolling
form — hero amount on Tech Blue, then a single bordered list of rows, with VAT
shown in a "VAT is calculated for you" box (net / VAT 25% / total). Never an
input.

### 7. Mileage

- **Real map** at the top (232px): Leaflet + OSM tiles, `filter: saturate(0.62)
  brightness(1.04)`, route drawn twice (9px white casing at 85% under a 4.5px
  Tech Blue line), hollow 7px origin dot, 24px Tech Blue destination pin with an
  Innovation Blue centre. Overlays: a white distance pill (**43 km**, "Shortest
  route · 38 min") top-left and a 40px locate button top-right.
- Form rows: From, To, Vehicle ("Egen bil · AB 12 345"), Purpose, Project.
- Light Blue allowance card: `STATE RATE 2026` pill, **162,97 DKK** (32px),
  "43 km × 3,79 kr./km · low rate", and a note that the rate drops above
  20.000 km/year.
- Sticky CTA: **Submit 162,97 DKK**.

### 8. Per diem

Its own screen because per diem has no receipt and no merchant.

- Rows: Country ("Tyskland · Berlin"), Departure ("3 Aug 2026, 07:40"), Return
  ("6 Aug 2026, 07:15"), Purpose.
- Light Blue allowance card: `STATE RATE 2026`, **1.688,01 DKK**, caption
  "3 days × 562,67 kr./day · no deductions" — the caption is **derived**, and
  becomes "before −253,20 in meals" as soon as a deduction is on. Note:
  "Counted per 24 hours from departure. 71 hours gives 2 full days plus 23 hours."
- **Meals paid by someone else** — three toggle rows (46×28px switch, 22px knob):
  Breakfast **15%**, Lunch **30%**, Dinner **30%** of the daily rate. Toggling
  shows "Deducts 15% · −253,20" on the row and updates the "Deducted" footer.
- Summary card: allowance − meal deductions = **To be reimbursed**, plus
  "Tax free — no receipt required for per diem."
- Sticky CTA: **Submit <live total> DKK**.

Deduction maths: `daily 562.67 × 3 days × pct`. All three on ⇒ −1.181,61.

### 9. Expense report

A container that settles as one. Tech Blue header with report name, date range,
**4.238,00 DKK** total and a DRAFT chip. Expense rows, then a **Settlement** card
splitting company-card-paid from self-paid — the split is what the employee
actually cares about. Actions: Add expense / Submit report.

### 10. Expense detail

Two variants:

- **Pending** — amount, status chip, receipt thumbnail, field list, and an
  **approval timeline** (submitted → manager → controller → posted) with the
  current step highlighted. CTA: *Withdraw from approval*.
- **Rejected** — Performance Purple header treatment, the rejection reason quoted
  verbatim from the approver, and *Withdraw expense* / *Fix and resubmit*.

### 11. Receipt inbox

Receipts captured but not yet attached to an expense, as a 2-column grid of
paper thumbnails with date and detected merchant, plus a count header and a
"Match to card transaction" affordance.

---

# Desktop portal

`Expense Portal.dc.html` — 1440 × 984 inside a browser-chrome frame
(`browser-window.jsx`). The frame, the left rail and the density / data-state
toggles are review scaffolding — do not build them. The **density** toggle
(comfortable `padding-y: 15px` / compact `9px`) is a real product feature worth
keeping.

## Shell

- **Sidebar** 208px, Tech Blue. Expense Management lockup
  (`assets/em-logo-white.png`, height 46px) at the top. Nav items 38px tall,
  radius 10px, icon 17px + 13px label, label `nowrap` + ellipsis (the label must
  never wrap when the active weight makes it wider). Active = background
  `rgba(143,248,255,0.16)` + white 600 weight, **no accent bar**. Badge = a true
  20px circle, Innovation Blue on Tech Blue, 11px/700, `padding-top: 1px` for
  optical centring, `tabular-nums`.
  Items: Approvals **8** · Expenses · Mileage · Card transactions **3** ·
  Reporting · Setup.
- Below the nav: a compact **Built inside** box (radius 12px,
  `rgba(255,255,255,0.07)`, `1px rgba(143,248,255,0.18)`) — eyebrow with
  `fa-circle-check` and one nowrap line "**Contina A/S** · BC 26.1".
- Footer: 30px avatar "LB", name + role, and a sign-out icon button.
- **Top bar** 56px white: page title (15px/700 Tech Blue), divider, a 34px pill
  search field, date-range pill "Aug 2026", and a bell with a Performance Purple
  dot.

### Sign-in

Full-window **40% / 60%** grid.

- **Left 40%** — Tech Blue with the looping cloud video (`object-fit: cover`) and
  `linear-gradient(155deg, rgba(4,30,88,0.72) 0%, rgba(5,41,117,0.44) 46%,
  rgba(5,41,117,0.88) 100%)`. Padding `44px 40px`, three vertical zones: logo
  (76px `em-logo-white.png`) top; headline 32px/300 white, max 18ch, "Approvals,
  receipts and mileage in one place." plus three `fa-circle-check` proof lines
  (Innovation Blue icon, 14px `rgba(255,255,255,0.82)` text) in the middle;
  eyebrow `BUILT INSIDE YOUR BUSINESS CENTRAL` bottom.
- **Right 60%** — centred 424px column: `SIGN IN` eyebrow · "Welcome back"
  (30px/700 Tech Blue) · 16px sub over **two lines** ("Use the Microsoft account
  you sign in / to Business Central with.") · a 52px Tech Blue **Continue with
  Microsoft 365** button · an "or" divider · Work email and Password fields
  (46px, radius 12px, slate-50 fill, leading icon) · a checked "Keep me signed
  in" + "Forgot password?" · a 48px outlined **Sign in** · footer "Single sign-on
  via the Contina A/S tenant · ISO 27001".

Both buttons enter the app at the queue; sign-out returns here.

### 1. Approval queue

**Summary row** — 4 cards, `1.25fr 1fr 1fr 1fr`:
1. Tech Blue: `WAITING FOR YOU` · **8** + "expenses · 8 people" · "Oldest has
   waited **3 days**"
2. White: `VALUE IN QUEUE` · **14.704,77** · "DKK · incl. 2.180,95 VAT"
3. White with Performance Purple border: `POLICY FLAGS` · **2** of 8 ·
   "1 over limit · 1 no receipt"
4. White: `YOUR MEDIAN TIME` · **1,8 days** · Smart Green "↓ 0,6 vs. last month"

**Table card.** Header: "Awaiting your approval", segmented pills **Clean only /
Flagged / Everything** (these really filter), and on the right either Export +
"Select all clean", or — when rows are selected — a bulk bar that animates in:
"N selected · SUM DKK", **Approve selected**, Clear.

Columns: `40px 1.5fr 1.7fr 130px 100px 116px 130px 40px` =
checkbox · Employee (28px avatar + name + department) · Expense (title + date) ·
Category (icon + label) · Waiting · Amount (right, + VAT sub-line) · Check ·
chevron.

Details that matter: selected rows get a Light Blue background; the checkbox is
17px, radius 5px, Tech Blue when checked; ages over the SLA render 700-weight in
`--color-danger-fg`; a clean row shows a Smart Green `fa-circle-check` "CLEAN"
with no chip background, a flagged row a filled danger chip. Row click opens the
approval view; checkbox click must `stopPropagation`.

Footer line is derived from the active filter, e.g. "Showing 6 clean of 8 · 2
hidden by the clean only filter", plus "Then routed to **Henrik Dam**, controller".

States: `loading` = 6 shimmer rows in the same grid; `empty` = 88px Light Blue
`fa-inbox` circle, "Queue is clear", explanatory copy, and two CTAs.

### 2. Approval view

The core fix over the old portal: **receipt and data side by side at full
height**, `1fr 468px`.

Sub-bar: back-to-queue pill, "Item **1 of 8**", up/down steppers, and a
`PENDING YOUR APPROVAL` chip on the right.

**Left — receipt pane** (`#eef2f8`): a toolbar with an `OCR MATCHED 98%` Smart
Green chip, the line "Total, date and VAT read from the receipt", and 28px
zoom-out / zoom-in / rotate / download buttons. The receipt sits centred, 460px
wide, white, `padding: 44px 34px 34px`, shadow `0 18px 44px rgba(5,41,117,0.16)`,
with dashed `#c9d2e2` rules between sections; the total line is highlighted
`rgba(143,248,255,0.42)` at 20px/700. Bottom bar: "Photographed in the app 5 Aug
at 20:47 · matched to card transaction **Eurocard 4417** automatically".

**Right — data pane** (white, scrolls, sticky action footer):
- submitter row (38px avatar, name, "Sales · Aarhus · submitted 5 Aug 20:48")
- title "Client dinner, Kähler" (22px/700 Tech Blue)
- **2.850,00 DKK** (32px/700) with VAT / Net to the right
- field grid `116px 1fr`: Date, Category, Payment, Attendees, Purpose, Project,
  Dimension
- **Policy check** — one bordered container with hairline-divided rows (never
  accent bars). Each row: coloured icon + a sentence in plain language, e.g.
  "**Over the meal limit.** 712,50 DKK per head against a 500 DKK cap for client
  dining."; "**Attendees documented.** …"; "**Only 25% VAT deductible** on
  representation. BC will post 142,50 DKK to input VAT…"
- **Approval chain** — 24px dot + connector timeline: submitted (Smart Green
  check) → *Lars Bruun · manager* (Light Yellow clock, ring
  `0 0 0 4px rgba(255,247,227,0.9)`, "You. Waiting 3 days · SLA is 2 days") →
  Henrik Dam · controller (grey) → Posted in Business Central (grey lock)
- footer: a note field, then **Approve** (flex, 42px, Tech Blue) / **Hold**
  (outlined) / **Reject** (outlined Performance Purple), and the line "Rejecting
  asks for a reason — it is sent to Mette and stored on the entry."

Each action returns to the queue with a toast: e.g. "Approved · 2.850,00 DKK sent
to Henrik Dam, controller".

### 3. All expenses

Controller's working list. Filter row: status pills with counts (All 248, Draft
14, Pending 31, On hold 6, Approved 22, Rejected 4, Posted 171) plus Employee and
Category dropdown pills.

Columns `118px 1.6fr 1.3fr 118px 120px 128px 118px`: Date · Expense (title +
sub-line) · Employee (avatar + name) · Category · Status chip · Amount (right,
with the **foreign amount and rate under the DKK figure**, e.g. "139,00 EUR ·
7,4604") · Entry (the BC G/L number, or an em dash when not yet posted).

Footer: "1–11 of 248", Prev/Next, and a right-aligned **Filtered total
486.320,45 DKK**.

### 4. Mileage

KPI row: Km logged YTD **74.280** · Reimbursed YTD **264.880** · On the high rate
**1** · Awaiting approval **2**.

Full-width entries table, columns `76px 178px 1fr 78px 74px 116px 118px`:
Date · Driver · Route & purpose (`fa-route` + route, purpose indented 19px
below) · Km · Rate (700-weight Tech Blue when the high rate applied) · Amount ·
Status chip. Header has "Show on map" and Export. Footer: "7 entries this month ·
886 km" + **3.214,42 DKK**.

Below, two equal columns:
- **Toward the 20.000 km rate** — per-driver progress bars (7px track) with a
  state tag: `HIGH RATE` (filled Tech Blue tag, Performance Purple bar),
  `1.760 KM LEFT` (Light Yellow tag, amber bar), `LOW RATE` (grey tag, Tech Blue
  bar). Explains that above 20.000 km the rate drops 3,79 → 2,23.
- **How distances are set** — one bordered container, three divided rows: address
  to address, home commute deducted, overrides flagged (danger icon).

### 5. Card transactions

Reconciliation from the bank feed rather than the employee.

Cards: Tech Blue **92%** matched ("136 of 148", with a 6px progress bar) ·
**3** No expense yet (Performance Purple border + text) · **1** Missing receipt ·
**16.359** value on cards.

Filters: **Needs action / Matched / All** with counts. Header actions: **Remind
cardholders** (primary, flashes a toast naming the three cardholders) and Import
feed.

Columns `88px 1.3fr 1.2fr 1.4fr 124px 128px`: Date · Merchant (category icon) ·
Card (holder + masked number) · Matched expense (the expense title + its
EM-number and state; danger-coloured when there is none) · Amount (+ FX/VAT
sub-line) · Reconciliation chip. Rows needing action get a
`rgba(247,239,250,0.5)` tint and **sort first**.

Footer: "Showing N of 148 imported this month · unmatched sorts first" and "Feed
imported 07-08-2026 06:00 · Eurocard, 24 cards".

### 6. Reporting

Four KPI cards: Spend YTD **486.320** · Auto-matched receipts **92%** ·
Submission to posting **4,1 d** · Policy breaches **7**.

Then `1.15fr 1fr`:

- **Spend by category** — 7 rows, each an icon + label + amount + percentage over
  a 7px Tech Blue bar in a slate-100 track.
- **Monthly spend** — the one Innovation Blue card in the system, with Tech Blue
  content. Eight months as **35px-wide, 2px-radius Tech Blue bars** (max height
  82px), each with its value above (11px `tabular-nums`) and month below (10px);
  the current month at full opacity, earlier months at 0.42 (bars) / 0.6–0.62
  (text). A `--c-tech-blue-20` hairline baseline sits behind the labels.
- **Where time goes** — four stages as **3px** pill bars in a 3px slate-100
  track, `gap: 16px`, label column 118px, value column 62px right-aligned.
  Bars over 1,7 days are Performance Purple, the rest Tech Blue. Values: 1,8 /
  1,6 / 0,7 / 2,4 days. The caption must match the data: "Submission to posting
  averages **4,1 days**. The wait before and during manager approval accounts for
  **3,4 of them** — the controller step is the fastest."

Bottom: **By department** table (Department · Entries · YTD · Vs. budget ·
Share bar). Positive variance renders in `--color-danger-fg`, negative in Smart
Green. Header actions: Export to Excel, Schedule monthly.

### 7. Setup

Left column:
- **Approval flow** — four reorderable step cards (26px numbered Tech Blue
  circle, title, meta, an SLA pill, drag handle): Employee submits · Line manager
  approves (2 days, skipped under 500 DKK) · Controller checks (3 days) · Post to
  Business Central (nightly). Plus a dashed **Add step** button.
- **Policy rules** — one bordered container of divided rows: icon, title, meta,
  an action tag (**BLOCK** / **FLAG** danger-tinted, **WARN** yellow) and a
  34×20px toggle. Rules: meal cap 500 DKK per attendee, receipt required over
  100 DKK, attendees on representation, late submission over 30 days, duplicate
  detection (off).

Right column:
- **Business Central** — company, journal template EXPENSE, version BC 26.1
  on-prem, and a Smart Green "Last sync 2 min ago".
- **Mileage rates 2026** — low **3,79** (first 20.000 km), high **2,23**, and a
  Light Blue note that rates follow the Danish tax agency and update each
  January.
- **Categories** — pill chips with icons plus a dashed **New** chip.

### Toast

Bottom-centre, `--c-ink` background, white text, 999px radius,
`padding: 12px 22px`, Innovation Blue `fa-circle-check`, `riseIn` 240ms,
auto-dismiss 2.6s.

---

## Data used in the prototypes

Realistic Danish data — reuse it for fixtures so screens stay comparable.

People: Mette Holm (Sales · Aarhus), Jonas Vestergaard (Consulting), Anne Sofie
Kruse (Marketing), Rasmus Lind (Service), Camilla Berg (Service), Mikkel
Overgaard (Product), Signe Dalgaard (Sales · København), Peter Winther
(Consulting). Approver **Lars Bruun** (manager), controller **Henrik Dam**,
finance **Anne Kjeldsen**. Company **Contina A/S** on BC 26.1. Mobile employee
**Mette Sørensen**, Nordic Consulting A/S.

Formatting: Danish — `1.234,56`, `DKK`, dates `06-08-2026` or "6 Aug". Rates:
mileage 3,79 / 2,23 kr./km, per diem 562,67 kr./day, VAT 25% (representation
only 25% deductible), EUR rate 7,4604.

## Accessibility

- Colour is never the only signal — every state pairs colour with an icon and a
  word.
- Mobile hit targets ≥ 44px (rows 60–72px, tab items 48px, sheet rows 68px).
- `--shadow-focus` (Innovation Blue ring) is the focus treatment; keep visible
  focus on every interactive element when rebuilding.
- Respect `prefers-reduced-motion`: freeze the shimmer, the `riseIn` entrances
  and the background videos (show the poster frame).

## Assets

In `assets/`:

| File | Use |
| --- | --- |
| `em-logo-white.png` (939×279) | Stacked Continia Expense Management lockup, white — portal sidebar and sign-in |
| `em-logo-wide-white.png` (1644×99) | Wide "continia Expense Management" lockup, white |
| `em-logo-hourglass-white.png` (1158×99) | "Expense Management" with the hourglass mark, no wordmark — mobile login |
| `brand-clouds.mp4` (1920×1080, 21.4s) | Brand cloud footage — mobile login hero, mobile summary header, portal sign-in |
| `brand-clouds.webm` | Same footage, WebM. **Note:** did not decode in Chromium during testing; the prototypes use the mp4. Re-encode or drop it. |

Fonts and icons: Alliance No.2 from the design system; Font Awesome Pro kit
`c11880975e` (light + `fa-kit`). Map tiles: OpenStreetMap (attribution required)
via Leaflet 1.9.4.

The `image-slot.js` placeholders are a prototype-only convenience for dropping
images during review — not part of the product.

## Files in this bundle

| File | What it is |
| --- | --- |
| `Expense Mobile.dc.html` | Mobile app prototype — all 11 screens, variants and states |
| `Expense Portal.dc.html` | Desktop portal prototype — sign-in + 7 screens |
| `Expense Design System.dc.html` | The extended expense design system: colour, type, status chips, table, money, receipt card, approval timeline, empty states |
| `mileage-map.html` | Leaflet/OSM map used by the mobile mileage screen |
| `ios-frame.jsx` | iPhone frame used to present the mobile screens (scaffolding) |
| `browser-window.jsx` | Browser chrome used to present the portal (scaffolding) |
| `image-slot.js` | Drag-and-drop image placeholder (scaffolding) |
| `support.js` | Prototype runtime — **do not port** |
| `PROJECT_RULES.md` | The project's banned-pattern rules — enforce these in review |
| `assets/` | Logos and the brand video |
| `_ds/` | The Contina 3.0 design-system tokens, stylesheet and component bundle the prototypes load |

To view a prototype, open the `.dc.html` file in a browser (serve the folder over
HTTP so the video and map load).
