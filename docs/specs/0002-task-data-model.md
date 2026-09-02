# 0002. Task data model and versioned localStorage blob

**Date**: 2026-09-02
**Status**: Proposed

## Summary

This decides what a task looks like and how the whole list is saved on your device. A task has a stable id, a title, a done flag, a position number for ordering, an optional due date, and two timestamps. The list is saved as one JSON object (a text blob) with a version number inside, so a later shape change can be upgraded in code instead of losing your data. Loading checks every task one by one, keeps the good ones, and tells you if any were dropped.

## Context

Spec 0001 chose localStorage (the browser's small built in key value store) under the key `todo:v1`, and handed this spec three open questions: the exact shape of the saved blob and its migration function, how a due date is stored, and how ordering works. Every later release leans on these answers. Drag reorder needs a position rule that does not drift. Due dates need a day value that means the same thing whatever the clock says. Reminders need room to add a field without breaking saved lists.

The forces are small but real. There is one user, one browser profile, and a list that will stay in the hundreds of items at most, so anything heavier than a JSON array is waste. At the same time the data is the whole product. Clearing site data, a corrupt write, or a build rollback must never silently destroy the list, and a wrong shape decided now would force every later feature to carry a migration.

Not deciding means the task list feature invents the shape on its own, and drag reorder, due dates, and reminders each patch it after the fact.

## Requirements

**User stories**:
- As the owner of the list, I want each task to keep a stable identity and order so that edits, reorders, and later features act on the right row.
- As the owner of the list, I want my list back after a reload or a new build so that the app is safe to rely on.
- As the owner of the list, I want to be told when saved data could not be read rather than lose it quietly.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):
- **AC-1**: A task has `id` (string, unique in the list), `title` (string), `done` (boolean), `position` (integer), `createdAt` (ISO timestamp string), and optionally `dueDate` (`YYYY-MM-DD` string) and `completedAt` (ISO timestamp string). No other fields are required.
- **AC-2**: A new task gets a fresh id, `done` false, `createdAt` now, and `position` equal to the current count (it lands at the bottom). Positions are always the contiguous integers 0 to n minus 1 after any add, delete, reorder, or drop of invalid rows.
- **AC-3**: A title is trimmed and must be 1 to 500 characters after trimming. Add and edit with a blank or over long title are rejected and leave the list unchanged.
- **AC-4**: Ticking a task sets `done` true and `completedAt` now; unticking sets `done` false and removes `completedAt`. Neither changes `position`.
- **AC-5**: Deleting a task removes it at once (no soft delete) and renumbers the remaining positions.
- **AC-6**: The list is saved under `todo:v1` as `{ version: 1, tasks: Task[] }` after every change, and the same list loads back after a page reload.
- **AC-7**: A blob whose `version` is lower than the current one is upgraded by a migrate function on load and saved back in the current shape. For version 1 the function is the identity; the chain exists so later versions add a step.
- **AC-8**: On load, each task is validated. Invalid tasks are dropped, valid ones are kept and renumbered, and a banner says how many were dropped. Unreadable JSON or a non object blob resets to an empty list with a banner, per spec 0001.
- **AC-9**: A blob whose `version` is higher than the app knows is never overwritten. The app starts with an empty list in memory, disables saving, and shows a banner asking you to reload for the newer version.
- **AC-10**: Export writes the exact stored blob as a JSON download named `todo-export-YYYY-MM-DD.json` using the local calendar day.

## Options considered

### Option 1: Bare array under a versioned key

Save `Task[]` directly under `todo:v1`. A shape change means a new key (`todo:v2`) and a one off copy from the old key.

**Pros**:
- Smallest possible blob and code.
- The key name already carries a version, so nothing new to invent.

**Cons**:
- Every shape change needs a new key plus a copy step, and the old key lingers.
- A bare array cannot carry a version or any future top level field, so a small change (one new task field with a default) still needs a whole new key.

### Option 2: Versioned object with hand written type guards

Save `{ version, tasks }`. A `migrate` function upgrades older versions step by step. A hand written `isTask` guard validates each row on load.

**Pros**:
- One key for the life of the app; migrations are ordinary code with a test each.
- Zero dependencies, about 40 lines of storage code, easy to read on a bad day.
- Per row validation means one corrupt task costs one task, not the list.

**Cons**:
- Guards are written by hand, so a new field means editing the guard and its test.
- Version bookkeeping exists even while there is only version 1.

### Option 3: Versioned object with a schema library

