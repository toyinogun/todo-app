# Scope: To Do App

A personal to do list you use in the browser. One list, saved on your device, no account. Built for you, as a learning and hobby project.

**Build approach:** Skateboard (ship the thinnest usable whole first, then grow it release by release, each release shippable).
**Workflow:** Prototype (just `/develop`, nothing after it; you rely on its build time self check and your own eye). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· Beta`) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | done |
| 2 | Coding standards & tooling | Foundation | planned |
| 3 | Data model | Foundation | planned |
| 4 | Design system & UI foundation | Foundation | planned |
| 5 | Task list | Release 1 | planned |
| 6 | Filter & search | Release 2 | planned |
| 7 | Drag to reorder | Release 2 | planned |
| 8 | Due dates | Release 3 | planned |
| 9 | Reminders | Release 3 | planned |
| 10 | Offline & installable | Release 4 | planned |

## Foundations

### 1. Stack & architecture · done · Beta
Pick the web stack and how tasks are stored on the device, then scaffold a runnable project so every later release builds on real structure. Keep it small: one page app, no server.
**Done when:** the stack and local storage choice are recorded in a spec, and the empty scaffold runs locally and builds clean.
- [x] Decide the stack (spec): `/architect stack & architecture`
- [x] Scaffold from the decision: `/develop stack & architecture`
Spec [0001](../specs/0001-stack-architecture.md) · code in `package.json`, `vite.config.ts`, `src/`, `.github/workflows/deploy.yml`

### 2. Coding standards & tooling
Capture conventions from the real scaffold, then install lint, format, and a pre commit check so later code stays tidy.
**Done when:** root `AGENTS.md` reflects the real stack, and lint and format run clean.
- [ ] Capture conventions + tooling choices: `/audit`
- [ ] Install the tooling: `/develop tooling`

### 3. Data model · needs a decision
The shape of a task and how the list is saved and loaded on the device. Leave room for order, due date, and completion from the start so later releases add fields, not migrations.
**Done when:** a task has a stable id, title, done flag, position, and optional due date; the list survives a page reload; a saved list from an older version still loads.
- [ ] Design it (spec): `/architect data model`

### 4. Design system & UI foundation · needs a decision
Type, color, spacing, and a handful of base pieces (input, button, checkbox, list row) so every screen feels like one app. Includes dark mode following the system theme. Everything works by keyboard alone with visible focus and labelled controls.
**Done when:** `design.md` covers type, color, spacing, and components; dark mode follows the system; base pieces are keyboard usable with visible focus.
- [ ] Design it (spec): `/architect design system & UI foundation`

## Release 1: Task list (the smallest usable whole)

### 5. Task list
Add a task, tick it done, edit its title, delete it. Saved on the device. This is the whole product on day one; you could use it tomorrow.
**Done when:** you can add, complete, uncomplete, edit, and delete tasks; the list is there after a reload; an empty list shows a friendly prompt.
- [ ] Build it: `/develop task list`

## Release 2: Find and arrange

### 6. Filter & search
Show all, active, or completed tasks, plus a quick text filter, so the list stays usable past a dozen items.
**Done when:** the three views work, the text filter narrows the list as you type, the chosen view survives a reload, and an empty result says so.
- [ ] Build it: `/develop filter & search`

### 7. Drag to reorder · needs a decision
Move tasks up and down by hand so the list reflects what matters most. The way dragging is done (native browser events, a library, or keyboard buttons) is a real choice.
**Done when:** you can drag a task to a new position with the mouse and move it with the keyboard; the order is saved and shown after a reload.
- [ ] Design it (spec): `/architect drag to reorder`

## Release 3: Time

### 8. Due dates
Give a task a date and see what is overdue or due today at a glance. Uses the browser's own date input.
**Done when:** you can set and clear a due date on a task; overdue and due today tasks are visibly marked; the list can be viewed by due date.
- [ ] Build it: `/develop due dates`

### 9. Reminders · needs a decision
Get nudged when a task with a due date comes up. In a local only web app there is no server to send anything, so how and when a reminder fires (browser notifications, only while the tab is open, or via the installed app) is a real decision.
**Done when:** you grant permission once, and a task due soon produces a visible notification while the app is open or installed; nothing fires for tasks already done.
- [ ] Design it (spec): `/architect reminders`

## Release 4: Always available

### 10. Offline & installable · needs a decision
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
