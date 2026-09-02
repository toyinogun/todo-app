# To Do App

A personal to do list in the browser. One list, saved on the device, no account, no server.

## Stack

- **Language / Runtime**: TypeScript (strict), Node 22 LTS (`.nvmrc`), browser only at runtime
- **Framework**: React 19 single page app, built and served in dev by Vite 8, `base: '/todo-app/'`; two HTML entries, the landing at `index.html` and the list at `app/index.html` (spec 0004)
- **Key dependencies**: react, react-dom, vitest (pure logic tests, no DOM), oxlint (from the Vite template)
- **Package manager**: pnpm (pinned by `packageManager` in `package.json`)
- **Persistence**: localStorage, one JSON blob under the versioned key `todo:v1`; every read and write wrapped in try/catch, failures shown as a banner, never a crash
- **Hosting / styling**: GitHub Pages via `.github/workflows/deploy.yml`; plain CSS with variables, dark mode via `prefers-color-scheme`
- Full decision: `docs/specs/0001-stack-architecture.md`

## Build approach

Skateboard: ship the thinnest usable whole first, then grow it release by release, each release shippable.

## Commands

```bash
# Install
pnpm install

# Dev server (landing at http://localhost:5173/todo-app/, the list at http://localhost:5173/todo-app/app/)
pnpm dev

# Build (typecheck then bundle)
pnpm build

# Test
pnpm test

# Lint
pnpm lint
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`. Scope lives in `docs/scope/scope.md`.

## Rules

- Functional style: functions are pure by default, same input gives same output, no side effects.
- Data is immutable. Use `const` and `readonly`; return new arrays and objects, never mutate in place.
- Side effects (localStorage, timers, notifications) live at the edges, in hooks or small adapter modules, kept explicit.
- Prefer plain functions and composition over classes. Module level variables are constants only.
- Avoid `null`; use `undefined` with union types. Expected failures return an explicit result, never throw.
- Folder by feature: `src/features/<name>/` holds a feature's components, logic, and tests together; `src/lib/` holds pure shared logic with no React or DOM.
- Consistent error handling: storage and browser API failures are caught and surfaced as a banner; the app keeps working in memory.
- Accessibility baseline (WCAG AA): every control works by keyboard, has a visible focus ring, and a label.
- Storage boundary: only `src/lib/storage.ts` reads or writes localStorage, and only the `usePersistedTasks` hook (`src/features/tasks/`) calls it from React. Task rules and list operations live in `src/lib/tasks.ts`; add fields there and in `isTask` together (spec 0002).
- Design system: build all UI to `docs/design.md`; colours, spacing, and radius come from the tokens in `src/index.css` (the only file with raw colour values), controls come from the base pieces in `src/components/` (Button, TextInput, Checkbox, ListRow, icons), never bare `<button>` or `<input>` in features (spec 0003). One recorded exception: the landing page (`index.html`, `src/landing/`) has its own look on scroll-craft's `--sc-*` tokens, so raw colours may appear in `src/landing/landing.css` (spec 0004).
- Tests: Vitest unit tests on pure logic (`*.test.ts` beside the code). UI is checked by eye and `/check verify`.

## Tooling

Chosen here, installed by `/develop tooling`:

- Lint and format: oxlint (already installed) plus Prettier.
- Before each commit: lint, format, and typecheck on staged files (a pre commit hook).
- CI: already configured; `deploy.yml` runs test and build on push to `main`.

## Git

- integration: on
- branch prefix: feat/
- commit: per-milestone

## Agent skills

- [vercel-react-best-practices](.claude/skills/vercel-react-best-practices/): `vercel-labs/agent-skills`, React and Next.js performance and component conventions.
- [scroll-craft](.claude/skills/scroll-craft/): the landing page's design source and build process; its workspace is `scrollcraft/`, the landing brief and check scripts are in `scrollcraft/builds/landing/`.

Declined: Vite skill (antfu/skills), Vitest skill (antfu/skills), publish-to-pages (github/awesome-copilot), oxlint, Prettier, GitHub Pages, playwright-core (dev only, for the scroll-craft shoot and the landing check script) · MCP servers: context7 (connected, docs for React, Vite, TypeScript)

## Context files

- [src/landing/AGENTS.md](src/landing/AGENTS.md): the landing page, a scroll-craft build with its own look, and the in memory demo.

<!-- Nested AGENTS.md files are listed here as they are created -->

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