Same blob as Option 2, but the row shape is declared with a schema library (zod or valibot) that parses and reports errors.

**Pros**:
- The type and the runtime check come from one declaration.
- Better error messages when a row fails.

**Cons**:
- Adds a dependency to a 60 kB app whose only schema is one flat object.
- Error detail nobody reads; the banner only needs a count.

## Decision

**Chosen option**: Option 2: Versioned object with hand written type guards

The list is stored as `{ version: 1, tasks: Task[] }` under `todo:v1`, loaded through a version migrate chain and a per row `isTask` guard, with the task shape and rules below.

**Implementation skills**: `vercel-react-best-practices` (`vercel-labs/agent-skills`, `.claude/skills/vercel-react-best-practices/`) for the persisted state hook only.

## Rationale

The data is the product, and the cost of a wrong shape is paid by every later release. Option 2 spends about forty lines to make three things true that Option 1 cannot: the key never changes, one bad row never takes the list, and a newer blob is never clobbered. That last case matters more than it looks; GitHub Pages can serve a stale cached build after a deploy, and release 4 adds a service worker that makes it likelier.

Option 3 buys nicer errors with a dependency. The shape is one flat object with seven fields, so a hand written guard is as clear as a schema and stays in line with spec 0001's aim of a few lines of storage code. If the shape ever grows nested structures, swapping the guard for a schema is a local change.

Integer positions renumbered on every reorder trade a few extra writes for zero drift logic. At a few hundred rows the rewrite is microseconds, and the invariant "positions are 0 to n minus 1" is trivial to test and to reason about in drag reorder.

## Feature design

**Data model sketch**:

One entity, no relationships.

| Field | Type | Required | Rule |
|---|---|---|---|
| `id` | string | yes | `crypto.randomUUID()` with the fallback from spec 0001; unique in the list |
| `title` | string | yes | trimmed, 1 to 500 characters |
| `done` | boolean | yes | flag only; never moves the row |
| `position` | integer | yes | 0 to n minus 1, contiguous; renumbered on add, delete, reorder, and invalid row drop |
| `dueDate` | string | no | local calendar day `YYYY-MM-DD`; absent means no date |
| `createdAt` | string | yes | ISO timestamp, set on add |
| `completedAt` | string | no | ISO timestamp, set on tick, removed on untick |

Stored blob: `{ version: 1, tasks: Task[] }` under `todo:v1`. The `tasks` array is kept sorted by `position`. Reminder fields arrive in release 3 as optional additions, which need no migration because a missing optional field reads as undefined.

**State transitions**:

`done: false` ⇄ `done: true`. Tick sets `completedAt`; untick removes it. Delete leaves the list from either state.

**API surface** (module functions, no network):

| Function | Inputs | Outputs | Errors |
|---|---|---|---|
| `addTask(tasks, title)` | tasks, title string | new array with the task at the bottom | invalid title returns the input array unchanged |
| `editTitle(tasks, id, title)` | id, title | new array | invalid title or unknown id returns the input unchanged |
| `toggleTask(tasks, id)` | id | new array with done and completedAt flipped | unknown id returns the input unchanged |
| `deleteTask(tasks, id)` | id | new array, renumbered | unknown id returns the input unchanged |
| `reorderTask(tasks, id, toIndex)` | id, target index | new array, renumbered | out of range index clamps |
| `renumber(tasks)` | tasks | new array with positions 0 to n minus 1 in array order | none |
| `isTask(value)` | unknown | boolean type guard | none |
| `migrate(blob)` | `{ version, tasks }` of any known version | current version blob | unknown higher version returns a `newer` result |
| `load()` | none | `{ tasks, dropped, status }` where status is `ok`, `reset`, or `newer` | never throws; catches storage and JSON errors |
| `save(tasks)` | tasks | `true` on success, `false` on failure | never throws; quota or private mode returns false |
| `exportBlob(tasks)` | tasks | a JSON download of the stored blob | none |
| `usePersistedTasks()` | none | `[tasks, setTasks, banner]` | wires load, save, and the multi tab `storage` event |

**Value sourcing** (every value each action produces, computes, or displays names where it comes from):

