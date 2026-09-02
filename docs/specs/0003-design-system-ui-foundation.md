# 0003. Quiet design system on CSS variables with four native base pieces

**Date**: 2026-09-02
**Status**: Accepted

## Summary

This decides how the app looks and how every later screen stays consistent. The look is quiet and plain: the system font, neutral greys, one blue accent, dark mode that follows the operating system. All colours, sizes, and spacing live as CSS variables (named values in one stylesheet) that every screen reuses, and four small React pieces (button, text input, checkbox, list row) wrap the browser's own controls so labels and keyboard focus are done once. A short `docs/design.md` records the system for humans and later builds.

## Context

The scaffold has a handful of CSS variables, a system font, a centred 40rem column, and a focus ring. That is enough for one heading and one paragraph. Release 1 adds inputs, buttons, checkboxes, and rows; release 2 adds a segmented view switch and drag handles; release 3 adds date badges. Without a shared foundation each feature would pick its own grey, its own padding, and its own focus treatment, and the app would stop feeling like one thing within two releases. Dark mode makes the cost sharper: every hard coded colour is a bug in one of the two themes.

The forces are small. One person builds this, at Prototype tier, on plain CSS by decision of spec 0001, so the foundation must be cheap to write and cheap to keep. The accessibility baseline in `AGENTS.md` (keyboard use, visible focus, a label on every control) is not negotiable and is easiest to guarantee if it is built into a few shared pieces rather than remembered per feature. Release 4 makes the app installable and offline, so anything the foundation loads (fonts, icon sets) is also something to cache.

Not deciding now means the task list feature invents the look under time pressure and every later feature copies or fights it.

## Options considered

### Option 1: Document the system and enforce it going forward by convention

Write the tokens and components once, record the standard in `docs/design.md` and one rule line in `AGENTS.md`, and rely on the build time self check and code review to keep new code on tokens.

**Pros**:
- Zero new tooling; fits Prototype tier and a one person team.
- The rule is one sentence: colours, spacing, and radius come from variables, controls come from `src/components/`.

**Cons**:
- Nothing fails the build on a hard coded colour; drift is caught by eye.

### Option 2: Document the system and add automated CSS linting

Same standard, plus a CSS linter (a tool such as Stylelint) configured to reject raw colour values and to run in the pre commit hook.

**Pros**:
- Drift fails before commit, not in review.

**Cons**:
- A new dependency, a config file, and rule tuning for a project with one stylesheet today.
- oxlint (the installed linter) does not lint CSS, so this is a second linter to keep current.

### Option 3: Document only, no shared components

Write `docs/design.md` and the token stylesheet, but let each feature write its own `<button>` and `<input>` markup with the shared classes.

**Pros**:
- Fewest files.

**Cons**:
- Every feature must remember the label, the `type="button"`, and the icon button's accessible name; the accessibility baseline becomes a checklist instead of a guarantee.

## Decision

**Chosen option**: Option 1: Document the system and enforce it going forward by convention

Define the design tokens and global rules in `src/index.css`, ship Button, TextInput, Checkbox, and ListRow as thin typed wrappers over native elements in `src/components/`, and record the system in `docs/design.md`. New code uses tokens and the shared pieces; nothing is enforced by tooling.

**Implementation skills**: `vercel-react-best-practices` (`vercel-labs/agent-skills`, `.claude/skills/vercel-react-best-practices/`)

## Rationale

The foundation exists to make the accessibility baseline automatic and dark mode free. Thin wrappers over native controls do both: the browser already handles keyboard, focus, forced colours, and screen readers for a native checkbox and button, so the wrapper only has to add the label and the class. A headless library would add a dependency to do what the platform does for four controls. Option 3 was rejected because the label and focus rules would live in each feature's head; Option 2 was rejected because a second linter is more to maintain than the one stylesheet it would police, and it stays the upgrade path if drift shows up.

The quiet direction, the system font, and the current blue were your picks. They also happen to be the cheapest: no font file to bundle or cache for offline, and the existing accent already passes contrast on both backgrounds. Where a pick had contrast consequences, the standard below settles it (the dark mode primary button uses dark text, because white on the light blue fails).

## Standard definition

**Design source**: the existing `src/index.css`, grown into the token set below. No design tool or images. `docs/design.md` is the source of truth once written; this section is its first draft.

**Canonical pattern** (tokens in `src/index.css`, the only file that defines a raw colour):

