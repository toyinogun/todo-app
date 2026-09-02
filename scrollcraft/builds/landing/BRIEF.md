# Brief: To do landing page

Interviewed 2026-09-02 inside `/develop landing page`. Seven creative answers below are the engineer's picks from the interview panels. Questions 8 (assets) and the Step 1 facts were settled in spec 0004 and are copied here.

## The eight interview answers

1. **Vibe**: Quiet, private, yours. References: a Muji notebook, the film Paterson, Field Notes.
2. **Journey**: Name, the private promise, then the app. First the name and one line. Then the privacy story, plainly. Then screenshots of the app. Last the live demo with the Open button.
3. **Energy**: Calm start, one lift in the middle, calm close. Quiet name, the privacy line lands with weight, the demo close is gentle and still.
4. **Feeling**: Curiosity, relief, trust, then play. The moment: "the tasks in the list were real and I could tick them right there on the landing page".
5. **One thing no site does**: The list stays with you. A small real task row is pinned in the margin from the first screen. As you scroll, the page's own chapters get ticked off in it, one per chapter, until it hands over to the live demo at the close. The page proves itself by doing the thing.
6. **Aesthetic range**: Editorial. Paper, measure, restraint. Warm off white ground, dark ink, one accent.
7. **Structure**: Distinct scenes. Separate chapters with their own ground, hard cuts between them.
8. **Assets on hand** (from spec 0004): the running app (screenshots captured by `capture.mjs` into `src/landing/assets/`, light and dark, desktop and phone), the SVG icons in `public/`, the app tokens in `src/index.css`. No footage, no photos, no brand kit. Nothing generated, no API key, no spend.

## Settled facts (spec 0004)

- What it is, for whom: a personal to do list in the browser, for one person, saved on their device.
- The belief to install: your list stays on your device and nobody else ever sees it.
- The one action and its label: `Open the app`, everywhere it appears. Target `/todo-app/app/`.
- Hard rules: no invented numbers, no counters, no audio, every section is real text, the demo is the closing act, the close resolves on the demo plus the link and holds.
- Copy anchors: name `To do`; `A to do list that stays on your device.`; `Your list is saved in this browser and never leaves it. No account, no server, nothing to sign up for.`; demo caption `Try it here. This sample is not saved.`

## Grammar: chaptered editorial

The page is a printed feature: a title page, three chapters on their own grounds with hard cuts, a colophon. No fixed bar. The folio in the margin is the signature move (below). Media sits in its own column with a caption. The close is a colophon where the action is a line of running text.

Why the other seven lost: filmic one shot needs a scrub hero and there is no footage; live surface forbids the plain copy this page exists to say and its close must be an input, not a link; continuous world needs geography to fly through; typographic poster forbids the screenshots and the demo, which are the point; gallery has one object, not a range; split stage has no two sided argument; rhythmic cutlist is the wrong energy for "quiet, private, yours".

## Signature move: the folio is a to do list

A small fixed list in the margin (bottom strip on phones) holds three items, one per chapter: `Know what it is`, `See where it lives`, `Try it`. It is real markup: a list of links to the chapters. Page JS watches which chapter crosses the middle of the screen; when the reader moves past a chapter its item is ticked, and ticks stay. When the closing chapter arrives the folio hands over: it slides away and the real list, in the page, takes its place with three sample tasks on the real row pieces. Off engine, driven by an IntersectionObserver in `src/landing/signature.ts`. With scripts off it is a plain chapter index.

## Journey (beats)

```
1  Curiosity    a title page: the name, one line, paper, nothing else
2  Recognition  what it is: one list, the whole app in one screenshot
3  Relief       the private line at full weight on an inverted ground
4  Trust        the same list on a phone, dark, the same device
5  Play         the real rows, tick one, it worked
6  Resolve      the colophon: one line of running text with the action, then it stops
```

## Feeling curve (one line per act)

```
1  Curiosity    title page, the wordmark set large on paper, the folio already there with nothing ticked
2  Recognition  chapter one, the laptop screenshot wiping in beside plain words, the first folio item ticks as you leave
3  Relief       chapter two, hard cut to ink ground, the private line assembling line by line at display size
4  Trust        the phone screenshot drifting slower than the page in its own column, caption in small type
5  Play         chapter three, paper again, the folio slides away and the real rows are in the page; you tick one
6  Resolve      the colophon under the demo, the action as running text, small print, and the page holds still
```

