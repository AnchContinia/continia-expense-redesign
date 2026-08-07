# Continia Expense Management — redesign

Redesignet af Continia Expense Management, vist som et **kørende produkt**
frem for et designgalleri. Samme URL viser portalen på desktop og appen på
mobil, og navigationen er designets egen.

**→ [Åbn produktet](https://anchcontinia.github.io/continia-expense-redesign/)**
· [Galleri](https://anchcontinia.github.io/continia-expense-redesign/gallery/)
· [Design system](https://anchcontinia.github.io/continia-expense-redesign/design-system/expense-design-system.html)

> Designfilerne er **referencer, ikke produktionskode**. Se
> [HANDOFF.md](HANDOFF.md) for tokens og implementeringsnoter, og
> [PROJECT_RULES.md](PROJECT_RULES.md) for de visuelle regler.

---

## Sådan opfører forsiden sig

| Viewport | Flade | Noter |
| --- | --- | --- |
| ≥ 1024px | Desktopportalen | Fuldskærm, ingen browserramme. Portalens egen sidebar skifter skærm. |
| 768–1023px | Desktopportalen | Med `min-width: 1280px` og vandret scroll — se gulvet nedenfor. |
| < 768px | Mobilappen | Fuldskærm uden telefonramme. Appens egen bundlinje skifter skærm. |

Fladen vælges med `matchMedia`, ikke user-agent. Krydser viewporten
breakpointet, skifter fladen, men skærmen kortlægges over — står du på
portalens Mileage, lander du på appens Mileage, ikke på forsiden.

### URL'er

Hashen afspejler altid den skærm der vises, og opdateres også når du
navigerer med designets egen navigation. Browserens tilbage-knap virker.

```
#/portal/sign-in            #/app/login
#/portal/approval-queue     #/app/my-expenses
#/portal/approval-view      #/app/history
#/portal/all-expenses       #/app/per-diem
#/portal/mileage            #/app/scan-receipt
#/portal/card-transactions  #/app/scan-result
#/portal/reporting          #/app/new-expense
#/portal/setup              #/app/mileage
                            #/app/expense-report
                            #/app/expense-detail
                            #/app/receipt-inbox
```

Deep links virker ved direkte indlæsning. Peger en hash på den anden flade
end viewporten tilsiger, oversættes den — `#/portal/mileage` på en telefon
bliver til `#/app/mileage`.

---

## Hvordan det virker

Det vigtigste at vide før du retter noget: **designfilerne indeholder ikke
artboards.** Hver fil er én React-komponent med en state-maskine, hvor
`state.screen` afgør hvilken skærm der renderes. Skærmene findes ikke som
HTML på disken — de opstår først når runtime'en (`support.js`) kører
templaten sammen med logikklassen.

Produktets egen navigation er allerede wired til den samme state: portalens
sidebar (`nav: [...]` med `go: this.go(id)`) og appens bundlinje
(`goHome`, `goHistory`, `goReceipts`, `goMileage`, `goReport`).

Skallen i `assets/shell.js` gør tre ting:

1. **Vælger flade** ud fra viewporten og indlæser designfilen i en
   fuldskærms-`<iframe>`.
2. **Injicerer chromeless-CSS** i iframen, som skjuler prototype-panelet,
   skærmtitlen, noterne og enhedsrammen, og lader designet fylde viewporten.
   Det sker med `!important` i et stylesheet — ikke inline styles, for React
   gen-skriver `style`-attributten ved hver re-render.
3. **Binder `state.screen` til URL'en** i begge retninger. Komponenten findes
   ved at gå ned gennem React-fibertræet efter den ene instans hvis logik har
   `screen`; derefter styres skærmen med `logic.setState({screen})`, og
   `setState` ombrydes så designets egne navigationsklik opdaterer hashen.

**Designfilerne er ikke ændret** ud over det tilbage-link til galleriet, der
blev indsat i forrige omgang. Al tilpasning ligger i skallen.

### Skalering

Designene er tegnet i fast bredde (390×844 og 1440×984), men indholdet er
bygget i flexbox og `fr`-kolonner — der er **nul `@media`-regler** og næsten
ingen hardkodede bredder. Fastbredden kom udelukkende fra enhedsrammen. Når
rammen fjernes, flyder layoutet af sig selv. Ingen CSS er skrevet om.

**Portalens gulv:** under ca. 1200px kolliderer tabelkolonnerne — `1.5fr` og
`1.7fr` bliver for smalle, og Employee- og Expense-teksten overlapper.
Verificeret brudt ved 1024px, ren ved 1280px. Derfor `min-width: 1280px` og
vandret scroll frem for et brækket layout.

Mobilappen flyder frit fra ~320px og opefter.

### App-følelse på mobil

`manifest.json` (standalone, navy `#052975`, Continia-ikon i 192/512/maskable),
`apple-mobile-web-app-capable`, `black-translucent` statuslinje,
`viewport-fit=cover` med `env(safe-area-inset-*)`, `overscroll-behavior: none`,
og — kun på mobilfladen — slået tekstmarkering, tap-highlight og
dobbelt-tap-zoom fra.

Enhedens dynamic island, statuslinje og home-indikator ligger i
`ios-frame.jsx`, ikke i designet. De skjules, så styresystemets rigtige
udgaver kan overtage. Designet reserverer allerede plads til dem.

---

## Struktur

```
/
├── index.html                      produktskal — vælger flade og router
├── manifest.json
├── assets/
│   ├── shell.js                    fladevalg, chromeless, routing
│   ├── shell.css
│   └── icons/                      192 / 512 / maskable / apple-touch
├── gallery/index.html              det oprindelige galleri
├── design-system/
│   └── expense-design-system.html
├── mobile/expense-mobile.html      11 skærme
├── desktop/expense-portal.html     8 skærme
├── support.js                      Claude Design-runtime
├── image-slot.js  ios-frame.jsx  browser-window.jsx
├── mileage-map.html                Leaflet-kort, iframe i appens Mileage
├── _ds/                            Contina 3.0: tokens, CSS, Alliance No.2
├── tools/prepare.py                klargør en frisk eksport (idempotent)
├── .nojekyll                       ellers springer Pages `_ds/` over
├── HANDOFF.md  PROJECT_RULES.md
└── rename-map.json
```

`.nojekyll` er påkrævet: uden den ignorerer GitHub Pages `_ds/`, fordi
mappenavnet starter med underscore.

### Eksterne afhængigheder

| Hvad | Hvorfra | Bruges af |
| --- | --- | --- |
| Font Awesome kit `c11880975e` | `kit.fontawesome.com` | alle tre designfiler |
| Leaflet 1.9.4 | `unpkg.com` | `mileage-map.html` |
| Inter | `fonts.googleapis.com` | skallen og galleriet |

---

## Opdateringsprocedure

Ny eksport fra Claude Design:

1. Pak ud uden for repoet.
2. Kopiér de tre HTML-filer ind under deres nye navne:

   ```sh
   cp "Expense Design System.dc.html" design-system/expense-design-system.html
   cp "Expense Mobile.dc.html"        mobile/expense-mobile.html
   cp "Expense Portal.dc.html"        desktop/expense-portal.html
   ```

3. Opdatér de delte filer hvis de er ændret: `support.js`, `image-slot.js`,
   `ios-frame.jsx`, `browser-window.jsx`, `mileage-map.html`, `_ds/`, `assets/`.
4. Ret stier og genindsæt tilbage-linket:

   ```sh
   python3 tools/prepare.py       # idempotent
   ```

5. Verificér lokalt i undermappe-kontekst, som Pages serverer:

   ```sh
   mkdir -p /tmp/serve && ln -sfn "$PWD" /tmp/serve/continia-expense-redesign
   cd /tmp/serve && python3 -m http.server 8000
   # http://localhost:8000/continia-expense-redesign/
   ```

6. Commit og push til `main`. Pages deployer selv.

### Hvad der kan brække ved en ny eksport

Skallen læner sig op ad tre ting i designfilerne. Ændrer eksporten dem, skal
`assets/shell.js` rettes:

| Antagelse | Hvor | Symptom hvis den brydes |
| --- | --- | --- |
| `state.screen` findes med de kendte nøgler | `SURFACES[*].screens` | Ruter falder tilbage til forsiden |
| DOM-strukturen `#dc-root > .sc-host > div > {aside, div}` | `chromelessCSS()` | Prototype-panel eller noter dukker op |
| `[data-om-starter="ios-frame"]` / `"browser-window"` med chrome som 1., 2. og 4. barn | `chromelessCSS()` | Statuslinje eller browserramme bliver stående |

Tjek altid begge flader og et par ruter efter en opdatering. Dukker
prototype-panelet op, er det DOM-strukturen der har flyttet sig — dump den
med:

```js
document.querySelector('[data-om-starter="ios-frame"]')
```

og sammenlign forældrekæden med den der står kommenteret i `shell.js`.

### Nye skærme

Tilføj slug → `state.screen` i `SURFACES` i `assets/shell.js`, og en post i
`EQUIVALENT` for begge flader så viewport-skift stadig bevarer konteksten.
Opdatér desuden kortene i `gallery/index.html` og tabellerne her.

---

## Kendte forbehold

- **Mobilens login** kunne ikke nås fra produkt-UI'et i designet — der er
  ingen `signOut`, og appens initial state er `home`. Appen åbner nu på
  login, fordi skærmens tre CTA'er allerede kaldte `goHome`. Der er stadig
  ingen vej *tilbage* til login uden at redigere hashen.
- **Portalens `approve`-skærm** har ingen post i sidebaren; i designet nås den
  ved at åbne en række i godkendelseskøen. Deep linket virker.
- Font Awesome-kittet er verificeret ikke domænelåst — ikonerne renderer på
  `github.io`.

## Lokalt kildemateriale

`_source/` og `design_handoff_expense_management/` er git-ignoreret. De
indeholder den rå eksport, Figma-screenshots og uploads.
