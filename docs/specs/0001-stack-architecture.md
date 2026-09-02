# 0001. Static React single page app on Vite, data in localStorage

**Date**: 2026-09-02
**Status**: Accepted

## Summary

This is the stack for your personal to do app. It is a static web page (plain files, no server) built with React and TypeScript through Vite (a build tool and dev server), and your tasks are saved in the browser's own localStorage (a small key value store every browser has). It is hosted for free on GitHub Pages. The point is the smallest boring setup that still leaves room for filters, drag reorder, due dates, reminders, and offline use later, without ever needing a server.

## Context

You want a to do list for yourself, used in the browser, with your data staying on your device. There is no account, no sync, no money, no deadline, and no one else in the codebase. The scope plans a Skateboard build: the thinnest usable list first, then filters and reorder, then due dates and reminders, then offline and installable.

The forces are simple. Every extra moving part (a server, a database, a hosting account with secrets) is something you maintain for zero user benefit today. At the same time, the later releases lean on this foundation: drag reorder needs an order field and a keyboard friendly library, reminders need browser notifications, and offline needs the app shell to be cacheable from a real HTTPS origin. Picking something that cannot be a static site, or that stores data somewhere the browser cannot read offline, would force a rework in release four.

Not deciding means each later feature guesses at framework, storage, and hosting on its own, and those guesses rarely agree.

## Options considered

### Option 1: Static single page app, React + TypeScript on Vite, localStorage, GitHub Pages

One folder of plain files. React renders one screen, a small hook loads and saves a JSON blob in localStorage, Vite builds it, GitHub Pages serves it over HTTPS (basis: your answers in the stack walk; static first for a local only tool).

**Pros**:
- No server, no secrets, no hosting bill, nothing to keep alive.
- Largest ecosystem and learning material for React and Vite (basis: landscape check, React 19 and Vite 8 current as of September 2026).
- HTTPS origin for free, which the installable and reminders releases need.

**Cons**:
- localStorage is synchronous and capped near 5MB. Fine for thousands of tasks, wrong for attachments.
- GitHub Pages needs a base path setting in Vite and a small deploy workflow.
- Data lives in one browser profile only. Clearing site data deletes the list.

### Option 2: Same front end plus a small backend and database now

A tiny API and hosted database from day one so sync is easy later.

**Pros**:
- Sync and multi device become a feature, not a rewrite.
- Data survives clearing the browser.

**Cons**:
- A server, a database, credentials, and a hosting account to run for a single user who asked for local only.
- Slower to first usable version, which the Skateboard approach exists to avoid.

### Option 3: No framework, plain HTML, CSS, and TypeScript

Zero dependencies, hand rolled DOM updates.

**Pros**:
- Nothing to install or learn beyond the platform.
- Smallest possible output.

**Cons**:
- Drag reorder, filters, and dark mode get tedious without a component model.
- Less transferable learning if the goal is also to learn modern web tooling.

## Decision

**Chosen option**: Option 1: Static single page app, React + TypeScript on Vite, localStorage, GitHub Pages

Build a static React and TypeScript single page app with Vite, keep all data in localStorage, and host it on GitHub Pages.

**Implementation skills**: `vercel-react-best-practices` (`vercel-labs/agent-skills`, `.claude/skills/vercel-react-best-practices/`)

## Rationale

