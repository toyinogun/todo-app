# Design system

Source: the tokens in `src/index.css`, grown per spec 0003. That file is the running truth for every value; this page is the human copy. When they disagree, fix this page in the same change.

## Direction

Quiet and plain. It reads as a tool, not a brand: the system font, neutral greys, one blue accent for focus and primary actions, no shadows, small corners. Dark mode follows the operating system and nothing else.

## Tokens

Defined once in `src/index.css` on `:root`, redefined for dark mode under `prefers-color-scheme: dark`.

| Group | Tokens |
|---|---|
| Colour | `--bg`, `--surface`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-fg`, `--danger` |
| Type | `--font`, `--text-sm`, `--text-md`, `--text-lg`, `--text-xl` |
| Space | `--space-1` (4px) through `--space-8` (32px), 4px base |
| Shape | `--radius` (6px), `--tap` (44px minimum height for anything interactive), `--measure` (40rem column) |

## Type

System font only. `h1` is `--text-xl`, `h2` is `--text-lg`, body and controls `--text-md`, helper text and badges `--text-sm`. Weights 400 and 600 only.

## Colour rules

- Every colour on screen is a token, in both themes. No raw colour outside `src/index.css`.
- Done tasks use `--muted` plus a strikethrough.
- Contrast: text at or above 4.5:1, borders and focus rings at or above 3:1, in both themes. Check before adding a token. In dark mode `--accent-fg` is dark because white on the light blue fails.

## Spacing and shape

Paddings and gaps use `--space-*`. Corners use `--radius`. No shadows. No transitions in the foundation; a later transition must sit inside `@media (prefers-reduced-motion: no-preference)`.

## Layout

`main` is centred at `--measure` with `--space-8` top and bottom and `--space-4` sides. One column at every width.

## Base pieces

In `src/components/`, styled by class in `components.css`. Props not listed pass through to the native element.

| Piece | Props | Guarantees |
|---|---|---|
| `Button` | `variant` (`primary`, `plain` default, `icon`), `danger`; `icon` requires `aria-label` | `type` defaults to `button`; `--tap` height; `icon` is a `--tap` square |
| `TextInput` | `label`, `hideLabel` | always labelled (hidden label stays for screen readers); `--tap` height |
| `Checkbox` | `label`, `hideLabel` | native checkbox, the whole label is the hit area, `accent-color` is `--accent` |
| `ListRow` | `done`, `children` | an `li` flex row; a child with class `row-title` gets the done styling; controls inside take the clicks |

Icons: `CheckIcon`, `TrashIcon`, `GripIcon` in `icons.tsx`, inline SVG at `1em`, `currentColor`, hidden from assistive tech. The name always comes from the button's `aria-label`.

## Accessibility baseline

Everything works by keyboard. Focus is the global `:focus-visible` ring (2px `--accent`, offset 2px), never overridden per component. Every control has a label. Native controls keep their forced colour and screen reader behaviour.
