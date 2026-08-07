/* @ds-bundle: {"format":4,"namespace":"ContiniaDesignSystem_354b58","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"PopupWindow","sourcePath":"components/brand/PopupWindow.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"StatPanel","sourcePath":"components/data-display/StatPanel.jsx"},{"name":"StatusChip","sourcePath":"components/data-display/StatusChip.jsx"},{"name":"Tag","sourcePath":"components/data-display/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"CONTINIA_LINKS","sourcePath":"components/navigation/links.js"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"}],"sourceHashes":{"assets/image-slot.js":"9309434cb09c","components/brand/Logo.jsx":"40ae43609a5d","components/brand/PopupWindow.jsx":"c9f37e7c7ab1","components/buttons/Button.jsx":"d4746fb9c7cd","components/data-display/Card.jsx":"d6bb4198ba00","components/data-display/StatPanel.jsx":"2ebcde06b5cd","components/data-display/StatusChip.jsx":"ef7f7547f681","components/data-display/Tag.jsx":"a7195aad3f54","components/forms/Checkbox.jsx":"0706408ee6a7","components/forms/Input.jsx":"c3c2d54864c7","components/navigation/SiteFooter.jsx":"362020c74a56","components/navigation/SiteHeader.jsx":"097ea0f71266","components/navigation/links.js":"b37f88ab750e","ui_kits/website/Footer.jsx":"1ef5680a5227","ui_kits/website/Header.jsx":"955fc5ce2be7","ui_kits/website/Hero.jsx":"6b67540531e7","ui_kits/website/Sections.jsx":"b131339524f6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ContiniaDesignSystem_354b58 = window.ContiniaDesignSystem_354b58 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/image-slot.js", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The official Continia primary lockup (logomark + "continia" wordmark),
   inlined from the brand SVG so the component is self-contained and recolorable.
   Per brand rules the logo may only be Tech Blue, White, Innovation or Light Blue. */