| Action | Value produced / displayed | Source |
|---|---|---|
| addTask | `id` | `crypto.randomUUID()` or the fallback, decided in spec 0001 |
| addTask | `createdAt` | `new Date().toISOString()` at the moment of the call |
| addTask | `position` | current task count |
| addTask, editTitle | valid `title` | input string, trimmed, length checked against 500 |
| toggleTask | `completedAt` | `new Date().toISOString()` at tick; removed at untick |
| deleteTask, reorderTask, load | `position` after change | `renumber` over array order |
| load | `version` | the `version` field of the stored blob |
| load | `dropped` count | rows failing `isTask` |
| load | `status` | `ok` normally, `reset` on unreadable blob, `newer` when `version` is above the app's |
| save | success flag | whether `localStorage.setItem` threw |
| exportBlob | file name day | local device date formatted `YYYY-MM-DD`, the same local day rule spec 0001 sets for due dates |
| banner | wording per status | the `status` and `dropped` values from `load`, plus `save` returning false |
| multi tab reload | fresh `tasks` | `load()` again when the `storage` event fires for `todo:v1` |

**Key invariants**:
- `tasks` sorted by `position`, and positions are exactly 0 to n minus 1, after every operation.
- Ids are unique within the list.
- `completedAt` is present if and only if `done` is true.
- `title` is never blank or over 500 characters once inside the list.
- The app never writes to `todo:v1` while `status` is `newer`.
- Every list operation returns a new array; the input is never mutated.

**Security model**:

Single user, local only. Anyone with access to the browser profile can read and edit the blob; there is nothing to authorize. No personal data leaves the device. Export is a user triggered download.

**Configuration required**: none. No environment variables or credentials.

**Critical test scenarios** (each maps to an acceptance criterion in `## Requirements`):
- Happy path: add three tasks, tick one, delete one, save, load, and get the same two tasks back with positions 0 and 1 and `completedAt` on the ticked one, verifies **AC-2**, **AC-4**, **AC-5**, **AC-6**.
- Failure case: a blob with one valid task, one row missing `id`, and one row with a number for `title` loads as one task at position 0 with `dropped` equal to 2, verifies **AC-8**.
- Failure case: a blob with `version: 9` loads as an empty list with status `newer`, and `save` is refused, verifies **AC-9**.
- Rule: a title of spaces only, and a title of 501 characters, are both rejected on add and on edit, verifies **AC-3**.
- Migration: `migrate` on a version 1 blob returns it unchanged, and the chain is a switch a later version extends, verifies **AC-7**.
- Export: the exported text parses back to the same blob and the filename carries today's local day, verifies **AC-10**.

## Build plan

Skateboard: the thinnest usable whole first. The pure module lands first because it can be tested with no browser, then storage, then the hook the task list feature binds to. Each step is small and runs green on its own.

1. Extend `src/lib/tasks.ts` with the full `Task` type, title validation, `createdAt`, `completedAt` handling, `editTitle`, `deleteTask`, `reorderTask`, and `renumber`, with Vitest tests, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**.
2. Add `src/lib/storage.ts` with `isTask`, `migrate`, `load`, and `save` over `todo:v1`, with tests using an in memory localStorage stub, satisfies **AC-6**, **AC-7**, **AC-8**, **AC-9**.
3. Add `src/lib/export.ts` with `exportBlob` building the download name from the local day, with a test on the name and the blob text, satisfies **AC-10**.
4. Add `src/features/tasks/usePersistedTasks.ts`: load on mount, save on change, refuse saves when status is `newer`, reload on the `storage` event, and expose the banner state, satisfies **AC-6**, **AC-8**, **AC-9**.

No UI is built here. The task list feature (scope row 5) renders the banner and calls these functions.

## Consequences

**Positive**:
- Every later feature has a fixed shape to build on; reorder, due dates, and reminders add behaviour, not migrations.
- A corrupt row or a stale build cannot silently destroy the list.
- All list logic is pure and testable with no DOM.

**Negative / tradeoffs**:
- Renumbering on every reorder rewrites the whole array; fine at hundreds of rows, wasteful at tens of thousands, which this app will not reach.
- Hand written guards must be updated by hand when a field is added.
- No undo after delete; the export button is the only safety net until import exists.

**Neutral**:
- The banner is a new UI state the task list feature must render (three messages: rows dropped, list reset, newer version found, plus the save failure from spec 0001).
- `completedAt` is stored even though nothing displays it yet.

## Follow-up

- [ ] The task list spec or build must render the banner states this spec introduces (dropped rows, reset, newer version, save failed).
- [ ] The reminders spec adds its field as optional on `Task` and, if it needs a non optional field, bumps `version` to 2 with a migrate step.
- [ ] Import (deferred in spec 0001) should load a file through the same `migrate` and `isTask` path.
