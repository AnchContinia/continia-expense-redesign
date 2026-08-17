# CLAUDE.md

Arbejdskontekst for dette repo. `README.md` beskriver *hvad* siden er og hvordan
den opdateres — denne fil er *hvordan man arbejder her* uden at træde i de
samme fælder igen.

## Hvad projektet er

Redesign af Continia Expense Management, publiceret som et **kørende produkt**
frem for et designgalleri.

- **Live:** https://anchcontinia.github.io/continia-expense-redesign/
- **Repo:** `AnchContinia/continia-expense-redesign`, public, Pages på `main` / root
- **Lokalt:** `~/Desktop/Claude-New-Expense app` (mellemrum i stien — quote altid)
- Brugeren er designer hos Continia. Han skriver dansk, har skarpe øjne for
  detaljer, og træffer selv de visuelle valg når man giver ham et reelt valg.

---

## Det vigtigste at forstå først

**Designfilerne indeholder ikke artboards.** Hver `.html` under `mobile/`,
`desktop/` og `design-system/` er **én React-komponent** med en state-maskine,
renderet af en custom runtime (`support.js`, ~68 KB).

```
<x-dc>                              template med {{ bindinger }}
  <sc-if value="{{ isQueue }}">     én skærm ad gangen
  <sc-for list="{{ rows }}" as="r"> lister
<script type="text/x-dc">           class Component extends DCLogic
  state = { screen, detail, ... }
  renderVals() { ... }              alt data OG alle styles bygges her
```

Konsekvenser man skal have i hovedet:

- Skærmenes HTML **findes ikke på disken**. Den opstår først når runtime'en
  kører. Man kan ikke "splitte en skærm ud" som en filoperation.
- `sc-if` rendrer som en React **Fragment** — ingen DOM-wrapper. Derfor er det
  sikkert at putte absolut-positionerede børn ind i en flex-container gennem en
  `sc-if`.
- Al styling er **inline på hvert element**, ofte genereret i JS
  (`chipStyle(key)`, `pill(on)`, `av(bg, fg)`, `padY`). `_ds/styles.css` er
  **120 bytes**. Der er intet fælles CSS-lag at rette ét sted.
- Det eneste delte lag er **127 CSS-variabler** i `_ds/.../tokens/*.css`.
  Brug altid dem (`var(--c-tech-blue)`, `var(--c-slate-500)`, …), aldrig hex.
- Der er **nul `@media`-regler** i nogen designfil.

### Produktets egen navigation er allerede wired

Portalens sidebar (`nav: [...]` med `go: this.go(id)`) og appens bundlinje
(`goHome`, `goHistory`, `goReceipts`, `goMileage`, `goReport`) peger på den
samme state-maskine. Det er derfor forsiden kan opføre sig som et rigtigt
produkt uden at noget er skrevet om.

**Skærme:** portal 11 (`login, queue, approve, list, mileage, cards, reports,
expense, trip, cardtx, settings`), mobil 11.

---

## Skallen (`assets/shell.js`)

`index.html` er en skal der loader designfilen i en fuldskærms-iframe. Den gør
fire ting, og de tre første er skrøbelige på hver sin måde:

1. **Vælger flade** med `matchMedia` (<768px → app, ellers portal).
2. **Injicerer chromeless-CSS** der skjuler prototype-panelet, skærmtitlen,
   noterne og enhedsrammen.
3. **Binder `state.screen` til URL-hashen** i begge retninger.
4. **Sætter `theme-color`** efter fladen — navy på app, *fjernet* på portal.

### Tre ting skallen antager om designfilerne

Brydes en af dem ved en ny eksport, går forsiden i stykker — ikke med en fejl,
men visuelt:

| Antagelse | Hvor | Symptom |
| --- | --- | --- |
| DOM: `#dc-root > .sc-host > div > {aside, div}` med `div.sc-host-x` om rammen | `chromelessCSS()` | Prototype-panel eller noter dukker op |
| `[data-om-starter="ios-frame"]` har island/statuslinje/home-indikator som barn 1, 2 og 4 | `chromelessCSS()` | Statuslinje bliver stående |
| Komponentens logic-instans har `state.screen` | `findLogic()` | Routing dør helt |

`findLogic()` går ned gennem **React-fibertræet** fra `#dc-root` og leder efter
den ene instans hvis `logic.state` har `screen`. Runtime'en eksponerer intet
globalt. Derefter styres skærmen med `logic.setState({screen})`, og `setState`
ombrydes så designets egne klik opdaterer hashen.

### Hvorfor `!important` i injiceret CSS, aldrig inline styles

