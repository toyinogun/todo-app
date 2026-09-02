# Scope: To Do App

A personal to do list you use in the browser. One list, saved on your device, no account. Built for you, as a learning and hobby project.

**Build approach:** Skateboard (ship the thinnest usable whole first, then grow it release by release, each release shippable).
**Workflow:** Prototype (just `/develop`, nothing after it; you rely on its build time self check and your own eye). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· Beta`) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | done |
| 2 | Coding standards & tooling | Foundation | done |
| 3 | Data model | Foundation | done |
| 4 | Design system & UI foundation | Foundation | done |
| 5 | Task list | Release 1 | done |
| 6 | Landing page | Release 2 | done |
| 7 | Filter & search | Release 3 | planned |
| 8 | Drag to reorder | Release 3 | planned |
| 9 | Due dates | Release 4 | planned |
| 10 | Reminders | Release 4 | planned |
| 11 | Offline & installable | Release 5 | planned |

## Foundations

### 1. Stack & architecture · done · Beta
Pick the web stack and how tasks are stored on the device, then scaffold a runnable project so every later release builds on real structure. Keep it small: one page app, no server.
**Done when:** the stack and local storage choice are recorded in a spec, and the empty scaffold runs locally and builds clean.
- [x] Decide the stack (spec): `/architect stack & architecture`
- [x] Scaffold from the decision: `/develop stack & architecture`
Spec [0001](../specs/0001-stack-architecture.md) · code in `package.json`, `vite.config.ts`, `src/`, `.github/workflows/deploy.yml`

### 2. Coding standards & tooling · done
Capture conventions from the real scaffold, then install lint, format, and a pre commit check so later code stays tidy.
**Done when:** root `AGENTS.md` reflects the real stack, and lint and format run clean.
- [x] Capture conventions + tooling choices: `/audit`
- [x] Install the tooling: `/develop tooling`
Code in `package.json` (`lint-staged`, `simple-git-hooks`, `prettier`), `.prettierrc`, `AGENTS.md`

### 3. Data model · done
The shape of a task and how the list is saved and loaded on the device. Leave room for order, due date, and completion from the start so later releases add fields, not migrations.
**Done when:** a task has a stable id, title, done flag, position, and optional due date; the list survives a page reload; a saved list from an older version still loads.
- [x] Design it (spec): `/architect data model`
- [x] Build it: `/develop data model`
  - [x] Pure task logic: full `Task` type, title rules, timestamps, add, edit, toggle, delete, reorder, renumber, with tests (AC-1 to AC-5)
  - [x] Storage: `isTask`, `migrate`, `load`, `save` over `todo:v1`, with tests (AC-6 to AC-9)
  - [x] Export blob as `todo-export-YYYY-MM-DD.json` (AC-10)
  - [x] `usePersistedTasks` hook: load, save, refuse saves on a newer blob, multi tab reload, banner state (AC-6, AC-8, AC-9)
Spec [0002](../specs/0002-task-data-model.md) · code in `src/lib/tasks.ts`, `src/lib/storage.ts`, `src/lib/export.ts`, `src/features/tasks/usePersistedTasks.ts`

### 4. Design system & UI foundation · done
Type, color, spacing, and a handful of base pieces (input, button, checkbox, list row) so every screen feels like one app. Includes dark mode following the system theme. Everything works by keyboard alone with visible focus and labelled controls.
**Done when:** `design.md` covers type, color, spacing, and components; dark mode follows the system; base pieces are keyboard usable with visible focus.
- [x] Design it (spec): `/architect design system & UI foundation`
- [x] Build it: `/develop design system & UI foundation`
  - [x] Tokens and global rules in `src/index.css`, dark mode by system
  - [x] Base pieces: Button, TextInput, Checkbox, ListRow, icons in `src/components/`
  - [x] `docs/design.md` plus a preview screen showing the pieces
Spec [0003](../specs/0003-design-system-ui-foundation.md) · code in `src/index.css`, `src/components/`, `docs/design.md`

## Release 1: Task list (the smallest usable whole)

### 5. Task list · done
Add a task, tick it done, edit its title, delete it. Saved on the device. This is the whole product on day one; you could use it tomorrow.
**Done when:** you can add, complete, uncomplete, edit, and delete tasks; the list is there after a reload; an empty list shows a friendly prompt.
- [x] Build it: `/develop task list`
  - [x] Screen: title, add form, list, empty state, storage banner, footer
  - [x] Row: tick, edit in place (Enter saves, Escape cancels), delete with focus handled
  - [x] Wired to `usePersistedTasks`, checked in the browser: reload, phone width, light and dark
Code in `src/features/tasks/TaskList.tsx`, `src/features/tasks/TaskRow.tsx`, `src/features/tasks/banner.ts`, `src/features/tasks/tasks.css`, `src/App.tsx`

## Release 2: Show it

### 6. Landing page · done
A short public page that explains the app (what it is, that your list stays private on your device, no account) with a screenshot and one button that opens the app. Where it lives (the app's root with the list one step in, or a separate static page beside it) is a real choice.
**Done when:** the page says what the app is and why it is private in a few lines, shows the app, and one clear button opens the working list; it uses the design tokens and base pieces; it reads well on a phone and by keyboard.
- [x] Design it (spec): `/architect landing page`
- [x] Build it: `/develop landing page`
  - [x] Two pages: landing at the root as plain HTML with head tags, list moved to `app/`, both built by Vite and linked to each other (AC-1, AC-2, AC-3, AC-7, AC-8, AC-9)
  - [x] Scroll page by `scroll-craft`: interview, brief, grammar and signature move, real HTML on its engine with its own look, app screenshots as the visuals (AC-1, AC-3, AC-5, AC-10, AC-11)
  - [x] Closing act demo: three sample tasks on the real row pieces, in memory only (AC-4)
  - [x] Verified: screenshot strip at desktop, phone, and reduced motion, then keyboard and scripts off by hand (AC-3, AC-6, AC-10, AC-11)
Spec [0004](../specs/0004-landing-page.md) · code in `index.html`, `app/index.html`, `src/landing/`, brief in `scrollcraft/builds/landing/`

## Release 3: Find and arrange

### 7. Filter & search
Show all, active, or completed tasks, plus a quick text filter, so the list stays usable past a dozen items.
**Done when:** the three views work, the text filter narrows the list as you type, the chosen view survives a reload, and an empty result says so.
- [ ] Build it: `/develop filter & search`

### 8. Drag to reorder · needs a decision
Move tasks up and down by hand so the list reflects what matters most. The way dragging is done (native browser events, a library, or keyboard buttons) is a real choice.
**Done when:** you can drag a task to a new position with the mouse and move it with the keyboard; the order is saved and shown after a reload.
- [ ] Design it (spec): `/architect drag to reorder`

## Release 4: Time

### 9. Due dates
Give a task a date and see what is overdue or due today at a glance. Uses the browser's own date input.
**Done when:** you can set and clear a due date on a task; overdue and due today tasks are visibly marked; the list can be viewed by due date.
- [ ] Build it: `/develop due dates`

### 10. Reminders · needs a decision
Get nudged when a task with a due date comes up. In a local only web app there is no server to send anything, so how and when a reminder fires (browser notifications, only while the tab is open, or via the installed app) is a real decision.
**Done when:** you grant permission once, and a task due soon produces a visible notification while the app is open or installed; nothing fires for tasks already done.
- [ ] Design it (spec): `/architect reminders`

## Release 5: Always available

### 11. Offline & installable · needs a decision
Load the app with no network and add it to your home screen or dock. Data already lives on the device, so this is about the app shell being cached and the install prompt working.
**Done when:** the app opens with the network off; the browser offers to install it; the icon and name look right once installed.
- [ ] Design it (spec): `/architect offline & installable`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Export & import**: save your tasks to a file and load them back · needs a decision
- **Account & sync**: sign in and see the same list on every device · needs a decision · Beta
- **Multiple lists**: separate lists or projects · needs a decision
- **Error monitoring & analytics**: only if you want to learn the setup

## Legend

**The decision box.** Every feature carries exactly one, the sub task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally, `Decide the stack (spec)` on Stack & architecture), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | **`/architect` at spec capture** | `Design it` ticked; spec linked; `Build it: /develop <feature>` + **2 to 5 milestones**; the tier's closing boxes (`Verify it` Alpha+, `Test it` Beta+, `Review it` + `Document it` GA); any surfaced follow up enrolled |
| `in-progress` (building) | `/develop` | milestone sub boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | **you, when you decide it is** (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; the tier's last stage (`Prototype` → after `/develop`; `Alpha` → after `/check verify`; `Beta`/`GA` → after `/test`) is the suggested point to call it done; `/sync` captures conventions |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards & tooling). The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre workflow) and `dropped` (de scoped, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag = inherits it.
- **Workflow tier tag** beside a heading (e.g. `· Beta`, `· GA`) sets that one feature's rigor above or below the project default; no tag inherits the default. It decides the feature's check boxes and each skill's next suggestion.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing (trust develop's own build time self check); **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
