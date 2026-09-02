# 0004. Landing page at the root as a scroll-craft page, list moves to /app/

**Date**: 2026-09-02 (updated 2026-09-02: design source changed from `design.md` to `scroll-craft`)
**Status**: Accepted

## Summary

This decides where the public landing page lives and how it is designed. The page becomes the front door at `/todo-app/`, and the working list moves one step in, to `/todo-app/app/`. Both are plain static pages built by Vite (the build tool) from two HTML files, with no routing library. The landing is a scroll experience page built by the `scroll-craft` skill (scroll is the timeline: sections pin, headlines assemble, one signature move), with its own look as a recorded exception to the quiet app style. No generated media: the app itself, your screenshots, and typography are the visuals. The page closes on a small playable copy of the real list (three sample tasks, kept in memory, never saved) next to the one Open button.

## Context

The app is done and deployed, but its only URL drops a stranger straight into an empty list with no explanation. The scope asks for a short public page that says what the app is, that the list stays private on the device, that there is no account, shows the app, and has one clear button that opens the working list.

The forces are small and fixed by earlier specs. Spec 0001 makes this a static site on GitHub Pages under the sub path `/todo-app/`, with no server, so the page must be static files and any extra path must exist as a real folder in the build output. Spec 0003 fixes the app's look: tokens in `src/index.css`, the four base pieces, dark mode by the system, no shadows, no transitions, keyboard and label rules. A marketing page wants motion and drama that the app deliberately does not, so the two looks have to be reconciled on purpose rather than by drift. One person builds this at Prototype tier, so anything added must be cheap to keep: an image that goes stale, a routing library, a paid media pipeline, or a redirect trick each carries a cost far beyond the page's worth.

The real choices are placement and design source. Putting the landing at the root changes what an existing bookmark opens; putting it beside the app keeps the bookmark but hides the front door. A plain hero is cheap but forgettable; a scroll experience is memorable but brings its own engine and rules. Not deciding means the list keeps greeting visitors with an empty box.

## Requirements

**User stories**:
- As a first time visitor, I want to scroll through a short page that shows me what this app is and why my list is private so that I decide to try it in under a minute.
- As a visitor, I want one obvious button that opens the working list so that I do not hunt for the app.
- As a visitor on a phone, using only a keyboard, or with reduced motion on, I want the page to read and work as well as the app does.
- As a returning user, I want a small way back to the landing page from the list so that I can share it.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):
- **AC-1**: Opening `/todo-app/` shows the landing page: the app name, what it is, and the private, no account, no server message, readable as real text in the page's own sections.
- **AC-2**: The page has exactly one primary action, labelled `Open the app`, used everywhere it appears, which is a real link to `/todo-app/app/`, and the working list opens there with every task list behaviour of Release 1 intact.
- **AC-3**: With JavaScript disabled or failed, the page still reads top to bottom as plain sections with the headline, the lines, and the Open link working; only motion, pinning, and the demo need scripts.
- **AC-4**: The closing act holds a live demo of the real list: three sample tasks rendered with the real row pieces, which you can tick, edit, and delete; a reload restores the three samples and nothing is written to localStorage.
- **AC-5**: The landing is built by `scroll-craft` on its engine and `--sc-*` tokens with its own palette and type, as a recorded exception to spec 0003; the app at `/app/` is untouched and stays on `design.md`. No media is generated; visuals are typography, the demo, and screenshots you capture.
- **AC-6**: Everything on the page is reachable and usable by keyboard in a sensible order, with a visible focus ring, and every control has a label; the page reads well at 390px wide and at desktop width.
- **AC-7**: The landing document has a `<title>`, a `<meta name="description">`, and Open Graph `og:title`, `og:description`, `og:url`, and `og:image` tags, so a shared link shows a name and a line.
- **AC-8**: The list page footer carries a plain `About` link back to `/todo-app/`, and the list is otherwise unchanged.
- **AC-9**: `pnpm build` produces both `dist/index.html` and `dist/app/index.html`, and the deployed site serves both paths.
- **AC-10**: With `prefers-reduced-motion` on, the page shows every section static and complete with no pinning or scrubbing, and nothing is hidden behind motion.
- **AC-11**: The build has a `scrollcraft/builds/landing/BRIEF.md` from the scroll-craft interview and a screenshot strip from its verify step at desktop, 390px, and reduced motion, with no dead scroll or unreadable text reported.