React gen-skriver `style`-attributten ved **hver** re-render. Sætter man
`el.style.x` fra skallen, er det væk næste gang state ændrer sig. Et stylesheet
med `!important` vinder over inline styles og overlever.

---

## Fælder der har kostet tid

**Semikolon i style-strenge.** At strippe det afsluttende `;` for at
sammenkæde to deklarationer slår dem *begge* ihjel — CSS-parseren kasserer hele
den ugyldige deklaration. `flex-shrink: 0 position: relative` fjernede både
`flex-shrink` og `position`, hvilket fik en video til at ankre til
telefonrammen i stedet for headeren og dække hele skærmen. Behold altid
semikolonet og tilføj efter.

**Case-insensitivt filsystem.** macOS ser `Assets/` og `assets/` som samme
mappe; GitHub gør ikke. Den oprindelige `Assets/` er derfor omdøbt til
`_source/` (git-ignoreret). Opret aldrig en mappe der kun adskiller sig i
store/små bogstaver.

**Headless screenshots ved smalle vinduer lyver.** `--window-size=390,844`
giver et klippet billede der ligner et layout-brud, selvom layoutet er korrekt.
Mål altid i stedet — eller indlejr siden i en 390px-iframe på en bredere side og
screenshot *den*.

**Krydsdomæne.** En harness på `localhost` kan ikke nå ind i live-sitet på
`github.io`. Test live med deep links der ikke kræver klik.

**Programmatisk iframe-resize** udløser hverken `matchMedia`-change eller
`resize` i headless. Skallen har derfor tre backstops: `matchMedia`, `resize`
og en `ResizeObserver` på `document.documentElement`.

**`theme-color` tinter browserens egen chrome.** Safari 15+ på macOS farver
tab- og værktøjslinjen med sidens `theme-color`. Et statisk `#052975` i
`index.html` fik derfor Tech Blue til at brede sig ud over hele browseren
omkring portalen — som om siden var et browser-tema. Metaen sættes nu fra
`setThemeColor()` pr. flade: navy på app (headeren *er* navy op i statuslinjen),
helt fjernet på portal (den har hvid topbar). `manifest.json` beholder sin navy
`theme_color` — den gælder kun den *installerede* app. Symptomet ses ikke i
headless og ikke i fuldskærm; kun i et almindeligt Safari-vindue.

---

## Verifikationsopskrift

GitHub Pages serverer fra `/repo-navn/`, ikke fra domænerod. Test altid i den
kontekst — ellers fanger man ikke sti-fejl.

```sh
SP=/tmp/serve && mkdir -p $SP
ln -sfn "$PWD" $SP/continia-expense-redesign
cd $SP && python3 -m http.server 8000
# http://localhost:8000/continia-expense-redesign/
```

Chrome findes på maskinen og kan bruges headless:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --virtual-time-budget=24000 \
  --window-size=1600,1000 --screenshot=out.png \
  "http://localhost:8000/continia-expense-redesign/#/portal/approval-queue"
```

`python3 tools/prepare.py` er idempotent og tjekker at hver `src`/`href`/`from`
i de tre designfiler faktisk findes på disken. Kør den efter enhver ændring.

### Hvad er klikbart hvor?

Det mest brugte diagnostiske snippet — kortlægger `onClick` pr. skærm, så man
ikke gætter på om noget allerede er wired:

```python
import re
from collections import defaultdict
c = re.sub(r'base64,[A-Za-z0-9+/=]+', 'base64,X',
           open('desktop/expense-portal.html', encoding='utf-8').read())
scr = [(m.start(), m.group(1))
       for m in re.finditer(r'<sc-if value="\{\{ (is[A-Za-z]+) \}\}"', c)]
owner = lambda p: next((n for s, n in reversed(scr) if s < p), None)
g = defaultdict(list)
for m in re.finditer(r'onClick="\{\{ ([^}]+) \}\}"', c):
    g[owner(m.start())].append(m.group(1))
for k, v in g.items():
    print(f'{k or "(root)":12} {sorted(set(v))}')
