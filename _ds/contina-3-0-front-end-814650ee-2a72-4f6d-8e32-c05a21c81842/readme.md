# Continia Design System

A design system for **Continia** — a B2B SaaS company building practical, reliable,
easy-to-use financial automation solutions for **Microsoft Dynamics 365 Business
Central**. Continia automates and digitalizes finance-department workflows
(document capture, expense management, payment management, e-documents, etc.),
delivered to the international market through a network of local partners.

> **Payoff:** *It's about time.*
> Continia gets time to work for you — "you can count on us," "we dig in," "we work smart."

This system is the foundation for generating well-branded Continia **frontend**
surfaces — web pages, apps, and product UI — for production or throwaway
prototypes. It does not cover slides, decks, or print.

---

## Source material

Everything here was derived from material supplied by the brand team. Stored in
`uploads/` (kept in case the reader has access):

- **`uploads/Continia_BrandGuide_2.0.pdf`** — the official 74-page Continia Brand
  Guidelines 2.0. The authoritative source for logo, colors, type, graphics,
  icons, photography, and tone. Key page renders captured to `scraps/`.
- **`uploads/Continia primary_Tech blue.svg`** / **`_White.svg`** — primary logo
  lockups (logomark + "continia" wordmark).
- **`uploads/AllianceNo2.zip`** — the Alliance No.2 webfont package (Light,
  Regular, SemiBold, Bold + Regular/Bold italics). Extracted to `assets/fonts/`.

No codebase or Figma file was supplied. The live products run **inside Microsoft
Dynamics 365 Business Central**; the marketing surface lives at **continia.com**.
The UI kit here is a faithful brand-driven recreation of a Continia marketing
surface, not a copy of proprietary Business Central UI.

---

## Content fundamentals

How Continia writes. Source: brand story + core values in the guide.

- **Voice:** confident, helpful, clear, practical, professional, and human.
  Not overly playful, not corporate-stiff. The throughline is *reliability*:
  "you can count on us."
- **Person:** speaks as **"we"** (Continia / "Continians") and addresses the
  reader as **"you."** Warm and direct — "We get time to work for you,"
  "that's our promise to you."
- **Core value phrasing** is short, declarative, "we"-led: *We dig in. We work
  smart. We deliver what we promise in due time. Count on Continia.*
- **The time motif is everywhere.** Time and data are framed as "the two most
  valuable commodities." Headlines lean on it: *It's about time. You can't buy
  back time — don't waste it, spend it wisely.*
- **Casing:** Sentence case for headlines and body. **Spaced ALL-CAPS** is a
  deliberate brand device for eyebrows/section labels and the logo's letterforms
  (`C O N T I N I A`) — wide letter-tracking (`--ls-overline`). Buttons in
  marketing UI elements use compact ALL-CAPS ("SEE MORE").
- **Numbers & proof:** concrete, confident stats stated plainly —
  *30+ years of experience · 1,500+ partners worldwide · 26,000 active licenses ·
  eliminate manual tasks by up to 90%.* Use real figures; never invent filler.
- **No emoji.** The brand uses Font-Awesome-style line icons and checkmarks
  instead of emoji. Tone stays professional.
- **Product framing:** solutions are "BUILT INSIDE your Business Central" —
  emphasize that users keep the interface they already know; setup is quick.

---

## Visual foundations

### Color
- **Tech Blue `#052975`** is the dominant brand color — backgrounds, headlines,
  logo, primary buttons. Deep, trustworthy navy.
- **Innovation Blue `#8FF8FF`** is the secondary — a bright cyan used for accents,
  highlights, key numbers on dark, and the lower stop of the brand gradient.
- **Light Blue `#DEF5FF`** is the primary *functional* color — soft section
  backgrounds, surface tints, info states.
- **Accents, used sparingly:** Smart Green `#5F9E8D`, Light Yellow `#FFF7E3`,
  Performance Purple `#983EAE`. Mainly for web/product differentiation, not
  general decoration. (The brand chart literally sizes each swatch by recommended
  use ratio — Tech Blue largest.)
- **Signature gradient:** Tech Blue → Innovation Blue (135°). **Decoration only** —
  large hero/section panels and accents. **Never** behind an icon tile, button or
  box/card; those always use a solid primary color. Subtle, never rainbow.
- Backgrounds are either **white / very light blue** (positive) or **deep Tech
  Blue** (negative). High contrast between the two is a defining trait.