const WORD = "M607.78,134.44c-61.7,0-67.73,37.11-67.73,87.27s6.03,88.29,67.73,88.29h102.83v45.16h-117.37c-90.31,0-113.88-53.18-113.88-133.45s23.57-132.42,113.88-132.42h111.35v45.16h-96.81Z M894.36,313.02c60.21,0,80.77-26.1,80.77-91.31s-20.57-90.29-80.77-90.29-80.76,25.07-80.76,90.29,20.57,91.31,80.76,91.31M1035.83,221.71c0,106.36-46.16,136.45-141.47,136.45s-141.45-30.09-141.45-136.45,46.15-135.43,141.45-135.43,141.47,30.09,141.47,135.43 M1091.69,134.44c0-30.1,15.05-45.16,45.16-45.16h93.29c60.21,0,103.34,20.57,103.34,90.8v175.07h-58.69v-159.53c0-40.13-15.54-61.19-55.68-61.19h-53.67c-10.05,0-15.05,5.01-15.05,15.03v205.69h-58.69v-220.72Z M1523.78,355.16c-60.21,0-97.83-21.56-97.83-86.78v-133.94h-36.62v-45.16h36.62V4h58.69v85.29h75.75v45.16h-75.75v121.89c0,40.13,21.06,53.67,61.21,53.67h14.54v45.16h-36.62Z M1624.34,89.29h58.69v265.87h-58.69V89.29ZM1624.34,54.18h0c0-29.92,24.26-54.18,54.18-54.18h4.52v54.18h-58.69Z M1754.33,134.44c0-30.1,15.05-45.16,45.13-45.16h93.32c60.21,0,103.34,20.57,103.34,90.8v175.07h-58.69v-159.53c0-40.13-15.54-61.19-55.68-61.19h-53.67c-10.05,0-15.05,5.01-15.05,15.03v205.69h-58.69v-220.72Z M2067.55,89.29h58.69v265.87h-58.69V89.29ZM2067.55,54.18V0h58.69c0,29.92-24.26,54.18-54.18,54.18h-4.52Z M2278.3,234.76c-20.06,0-28.08,12.54-28.08,37.62s8.02,37.62,28.08,37.62h82.77c10.05,0,15.05-5.01,15.05-15.04v-60.21h-97.82ZM2360.07,89.29c50.16,0,74.74,33.11,74.74,78.26v142.45c0,30.1-15.05,45.16-45.16,45.16h-133.93c-45.14,0-66.21-27.59-66.21-82.78,0-50.16,21.07-82.78,66.21-82.78h120.39v-17.05c0-25.08-12.02-38.11-37.11-38.11h-129.93v-45.16h150.99Z";
const MARK1 = "M190.38,179.58v175.73H0c0-97.06,78.69-175.73,175.74-175.73h14.64Z";
const MARK2 = "M190.38,179.58V3.84h190.38c0,97.06-78.69,175.73-175.74,175.73h-14.64Z";
const FILLS = {
  techblue: "#052975",
  white: "#ffffff",
  innovation: "#8ff8ff",
  lightblue: "#def5ff"
};
function Logo({
  color = "techblue",
  markOnly = false,
  height = 36,
  className = "",
  style = {},
  ...props
}) {
  const fill = FILLS[color] || color;
  if (markOnly) {
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: "0 0 380.76 355.31",
      height: height,
      className: className,
      style: {
        overflow: "visible",
        display: "block",
        ...style
      },
      role: "img",
      "aria-label": "Continia"
    }, props), /*#__PURE__*/React.createElement("path", {
      d: MARK1,
      fill: fill
    }), /*#__PURE__*/React.createElement("path", {
      d: MARK2,
      fill: fill
    }));
  }
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 2434.81 358.16",
    height: height,
    className: className,
    style: {
      overflow: "visible",
      display: "block",
      ...style
    },
    role: "img",
    "aria-label": "Continia"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: MARK1,
    fill: fill
  }), /*#__PURE__*/React.createElement("path", {
    d: MARK2,
    fill: fill
  }), /*#__PURE__*/React.createElement("path", {
    d: WORD,
    fill: fill
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/PopupWindow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Continia "pop-up window" UI element — matches the official UI.svg:
   a rounded white window with a Tech Blue header bar carrying the white
   "continia" logo (left) and three white window-control dots (right). */

const CSS = `
.cnt-popup {
  font-family: var(--font-sans);
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--shadow-popup);
}
.cnt-popup__bar {
  display: flex; align-items: center; gap: 12px;
  background: var(--c-tech-blue);
  padding: 16px 22px;
}
.cnt-popup__logo { display: inline-flex; }
.cnt-popup__logo svg { display: block; height: 22px; width: auto; }
.cnt-popup__divider { width: 1px; height: 16px; background: rgba(255,255,255,0.3); }
.cnt-popup__name { color: rgba(255,255,255,0.9); font-weight: var(--fw-medium); font-size: 14px; letter-spacing: .01em; }
.cnt-popup__dots { margin-left: auto; display: inline-flex; gap: 8px; }
.cnt-popup__dots i { width: 10px; height: 10px; border-radius: 999px; background: #fff; }
.cnt-popup__body { background: #fff; }
.cnt-popup__body img { display: block; width: 100%; height: auto; }
/* innovation variant: cyan header bar with Tech Blue logo + dots */
.cnt-popup--inno .cnt-popup__bar { background: var(--c-innovation-blue); }
.cnt-popup--inno .cnt-popup__divider { background: rgba(5,41,117,0.25); }
.cnt-popup--inno .cnt-popup__name { color: rgba(5,41,117,0.75); }
.cnt-popup--inno .cnt-popup__dots i { background: var(--c-tech-blue); }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "popup");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function PopupWindow({
  children,
  title = null,
  variant = "default",
  className = "",
  style = {},
  ...props
}) {
  useStyle();
  const inno = variant === "innovation";
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["cnt-popup", inno ? "cnt-popup--inno" : "", className].filter(Boolean).join(" "),
    style: style
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "cnt-popup__bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cnt-popup__logo"
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    color: inno ? "techblue" : "white",
    height: 22
  })), title && /*#__PURE__*/React.createElement("span", {
    className: "cnt-popup__divider",
    "aria-hidden": "true"
  }), title && /*#__PURE__*/React.createElement("span", {
    className: "cnt-popup__name"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "cnt-popup__dots",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null))), /*#__PURE__*/React.createElement("div", {
    className: "cnt-popup__body"
  }, children));
}
Object.assign(__ds_scope, { PopupWindow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PopupWindow.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Continia Button — pill-shaped, Alliance No.2, brand-colored.
 * Self-contained: injects its own CSS (referencing global tokens) once.
 */

const CSS = `
.cnt-btn {
  --_bg: var(--c-tech-blue);
  --_fg: #fff;
  --_bd: transparent;
  font-family: var(--font-sans);
  font-weight: var(--fw-semibold);
  display: inline-flex; align-items: center; justify-content: center;
  gap: 0.55em;
  border: 1.5px solid var(--_bd);
  background: var(--_bg);
  color: var(--_fg);
  border-radius: var(--radius-pill);
  cursor: pointer;
  text-decoration: none;
  line-height: 1;
  white-space: nowrap;
  transition: background var(--dur-base) var(--ease-standard),
              border-color var(--dur-base) var(--ease-standard),
              color var(--dur-base) var(--ease-standard),
              transform var(--dur-fast) var(--ease-standard),
              box-shadow var(--dur-base) var(--ease-standard);
}
.cnt-btn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
.cnt-btn:active { transform: scale(0.975); }
.cnt-btn:disabled, .cnt-btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }

/* sizes */
.cnt-btn--sm { font-size: 13px; padding: 9px 16px; }
.cnt-btn--md { font-size: 15px; padding: 12px 22px; }
.cnt-btn--lg { font-size: 17px; padding: 15px 30px; }

/* caps treatment — the brand's "SEE MORE" style */
.cnt-btn--caps { text-transform: uppercase; letter-spacing: 0.06em; font-weight: var(--fw-bold); }

/* variants */
.cnt-btn--primary { --_bg: var(--c-tech-blue); --_fg: #fff; }
.cnt-btn--primary:hover { --_bg: var(--color-primary-hover); }
.cnt-btn--secondary { --_bg: transparent; --_fg: var(--c-tech-blue); --_bd: var(--c-tech-blue); }
.cnt-btn--secondary:hover { --_bg: var(--c-light-blue); }
.cnt-btn--purple { --_bg: var(--c-performance-purple); --_fg: #fff; }
.cnt-btn--purple:hover { --_bg: #872f9c; }

/* variants for dark (Tech Blue) surfaces */
.cnt-btn--innovation { --_bg: var(--c-innovation-blue); --_fg: var(--c-tech-blue); }
.cnt-btn--innovation:hover { --_bg: var(--c-innovation-blue-50); }
.cnt-btn--white { --_bg: #ffffff; --_fg: var(--c-tech-blue); }
.cnt-btn--white:hover { --_bg: var(--c-light-blue); }
.cnt-btn--ghost-dark { --_bg: transparent; --_fg: #fff; --_bd: rgba(255,255,255,0.55); }
.cnt-btn--ghost-dark:hover { --_bg: rgba(255,255,255,0.12); --_bd: #fff; }

.cnt-btn--block { display: flex; width: 100%; }
.cnt-btn .cnt-btn__icon { display: inline-flex; font-size: 1.15em; line-height: 0; }
`;
let _injected = false;
function useStyle() {
  if (typeof document === "undefined" || _injected) return;
  _injected = true;
  const tag = document.createElement("style");
  tag.setAttribute("data-cnt", "button");
  tag.textContent = CSS;
  document.head.appendChild(tag);
}
function Button({
  children,
  variant = "primary",
  size = "md",
  caps = false,
  block = false,
  icon = null,
  iconRight = null,
  href,
  className = "",
  ...props
}) {
  useStyle();
  const cls = ["cnt-btn", `cnt-btn--${variant}`, `cnt-btn--${size}`, caps ? "cnt-btn--caps" : "", block ? "cnt-btn--block" : "", className].filter(Boolean).join(" ");
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.createElement("span", {
    className: "cnt-btn__icon"
  }, icon), children, iconRight && /*#__PURE__*/React.createElement("span", {
    className: "cnt-btn__icon"
  }, iconRight));
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href
    }, props), inner);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, props), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cnt-card {
  font-family: var(--font-sans);
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
}
.cnt-card--hover:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.cnt-card--flat { box-shadow: none; }
.cnt-card--tint { background: var(--c-light-blue); border-color: transparent; }
.cnt-card--brand { background: var(--c-tech-blue); border-color: transparent; color: #fff; }
.cnt-card__icon {
  width: 48px; height: 48px; border-radius: var(--radius-md);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 24px; color: #fff; background: var(--grad-brand);
  margin-bottom: var(--space-4);
}
.cnt-card--brand .cnt-card__icon { background: rgba(255,255,255,0.12); color: var(--c-innovation-blue); }
.cnt-card__eyebrow { font-size: 11px; font-weight: var(--fw-semibold); letter-spacing: var(--ls-overline); text-transform: uppercase; color: var(--color-text-brand); margin-bottom: 8px; }
.cnt-card--brand .cnt-card__eyebrow { color: var(--c-innovation-blue); }
.cnt-card__title { font-size: 20px; font-weight: var(--fw-bold); letter-spacing: -0.01em; margin: 0 0 8px; color: inherit; }
.cnt-card__body { font-size: 15px; line-height: var(--lh-body); color: var(--color-text-muted); margin: 0; }
.cnt-card--brand .cnt-card__body { color: rgba(255,255,255,0.82); }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "card");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function Card({
  children,
  variant = "default",
  hover = false,
  icon = null,
  eyebrow,
  title,
  className = "",
  ...props
}) {
  useStyle();
  const cls = ["cnt-card", variant !== "default" ? `cnt-card--${variant}` : "", hover ? "cnt-card--hover" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, props), icon && /*#__PURE__*/React.createElement("div", {
    className: "cnt-card__icon"
  }, icon), eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "cnt-card__eyebrow"
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    className: "cnt-card__title"
  }, title), children && /*#__PURE__*/React.createElement("p", {
    className: "cnt-card__body"
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cnt-stat {
  font-family: var(--font-sans);
  position: relative; overflow: hidden;
  background: var(--c-tech-blue);
  color: #fff;
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  min-height: 120px;
  display: flex; flex-direction: column; justify-content: flex-end;
}
.cnt-stat__quarter {
  position: absolute; top: 0; right: 0;
  width: 130px; height: 130px;
  background: var(--grad-brand);
  border-bottom-left-radius: 100%;
  opacity: 0.85;
}
.cnt-stat__value { position: relative; font-size: 56px; font-weight: var(--fw-bold); line-height: 1; letter-spacing: -0.02em; color: #fff; }
.cnt-stat__label { position: relative; font-size: 15px; line-height: 1.4; color: rgba(255,255,255,0.85); margin-top: 8px; max-width: 22ch; }
.cnt-stat--light { background: var(--c-light-blue); color: var(--c-tech-blue); }
.cnt-stat--light .cnt-stat__value { color: var(--c-tech-blue); }
.cnt-stat--light .cnt-stat__label { color: var(--c-tech-blue-85); }
.cnt-stat--light .cnt-stat__quarter { background: var(--c-tech-blue); opacity: 0.12; }

/* color tones */
.cnt-stat--green { background: var(--c-smart-green); }
.cnt-stat--green .cnt-stat__value { color: #fff; }
.cnt-stat--purple { background: var(--c-performance-purple); }
.cnt-stat--purple .cnt-stat__value { color: #fff; }

/* centered icon-left layout */
.cnt-stat--row { flex-direction: row; align-items: center; justify-content: center; gap: var(--space-4); text-align: left; }
.cnt-stat__icon { flex: none; width: auto; height: auto; border-radius: 0;
  display: inline-flex; align-items: center; justify-content: center; font-size: 64px;
  background: transparent; color: #fff; }
.cnt-stat--light .cnt-stat__icon { background: transparent; color: var(--c-tech-blue); }
.cnt-stat--row .cnt-stat__label { font-size: 18px; color: rgba(255,255,255,0.92); margin-top: 4px; }
.cnt-stat--light.cnt-stat--row .cnt-stat__label { color: var(--c-tech-blue-85); }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "stat");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function StatPanel({
  value,
  label,
  variant = "default",
  icon = null,
  className = "",
  ...props
}) {
  useStyle();
  const cls = ["cnt-stat", variant !== "default" ? `cnt-stat--${variant}` : "", icon ? "cnt-stat--row" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, props), !icon && /*#__PURE__*/React.createElement("span", {
    className: "cnt-stat__quarter",
    "aria-hidden": "true"
  }), icon && /*#__PURE__*/React.createElement("span", {
    className: "cnt-stat__icon",
    "aria-hidden": "true"
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: "cnt-stat__text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cnt-stat__value"
  }, value), label && /*#__PURE__*/React.createElement("div", {
    className: "cnt-stat__label"
  }, label)));
}
Object.assign(__ds_scope, { StatPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatPanel.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatusChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Continia StatusChip — the 4-state pill for document/finance states
 * (Imported → Recognized → For approval → Posted). Derived from the
 * functional colors; established on the 2026 frontpage redesign.
 */

const CSS = `
.cnt-status {
  font-family: var(--font-sans); font-weight: var(--fw-bold);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; line-height: 1; padding: 6px 12px;
  border-radius: var(--radius-pill); white-space: nowrap;
  letter-spacing: 0.01em;
}
.cnt-status--wide { min-width: 96px; }
.cnt-status--neutral { background: var(--c-slate-100); color: var(--color-neutral-fg); }
.cnt-status--info { background: var(--c-light-blue); color: var(--color-info-fg); }
.cnt-status--warning { background: var(--c-light-yellow); color: var(--color-warning-fg); }
.cnt-status--success { background: var(--c-smart-green-30); color: var(--color-success-fg); }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "status-chip");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function StatusChip({
  children,
  status = "neutral",
  wide = false,
  className = "",
  ...props
}) {
  useStyle();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["cnt-status", `cnt-status--${status}`, wide ? "cnt-status--wide" : "", className].filter(Boolean).join(" ")
  }, props), children);
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cnt-tag {
  font-family: var(--font-sans); font-weight: var(--fw-semibold);
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; line-height: 1; padding: 6px 12px;
  border-radius: var(--radius-pill); white-space: nowrap;
}
.cnt-tag .cnt-tag__dot { width: 7px; height: 7px; border-radius: 999px; background: currentColor; }
.cnt-tag--neutral { background: var(--c-slate-100); color: var(--color-text); }
.cnt-tag--brand { background: var(--c-light-blue); color: var(--c-tech-blue); }
.cnt-tag--solid { background: var(--c-tech-blue); color: #fff; }
.cnt-tag--innovation { background: var(--c-innovation-blue); color: var(--c-tech-blue); }
.cnt-tag--success { background: var(--color-success-bg); color: #2f6a59; }
.cnt-tag--warning { background: var(--color-warning-bg); color: #8a6a14; }
.cnt-tag--feature { background: var(--color-feature-bg); color: var(--color-feature); }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "tag");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function Tag({
  children,
  variant = "neutral",
  dot = false,
  className = "",
  ...props
}) {
  useStyle();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["cnt-tag", `cnt-tag--${variant}`, className].filter(Boolean).join(" ")
  }, props), dot && /*#__PURE__*/React.createElement("span", {
    className: "cnt-tag__dot"
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cnt-check { font-family: var(--font-sans); display: inline-flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 15px; color: var(--color-text); user-select: none; }
.cnt-check input { position: absolute; opacity: 0; width: 0; height: 0; }
.cnt-check__box {
  flex: none; width: 20px; height: 20px; margin-top: 1px;
  border: 1.5px solid var(--color-border); border-radius: 6px;
  background: #fff; display: inline-flex; align-items: center; justify-content: center;
  transition: background var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard);
}
.cnt-check:hover .cnt-check__box { border-color: var(--c-tech-blue-50); }
.cnt-check__box svg { width: 13px; height: 13px; stroke: #fff; stroke-width: 3; fill: none; opacity: 0; transition: opacity var(--dur-fast) var(--ease-standard); }
.cnt-check input:checked + .cnt-check__box { background: var(--c-tech-blue); border-color: var(--c-tech-blue); }
.cnt-check input:checked + .cnt-check__box svg { opacity: 1; }
.cnt-check input:focus-visible + .cnt-check__box { box-shadow: var(--shadow-focus); }
.cnt-check[data-disabled="true"] { opacity: .5; cursor: not-allowed; }
/* radio variant */
.cnt-check--radio .cnt-check__box { border-radius: 999px; }
.cnt-check--radio input:checked + .cnt-check__box { background: #fff; border-color: var(--c-tech-blue); }
.cnt-check--radio .cnt-check__dot { width: 10px; height: 10px; border-radius: 999px; background: var(--c-tech-blue); opacity: 0; transition: opacity var(--dur-fast) var(--ease-standard); }
.cnt-check--radio input:checked + .cnt-check__box .cnt-check__dot { opacity: 1; }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "checkbox");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function Checkbox({
  label,
  type = "checkbox",
  disabled = false,
  className = "",
  ...props
}) {
  useStyle();
  const isRadio = type === "radio";
  return /*#__PURE__*/React.createElement("label", {
    className: ["cnt-check", isRadio ? "cnt-check--radio" : "", className].filter(Boolean).join(" "),
    "data-disabled": disabled ? "true" : "false"
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    disabled: disabled
  }, props)), /*#__PURE__*/React.createElement("span", {
    className: "cnt-check__box"
  }, isRadio ? /*#__PURE__*/React.createElement("span", {
    className: "cnt-check__dot"
  }) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "2,9 6,13 14,3"
  }))), label && /*#__PURE__*/React.createElement("span", {
    className: "cnt-check__label"
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cnt-field { font-family: var(--font-sans); display: flex; flex-direction: column; gap: 6px; }
.cnt-field__label { font-size: 13px; font-weight: var(--fw-semibold); color: var(--color-text); }
.cnt-field__label .req { color: var(--color-feature); margin-left: 2px; }
.cnt-input-wrap { position: relative; display: flex; align-items: center; }
.cnt-input-wrap__icon { position: absolute; left: 14px; display: inline-flex; color: var(--color-text-muted); font-size: 18px; pointer-events: none; }
.cnt-input {
  font-family: var(--font-sans); font-size: 15px; color: var(--color-text);
  background: #fff; width: 100%; box-sizing: border-box;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 11px 14px;
  transition: border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard);
}
.cnt-input.has-icon { padding-left: 42px; }
.cnt-input::placeholder { color: var(--color-text-subtle); }
.cnt-input:hover { border-color: var(--c-tech-blue-50); }
.cnt-input:focus { outline: none; border-color: var(--c-tech-blue); box-shadow: var(--shadow-focus); }
.cnt-input:disabled { background: var(--c-slate-50); color: var(--color-text-subtle); cursor: not-allowed; }
.cnt-field[data-invalid="true"] .cnt-input { border-color: var(--color-feature); }
.cnt-field__hint { font-size: 12px; color: var(--color-text-muted); }
.cnt-field[data-invalid="true"] .cnt-field__hint { color: var(--color-feature); }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "input");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function Input({
  label,
  hint,
  icon = null,
  required = false,
  invalid = false,
  id,
  className = "",
  ...props
}) {
  useStyle();
  const fid = id || (label ? "f-" + label.replace(/\s+/g, "-").toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "cnt-field",
    "data-invalid": invalid ? "true" : "false"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "cnt-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "cnt-input-wrap"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "cnt-input-wrap__icon"
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: ["cnt-input", icon ? "has-icon" : "", className].filter(Boolean).join(" ")
  }, props))), hint && /*#__PURE__*/React.createElement("span", {
    className: "cnt-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/links.js
try { (() => {
// Canonical continia.com link map — the single source of truth for nav/footer URLs.
// Captured in the July 2026 pricing-session audit. Update HERE; never hand-retype per page.
// Also exported from the bundle as CONTINIA_LINKS.
const BASE = "https://www.continia.com";
const CONTINIA_LINKS = {
  home: BASE + "/",
  // "Get a free trial" CTAs go to Microsoft AppSource (SiteHeader's default CTA href)
  trial: "https://appsource.microsoft.com/en-us/marketplace/apps?search=continia",
  nav: [{
    label: "Solutions",
    href: BASE + "/solutions/",
    menu: true
  }, {
    label: "Use cases",
    href: BASE + "/use-cases/",
    menu: true
  }, {
    label: "Pricing",
    href: BASE + "/pricing/"
  }, {
    label: "Why Continia?",
    href: BASE + "/why-continia/"
  }],
  // opticalScale: per-icon optical-size correction for fa-kit icons (see readme "Iconography")
  solutions: [{
    label: "Document Capture",
    href: BASE + "/solutions/document-capture/",
    icon: "fa-kit fa-document-capture-solution-dc-icon",
    opticalScale: 1.18
  }, {
    label: "Expense Management",
    href: BASE + "/solutions/expense-management/",
    icon: "fa-kit fa-expense-management-solution-em-icon"
  }, {
    label: "Document Output",
    href: BASE + "/solutions/document-output/",
    icon: "fa-kit fa-document-output-solution-do-icon-file-export"
  }, {
    label: "Payment Management",
    href: BASE + "/solutions/payment-management/"
  }, {
    label: "Continia Banking",
    href: BASE + "/solutions/continia-banking/",
    icon: "fa-kit fa-banking-solution-cb-icon"
  }, {
    label: "Continia Finance",
    href: BASE + "/solutions/continia-finance/",
    icon: "fa-kit fa-finance-solution-cf-add-modules--stack-icon"
  }, {
    label: "Collection Management",
    href: BASE + "/solutions/collection-management/"
  }, {
    label: "OPplus",
    href: BASE + "/solutions/opplus/"
  }],
  company: [{
    label: "Contact",
    href: BASE + "/contact/"
  }, {
    label: "Meet the team",
    href: BASE + "/meet-the-team/"
  }, {
    label: "About us",
    href: BASE + "/about-us/"
  }, {
    label: "Career",
    href: BASE + "/career/"
  }, {
    label: "Working at Continia",
    href: BASE + "/working-at-continia/"
  }, {
    label: "Find a partner",
    href: BASE + "/find-a-partner/"
  }],
  resources: [{
    label: "Use cases",
    href: BASE + "/use-cases/"
  }, {
    label: "News",
    href: BASE + "/news/"
  }, {
    label: "Blog",
    href: BASE + "/blog/"
  }, {
    label: "Webinars",
    href: BASE + "/webinars/"
  }, {
    label: "Support",
    href: BASE + "/support/"
  }, {
    label: "Learn",
    href: "https://learn.continia.com/"
  }, {
    label: "Docs",
    href: "https://docs.continia.com/"
  }, {
    label: "Partnerzone",
    href: "https://partnerzone.continia.com/"
  }],
  legal: [{
    label: "Cookie & privacy policy",
    href: BASE + "/cookie-and-privacy-policy/"
  }, {
    label: "Trust Center",
    href: BASE + "/trust-center/"
  }, {
    label: "License terms",
    href: BASE + "/license-terms/"
  }],
  social: [{
    label: "LinkedIn",
    icon: "fa-brands fa-linkedin-in",
    href: "https://www.linkedin.com/company/continia-software"
  }, {
    label: "YouTube",
    icon: "fa-brands fa-youtube",
    href: "https://www.youtube.com/@ContiniaSoftware"
  }]
};
Object.assign(__ds_scope, { CONTINIA_LINKS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/links.js", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Canonical continia.com footer — the official anatomy (pricing session 2026):
 * brand column (logo + tagline + social) · Solutions · Continia Software ·
 * Resources · legal bar (©, policy links, ISO 27001 + BUILT INSIDE badges).
 */

const CSS = `
.cnt-sitefooter { background: var(--c-tech-blue); color: #fff; font-family: var(--font-sans); }
.cnt-sitefooter a { text-decoration: none; }
.cnt-sitefooter__top { max-width: var(--layout-content-max, 1360px); margin: 0 auto; padding: 64px var(--layout-page-pad, 28px) 48px; display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 40px; }
.cnt-sitefooter__brand p { color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.6; margin: 16px 0 20px; }
.cnt-sitefooter__social { display: flex; gap: 10px; }
.cnt-sitefooter__social a { width: 36px; height: 36px; border-radius: var(--radius-pill); border: 1px solid rgba(255,255,255,0.3); display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; transition: background var(--dur-base) var(--ease-standard); }
.cnt-sitefooter__social a:hover { background: rgba(255,255,255,0.12); }
.cnt-sitefooter__col { display: flex; flex-direction: column; gap: 9px; align-items: flex-start; }
.cnt-sitefooter__col h4 { font-size: 12px; letter-spacing: var(--ls-overline); text-transform: uppercase; color: var(--c-innovation-blue); margin: 0 0 8px; font-weight: var(--fw-semibold); }
.cnt-sitefooter__col a { color: rgba(255,255,255,0.78); font-size: 14px; transition: color 200ms var(--ease-standard); }
.cnt-sitefooter__col a:hover { color: var(--c-innovation-blue); }
.cnt-sitefooter__bottom { border-top: 1px solid rgba(255,255,255,0.15); }
.cnt-sitefooter__bottominner { max-width: var(--layout-content-max, 1360px); margin: 0 auto; padding: 20px var(--layout-page-pad, 28px); display: flex; align-items: center; gap: 12px 22px; flex-wrap: wrap; font-size: 13px; color: rgba(255,255,255,0.65); }
.cnt-sitefooter__legal { display: flex; gap: 18px; flex-wrap: wrap; }
.cnt-sitefooter__legal a { color: rgba(255,255,255,0.65); transition: color 200ms var(--ease-standard); }
.cnt-sitefooter__legal a:hover { color: var(--c-innovation-blue); }
.cnt-sitefooter__badges { display: flex; gap: 8px; margin-left: auto; }
.cnt-sitefooter__badge { border: 1px solid rgba(255,255,255,0.3); border-radius: var(--radius-pill); padding: 5px 12px; font-size: 10.5px; letter-spacing: 0.08em; font-weight: var(--fw-semibold); color: rgba(255,255,255,0.85); white-space: nowrap; text-transform: uppercase; }
@media (max-width: 920px) { .cnt-sitefooter__top { grid-template-columns: 1fr 1fr; } .cnt-sitefooter__badges { margin-left: 0; } }
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "site-footer");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function SiteFooter({
  links = __ds_scope.CONTINIA_LINKS,
  className = "",
  ...props
}) {
  useStyle();
  const cols = [["Solutions", links.solutions], ["Continia Software", links.company], ["Resources", links.resources]];
  return /*#__PURE__*/React.createElement("footer", _extends({
    className: ["cnt-sitefooter", className].filter(Boolean).join(" ")
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "cnt-sitefooter__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cnt-sitefooter__brand"
  }, /*#__PURE__*/React.createElement("a", {
    href: links.home,
    "aria-label": "Continia home"
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    color: "white",
    height: 28
  })), /*#__PURE__*/React.createElement("p", null, "Scalable add-on solutions for Microsoft Dynamics 365 Business Central", /*#__PURE__*/React.createElement("br", null), "\u2014 100% built inside."), /*#__PURE__*/React.createElement("div", {
    className: "cnt-sitefooter__social"
  }, links.social.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.label,
    href: s.href,
    "aria-label": s.label
  }, /*#__PURE__*/React.createElement("i", {
    className: s.icon
  }))))), cols.map(([h, items]) => /*#__PURE__*/React.createElement("nav", {
    key: h,
    className: "cnt-sitefooter__col",
    "aria-label": h
  }, /*#__PURE__*/React.createElement("h4", null, h), items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.label,
    href: it.href
  }, it.label))))), /*#__PURE__*/React.createElement("div", {
    className: "cnt-sitefooter__bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cnt-sitefooter__bottominner"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " Continia Software A/S. It's about time."), /*#__PURE__*/React.createElement("div", {
    className: "cnt-sitefooter__legal"
  }, links.legal.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href
  }, l.label))), /*#__PURE__*/React.createElement("div", {
    className: "cnt-sitefooter__badges"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cnt-sitefooter__badge"
  }, "ISO 27001"), /*#__PURE__*/React.createElement("span", {
    className: "cnt-sitefooter__badge"
  }, "Built inside Business Central")))));
}
Object.assign(__ds_scope, { CONTINIA_LINKS: __ds_scope.CONTINIA_LINKS, SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Canonical continia.com site header. Use this on EVERY page — never
 * re-implement the nav (copy-pasted headers drifted; pricing session 2026).
 */

const CSS = `
.cnt-siteheader { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); font-family: var(--font-sans); transition: box-shadow 250ms var(--ease-standard); }
.cnt-siteheader--static { position: relative; }
.cnt-siteheader--scrolled { box-shadow: 0 8px 24px rgba(5,41,117,0.10); }
.cnt-siteheader__inner { max-width: var(--layout-content-max, 1360px); margin: 0 auto; padding: 14px var(--layout-page-pad, 28px); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 28px; }
.cnt-siteheader__logo { display: flex; flex: none; justify-self: start; }
.cnt-siteheader__nav { display: flex; gap: 4px; justify-self: center; min-width: 0; }
.cnt-siteheader__link { font-size: 15px; font-weight: var(--fw-semibold); color: var(--color-text); text-decoration: none; padding: 8px 12px; display: inline-flex; align-items: center; gap: 7px; transition: color var(--dur-base) var(--ease-standard); }
.cnt-siteheader__link:hover { color: var(--c-tech-blue); }
.cnt-siteheader__link i { font-size: 11px; opacity: 0.55; }
.cnt-siteheader__link--active { color: var(--c-tech-blue); box-shadow: inset 0 -2px 0 var(--c-innovation-blue); padding-bottom: 3px; }
.cnt-siteheader__actions { display: flex; align-items: center; gap: 14px; flex: none; justify-self: end; }
.cnt-siteheader__find { font-size: 14px; }
.cnt-siteheader__find i { font-size: 13px; opacity: 1; }
.cnt-siteheader__burger { display: none; background: none; border: 0; font-size: 20px; color: var(--c-tech-blue); cursor: pointer; padding: 6px; }
.cnt-siteheader__mobile { display: none; }
@media (max-width: 980px) {
  .cnt-siteheader__inner { display: flex; justify-content: space-between; }
  .cnt-siteheader__nav, .cnt-siteheader__find { display: none; }
  .cnt-siteheader__burger { display: block; }
  .cnt-siteheader__mobile { display: flex; flex-direction: column; gap: 2px; padding: 8px var(--layout-page-pad, 28px) 18px; border-top: 1px solid var(--color-border); }
}
`;
let _i = false;
function useStyle() {
  if (typeof document === "undefined" || _i) return;
  _i = true;
  const t = document.createElement("style");
  t.setAttribute("data-cnt", "site-header");
  t.textContent = CSS;
  document.head.appendChild(t);
}
function SiteHeader({
  activeItem,
  ctaLabel = "Get a free trial",
  onCta,
  ctaHref,
  sticky = true,
  links = __ds_scope.CONTINIA_LINKS,
  className = "",
  ...props
}) {
  useStyle();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    if (!sticky) return;
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, {
      passive: true
    });
    return () => window.removeEventListener("scroll", on);
  }, [sticky]);
  const findPartner = links.company.find(c => c.label === "Find a partner");
  const ctaLink = ctaHref ?? (onCta ? undefined : links.trial);
  const navLink = (l, extra = "") => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    className: ["cnt-siteheader__link", l.label === activeItem ? "cnt-siteheader__link--active" : "", extra].filter(Boolean).join(" "),
    href: l.href,
    "aria-current": l.label === activeItem ? "page" : undefined
  }, l.label, l.menu && /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-chevron-down"
  }));
  return /*#__PURE__*/React.createElement("header", _extends({
    className: ["cnt-siteheader", sticky ? "" : "cnt-siteheader--static", scrolled ? "cnt-siteheader--scrolled" : "", className].filter(Boolean).join(" ")
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "cnt-siteheader__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "cnt-siteheader__logo",
    href: links.home,
    "aria-label": "Continia home"
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    height: 30
  })), /*#__PURE__*/React.createElement("nav", {
    className: "cnt-siteheader__nav",
    "aria-label": "Primary"
  }, links.nav.map(l => navLink(l))), /*#__PURE__*/React.createElement("div", {
    className: "cnt-siteheader__actions"
  }, findPartner && /*#__PURE__*/React.createElement("a", {
    className: "cnt-siteheader__link cnt-siteheader__find",
    href: findPartner.href
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-location-dot"
  }), " Find a partner"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onCta,
    href: ctaLink
  }, ctaLabel), /*#__PURE__*/React.createElement("button", {
    className: "cnt-siteheader__burger",
    "aria-label": "Menu",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-" + (open ? "xmark" : "bars")
  })))), open && /*#__PURE__*/React.createElement("div", {
    className: "cnt-siteheader__mobile"
  }, links.nav.map(l => navLink(l)), findPartner && /*#__PURE__*/React.createElement("a", {
    className: "cnt-siteheader__link",
    href: findPartner.href
  }, "Find a partner")));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// Continia website — footer + demo dialog
const {
  Logo,
  Input,
  Button,
  Checkbox
} = window.ContiniaDesignSystem_354b58;
function Footer() {
  const cols = {
    Solutions: ["Document Capture", "Document Output", "Expense Management", "Payment Management", "Continia Finance", "Continia Banking", "Collection Management", "OPplus"],
    "Continia Software": ["Contact", "Meet the team", "About us", "Career", "Working at Continia", "Find a partner"],
    Resources: ["Use cases", "News", "Blog", "Webinars", "Support", "Learn", "Docs", "Partnerzone"]
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-footer__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-footer__brand"
  }, /*#__PURE__*/React.createElement(Logo, {
    color: "white",
    height: 30
  }), /*#__PURE__*/React.createElement("p", null, "Scalable add-on solutions for Microsoft Dynamics 365 Business Central", /*#__PURE__*/React.createElement("br", null), "\u2014 100% built inside."), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__social"
  }, ["linkedin-in", "youtube"].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    "aria-label": s
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-" + s
  }))))), Object.entries(cols).map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    className: "site-footer__col"
  }, /*#__PURE__*/React.createElement("h4", null, h), items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    href: "#"
  }, it))))), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " Continia Software A/S. It's about time."), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__legal"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Cookie & privacy policy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Trust Center"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "License terms"))));
}
function DemoDialog({
  open,
  onClose
}) {
  const [sent, setSent] = React.useState(false);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal__panel",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal__close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-xmark"
  })), !sent ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Get a free trial"), /*#__PURE__*/React.createElement("h3", {
    className: "modal__title"
  }, "Start automating in Business Central"), /*#__PURE__*/React.createElement("p", {
    className: "modal__sub"
  }, "Tell us a little about your team and we'll point you to a free trial on Microsoft AppSource."), /*#__PURE__*/React.createElement("div", {
    className: "modal__form"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    required: true,
    placeholder: "you@company.com",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-light fa-envelope"
    })
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Company",
    placeholder: "Acme A/S"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "I'd like product updates from Continia",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    onClick: () => setSent(true)
  }, "Get my free trial"))) : /*#__PURE__*/React.createElement("div", {
    className: "modal__done"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal__check"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-check"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "modal__title"
  }, "It's about time \u2014 thanks!"), /*#__PURE__*/React.createElement("p", {
    className: "modal__sub"
  }, "Check your inbox for your free-trial link. You can count on us."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onClose
  }, "Close"))));
}
Object.assign(window, {
  Footer,
  DemoDialog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// Continia website — top navigation header
const {
  Logo,
  Button
} = window.ContiniaDesignSystem_354b58;
function Header({
  onDemo
}) {
  const [open, setOpen] = React.useState(false);
  const links = ["Solutions", "Use cases", "Pricing", "Why Continia?"];
  const hasMenu = {
    "Solutions": true,
    "Use cases": true
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "site-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-header__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "site-header__logo",
    href: "#",
    "aria-label": "Continia home"
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 30
  })), /*#__PURE__*/React.createElement("nav", {
    className: "site-nav",
    "aria-label": "Primary"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    className: "site-nav__link",
    href: "#"
  }, l, hasMenu[l] && /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-chevron-down"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "site-header__actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "site-nav__link site-nav__signin",
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-location-dot"
  }), " Find a partner"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onDemo
  }, "Get a free trial"), /*#__PURE__*/React.createElement("button", {
    className: "site-header__burger",
    "aria-label": "Menu",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-" + (open ? "xmark" : "bars")
  })))), open && /*#__PURE__*/React.createElement("div", {
    className: "site-header__mobile"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    className: "site-nav__link"
  }, l)), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "site-nav__link"
  }, "Find a partner")));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// Continia website — hero (aligned to continia.com/home)
// "Save time / Automate your finance processes" + Business Central screen in a pop-up window
const {
  Button,
  PopupWindow
} = window.ContiniaDesignSystem_354b58;
function BCScreen() {
  const rows = [{
    doc: "Invoice 100482",
    vendor: "Northwind Traders",
    amt: "€ 4,820.00"
  }, {
    doc: "Invoice 100483",
    vendor: "Fabrikam Inc.",
    amt: "€ 1,240.50"
  }, {
    doc: "Credit memo 5521",
    vendor: "Contoso Ltd.",
    amt: "€ 612.00"
  }, {
    doc: "Invoice 100484",
    vendor: "Adatum Corp.",
    amt: "€ 9,310.75"
  }, {
    doc: "Invoice 100485",
    vendor: "Tailspin Toys",
    amt: "€ 2,054.20"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "bc-shot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bc-shot__rows"
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.doc,
    className: "bc-shot__row"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-file-invoice"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bc-shot__doc"
  }, /*#__PURE__*/React.createElement("strong", null, r.doc), /*#__PURE__*/React.createElement("span", null, r.vendor)), /*#__PURE__*/React.createElement("span", {
    className: "bc-shot__amt"
  }, r.amt), /*#__PURE__*/React.createElement("span", {
    className: "bc-shot__chip"
  }, "Posted")))));
}
function Hero({
  onDemo
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Finance automation \xB7 Business Central"), /*#__PURE__*/React.createElement("h1", {
    className: "hero__title"
  }, "Save time"), /*#__PURE__*/React.createElement("h2", {
    className: "hero__sub"
  }, "Automate your finance processes"), /*#__PURE__*/React.createElement("p", {
    className: "hero__lead"
  }, "Eliminate 90% of manual tasks with finance automation solutions built inside Microsoft Dynamics 365 Business Central."), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "md",
    onClick: onDemo,
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-light fa-arrow-right"
    })
  }, "Get a free trial"), /*#__PURE__*/React.createElement(Button, {
    size: "md",
    variant: "purple"
  }, "Find all webinars")), /*#__PURE__*/React.createElement("div", {
    className: "hero__proof"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "30+"), " years of experience"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "2,000+"), " partners worldwide"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "45+"), " countries"))), /*#__PURE__*/React.createElement("div", {
    className: "hero__art"
  }, /*#__PURE__*/React.createElement(PopupWindow, {
    title: "Business Central",
    className: "hero__window"
  }, /*#__PURE__*/React.createElement(BCScreen, null)))));
}
window.Hero = Hero;
window.BCScreen = BCScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
// Continia website — content sections (aligned to continia.com/home)
const {
  Card,
  Button,
  StatPanel,
  PopupWindow
} = window.ContiniaDesignSystem_354b58;

// The five solutions featured on the live home page, with their real descriptions.
// Icons are Continia's own custom solution icons from the FA Pro kit (fa-kit prefix).
const SOLUTIONS = [{
  icon: "document-capture-solution-dc-icon",
  name: "Document Capture",
  href: "/solutions/document-capture/",
  desc: "Automate your entire Accounts Payable — streamline your invoice process from start to finish."
}, {
  icon: "banking-solution-cb-icon",
  name: "Continia Banking",
  href: "/solutions/banking/",
  desc: "Streamline payments and secure your financial operations directly within your Business Central."
}, {
  icon: "finance-solution-cf-add-modules--stack-icon",
  name: "Continia Finance",
  href: "/solutions/finance/",
  desc: "Optimize your financial processes and ease the burden of core accounting tasks."
}, {
  icon: "expense-management-solution-em-icon",
  name: "Expense Management",
  href: "/solutions/expense-management/",
  desc: "Simplify employee expense reporting and get a real-time overview of employee spending."
}, {
  icon: "document-output-solution-do-icon-file-export",
  name: "Document Output",
  href: "/solutions/document-output/",
  desc: "Automate and customize your document distribution — send and manage your outgoing documents easily."
}];

// Real customers from the live "Trusted by" wall (rendered as wordmarks).
const CUSTOMERS = ["KEMPINSKI", "MAERSK", "BMW", "PwC", "KPMG", "BESTSELLER", "HUMMEL", "WEBER", "TASCHEN", "EVENTIM"];
function TrustBar() {
  return /*#__PURE__*/React.createElement("section", {
    className: "trust"
  }, /*#__PURE__*/React.createElement("p", {
    className: "trust__label"
  }, "Trusted by:"), /*#__PURE__*/React.createElement("div", {
    className: "trust__logos"
  }, CUSTOMERS.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    className: "trust__logo"
  }, n))));
}
function SolutionsGrid() {
  const [active, setActive] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "solutions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Our solutions"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "Scalable add-on solutions for Business Central"), /*#__PURE__*/React.createElement("p", {
    className: "section__sub"
  }, "We make scalable add-on solutions for Microsoft Dynamics 365 Business Central \u2014 100% built inside for maximum efficiency.")), /*#__PURE__*/React.createElement("div", {
    className: "solutions"
  }, SOLUTIONS.map((s, i) => /*#__PURE__*/React.createElement(Card, {
    key: s.name,
    hover: true,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-kit fa-" + s.icon
    }),
    eyebrow: "Solution",
    title: s.name,
    onMouseEnter: () => setActive(i),
    className: i === active ? "is-active" : ""
  }, s.desc))));
}
function StatBand() {
  return /*#__PURE__*/React.createElement("section", {
    className: "statband"
  }, /*#__PURE__*/React.createElement("div", {
    className: "statband__item"
  }, /*#__PURE__*/React.createElement("strong", null, "30+ years"), /*#__PURE__*/React.createElement("span", null, "of experience")), /*#__PURE__*/React.createElement("div", {
    className: "statband__divider",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "statband__item statband__item--built"
  }, /*#__PURE__*/React.createElement("span", {
    className: "statband__built"
  }, "BUILT INSIDE"), /*#__PURE__*/React.createElement("strong", null, "Microsoft Dynamics 365"), /*#__PURE__*/React.createElement("span", null, "Business Central")), /*#__PURE__*/React.createElement("div", {
    className: "statband__divider",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "statband__item"
  }, /*#__PURE__*/React.createElement("strong", null, "2,000+ partners"), /*#__PURE__*/React.createElement("span", null, "worldwide")));
}
function Legwork() {
  const reasons = ["Eliminate manual tasks with automation and AI", "Reduce errors and improve transaction security", "Get scalable solutions tailored to your growing business", "Ensure compliance with the latest regulations and standards"];
  return /*#__PURE__*/React.createElement("section", {
    className: "section section--tint",
    id: "why"
  }, /*#__PURE__*/React.createElement("div", {
    className: "built"
  }, /*#__PURE__*/React.createElement("div", {
    className: "built__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Why Continia?"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "Let the software do the legwork for you"), /*#__PURE__*/React.createElement("p", {
    className: "section__sub"
  }, "Say goodbye to manual data entry and repetitive tasks. Continia streamlines your financial processes, saving you time and money to spend on more valuable activities."), /*#__PURE__*/React.createElement("ul", {
    className: "checklist"
  }, reasons.map(t => /*#__PURE__*/React.createElement("li", {
    key: t
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-check"
  }), " ", t))), /*#__PURE__*/React.createElement(Button, {
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-light fa-arrow-right"
    })
  }, "Why choose Continia")), /*#__PURE__*/React.createElement("div", {
    className: "built__art"
  }, /*#__PURE__*/React.createElement(PopupWindow, {
    title: "Business Central",
    className: "hero__window"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bc-shot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bc-shot__rows"
  }, [{
    doc: "Invoice 100482",
    vendor: "Northwind Traders",
    amt: "€ 4,820.00"
  }, {
    doc: "Invoice 100483",
    vendor: "Fabrikam Inc.",
    amt: "€ 1,240.50"
  }, {
    doc: "Credit memo 5521",
    vendor: "Contoso Ltd.",
    amt: "€ 612.00"
  }, {
    doc: "Invoice 100484",
    vendor: "Adatum Corp.",
    amt: "€ 9,310.75"
  }, {
    doc: "Invoice 100485",
    vendor: "Tailspin Toys",
    amt: "€ 2,054.20"
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.doc,
    className: "bc-shot__row"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-light fa-file-invoice"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bc-shot__doc"
  }, /*#__PURE__*/React.createElement("strong", null, r.doc), /*#__PURE__*/React.createElement("span", null, r.vendor)), /*#__PURE__*/React.createElement("span", {
    className: "bc-shot__amt"
  }, r.amt), /*#__PURE__*/React.createElement("span", {
    className: "bc-shot__chip"
  }, "Posted")))))))));
}
function Stats() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "100% built inside Business Central"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "An intuitive, easy-to-use interface")), /*#__PURE__*/React.createElement("div", {
    className: "stats__grid"
  }, /*#__PURE__*/React.createElement(StatPanel, {
    value: "21,000+",
    label: "Customers",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-light fa-users"
    })
  }), /*#__PURE__*/React.createElement(StatPanel, {
    value: "32,000+",
    label: "Solutions sold",
    variant: "green",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-light fa-cubes"
    })
  }), /*#__PURE__*/React.createElement(StatPanel, {
    value: "45+",
    label: "Countries",
    variant: "purple",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-light fa-earth-europe"
    })
  })));
}
function CTA({
  onDemo
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cta"
  }, /*#__PURE__*/React.createElement("img", {
    className: "cta__fifth",
    src: "../../assets/brand/fifth-element-inline-innovation.svg",
    alt: "",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cta__inner"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "cta__title"
  }, "It's about time to future-proof your finance operations"), /*#__PURE__*/React.createElement("p", {
    className: "cta__sub"
  }, "Get all your tools in one place and work faster \u2014 without leaving Business Central."), /*#__PURE__*/React.createElement("div", {
    className: "cta__btns"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    className: "cta-btn-solid",
    onClick: onDemo
  }, "Get a free trial"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "purple"
  }, "Find a partner"))));
}
Object.assign(window, {
  TrustBar,
  SolutionsGrid,
  StatBand,
  Legwork,
  Stats,
  CTA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.PopupWindow = __ds_scope.PopupWindow;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatPanel = __ds_scope.StatPanel;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.CONTINIA_LINKS = __ds_scope.CONTINIA_LINKS;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

})();