Two adjacent acts never share a feeling. Chapter two carries the energy lift (loudest type, inverted ground). The peak is chapter three.

## The peak

"The list in the corner had been ticking itself off while I read, and then it turned into a real list I could use." Lives in chapter three (the close). It gets the largest span, the biggest visual change (folio hands over, app surface appears on paper), and the quiet colophon after it so it holds.

## Tell someone sentence

It's the site where a tiny to do list in the margin ticks itself off as you read, then hands you the real one at the end.

## Authored silence

None. Every section has content from its first pixel. The colophon after the demo is a resolved hold, not dead scroll.

## Score

| Beat        | Act                       | Device                                 | Why                                                     |
| ----------- | ------------------------- | -------------------------------------- | ------------------------------------------------------- |
| Curiosity   | title page                | `flow` + `in` stagger                  | Type on paper, no media above the fold, per the grammar |
| Recognition | chapter one               | `reveal` (up) on the figure            | A wipe at the chapter boundary is a change of ground    |
| Relief      | chapter two               | `kinetic` lines on the display line    | The one loud moment; lines assembling carry the weight  |
| Trust       | chapter two, media column | `parallax` inside the column           | Depth without motion on the text                        |
| Play        | chapter three             | signature move handoff + the live demo | The page stops moving and starts responding             |
| Resolve     | colophon                  | plain flow, holds                      | The close resolves and holds                            |

Four device families (in, reveal, kinetic, parallax) plus the bespoke move. No device twice in a row. No scrub, no pin, no spotlight, no magnet (all banned by the grammar). No drift: grounds are painted per chapter. Page length about 8 viewport heights.

## Fingerprint gate

Registry was empty at build time. Nothing to clear. Row appended after verification.

## Look

Six tokens and two faces, in `src/landing/landing.css`:
paper `#f6f5f1`, surface `#ffffff`, ink `#17181c`, ink soft `#5c5f68`, accent cobalt `#1d4ed8`, accent ink `#ffffff`.
Chapter two inverts: ink ground `#17181c`, paper ink, accent lifted to `#8ab4ff` (one hue, two lightnesses, the sanctioned two stop accent for a page that hard cuts between grounds).
Display: a system serif stack (Iowan Old Style, Palatino, Georgia). Text: system sans. No hosted fonts.
The demo keeps the app's own tokens inside its frame on purpose: it is the real product shown inside the page.

## Feel check and verification

Filled in after the shoot. See the report in `/develop`'s summary and `lab/` in this folder.

## Feel check (2026-09-02, cold, from the contact sheets)

Felt curve, one word per act: curiosity, recognition, weight, trust, play, then it stops. Diff against the intended curve: chapter two read as "weight" rather than "relief", which is the same lift seen from the loud side; kept. The first pass of chapter one read as "unfinished" because the laptop screenshot carried an empty lower half from a full viewport capture; both screenshots were recaptured cropped (`capture.mjs`, 1280 by 560 and 390 by 600) and it now reads as recognition. The peak is the close: the folio hands over and the app surface appears on paper, the largest visual change on the sheet. The end resolves: the colophon holds with the action in running text.

Length: about 4.5 viewport heights, under the 8 to 14 band in the skill's checks. Deliberate: a one list app earns a short feature, and padding chapters to reach the band would be scroll tax.

## Verified

- `lab/shots/sheet.png` (desktop 1280 wide), `lab/mobile/sheet.png` (390 by 844), `lab/reduced/sheet.png` (reduced motion): no dead scroll, every cue clears 4.5:1 at its worst frame, every section complete under reduced motion.
- `verify.mjs`: scripts off, the name, the two lines, and the `Open the app` links are present and visible; Tab order runs folio, skip link, the nine demo controls, the closing link, all labelled, all with a visible ring; ticking a demo task writes nothing to `localStorage`.
- Not verified: a real phone (touch scrolling, Low Power Mode). Manual step.