### Typography
- **Alliance No.2** throughout — a modern, techy geometric sans with small quirky
  curves. Bold (700) headlines, SemiBold (600) subheadlines (stands in for the
  spec's "Medium" — no Medium master was supplied), Regular (400) body, Light
  (300) for large display lockups.
- Headlines and body are **sentence case**; eyebrows are **wide-tracked caps**.
- Generous line-height on body (1.6); tight on big display.

### Layout, shape & depth
- **One canonical content width — hard rule.** Every page section wrapper is
  `max-width: var(--layout-content-max)` (1360px) +
  `padding-inline: var(--layout-page-pad)` (28px). Never mix widths across
  pages/tabs — 1200 vs 1360 caused a visible jump when switching pages
  (pricing session 2026). `--container-max`/`--container-wide` now alias it.
- **Generous whitespace.** Clean, uncluttered, lots of breathing room.
- **Rounded UI-style elements** — pill buttons, rounded cards (12–24px radii),
  large rounded "pop-up window" panels.
- **Corner radii:** cards `--radius-lg`(16) / `--radius-xl`(24); buttons & chips
  are pills (`--radius-pill`); inputs `--radius-md`(12).
- **Cards:** white surface, soft blue-tinted shadow (`--shadow-md`), hairline
  border `#dde3ee`, no harsh lines. On dark, cards become translucent navy.
- **Shadows** are soft and blue-tinted (`rgba(5,41,117,…)`), never neutral grey
  or harsh. Pop-up windows use a deeper `--shadow-popup`.
- **Borders** are thin (1–1.5px), light blue-grey.

### Brand graphics (motifs)
- **Quarter circle** — derived from the logomark and the dots over the "i"s.
  A single large rounded corner. Four quarters combine into a **full circle**.
  Used as playful overlays on imagery and panels.
- **5th element** — a large line-art composition of quarter-circle arcs + a grid,
  rooted in the payoff "It's about time" and the secondary logo. Sits as a subtle
  tonal watermark (slightly lighter navy) on Tech Blue backgrounds. Variants:
  single / in-line / stacked.
- **UI elements** — branded "pop-up window" panels with a Tech Blue title bar
  showing the logomark + "continia", used to frame Business Central screenshots,
  videos, and images. Paired with caps **buttons** ("SEE MORE") and a **mouse
  cursor + click** motif to signal interactivity.

### Motion & states
- Calm, confident motion — short durations (120–360ms), standard/`ease-out`
  easing. **Fades and gentle rises**, never bouncy or springy.
- **Hover:** primary buttons darken (`--color-primary-hover`); cards lift with a
  slightly larger shadow + small translateY; links gain underline/innovation-blue.
- **Press:** subtle scale-down (~0.98) and/or deeper color.
- **Focus:** Innovation-blue focus ring (`--shadow-focus`).

### Photography
- Warm, human, welcoming — centered on **real Continia employees**, office
  environments, partners, and customer scenarios; or feature/action shots inside
  the solutions.
- Polished **Continia LUT** color treatment (indoor & outdoor variants) — slightly
  warm, natural, cohesive.
- **Remove third-party logos** from imagery. Often paired with a quarter-circle
  overlay carrying a headline + big stat.

---

## Iconography

- **System:** Font Awesome **classic, light** is Continia's icon system — thin
  single-weight line icons. This is the brand spec, now wired to the team's own
  **Font Awesome Pro kit**. Only the classic light style is used. Specific icons
  map to recurring concepts (download, security, expense, invoice, email, import,
  release, certification, technical support).
- **Loading:** the Pro kit is loaded via script in every component card and the
  UI kit:
  `<script src="https://kit.fontawesome.com/c11880975e.js" crossorigin="anonymous"></script>`
  → `<i class="fa-light fa-download"></i>`.
- Only the **classic light** family/weight is used for UI icons. The one exception
  is real social-media logos in the website footer, which use brand icons
  (`fa-brands fa-linkedin-in`, `fa-youtube`, `fa-x-twitter`) — these have no light
  equivalent.
- Icons are colored only with the approved palette (Tech Blue / Innovation Blue /
  Light Blue / White) via `color:` on the `<i>`.
- **Checkmarks** (`fa-light fa-check` / `fa-circle-check`) are the brand's bullet
  glyph for feature lists.
- **No emoji**, no multicolor icon sets, no solid/regular/duotone styles.

### Continia custom icons (solutions & modules)

The Pro kit (`c11880975e`) carries Continia's **own uploaded icons** for the
solutions and feature/finance modules. They render in the same light-line style
and are referenced with the **`fa-kit`** prefix (not `fa-light`):
`<i class="fa-kit fa-document-capture-solution-dc-icon"></i>`. Always prefer these
over generic FA icons when representing a Continia solution or module.

- **Solutions:** `fa-document-capture-solution-dc-icon`,
  `fa-banking-solution-cb-icon`, `fa-finance-solution-cf-add-modules--stack-icon`,
  `fa-expense-management-solution-em-icon`,
  `fa-document-output-solution-do-icon-file-export`.
- **Expense-Management modules:**
  `fa-credit-card-transactions-feature-module-expense-management-em-icon`,
  `fa-mileage-feature-module-expense-management-em-car-icon`,
  `fa-per-diem-feature-module-expense-management-em-briefcase-icon`.
- **Banking modules:** `fa-direct-communication-feature-module-banking-cb-icon`,
  `fa-security-feature-module-banking-cb-icon`.
- **Document-Capture / Output modules:**
  `fa-purchase-contracts-feature-module-document-capture-dc-overview-contract-icon`,
  `fa-security-feature-module-document-output-do-icon`.
- **Finance modules & misc:** `fa-general-ledger`, `fa-treasury`, `fa-factoring`,
  `fa-installments`, `fa-extended-fixed-assets`, `fa-multi-level-payment-discount`,
  `fa-l-open-entries`, `fa-file-storage`, `fa-printing`, `fa-iban-magnifying-glass`,
  `fa-associations`, `fa-associations-feature-module-finance-cf-link-icon`.
- **Motif / utility:** `fa-mouse-cursor` (the brand cursor motif),
  `fa-handshake-light`, `fa-release-continia-rocket-launch`, `fa-thief`, `fa-cancel`.

See the **Icons** group in the Design System tab (`guidelines/icons-solutions.html`,
`guidelines/icons-modules.html`) for the full rendered set.

**Optical-size gotcha:** the custom kit icons are not optically normalized —
`fa-document-capture-solution-dc-icon` renders ~18% smaller than the other
solution icons at the same font-size. Give it `transform: scale(1.18)` (or +18%
font-size) when it sits in a row with sibling icons. Per-icon corrections are
recorded as `opticalScale` in `components/navigation/links.js`.

---

## Field-tested web patterns (frontpage redesign, July 2026)

Patterns proven while building the continia.com frontpage refresh. Reuse these
before inventing new ones. Visual index: `guidelines/patterns-frontpage.html`
(Inspiration group in the Design System tab).

- **"Living BC mockup" hero** — the strongest hero element: a `PopupWindow`
  framing a fake Business Central list page with an animated document flow.
  A ~200px BC-style sidebar (solution nav using the `fa-kit` solution icons)
  makes it read instantly as BC; 5 document rows cascade through
  Imported → Recognized → For approval → Posted (`StatusChip`s + a stage bar
  above), footer line "N of 5 posted automatically · 0 manual touches".
  ~730ms per tick reads well. Demonstrates the product promise without a
  screenshot — a reusable marketing motif.
- **Bento solutions grid** — 3-col grid with one 2-col-wide card, each card
  containing a *mini live UI* (table rows, progress bar, module chips) rather
  than an illustration. Mostly white cards + one Tech Blue + one Light Blue
  card gives rhythm without breaking the 2-background rule.
- **Impact rows** — giant count-up numbers (clamp 64–110px, `tabular-nums`,
  `min-width` on the number column to prevent layout shift while counting)
  with hairline `#dde3ee` dividers — reads more Continia than boxed stat cards.
- **Logo marquee** on Tech Blue — 38s linear loop, duplicated list, edge fade
  via `mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%,
  transparent)`.
- **Sticky header** — white at 94% opacity + `backdrop-filter: blur(14px)`,
  shadow `0 8px 24px rgba(5,41,117,0.10)` only after `scrollY > 10`.
- **Motion recipe** (matches "calm, confident"):
  - Scroll reveals: `opacity 0→1` + `translateY(28px)→0`, 650ms
    `cubic-bezier(0.16,1,0.3,1)`, IntersectionObserver threshold 0.12, only on
    elements below the fold at load.
  - Stat count-up: 1600ms, ease-out cubic, triggered once at ~0.2 visibility.
  - Card hover: `translateY(-4px)` + shadow `0 2px 8px → 0 18px 48px
    rgba(5,41,117,0.14)`, 250ms.
  - Always expose a `motion` boolean prop that freezes flows, reveals, marquee
    and count-ups to their end state (accessibility + screenshots).
- **Copy** — a two-line time-motif headline tested best: *"You can't buy back
  time. / But you can automate it."* Keep the H1 to exactly 2 lines (`<br>`,
  clamp ~38–68px). ~~Hero badge: white pill~~ — **superseded** (Why Continia
  session): no pill badge above the H1; a plain wide-tracked caps eyebrow only.
  Proof points as an inline checkmark row (`fa-light fa-circle-check` in Smart
  Green) under the hero CTAs rather than a stat band.