```css
:root {
  color-scheme: light dark;
  /* colour */
  --bg: #ffffff;        /* page */
  --surface: #f5f5f5;   /* row hover, input background */
  --fg: #1a1a1a;        /* text */
  --muted: #6b6b6b;     /* secondary text, done tasks; 5.3:1 on --bg */
  --border: #d4d4d4;    /* rows, inputs */
  --accent: #2563eb;    /* focus ring, primary button, checked state */
  --accent-fg: #ffffff; /* text on --accent */
  --danger: #b91c1c;    /* delete, error banner text */
  /* type */
  --font: system-ui, sans-serif;
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  /* space, 4px base */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  /* shape */
  --radius: 6px;
  --tap: 2.75rem;       /* 44px, minimum height of any interactive element */
  --measure: 40rem;     /* main column width */
  font-family: var(--font);
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --surface: #1e1e1e;
    --fg: #ededed;
    --muted: #9a9a9a;
    --border: #3a3a3a;
    --accent: #60a5fa;
    --accent-fg: #121212; /* white on this blue fails contrast */
    --danger: #f87171;
  }
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

**Type**: system font only, four sizes. `h1` is `--text-xl`, `h2` is `--text-lg`, body and controls `--text-md`, helper text and badges `--text-sm`. Weights: 400 and 600 only.

**Colour rules**: every colour on screen is one of the tokens above, in both themes. Done tasks use `--muted` plus `text-decoration: line-through`. Dark mode follows the system only; no switch, no stored preference. Contrast at or above 4.5:1 for text and 3:1 for borders and focus rings in both themes (the values above meet this; a new token must be checked before it is added).

**Spacing and shape**: paddings and gaps use `--space-*` only. Corners use `--radius`. No shadows. No transitions in the foundation; a later feature that adds one must wrap it in `@media (prefers-reduced-motion: no-preference)`.

**Layout**: `main` is `max-width: var(--measure)`, centred, `padding: var(--space-8) var(--space-4)`. One column at every width; nothing hides on a phone.

**Base pieces** (`src/components/`, one `components.css` beside them, styled by class, every prop not listed passes through to the native element):

| Piece | File | Props | Renders | Guarantees |
|---|---|---|---|---|
| Button | `Button.tsx` | `variant?: 'primary' \| 'plain' \| 'icon'` (default `plain`), `danger?: boolean`; the `icon` variant requires `aria-label` (enforced by the prop type) | `<button type="button" class="btn btn-{variant}">` | `type` defaults to `button`; min height `--tap`; `icon` is a `--tap` square |
| TextInput | `TextInput.tsx` | `label: string`, `hideLabel?: boolean` | `<label>` wrapping text and `<input>`; `hideLabel` keeps the text for screen readers only (a visually hidden class) | always labelled; id from `useId`; min height `--tap` |
| Checkbox | `Checkbox.tsx` | `label: string`, `hideLabel?: boolean` | `<label>` wrapping native `<input type="checkbox">` with `accent-color: var(--accent)` | native keyboard and forced colour behaviour; the hit area is the whole label |
| ListRow | `ListRow.tsx` | `done?: boolean`, `children` | `<li class="row" data-done>` as a flex row, gap `--space-3`, border bottom `--border`, hover `--surface` | a child with class `row-title` gets the done styling; the row itself takes no click handler (controls inside do) |

Icons live in `src/components/icons.tsx`: `CheckIcon`, `TrashIcon`, `GripIcon`, each an inline SVG at `1em`, `fill="currentColor"`, `aria-hidden="true"`. The accessible name always comes from the surrounding button's `aria-label`, never from the icon.

**`docs/design.md`**: written by the build of this feature. Sections: Direction (one paragraph), Tokens (the block above), Type, Colour rules, Spacing and shape, Layout, Base pieces (the table above), Accessibility baseline. Kept short; when the CSS and the file disagree, fix the file in the same change.

**Replaces**:
- Raw colour values, pixel paddings, or font sizes written inside a feature's CSS or inline styles.
- Bare `<button>`, `<input>`, and `<input type="checkbox">` in feature components.
- Focus styles set per component (`:focus-visible` is global and untouched).

**Enforcement**:
Convention. One rule line in `AGENTS.md` (added by `/sync`): colours, spacing, and radius come from the tokens in `src/index.css`; controls come from `src/components/`. Checked by the build time self check and by eye. Upgrade path if drift appears: a CSS linter in the pre commit hook.

**Rollout**:
New code immediately. The existing `src/index.css` is extended in place; `App.tsx` has no controls yet, so there is nothing to migrate.

**Exceptions**:
- A one off SVG may set its own `fill` when it is decorative artwork, not an icon.
- Native date input (release 3) is used bare, styled only through tokens; wrapping it is not worth it.

## Consequences

**Positive**:
- Dark mode, focus, labels, and tap size are solved once; the task list feature composes them.
- Nothing to download: no font, no icon set, no component library, which keeps the offline release trivial.
- A new colour or size is one line in one file.

**Negative / tradeoffs**:
- Nothing stops a hard coded colour except review; drift is possible.
- Native controls look native: the checkbox and date input differ slightly per operating system.
- The `icon` button relies on the author passing a real `aria-label`; the type forces its presence, not its quality.

**Neutral**:
- `docs/design.md` is a second place the tokens are written; the spec makes it the human copy and the CSS the running one.
- Banner and empty state are not base pieces; release 1 styles them from tokens (`--danger` text on `--surface` for the banner, `--muted` centred text for the empty prompt). Promote to components if a second feature needs them.
- The segmented view switch (release 2) and the date badge (release 3) are new pieces built to this standard when those features land.

## Follow-up

- [ ] `/sync` after the build: add the token and components rule line to `AGENTS.md` and a pointer to `docs/design.md`.
- [ ] Release 2 must decide whether the view switch is a radio group or tabs; this spec only fixes its tokens.
- [ ] If a colour is ever added, check contrast in both themes before it lands.