## Options considered

Two independent choices, placement and design source.

### Placement

**Option 1: Root is the landing page, the list at `/app/`, two Vite HTML entries.** Vite's multi page build takes `index.html` (landing) and `app/index.html` (list) as inputs and emits both under `dist/`. No router. Pros: the shared URL is the page that explains the app; no dependency; each page loads only its own script. Cons: existing bookmarks to `/todo-app/` need one click to reach the list; two `<head>` blocks kept in step by hand.

**Option 2: Root stays the list, landing at `/about/`.** Same mechanism, reversed. Pros: nothing moves for a current user. Cons: the page nobody links to is the page nobody reads.

**Option 3: One page, hash route.** One entry renders the landing and swaps in the list on `#app`. Pros: one file. Cons: the landing downloads the app code, the URL looks odd, no JavaScript shows nothing.

**Option 4: Add a client router.** Pros: grows well with many pages. Cons: a dependency plus the GitHub Pages 404 redirect trick, for two pages that share no state.

### Design source

**Option A: A static hero to `design.md`.** One screen in the app's quiet style: name, three lines, button, demo. Pros: cheapest to build and keep; one look across app and landing. Cons: forgettable; nothing to make a visitor remember the page. This was the original pick, replaced on 2026-09-02.

**Option B: A scroll experience page by `scroll-craft`.** The skill interviews you, picks a page grammar and a signature move, writes real HTML on its engine, and verifies by screenshotting its own scroll. Pros: memorable; real semantic HTML; a repeatable, verified process rather than hand rolled animation. Cons: a second look and a second token set to hold as an exception; the landing needs scripts for motion; the engine and its verify harness (Playwright) are more machinery than a hero; the interview is a creative session you must sit for.

## Decision

**Chosen option**: Placement Option 1 and Design source Option B

The landing page is a second Vite entry at the repo root, built by `scroll-craft` as a scroll experience page with its own look, the list moves to `app/index.html`, and the page closes on the in memory demo and the one Open button.