Gotchas:

- `image-slot` filling a fixed-height card media area needs `fit="cover"`
  **and** `display:block; width:100%; height:100%` on the element itself, or it
  won't fill its wrapper.
- The **5th element** works best huge and cropped on tall gradient sections
  (final CTA). **Never in the header/hero**, and max **one instance per page**
  — e.g. peeking from the bottom-right corner of a dark section. As a small
  corner watermark (~10% opacity) in footers it adds noise without payoff —
  skip it there.
- Footer: standard lockup + legal row — no giant full-width wordmark.

### From the pricing redesign (July 2026)

- **Never re-implement the site chrome.** Use `SiteHeader` / `SiteFooter` from
  the bundle (`components/navigation/`) on every page — copy-pasted nav/footers
  drifted apart (active state, grouping, logo size). Pass `activeItem` for the
  current page.
- **Active nav state** (the official "current page" marking, built into
  SiteHeader): `color: var(--c-tech-blue); box-shadow: inset 0 -2px 0
  var(--c-innovation-blue); padding-bottom: 3px`.
- **Canonical link map:** official continia.com URLs (nav, solutions, company,
  resources, legal, social, docs/learn/partnerzone subdomains) live in
  `components/navigation/links.js` as `CONTINIA_LINKS` (also exported from the
  bundle). Edit there; never hand-retype URLs per page.