The product is a single list for one person with no network needs, so a server adds cost without value; a static site is the honest shape of the product (basis: static first for a local only tool; the scope's Skateboard approach). React on Vite is the boring, well documented pick that still scales to the later releases: dnd-kit for keyboard friendly drag reorder, vite-plugin-pwa for offline, both fit this stack cleanly (basis: landscape check, both actively maintained as of 2026). localStorage wins over IndexedDB because the data is a few kilobytes of JSON and one blob is a few lines of code; IndexedDB is the documented upgrade path if attachments ever arrive (basis: choose the simplest storage that meets the size).

Option 2 was rejected because you said local only and the cost lands on you. Option 3 was rejected because release two (reorder, filters) is exactly where hand rolled DOM code starts to hurt. Plain CSS with variables beats Tailwind here because dark mode is a handful of variables and there is one screen; Tailwind is a fine choice you can add later without a rewrite.

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Application type | Static single page app, no server | Everything runs in the browser, matching local only and installable. |
| Language | TypeScript (strict) | Catches shape mistakes in the task model early at almost no cost. |
| UI framework | React (current major, 19 at time of writing) | Largest ecosystem, and the later drag reorder library targets it. |
| Build tool | Vite (current major) | Fast dev server and build with near zero config; PWA plugin available later. |
| Package manager | pnpm | Your pick; fast and disk friendly, one install step. |
| State | React `useState` plus one `usePersistedState` hook that loads from and saves to storage | One list, one screen; a reducer is ceremony for this size. |
| Persistence | localStorage, one JSON blob under a single versioned key (`todo:v1`) | Built in, a few lines, plenty for this size; the version in the key gives a migration hook. |
| Storage failure handling | Every read and write wrapped in try/catch. Unreadable or corrupt JSON: reset to an empty list and show a banner. Write failure (quota, private mode): keep working in memory and show a banner saying changes are not being saved. | Storage can throw in private mode or when full; the app must never crash or silently lose edits. |
| Multi tab | Listen for the `storage` event and reload state from the blob when another tab writes | Two open tabs would otherwise overwrite each other, last write wins. |
| Backup | A JSON export button (download the blob) ships in release 1; import stays deferred | Ten lines of code that remove the day one data loss risk of clearing site data. |
| Ids | `crypto.randomUUID()` with a two line fallback (timestamp plus random) when it is missing | Built into browsers on HTTPS and localhost only; a plain http LAN address during dev has no `crypto.randomUUID`. |
| Routing | URL hash carries only the view (`#/all`, `#/active`, `#/completed`), no router. Search text and any sort stay in memory. | The view must survive a refresh; the scope asks nothing more of the URL. Works on GitHub Pages with no fallback tricks. |
| Error handling | One top level React error boundary showing a plain reload message | Kept trivial at Prototype tier; stops a render error from blanking the page. |
| Styling | Plain CSS with CSS variables, `prefers-color-scheme` for dark mode | Native, zero dependencies, dark mode is a few variables. |
| Testing | Vitest with one pure logic test of the task list functions (no DOM, no jsdom) | Vite native, near zero setup, no extra test libraries; later features add tests only if you want. |
| Lint and format | Decided by `/audit` after scaffold. Constraint: `/audit` may add lint, format, and hooks, but must not change the package manager, framework, styling, or storage choices here. | Tooling follows the real project; the stack stays decided. |
| Repository | Public GitHub repo named `todo-app` | GitHub Pages is free on public repos; the name fixes the base path below. |
| Runtime pins | Node 22 LTS; `packageManager` field in `package.json` pins pnpm; CI runs `pnpm install --frozen-lockfile` | The deploy workflow needs exact versions or it drifts from your machine. |
| Hosting | GitHub Pages, source set to GitHub Actions, using the official `actions/upload-pages-artifact` and `actions/deploy-pages` workflow on push to `main` with `pages: write` and `id-token: write` permissions | Free HTTPS from the repo you need anyway; no `gh-pages` branch to maintain. |
| Vite base | `base: '/todo-app/'` | Pages serves from a sub path; assets break without it. |
| Later, release 2 | dnd-kit for drag reorder | Keyboard and screen reader support built in; install when that feature is built. The data model must carry a numeric `position` with a renumber rule, never the array index. |
| Later, release 4 | vite-plugin-pwa for offline and install | Zero config PWA for Vite; install when that feature is built. Its spec must use `registerType: 'autoUpdate'` and a navigate fallback scoped to the base path, or a stale service worker will pin users to an old version. |
| Observability | None | Personal tool; the browser console is enough. |

Scaffold installs only the runnable skeleton (React, TypeScript, Vite, Vitest). Each later feature installs its own dependency when built.

## Consequences

**Positive**:
- Zero running cost and nothing to operate.
- Every later scope feature has a clear home in this stack, no foundation rework expected.
- An already open tab keeps working with the network off, even before the PWA release (a cold load still needs the network until release 4).

**Negative / tradeoffs**:
- Data is per browser profile; clearing site data or switching browsers loses the list until Export & import (deferred) exists.
- localStorage size cap rules out attachments without moving to IndexedDB.
- Reminders can only fire while the app is open or installed; there is no server to send anything.

**Neutral**:
- The storage key carries a version so the data model spec can evolve the shape with a small migration function.
- GitHub Pages serves from a sub path, so Vite `base` must match the repository name.

## Follow-up

- [ ] Run `/audit` after the scaffold to capture conventions and pick lint and format tooling.
- [ ] Agent Skills: installed `vercel-react-best-practices`; `/audit` should list it under `## Agent skills` in `AGENTS.md`. Skills for antfu/skills (Vite, Vitest) and github/awesome-copilot (publish-to-pages) were offered and not taken; record them as declined.
- [ ] Later skills, add when those features are built: `atman-33/skills` dnd-kit (release 2) and `alinaqi/maggy` pwa-development (release 4). The `context7` MCP server is already connected for React, Vite, and TypeScript docs.
- [ ] The data model spec must settle: the versioned storage shape and migration function; due date stored as a local calendar day string (`YYYY-MM-DD`) compared against local midnight; the numeric `position` field and its renumber rule.
- [ ] The reminders spec must pick who owns the timer (a timer while the app is open, or the service worker's notification API once installed) and note that iOS Safari only allows notifications from the installed app.

## References

**Project sources**:
- `docs/scope/scope.md`, the Skateboard approach, Prototype workflow, and the four planned releases.

**Practices & standards**:
- Static first for a local only tool: no server until a feature needs one.
- Choose the simplest storage that meets the size (localStorage before IndexedDB).
- Boring technology over new: React and Vite for ecosystem and docs.
- Scaffold the skeleton only; each feature installs its own dependencies.

**Links** (web verified only):
- Tailwind CSS (considered, not chosen): https://tailwindcss.com
- Other landscape facts (React 19, Vite 8, dnd-kit, vite-plugin-pwa 1.3, idb, Dexie) came from search summaries only and were not fetched, so no links are given for them.
