/* Continia Expense Management — produktskal.
 *
 * Designfilerne er ikke statiske artboards. Hver fil er én React-komponent med
 * en state-maskine, hvor `state.screen` afgør hvilken skærm der renderes, og
 * hvor produktets egen navigation (portalens sidebar, appens bundlinje) allerede
 * er wired til den samme state.
 *
 * Skallen gør fire ting:
 *   1. vælger flade ud fra viewporten (matchMedia, ikke user-agent)
 *   2. injicerer CSS i designfilen der fjerner prototype-chrome og lader
 *      designet fylde viewporten — designfilen selv røres ikke
 *   3. binder `state.screen` sammen med URL'ens hash i begge retninger
 *   4. sætter `theme-color` efter fladen, så browserens egen chrome ikke
 *      bliver navy på portalen (se setThemeColor)
 *
 * Punkt 2 sker med !important i et stylesheet, ikke med inline styles: React
 * gen-skriver style-attributten ved hver re-render og ville ellers overskrive os.
 */
(function () {
  'use strict';

  var MOBILE_MAX = 767;               // < 768px  -> mobilappen
  var PORTAL_MIN_WIDTH = 1280;        // portalens flydende gulv

  // Browser-chromens tint pr. flade. null = ingen theme-color, dvs. browserens
  // egen værktøjslinje. Se setThemeColor().
  var THEME_COLOR = { app: '#052975', portal: null };

  // ── Ruter ──────────────────────────────────────────────────
  // slug i URL'en  <->  state.screen i designfilen

  var SURFACES = {
    portal: {
      file: 'desktop/expense-portal.html',
      marker: 'browser-window',
      home: 'login',
      screens: {
        'sign-in':           'login',
        'approval-queue':    'queue',
        'approval-view':     'approve',
        'all-expenses':      'list',
        'mileage':           'mileage',
        'card-transactions': 'cards',
        'reporting':         'reports',
        'setup':             'settings',
        'expense-detail':    'expense',
        'mileage-detail':    'trip',
        'card-transaction':  'cardtx'
      }
    },
    app: {
      file: 'mobile/expense-mobile.html',
      marker: 'ios-frame',
      home: 'login',
      screens: {
        'login':           'login',
        'my-expenses':     'home',
        'history':         'history',
        'per-diem':        'perdiem',
        'scan-receipt':    'scan',
        'scan-result':     'result',
        'new-expense':     'create',
        'mileage':         'mileage',
        'expense-report':  'report',
        'expense-detail':  'detail',
        'receipt-inbox':   'receipts'
      }
    }
  };

  // Nogle skærme har brug for at en sidestillet state også sættes, så skærmen
  // åbner i en meningsfuld tilstand frem for hvad brugeren sidst så.
  var SCREEN_STATE = {
    app: {
      detail: { detail: 'pending' },
      result: { scan: 'ok' },
      create: { wiz: 1 }
    },
    portal: {}
  };

  // Når viewporten krydser breakpointet skal brugeren blive i sin kontekst,
  // ikke smides tilbage til forsiden. Kortlægning mellem fladernes skærme:
  var EQUIVALENT = {
    portal: { login:'login', queue:'home', approve:'detail', list:'history',
              mileage:'mileage', cards:'history', reports:'report', settings:'home',
              expense:'detail', trip:'mileage', cardtx:'receipts' },
    app:    { login:'login', home:'queue', history:'list', perdiem:'list',
              scan:'queue', result:'queue', create:'queue', mileage:'mileage',
              report:'reports', detail:'expense', receipts:'cardtx' }
  };

  function slugFor(surface, screen) {
    var map = SURFACES[surface].screens;
    for (var slug in map) if (map[slug] === screen) return slug;
    return null;
  }

  // ── Chromeless ─────────────────────────────────────────────
  // Fjerner prototype-panelet, skærmtitlen, noterne og enhedsrammen, og lader
  // designet fylde viewporten. DOM-strukturen er verificeret i begge filer:
  //
  //   #dc-root > .sc-host > div            ydre flex-række (padding 32, gap 32)
  //     ├─ aside                           prototype-panelet
  //     └─ div                             scene-kolonne (gap 14–18)
  //         ├─ div                         skærmtitel / variant-chips
  //         ├─ div.sc-host-x               x-import (display: contents)
  //         │    └─ [data-om-starter=…]    selve rammen
  //         └─ div                         noter

  function chromelessCSS(surface) {
    var cfg = SURFACES[surface];
    var frame = '[data-om-starter="' + cfg.marker + '"]';

    var css = [
      'html,body{margin:0!important;padding:0!important;background:#eef1f6!important;overscroll-behavior:none!important}',

      /* prototype-panelet */
      '#dc-root > .sc-host > div > aside{display:none!important}',

      /* mit eget tilbage-link hører til galleriet, ikke produktet */
      'a[aria-label="Tilbage til galleriet"]{display:none!important}',

      /* ydre række og scene-kolonne: fuld bredde, ingen luft */
      '#dc-root,#dc-root > .sc-host{display:block!important;width:100%!important}',
      '#dc-root > .sc-host > div{display:block!important;padding:0!important;gap:0!important;min-height:0!important}',
      '#dc-root > .sc-host > div > div{display:block!important;gap:0!important;width:100%!important}',

      /* alt i scene-kolonnen som ikke er x-import-wrapperen: titel og noter */
      '#dc-root > .sc-host > div > div > div:not(.sc-host-x){display:none!important}',

      /* rammen bliver til selve skærmen */
      frame + '{width:100%!important;height:100dvh!important;max-width:none!important;' +
              'border-radius:0!important;box-shadow:none!important}'
    ];

    if (surface === 'portal') {
      css.push(
        /* browservinduets titellinje og adresselinje — sidste barn er indholdet */
        '[data-om-starter="browser-window"] > div:not(:last-child){display:none!important}',
        '[data-om-starter="browser-window"] > div:last-child{height:100%!important}'
      );
    } else {
      css.push(
        /* enhedens dynamic island, statuslinje og home-indikator ligger i
           ios-frame.jsx, ikke i designet — det rigtige styresystem leverer dem */
        '[data-om-starter="ios-frame"] > div:nth-child(1),' +
        '[data-om-starter="ios-frame"] > div:nth-child(2),' +
        '[data-om-starter="ios-frame"] > div:nth-child(4){display:none!important}',

        /* app-følelse: ingen tekstmarkering, ingen dobbelt-tap-zoom, ingen
           blå tap-highlight */
        'html{-webkit-text-size-adjust:100%!important;touch-action:manipulation!important}',
        'body,body *{-webkit-user-select:none!important;user-select:none!important;' +
        '-webkit-touch-callout:none!important;-webkit-tap-highlight-color:transparent!important}'
      );
    }

    return css.join('\n');
  }

  function injectCSS(doc, surface) {
    var existing = doc.getElementById('shell-chromeless');
    if (existing) existing.remove();
    var el = doc.createElement('style');
    el.id = 'shell-chromeless';
    el.textContent = chromelessCSS(surface);
    (doc.head || doc.documentElement).appendChild(el);
  }

  // ── Adgang til designets state-maskine ─────────────────────
  // Runtime'en eksponerer ikke komponenten. Den findes ved at gå ned gennem
  // React-fibertræet og lede efter den ene instans hvis logik har `screen`.

  function findLogic(doc) {
    var root = doc.getElementById('dc-root');
    if (!root) return null;

    var key = Object.keys(root).filter(function (k) {
      return k.indexOf('__reactContainer') === 0;
    })[0];
    if (!key) return null;

    var found = null;
    var budget = 8000;

    (function walk(node) {
      if (!node || found || budget-- < 0) return;
      var sn = node.stateNode;
      if (sn && sn.logic && sn.logic.state && 'screen' in sn.logic.state) {
        found = sn.logic;
        return;
      }
      walk(node.child);
      walk(node.sibling);
    })(root[key]);

    return found;
  }

  // ── Skallen ────────────────────────────────────────────────

  var body = document.body;
  var frameEl = document.getElementById('surface');
  var mq = window.matchMedia('(max-width: ' + MOBILE_MAX + 'px)');

  var current = { surface: null, logic: null, screen: null };
  var applying = false;

  function surfaceForViewport() {
    return mq.matches ? 'app' : 'portal';
  }

  /** Læs ruten af URL'en. Viewporten bestemmer fladen; hashen bestemmer skærmen,
   *  oversat til den flade vi rent faktisk viser. */
  function readRoute() {
    var want = surfaceForViewport();
    var m = /^#\/(portal|app)\/([a-z0-9-]+)/i.exec(location.hash || '');
    if (!m) return { surface: want, screen: SURFACES[want].home };

    var from = m[1].toLowerCase();
    var screen = SURFACES[from].screens[m[2].toLowerCase()];
    if (!screen) return { surface: want, screen: SURFACES[want].home };

    if (from !== want) {
      screen = (EQUIVALENT[from] && EQUIVALENT[from][screen]) || SURFACES[want].home;
    }
    return { surface: want, screen: screen };
  }

  function hashFor(surface, screen) {
    var slug = slugFor(surface, screen);
    return slug ? '#/' + surface + '/' + slug : '';
  }

  /** state.screen -> URL. Kaldes når designets egen navigation skifter skærm. */
  function syncHash() {
    if (applying || !current.logic) return;
    var screen = current.logic.state.screen;
    if (screen === current.screen) return;
    current.screen = screen;

    var hash = hashFor(current.surface, screen);
    if (hash && hash !== location.hash) {
      history.pushState(null, '', hash);
    }
  }

  /** Sæt skærmen i designet. */
  function setScreen(screen) {
    if (!current.logic) return;
    var patch = { screen: screen };
    var extra = SCREEN_STATE[current.surface][screen];
    if (extra) for (var k in extra) patch[k] = extra[k];

    applying = true;
    current.screen = screen;
    current.logic.setState(patch);
    setTimeout(function () { applying = false; }, 0);
  }

  /** Fang designets egne state-skift, så URL'en følger med. */
  function watchLogic(logic) {
    if (logic.__shellPatched) return;
    var proto = logic.setState.bind(logic);
    logic.setState = function (update, cb) {
      proto(update, cb);
      setTimeout(syncHash, 0);
    };
    logic.__shellPatched = true;
  }

  /** Vent på at runtime'en har monteret komponenten. */
  function whenReady(doc, done, tries) {
    tries = tries || 0;
    var logic = findLogic(doc);
    if (logic) return done(logic);
    if (tries > 120) return done(null);        // ~12s
    setTimeout(function () { whenReady(doc, done, tries + 1); }, 100);
  }

  /** Safari (15+, macOS) og Chrome tinter browser-chromen med sidens
   *  theme-color. Mobilappens header er Tech Blue helt op i statuslinjen, så
   *  navy er den rigtige tint dér. Portalen har derimod en hvid 56px topbar:
   *  en navy værktøjslinje fik Tech Blue til at brede sig ud over hele
   *  browseren i stedet for at stoppe ved vindueskanten.
   *
   *  Metaen styres herfra frem for med `media` på selve tagget, fordi
   *  understøttelsen af width-queries på theme-color er ujævn — og fordi
   *  fladen alligevel kan skifte midt i en session når man resizer.
   *
   *  manifest.json beholder sin navy `theme_color`: den gælder den
   *  *installerede* app, hvor en navy titelbjælke er det vi vil have. */
  function setThemeColor(surface) {
    var el = document.querySelector('meta[name="theme-color"]');
    var color = THEME_COLOR[surface];

    if (!color) {
      if (el) el.parentNode.removeChild(el);
      return;
    }
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'theme-color');
      document.head.appendChild(el);
    }
    el.setAttribute('content', color);
  }

  function loadSurface(surface, screen) {
    current.surface = surface;
    current.logic = null;
    current.screen = null;
    body.setAttribute('data-surface', surface);
    setThemeColor(surface);
    body.removeAttribute('data-ready');

    frameEl.onload = function () {
      var doc;
      try {
        doc = frameEl.contentDocument;
      } catch (e) {
        body.setAttribute('data-error', '1');
        return;
      }
      if (!doc) { body.setAttribute('data-error', '1'); return; }

      injectCSS(doc, surface);

      whenReady(doc, function (logic) {
        if (!logic) { body.setAttribute('data-error', '1'); return; }
        current.logic = logic;
        watchLogic(logic);
        setScreen(screen);

        // Giv React én frame til at rendere den rigtige skærm, før vi
        // afslører fladen — ellers ses standardskærmen et øjeblik.
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            body.setAttribute('data-ready', '1');
          });
        });
      });
    };

    frameEl.src = SURFACES[surface].file;
  }

  /** Anvend URL'ens rute — skift flade hvis nødvendigt, ellers bare skærm. */
  function applyRoute() {
    var route = readRoute();

    if (route.surface !== current.surface) {
      loadSurface(route.surface, route.screen);
    } else if (current.logic && route.screen !== current.logic.state.screen) {
      setScreen(route.screen);
    }

    // Normalisér URL'en, så den altid viser den flade der faktisk er på skærmen.
    var hash = hashFor(route.surface, route.screen);
    if (hash && hash !== location.hash) history.replaceState(null, '', hash);
  }

  // ── Hændelser ──────────────────────────────────────────────

  window.addEventListener('popstate', applyRoute);
  window.addEventListener('hashchange', applyRoute);

  // Viewport krydser breakpointet: skift flade, men behold konteksten.
  function onBreakpoint() {
    var want = surfaceForViewport();
    if (want === current.surface) return;

    var from = current.surface;
    var screen = current.logic ? current.logic.state.screen : SURFACES[from].home;
    var mapped = (EQUIVALENT[from] && EQUIVALENT[from][screen]) || SURFACES[want].home;

    var hash = hashFor(want, mapped);
    if (hash) history.replaceState(null, '', hash);
    loadSurface(want, mapped);
  }

  if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
  else mq.addListener(onBreakpoint);                 // Safari < 14

  // Hverken matchMedia-change eller resize fyrer pålideligt i alle
  // sammenhænge — fx når en iframe ændrer størrelse programmatisk. Begge
  // bruges som backstop, og en ResizeObserver på dokumentroden fanger resten.
  // onBreakpoint returnerer straks hvis fladen allerede er den rigtige, så
  // det er gratis at kalde den ofte.
  var resizeTimer = null;
  function nudge() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onBreakpoint, 150);
  }

  window.addEventListener('resize', nudge);
  window.addEventListener('orientationchange', nudge);

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(nudge).observe(document.documentElement);
  }

  // ── Start ──────────────────────────────────────────────────

  var start = readRoute();
  var startHash = hashFor(start.surface, start.screen);
  if (startHash && startHash !== location.hash) {
    history.replaceState(null, '', startHash);
  }
  loadSurface(start.surface, start.screen);
})();