- **Footer anatomy (spec):** brand column (white logo + tagline + social icons)
  · Solutions · Continia Software · Resources · legal bar with ©-line, policy
  links and ISO 27001 + BUILT INSIDE badges. Implemented by `SiteFooter`.
- **Logo** bakes in `overflow: visible; display: block` — the SVG previously
  clipped the "i"-dots in tight containers.

### From the Why Continia redesign (July 2026)

- **Hero:** dark Tech Blue **gradient** hero preferred over light variants.
  Above the H1: plain wide-tracked caps eyebrow — **no pill badge** (this
  supersedes the frontpage badge recipe).
- **Glow on key numbers (dark surfaces):** Innovation Blue at 50% opacity,
  tight radius — `text-shadow: 0 0 18px rgba(143,248,255,0.5)`. Subtle, never
  neon.
- **Trust bar (canonical copy):** "TRUSTED BY **21,000+** CUSTOMERS WORLDWIDE"
  in wide-tracked caps; the number bold, Innovation Blue, with the 50% glow.
  Reuse the frontpage trust-bar structure — don't redesign per page.
- **Section H2s:** one line where possible ("Why finance teams choose
  Continia") — avoid forced `<br>` breaks.
- **Copy tone:** don't restate brand values verbatim in body copy
  ("Practical, reliable…"); lead with the user benefit ("Easy to use — that's
  the promise.").
- **Testimonial carousel (canonical pattern):** centered caps eyebrow + "Hear
  from our partners" H2; white card (max ~840px) with 1px `#dde3ee` border,
  24px radius, soft blue shadow, **Light Blue quarter-circle in the top-right
  corner**; initials avatar; arrows + pill dots below; auto-advance ~6.5s,
  pause on hover.
- **PopupWindow mockups on dark sections:** 1px **Innovation Blue** stroke on
  the window; generous height and a wide content column so vendor/data lists
  read as real UI.
- **Motion:** looping attention animations (proof boxes cycling in/out from
  the bottom) are OK on hero-level content — but everything respects
  `prefers-reduced-motion` and the `motion` prop.

### From the Solutions redesign (July 2026)

- **Solutions layout-switcher:** three layouts (Bento / Classic grid / By
  workflow) behind pill buttons in ONE section beats three separate pages.
  Bento with mini live-UI (table rows, chips, progress) is the strongest.
- **Final-CTA gradient (de-facto standard):** Tech Blue → Light Blue →
  Innovation Blue gradient with the 5th element centered at ~8% opacity —
  reused from Pricing; use for end-of-page CTAs (this is the page's one
  5th-element instance).
- **FAQ ("Good to know" style):** individual white cards with rounded corners
  and soft shadows — NOT one merged accordion list. Blue border on the active
  card. At 10+ questions: show 6 + a "Show all N questions" button.
- **Nav layout (canonical, built into SiteHeader):** 3-zone grid — logo left,
  links absolutely centered, actions right. Use on all marketing pages.
- **Logo sizing gotcha — superseded:** never force a fixed **width** on the
  Logo mount (`width: 204px` clipped it). Give only `height` — the SVG computes
  its own width from the viewBox. `overflow: visible; display: block` is baked
  into the component; keep `overflow: visible` on tight wrappers too.
- **Mock-table text overflow:** document names in BC mockups (hero flow, bento
  cards) need `max-width` + `text-overflow: ellipsis; white-space: nowrap` or
  they collide with the amount column.

### From the frontpage nav/footer pass (July 2026)

- **One chrome across the site:** nav + footer are copied 1:1 between pages
  (same layout, links, URLs) so every page feels like one site — that chrome IS
  `SiteHeader`/`SiteFooter`; never fork it per page.
- **Active underline = "you are here":** the inset Innovation Blue underline
  marks ONLY the current page. Never copy it along when reusing the nav — set
  `activeItem` per page.
- **Responsive header:** below 980px hide nav links + "Find a partner", but
  logo (left) and CTA (right) stay put via `space-between` — never a lonely
  centered logo. Built into SiteHeader.
- **Link conventions:** same-page sections use `#anchors` (e.g. `#solutions` on
  the frontpage); everything else points at real continia.com URLs from
  `CONTINIA_LINKS`. The "Get a free trial" CTA goes to **Microsoft AppSource**
  (`CONTINIA_LINKS.trial` — SiteHeader's default).
- **Hover recipe:** nav links dark navy → Tech Blue; footer links on dark
  white/72–78% → Innovation Blue. Always `transition: color 200ms`.

### From the Use Cases redesign (July 2026)

- **Hero with photo + floating stat boxes (strongest hero for photo pages):**
  image-library photo right of copy, framed `border: 3px solid var(--c-tech-blue);
  border-radius: 15px; overflow: hidden`, with three floating cards overlapping
  the photo edges (absolute, negative offsets like `left: -24px` /
  `right: -110px`). Stat card: Tech Blue bg, Innovation Blue number with the
  50% glow, `tabular-nums`. Other cards: white, 1px `#dde3ee`, radius-lg, soft
  blue shadow.
- **No motif overlays on photos:** a quarter-circle corner holding a stat read
  worse than a plain floating Tech Blue card matching the other boxes — prefer
  consistent card language.
- **Shadows on dark surfaces:** deep shadows (0.45+ alpha) are far too loud on
  the Tech Blue gradient. Recipe: two-layer at ~0.12–0.14 alpha — cards
  `0 22px 48px rgba(2,12,40,0.12), 0 6px 16px rgba(2,12,40,0.07)`; photo
  `0 30px 70px rgba(2,12,40,0.14), 0 10px 26px rgba(2,12,40,0.08)`.
- **Hero animation recipe (calm, layered):** photo scale-in 1.06→1 over 1.3s;
  cards rise staggered (0.15/0.35/0.55s, 650ms `cubic-bezier(0.16,1,0.3,1)`);
  then infinite gentle float (`translateY(-9px)`, 6.5–8s, offset delays so
  boxes drift out of phase); count-ups 1600ms ease-out cubic; chips may cycle
  content every ~3.8s with a 320ms opacity fade. All gated on
  `prefers-reduced-motion`. Run count-ups/timers from `componentDidMount`
  (rAF/`setInterval`) and clear them in `componentWillUnmount`.
- **Scope global link resets — hard rule:** a bare `a:hover { color: … }` body
  reset recolors the text inside bundle components (Button renders
  `<a class=…>` — text vanished on dark hover). Always write helmet/page link
  rules as `a:not([class])` / `a:not([class]):hover`.
- **Hero A/B toggle (review trick):** a fixed pill button bottom-left toggling
  `state.hero` ("new"/"classic") lets stakeholders compare heroes live in one
  file. Remove before handoff.
- **Use-case library pattern:** 20+ links become a filterable library: sticky
  toolbar under the hero (`position: sticky; top: 64px`, 94% white +
  `blur(14px)`, border-bottom `#e6ebf5`) with solution filter pills (counts;
  active = Tech Blue bg/white text, idle = white + `#dde3ee` border) + live
  search; featured "BUILT INSIDE" card on top; cards with `fa-light` icon tile,
  solution label, title, one-line benefit, arrow link. Grid
  `repeat(auto-fill, minmax(320px, 1fr))`, gap 24px. Filters + search combine;
  empty state offers a clear-all Button.
- **Console note:** "ResizeObserver loop completed with undelivered
  notifications" on load is benign browser noise, not a defect.

---

## Index / manifest

Root:
- **`styles.css`** — single entry point; `@import`s all token files. Consumers link this.
- **`readme.md`** — this guide.
- **`SKILL.md`** — Agent-Skills-compatible front matter for use in Claude Code.

`tokens/` — CSS custom properties (all reachable from `styles.css`):
- `fonts.css` — Alliance No.2 `@font-face` rules.
- `colors.css` — palette, tints, gradients, semantic aliases.
- `typography.css` — font stack, weights, fluid type scale, tracking.
- `spacing.css` — spacing scale, radii, shadows, motion, layout widths.

`assets/`
- `fonts/` — Alliance No.2 TTFs.
- `logos/` — primary lockups (Tech Blue + White) and standalone logomark
  (Tech Blue / White).
- `brand/` — the official **5th element** vectors (`fifth-element-single.svg`,
  `-inline.svg`, `-stacked.svg`), recolorable via `fill="currentColor"`.

`guidelines/` — foundation specimen cards (the Design System tab): colors, type,
spacing, radii, shadows, gradients, logo, and brand-motif cards — plus the
**Inspiration** group (`inspiration-web.html`, `inspiration-app.html`,
`inspiration-ux.html`, `patterns-frontpage.html`): web layout patterns, app/product
UI anatomy, UX principles, and field-tested frontpage patterns to lean on when
doing frontend, web & app assignments.

`components/` — reusable React UI primitives. In consuming projects they're
reachable as `const { Button } = window.ContiniaDesignSystem_354b58`. Each
directory has a `.jsx`, a `.d.ts`, a `.prompt.md`, and a `@dsCard` HTML demo:
- `components/buttons/` — **Button** (light surfaces: primary / secondary /
  purple; dark surfaces: innovation / white / ghost-dark; sizes; `caps`; icons).
  *Starting point.*
- `components/forms/` — **Input** (label, icon, hint, invalid), **Checkbox**
  (checkbox + radio).
- `components/data-display/` — **Card** (feature/brand/tint; *starting point*),
  **Tag** (pill badge), **StatusChip** (4-state document/finance pill:
  neutral / info / warning / success), **StatPanel** (quarter-circle big number).
- `components/navigation/` — **SiteHeader** (canonical sticky site nav;
  `activeItem` current-page marking, CTA, burger; *starting point*) +
  **SiteFooter** (official 4-col anatomy + legal bar) + `links.js`
  (`CONTINIA_LINKS` canonical URL map). The site chrome — never rebuild per page.
- `components/brand/` — **Logo** (lockup / mark-only, brand colors),
  **PopupWindow** (the signature UI-element frame).

`ui_kits/website/` — high-fidelity recreation of the Continia marketing surface
(`index.html` = home), composed from the components: `Header`, `Hero`,
`Sections` (TrustBar / SolutionsGrid / BuiltInside / Quote / CTA), `Footer`
(+ demo dialog), with `site.css`. Interactive: nav, hover, and a working demo
modal. This is the public product surface — the solutions themselves run inside
Microsoft Dynamics 365 Business Central.

`assets/images/` + `imagery.html` — the **image library**. Drop reusable image
files (employee / office / partner / Business Central shots, warm Continia-LUT
treatment) into `assets/images/` and reference them from any page or app mock; or
open "Imagery" in the Design System tab and drag images straight onto the slots
(they persist) when mocking up. `imagery.html` lives at the project root so the
drag-drop slots can save.