```

Samme trick med `<sc-for list="{{ x }}" as="y">` finder listerne, og
`grid-template-columns` finder tabellernes kolonner (husk: de står **to**
steder — i tabelhovedets markup og i `rowStyle` i logikken; ret altid begge).

**Verificér før du melder færdig.** Alt i dette repo er blevet målt eller
renderet, ikke antaget. Målte tal der stadig gælder:

- Portalen flyder rent ned til **1280px**; ved **1024px overlapper**
  tabelkolonnerne (`1.5fr`/`1.7fr` bliver for smalle). Derfor
  `min-width: 1280px` + vandret scroll i 768–1024-båndet.
- iOS-rammen er præcis **390×844** og sidder på **x=332, y=88** i canvas.
  Browservinduet er **1440×984** på **x=332, y=32**.
- Font Awesome-kittet `c11880975e` er **ikke** domænelåst — verificeret på
  `github.io`.
- Det eksisterende `approve`-view flyder **308px** over ved 900px viewporthøjde.
  Portalen er tegnet til 984px. Detaljeskærmenes beskæring er samme fænomen,
  ikke en regression.

---

## Konventioner

**Sprog.** Svar og kodekommentarer på dansk. Commit-beskeder på engelsk.
Designets egen tekst (UI-copy) er engelsk — bland ikke dansk ind i skærmene.

**Commits.** Emnelinje i imperativ, derefter en brødtekst der forklarer *hvorfor*
og hvilke ikke-oplagte begrænsninger der styrede løsningen. Slut med
`Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

**Ændringer i designfilerne.** Hold dem minimale og verificér diffen bagefter
(`git diff --stat` + læs de faktiske linjer). Følg designets egne præcedenser
frem for at opfinde nye værdier — søg efter et eksisterende mønster først:

| Behov | Designets eget svar |
| --- | --- |
| Bar-track på hvid | `var(--c-slate-100)` + fill `var(--c-tech-blue)` |
| `<strong>` i slate-tekst | `var(--c-slate-700)` (dominerende, 5 brug) |
| Label over et tal | 11px, 700, `letter-spacing: 0.12em`, uppercase, `--c-slate-500` |
| Statuschip | `chipStyle(key)` — `draft, pending, hold, approved, rejected, posted, matched, noexp, norec` |
| Klikbar række | `class="trow"` (har cursor + hover) + afsluttende chevron-celle |
| Detaljeskærm | Toolbar med tilbage-pill, "Item N of M", prev/næste → `grid 1fr 468px` |

**`PROJECT_RULES.md` er bindende** for alt visuelt: ingen kvartcirkler, ingen
farvet venstre-kant-accent, intet 5. element-watermark, ingen accentbjælke på
aktiv navigation. Signalér tilstand med chips, ikoner og tekst — farve er
aldrig det eneste signal.

**Spørg ved reelle valg.** Brugeren har konsekvent valgt godt når han fik to
konkrete muligheder med konsekvenserne beskrevet. Spørg ikke om ting der har et
oplagt svar.

---

## Status

Alt nedenstående er bygget, verificeret og deployet.

| Commit | Hvad |
| --- | --- |
| `8c9436b` | Galleri: 3 eksporter struktureret til Pages, stier rettet, tilbage-link |
| `bfb528e` | Produktskal: fladevalg, chromeless, hash-routing, PWA, galleri flyttet til `/gallery/` |
| `7e8c0e1` | Markeret stat-tile: fyld → hvid + tech blue stroke |
| `89d7f58` | Stroke til 2px; cloud-video i alle 8 app-under-headere |
| `ba3fc2a` | Rækkedetaljer i Expenses, Mileage og Card transactions |
| `8d79ce8` | Sidebar-logoet er en home-knap |

### Kendte begrænsninger

- Mobilens `login` kan ikke nås tilbage fra produkt-UI'et — der er ingen
  `signOut` i appen. Appen åbner på login; derfra er der kun vej frem.
- Portalens `approve` har ingen sidebar-post; den nås fra godkendelseskøen.
- Mileage-kortet tegner nu rigtig vejgeometri pr. strækning, men de **påståede
  km i fixturedataen matcher ikke** ruten (Silkeborg→Herning er 38,5 km og
  hævder 116). Sub-baren siger "distance checked against the routing service",
  hvilket kortet nu gør efterprøveligt. Se `mileage-map.html`.
- Detaljeskærmenes handlingsfelt klippes under ca. 950px viewporthøjde.
- Scan og Scan result i appen har bevidst **ikke** cloud-video — de er
  kamera-viewfindere på `#08111f`, ikke navy headere.

### Oplagte næste skridt

Ikke aftalt med brugeren — spørg før du går i gang:

- Portalens **Reporting** og **Setup** har **nul** `onClick` overhovedet.
  Kategorirækker, afdelinger og opsætningsfelter er helt døde. Det er de sidste
  to skærme uden interaktion.
- Mobilappen har derimod allerede rækkeinteraktion: History (`h.open`),
  Expense report (`goDetail`) og Receipt inbox (`goScanFail`). Antag ikke at
  den mangler det — tjek `onClick`-kortet først.
