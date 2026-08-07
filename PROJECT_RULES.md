# Project rules — Continia Expense Management

These rules were enforced across the whole design and must be enforced in the
implementation too.

## Banned visual patterns (never use, in any file)

1. **No quarter-circle / arc decorations.** No `border-radius: 0 0 0 Npx` corner
   fills, no arcs peeking out of cards, no circular overlays on tiles, panels or
   photos. The brand guide allows the quarter circle as a marketing motif — it is
   **not allowed in product UI**. Product surfaces stay flat and quiet.
2. **No rounded container with a coloured left-border accent bar.** The
   `border-left: 3px solid <accent>` + tinted background callout is banned
   everywhere. For a callout, use a plain white card with a 1px `#dde3ee` border
   (or a divided list inside one bordered container) and let a coloured icon carry
   the meaning.
3. **No 5th element watermark** in product UI.
4. **No accent bar on active navigation.** Active state is a background tone plus
   a heavier weight.

Signal state with **chips, icons and text**, never with decorative shapes or
accent bars. Colour is never the only signal.

## Applies to
Every surface in the product — mobile app, desktop portal, and the expense
design-system documentation.