**Implementation skills**: `scroll-craft` (`.claude/skills/scroll-craft/`, the landing page's design source and build process) · `vercel-react-best-practices` (`vercel-labs/agent-skills`, `.claude/skills/vercel-react-best-practices/`, the demo component and the list entry)

The engineer's picks, recorded as fixed requirements:
- Design source: `scroll-craft`. `/develop landing page` hands the page to that skill. Its eight question interview runs then, inside `/develop`, and its answers live in `scrollcraft/builds/landing/BRIEF.md`, not here.
- Integration: the root `index.html` is the scroll-craft page and Vite bundles it as the landing entry; the engine files sit under `src/landing/`.
- Look: the landing has its own palette and type through the `--sc-*` tokens, an exception to spec 0003 limited to `index.html` and `src/landing/`. The app stays on `design.md`.
- Demo: kept, as the closing act, playable, in memory only.
- Assets: nothing generated, no API key, no spend. The world is the app: typography, screenshots you capture, the live demo.
- Return visits: always show the landing; no redirect, no stored preference.
- Discoverability: title, description, and Open Graph tags. Nothing more.
- Way back: an `About` link in the list footer.
- No JavaScript: the page reads as plain sections and the Open link works; motion and the demo need scripts.

Inputs the scroll-craft brief needs that are settled now (so the interview asks only the creative questions):
- **What it is, for whom**: a personal to do list in the browser, for one person, saved on their device.
- **The belief to install**: your list stays on your device and nobody else ever sees it.
- **The one action and its label**: `Open the app`, everywhere it appears.
- **Assets on hand**: the running app (screenshots you capture at light and dark, desktop and phone), the SVG icons in `public/`, the tokens in `src/index.css` as a starting palette. No footage, no photos, no brand kit.
- **Hard rules from this project**: no invented numbers (no user counts, no stat counters); no audio; every section is real text; the demo is the closing act; the close resolves on the demo plus the button and holds.
- **Grammar, signature move, journey beats, feeling curve, energy curve, aesthetic range, one world or scenes**: decided in the interview and recorded in `BRIEF.md`. The spec does not pre empt them.

Calls made here with the design in hand:
- **Entry layout**: `index.html` at the root is the scroll-craft page and the landing entry; `app/index.html` is the list entry with the existing `src/main.tsx`. `src/landing/` holds `scrollcraft.js`, `scrollcraft.css` (copied from the skill's `engine/`, never edited), `landing.css` (the `--sc-*` overrides and page styles), `Demo.tsx`, and `main.tsx` (mounts the demo and loads the engine). Vite's `build.rollupOptions.input` names both entries. Runner up was a separate static build folder copied over `dist/`, which means two build systems.
- **Engine loading**: `src/landing/main.tsx` imports `./scrollcraft.css` and `./scrollcraft.js` so Vite bundles and hashes them. Runner up was `<script src>` tags in `index.html`, which works but bypasses the bundle.
- **Where the demo mounts**: an empty `div#demo` inside the closing act's markup, with the copy and the Open link as real HTML around it. If scripts fail, the closing act still shows the copy and the link, and an empty box.
- **Demo state**: `useState` over the pure functions in `src/lib/tasks.ts` (`addTask`, `toggleTask`, `editTitle`, `deleteTask`), seeded once with three titles. The storage boundary rule in `AGENTS.md` holds: the demo never imports `src/lib/storage.ts`.
- **Demo pieces**: reuse `TaskRow` as is inside a `ul` styled by `tasks.css`, framed by `--sc-surface`. The rows keep the app's tokens inside the frame on purpose: the demo is the real product shown inside the marketing page.
- **Sample tasks**: `Buy milk` (done), `Book the dentist`, `Reply to Sam`.
- **Reduced motion**: the engine's reduced motion path renders every act static; `landing.css` must not add motion outside `@media (prefers-reduced-motion: no-preference)`, per spec 0003.
- **Head tags**: `<title>` is `To do, a private list in your browser`; the list page keeps `To do`. `og:url` is `https://toyinogun.github.io/todo-app/`. `og:image` points at `/todo-app/og.png`, a file you add later (Follow-up).
- **Copy anchors** (the interview and the page grammar decide the rest; these lines are the fixed facts, edit freely):
  - The name: `To do`
  - What it is: `A to do list that stays on your device.`
  - The private line: `Your list is saved in this browser and never leaves it. No account, no server, nothing to sign up for.`
  - The action: `Open the app`
  - Demo caption (small, `--sc-ink-soft`): `Try it here. This sample is not saved.`
- **About link**: the list footer becomes `Your list never leaves this browser. <a href=BASE_URL>About</a>`, using `import.meta.env.BASE_URL` so the base path is never typed twice.
- **Verification tooling**: scroll-craft's `serve.mjs` and `shoot.mjs` run against `dist/` after `pnpm build` (the page needs the bundled engine). `playwright-core` is installed as a dev dependency for the shoot step only. Runner up was checking by eye alone, which misses dead scroll between the two positions you happen to look at.

## Rationale

The site is static on a sub path with no server, so any page must be a real file in the build output; two HTML entries give that with a config change and nothing new to install. Moving the list to `/app/` costs one click for existing bookmarks, and you accepted that so the shared URL is the page that explains the app.

A scroll experience page over a static hero is a deliberate trade of upkeep for memorability. scroll-craft keeps that trade honest: it writes real HTML so the no JavaScript case still reads, it forbids the machine made tells (counters, scroll cues, invented numbers), and it verifies its own scroll with screenshots, which is the part a hand rolled animation always skips. Giving the landing its own look, as a recorded exception, is cheaper and clearer than bending spec 0003's no transitions, no shadows rules for one page or bending the page to a grey list. Keeping the exception to two paths keeps `/sync` and the design rule useful for everything else.

No generated media follows from Prototype tier and a one person team: a paid pipeline and clips that must be re encoded for phones are the heaviest thing to keep right, and the product itself is a stronger world for a tool than a generated diorama. The demo as the closing act follows scroll-craft's own rule that the close must resolve and hold: the page stops moving and starts responding.

## Feature design

**Data model sketch**:
No persistent data. The demo holds a `readonly Task[]` from spec 0002 in React state, seeded from three constant titles, and discards it on unload. No new fields, no storage key, no migration.

**State transitions**:
None beyond the existing task done and not done toggle handled by `toggleTask`. Scroll position drives the engine's per act progress (`--sc-p`), which is presentation, not state.

**API surface** (pages and actions, there are no network endpoints):
| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `/todo-app/` | GET (static) | none | landing HTML, engine CSS and JS, `landing.css`, demo script | public | 404 only if the build did not emit `dist/index.html` |
| `/todo-app/app/` | GET (static) | none | list HTML and the existing app bundle | public | 404 if `dist/app/index.html` is missing |
| Open the app | click or Enter on an `a` | none | navigation to `/todo-app/app/` | public | none, plain anchor |
| Scroll | wheel, touch, keyboard | scroll position | act progress on `data-sc-*` markup | public | scripts off: page reads static |
| Demo tick, edit, delete | React handlers | task id, new title | new in memory list | public | invalid title refused by `validTitle` as in the app |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Render landing | name, what it is, private line, action label, caption | the copy anchors in `## Decision`, typed into `index.html` |
| Render landing | section order, headlines, grammar, signature move, feeling curve | `scrollcraft/builds/landing/BRIEF.md`, written by the scroll-craft interview at build time |
| Render landing | palette, display and text fonts | `--sc-*` overrides in `src/landing/landing.css`, chosen in the interview; no font files beyond system fallbacks unless the interview picks a hosted font, in which case it is self hosted under `public/` |
| Render landing | screenshots of the app | files you capture into `src/landing/assets/`, light and dark, desktop and phone |
| Open the app | link target | the literal `/todo-app/app/` in the plain HTML; base decided in spec 0001 |
| Render demo | three sample tasks with ids and timestamps | `addTask` from spec 0002 applied to the three constant titles at mount |
| Demo tick, edit, delete | the updated list | `toggleTask`, `editTitle`, `deleteTask` from spec 0002 over React state |
| Demo reload | the original three tasks | the seed runs again on mount; nothing was saved |
| Reduced motion | static acts | the engine's reduced motion path plus the `no-preference` guard in `landing.css` |
| Head tags | title, description, `og:url`, `og:image` | literals in `index.html` from `## Decision`; the Pages URL from the GitHub repo `toyinogun/todo-app` |
| About link | link target | `import.meta.env.BASE_URL` |
| Verify | screenshot strip, dead scroll and contrast report | scroll-craft `shoot.mjs` against `dist/` served by `serve.mjs` |

**Key invariants**:
- The landing never imports `src/lib/storage.ts` or `usePersistedTasks`; the storage boundary in `AGENTS.md` holds. The demo never writes localStorage.
- `src/landing/scrollcraft.js` and `scrollcraft.css` are copies of the skill's engine and are never edited; bespoke behaviour (the signature move) lives in the page's own markup and `landing.css` or a small `signature.ts`.
- The spec 0003 exception covers `index.html` and `src/landing/` only. Raw colour values may appear in `landing.css` as `--sc-*` tokens; nowhere else outside `src/index.css`. The app at `/app/` and `src/components/` are untouched.
- No numbers on the page that are not real; no counters, no scroll cue, no audio.
- The headline, the lines, and the Open link exist in the HTML file, not only in script output.
- The base path is written once in `vite.config.ts` and read through `import.meta.env.BASE_URL` in code; the only literal copies are in the plain HTML and the `og:url` tag.

**Security model**:
Public, read only page with no input that leaves the browser. The demo edits stay in memory. No personal data, no compliance scope, no third party requests (no hosted fonts from a CDN, no analytics).

**Configuration required**:
None at runtime. `vite.config.ts` gains a `build.rollupOptions.input` map naming `index.html` and `app/index.html`. `playwright-core` is added as a dev dependency for the verify step. No `KIE_AI_API_KEY`: no media is generated.

**Critical test scenarios** (each maps to an acceptance criterion in ## Requirements):
- Happy path: open `/todo-app/`, scroll to the end, read the name, what it is, and the private line on the way, reach the demo, tick a task, press the Open button, land on the working list and add a task, verifies **AC-1**, **AC-2**, **AC-4**
- Failure case: disable JavaScript, reload the landing, every section's text and the Open link show and the link works, verifies **AC-3**
- Demo isolation: tick and delete demo tasks, reload, the three samples are back and the `todo:v1` key is unchanged, verifies **AC-4**
- Reduced motion: turn it on, reload, every act is visible and complete with no pinning, verifies **AC-10**
- Keyboard: Tab from the top through every focusable thing to the Open button in reading order with a visible ring, verifies **AC-6**
- Scroll verify: run the shoot at desktop, 390px, and reduced motion; the report lists no dead scroll and no failing contrast; `BRIEF.md` exists, verifies **AC-11**
- Look boundary: `git diff` after the build touches nothing under `src/components/`, `src/features/`, or `src/index.css` except the About link, verifies **AC-5**, **AC-8**
- Build: run `pnpm build`, both `dist/index.html` and `dist/app/index.html` exist, verifies **AC-9**
- Head: view source of the landing and confirm the title, description, and four Open Graph tags, verifies **AC-7**

## Build plan

Skateboard: the first task is the thinnest whole (both pages exist and link to each other, plain HTML), then the landing grows into the scroll page, then the demo lands, then it is verified.

1. [x] Move the list entry to `app/index.html`, add `build.rollupOptions.input` with both entries in `vite.config.ts`, and make the root `index.html` a plain page with the name, the two lines, and the `Open the app` anchor. Run `pnpm build` and confirm both files in `dist/`, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-9**
2. [x] Add the `About` link to the list footer using `import.meta.env.BASE_URL`, satisfies **AC-8**
3. [x] Add the head tags to the root `index.html`: title, description, and the Open Graph tags from `## Decision`, satisfies **AC-7**
4. [x] Capture the app screenshots (light and dark, desktop and phone) into `src/landing/assets/`, satisfies **AC-5**
5. [x] Hand the page to `scroll-craft`: run its interview with the settled inputs above, write `BRIEF.md`, pick the grammar and signature move, pass the fingerprint gate, write the feeling curve and score, then write the root `index.html` as real HTML on the engine copied into `src/landing/`, themed in `landing.css`, with the closing act holding the copy, `div#demo`, and the Open link, satisfies **AC-1**, **AC-3**, **AC-5**, **AC-10**, **AC-11**
6. [x] Build the demo: `src/landing/Demo.tsx` with `useState` over the three seeded tasks and the reused `TaskRow`, mounted by `src/landing/main.tsx` into `div#demo`, with the caption, satisfies **AC-4**
7. [x] Verify: `pnpm build`, serve `dist/`, run the shoot at desktop, 390px, and reduced motion, read the sheet, fix, shoot again; then Tab through by hand and disable scripts once, satisfies **AC-3**, **AC-6**, **AC-10**, **AC-11**

## Consequences

**Positive**:
- The shared URL explains the app before showing it, and gives a visitor something to remember.
- No runtime dependency added; the deploy workflow needs no change.
- The demo cannot go stale, since it is the real row component.
- The scroll is verified by screenshots, not by hope.

**Negative / tradeoffs**:
- The list moves to `/todo-app/app/`; an old bookmark needs one extra click.
- Two looks to hold: the app on `design.md`, the landing on `--sc-*` tokens. The exception must stay fenced to two paths.
- The landing needs scripts for motion and the demo; with scripts off it is a plain page.
- Screenshots you capture go stale when the app's UI changes; recapture is a manual step.
- A dev dependency (`playwright-core`) and a `scrollcraft/` workspace folder join the repo for the verify step.
- The `og:image` is a 404 until you add the file.
- Headless verification cannot prove a real phone; a check on an actual phone is a manual step.

**Neutral**:
- Release 5 (offline and installable) must list both entries and the engine assets in what it caches, and the install manifest's start URL should be `/todo-app/app/`.
- `src/landing/` follows the folder by feature rule from `AGENTS.md`; the engine copies inside it are vendored files, not project code.
- `/sync` should record the spec 0003 exception as a one line rule so later audits do not flag `landing.css`.

## Follow-up

- [ ] Add `public/og.png` (1200 by 630) for the social card, ideally a frame from the finished page; until then `og:image` is a 404.
- [ ] Release 5 (offline and installable): cache both entries and the engine assets, set the manifest start URL to `/todo-app/app/`.
- [ ] Check the finished page on a real phone once; headless Chrome cannot reproduce touch scrolling or Low Power Mode.
- [ ] `scroll-craft` is installed but not yet listed under `## Agent skills` in root `AGENTS.md`; it belongs there as the landing page's design source (`/sync` owns that edit).
- [ ] If the demo ever needs the storage banner or multi tab behaviour, that is the real app; keep the demo in memory.
