# Continia Expense Management — redesign

Designgalleri for redesignet af Continia Expense Management. Tre interaktive
designreferencer bygget i Claude Design: det fælles design system, mobilappen
til medarbejderen og desktopportalen til godkenderen.

**→ [Åbn galleriet](https://anchcontinia.github.io/continia-expense-redesign/)**

> Designfilerne er **referencer, ikke produktionskode**. Se
> [HANDOFF.md](HANDOFF.md) for tokens og implementeringsnoter, og
> [PROJECT_RULES.md](PROJECT_RULES.md) for de visuelle regler der gælder på
> alle flader.

---

## Skærmoversigt

### Design system — [`design-system/expense-design-system.html`](design-system/expense-design-system.html)

Viewport 1440 × 1000. Tokens og primitives som begge flader deler.

| Sektion | Sektion |
| --- | --- |
| Color | DataTable |
| Typography | Navigation |
| Space, radius, elevation | Empty, loading, error |
| Buttons | Modal, sheet, toast |
| Forms | Icons |
| Expense primitives | |

### Mobil — [`mobile/expense-mobile.html`](mobile/expense-mobile.html)

iPhone 390 × 844, medarbejderens flade. 11 skærme i én fil, vælg dem i
sidepanelet til venstre.

| Skærm | Noter |
| --- | --- |
| Login | |
| My expenses | 2 varianter (list-led / summary-led) |
| History | |
| Per diem | |
| Scan receipt | |
| Scan result | |
| New expense | 2 varianter (single screen / wizard) |
| Mileage | Rigtigt Leaflet/OSM-kort via `mileage-map.html` |
| Expense report | |
| Expense detail | 2 tilstande |
| Receipt inbox | |

Sidepanelet skifter også **datatilstand**: Normal, Loading, Empty, Error, Offline.

### Desktop — [`desktop/expense-portal.html`](desktop/expense-portal.html)

1440 × 900, godkenderens og controllerens flade. 8 skærme i én fil.

| Skærm | Noter |
| --- | --- |
| Sign in | 40/60-split, Microsoft 365 først |
| Approval queue | 8 poster, bulk-handlinger |
| Approval view | Kvittering og data side om side |
| All expenses | |
| Mileage | |
| Card transactions | 3 poster til afstemning |
| Reporting | |
| Setup | |

Sidepanelet skifter **densitet** (Comfortable / Compact) og datatilstand.

---

## Sådan hænger filerne sammen

Designfilerne er **ikke** selvstændige — de deler en runtime og et
tokenlag via relative stier. Derfor ligger afhængighederne i roden og
HTML-filerne et niveau nede:

```
/
├── index.html                      galleri
├── design-system/
│   └── expense-design-system.html
├── mobile/
│   └── expense-mobile.html
├── desktop/
│   └── expense-portal.html
├── support.js                      Claude Design-runtime (alle tre filer)
├── image-slot.js                   billed-placeholder (mobil + desktop)
├── ios-frame.jsx                   iPhone-chrome (mobil)
├── browser-window.jsx              browser-chrome (desktop)
├── mileage-map.html                Leaflet-kort, iframe i mobilens Mileage
├── _ds/                            Contina 3.0: tokens, CSS, Alliance No.2
├── assets/                         brand-logoer + brand-clouds-video
├── rename-map.json                 original → nyt filnavn
├── .nojekyll                       så GitHub Pages ikke skjuler _ds/
├── HANDOFF.md                      tokens og implementeringsnoter
└── PROJECT_RULES.md                bandlyste visuelle mønstre
```

`.nojekyll` er **påkrævet**: uden den springer GitHub Pages `_ds/` over,
fordi mappenavnet starter med underscore — og så mister alle tre filer
tokens og fonte.

### Eksterne afhængigheder

To ting hentes fra nettet og virker ikke offline:

| Hvad | Hvorfra | Bruges af |
| --- | --- | --- |
| Font Awesome kit `c11880975e` | `kit.fontawesome.com` | alle tre filer (ikoner) |
| Leaflet 1.9.4 | `unpkg.com` | `mileage-map.html` |

Font Awesome-kits kan være låst til bestemte domæner. Mangler ikonerne på
det publicerede site, skal `*.github.io` tilføjes under kittets tilladte
domæner i Font Awesome-kontoen.

---

## Opdateringsprocedure

Når der kommer en ny eksport fra Claude Design:

1. **Pak eksporten ud** et sted uden for repoet.
2. **Kopiér de tre HTML-filer ind** under deres nye navne:

   ```sh
   cp "Expense Design System.dc.html" design-system/expense-design-system.html
   cp "Expense Mobile.dc.html"        mobile/expense-mobile.html
   cp "Expense Portal.dc.html"        desktop/expense-portal.html
   ```

3. **Opdatér de delte filer**, hvis de er ændret i eksporten:
   `support.js`, `image-slot.js`, `ios-frame.jsx`, `browser-window.jsx`,
   `mileage-map.html`, `_ds/`, `assets/`.

4. **Ret stierne igen.** En frisk eksport bruger stier der antager at alt
   ligger i samme mappe. Kør scriptet:

   ```sh
   python3 tools/prepare.py
   ```

   Det gør præcis to ting pr. fil — sætter `../` foran hver relativ
   afhængighed, og indsætter tilbage-linket lige efter `<body>`. Det er
   idempotent, så det er harmløst at køre igen.

5. **Verificér lokalt** i undermappe-kontekst, som GitHub Pages serverer:

   ```sh
   ln -sfn "$PWD" /tmp/serve/continia-expense-redesign
   cd /tmp/serve && python3 -m http.server 8000
   # åbn http://localhost:8000/continia-expense-redesign/index.html
   ```

   Tjek at alle tre kort viser et levende preview, at hver fil åbner, og at
   "← Galleri" fører tilbage.

6. **Opdatér `rename-map.json`** og datoen i `index.html`-footeren, hvis
   noget er skiftet navn eller kommet til.

7. Commit og push til `main`. Pages deployer selv.

### Hvis en skærm er kommet til eller forsvundet

Skærmlisterne står tre steder og skal følges: kortene i `index.html`
(`<ul class="screens">`), tabellerne i denne README, og `screens`-tallene
i `rename-map.json`.

### Hvis previewet i galleriet er forskubbet

Kortene viser et **beskåret** udsnit af designfilen — netop det område hvor
telefonen eller browservinduet står. Udsnittet er hardcodet i
`index.html` på hver `.shot`:

```html
<div class="shot" data-w="390" data-h="844" data-ox="332" data-oy="88">
```

`data-w`/`data-h` er udsnittets størrelse, `data-ox`/`data-oy` dets øverste
venstre hjørne inde i filen, og `data-fw`/`data-fh` på `<iframe>` er den
viewport filen renderes i. Flytter en ny eksport sidepanelet eller
overskriften, ændrer offsettet sig. Mål det rigtige med:

```js
document.querySelector('[data-om-starter="ios-frame"]').getBoundingClientRect()
// desktop: [data-om-starter="browser-window"]
```

Nuværende værdier: mobil `332, 88` (390 × 844), desktop `332, 32`
(1440 × 900 af et 1440 × 984 vindue), design system `0, 0`.

---

## Lokalt kildemateriale

`_source/` og `design_handoff_expense_management/` er git-ignoreret. De
indeholder den rå eksport, Figma-screenshots og uploads — det ligger stadig
lokalt, det skal blot ikke publiceres.
