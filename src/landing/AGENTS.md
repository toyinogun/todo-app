# Landing page (`src/landing/`)

The public front door at `/todo-app/`, built by the `scroll-craft` skill as a scroll driven page. Spec: `docs/specs/0004-landing-page.md`. Brief, screenshot script, and check script: `scrollcraft/builds/landing/`.

## Files

- `index.html` (repo root): the page itself, real HTML with `data-sc-*` attributes. The copy, the `Open the app` links (always to `/todo-app/app/`), and the head tags live here.
- `main.tsx`: loads the engine and the styles in order (`scrollcraft.css`, the app's `index.css` for the demo's tokens, `scrollcraft.js`, `landing.css`), then mounts the engine, the folio, and the demo.
- `scrollcraft.js`, `scrollcraft.css`: vendored copies of `.claude/skills/scroll-craft/engine/`. Never edit them; copy a newer engine over them instead. `scrollcraft.d.ts` types the global.
- `landing.css`: the `--sc-*` token overrides and every page style. The one place outside `src/index.css` where raw colours are allowed (spec 0004's exception to spec 0003).
- `signature.ts`: the folio in the margin, a list of the chapters that ticks itself as you scroll and hands over at the close. Plain IntersectionObserver, no engine.
- `Demo.tsx`: three sample tasks on the real `TaskRow`, in React state only.
- `assets/`: app screenshots captured by `scrollcraft/builds/landing/capture.mjs` from the dev server. Recapture when the list's look changes.

## Rules

- Never import `src/lib/storage.ts` or `usePersistedTasks` here. The demo writes nothing.
- Add motion only inside `@media (prefers-reduced-motion: no-preference)`.
- Every section, headline, and the Open link must exist in `index.html`, not only in script output, so the page reads with scripts off. The `<noscript>` block in `index.html` shows content the engine would otherwise hide.
- Sections need `data-sc-act="flow"` for the engine to drive their cues, reveals, and parallax.
- Check after a change: `pnpm build`, serve `scrollcraft/builds/landing/site` on port 4500 with scroll-craft's `serve.mjs`, run `shoot.mjs` at desktop, 390 wide, and reduced motion, then run the check script in the build folder for scripts off, keyboard order, and demo isolation.

_Drafted by /sync from the introducing change, worth a quick human pass._
