# Code Ninjas Woodbridge — animated ads

A React (Create React App) project of self-contained **animated ad units** for
Code Ninjas Woodbridge (a kids' learn-to-code-by-building-games franchise).
Each ad is one full-screen animated composition — a trial-pass reveal, a camp
promo, a schedule board, etc.

## These are social-media (Instagram) videos — vary the palette per ad

The workflow is: play the ad/animation full-screen, **screen-record it, and post
it to Instagram.** So these ads live **next to each other on one IG feed/grid.**
If every ad uses the same colour theme, the feed looks repetitive and cheap.

**Give each new ad a distinct visual/colour identity.** Do not default to the
same dark-navy + cyan "cinematic space" palette every time — that's just the
look of a couple of existing ads, not a house style to clone. Pick a colour
story that fits *that* ad's concept (warm/sunset, neon arcade, clean daylight,
paper/print, retro CRT, etc.) so consecutive posts look intentionally varied.
Brand red `#e4002b` and the Code Ninjas mark are the through-line; the
surrounding palette should change ad to ad.

## Safe margins (screen-recording crop)

Because the ad is screen-recorded and then re-fit to the phone screen before it
goes to IG, the edges get cropped more than you'd expect — especially the
sides. **Keep generous dead-space: ~40px clear top/bottom and ~45px left/right.**
No meaningful content (headings, TITLE text, logos, CTAs, the subject/graphic)
may sit inside that band. In practice: **cap hero widths around 66–74vw (not
80vw+)**, and keep big TITLE text small enough to fit — long words like
"ROBOTICS"/"WEBSITES" must not run wide, so title font maxes ~44px.

### Centre the composition — never spread it to the safe line

The margin above is a **floor, not a target.** The crop is unpredictable and can
come off any edge, so every ad must read as one block of content **centred in
the frame with clear space on all four sides.** Do not let a layout push one
element to the top of the card and another to the bottom: that puts content
hard against the safe line, and the first crop off that edge takes it.

Concretely, in each ad's stylesheet:

```css
.xx-stage {
  --safe-x: max(45px, 11vw);   /* px floor is the minimum; the vw/vh term lets */
  --safe-y: max(40px, 6vh);    /* the guard grow with the screen              */
}

.xx-card {
  position: absolute;
  inset: var(--safe-y) var(--safe-x);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;              /* <- the whole group, centred */
  gap: calc(clamp(28px, 6vh, 54px) * var(--s));
}
```

**Anti-pattern:** giving one child `flex: 1` so it eats the free space. That
justifies the siblings out to both edges instead of centring them together —
whatever leftover room exists should sit *outside* the content as crop margin,
split evenly above and below, not *inside* it as a stretched gap.

Two consequences worth knowing:

- Entrance animations that slide something in from off-screen can no longer
  assume a fixed offset like `translateY(calc(100% + 40px))`, because the
  element is no longer pinned to the card edge. Use
  `translateY(calc(100% + 50vh))` — the gap below a centred block can never
  exceed half the card plus the guard, so half a viewport always clears it on
  any phone, with nothing to measure.
- Expect the composition to occupy roughly a third to a half of the screen
  height. That is correct. Sparse and safe beats full-bleed and cropped.

## MOBILE ONLY

These ads are **only ever shown on mobile (portrait phone).** Do **not** build,
test, or tune desktop or landscape layouts — don't add desktop breakpoints,
hover states, or "looks good on a wide screen" polish. Design for a portrait
phone viewport (~390×844) and stop there. If something happens to survive on
desktop, fine, but it is never a goal and never worth effort.

## Layout & structure

- One ad = **one component in `src/Components/` + one stylesheet in
  `src/Stylesheets/`** with the same name (e.g. `FreeTrialPassAd.js` +
  `FreeTrialPassAd.css`). Older/parked ads live in `src/Used/`.
- Only **one ad renders at a time**, chosen in `src/App.js` — swap the import
  and the returned component; leave the previous one commented out, don't delete.
- Shared images go in `src/Images/`, fonts in `src/Fonts/`.

## Running & verifying

- Dev server: `npm start` (react-scripts) on **http://localhost:3000**. Always
  run npm/build commands **from the project root** (`react-scripts` resolves
  paths from cwd and errors out if you're inside a subfolder like `src/Images`).
- Build check: `CI=true npx react-scripts build` from the root.
- **Verifying animation in the browser tool is unreliable**: the automation
  Chrome tab is backgrounded, so CSS animations/transitions freeze at t=0 and
  H.264 video won't play. To preview true mobile size, render the app inside a
  ~390px iframe (same origin) and, since the tab is hidden, force final states
  by hand (e.g. set the flip transform, reveal `.ft-below` children) for a
  representative still. Real playback only happens on an actual phone — flag
  timing/motion as "verify on device."

## Style conventions (mobile-first, cinematic)

- Portrait-first. Size everything off `vh`/`vw`/`vmax` with `clamp()` so it
  scales across phone sizes; avoid fixed px for anything layout-bearing.
- Brand red is `#e4002b` (lighter `#ff2a4d`). Recent ads use a **dark, graded,
  "cinematic product-drop" stage** (deep navy space, ambient red/cyan light,
  vignette, film grain) with the brand mark as the hero object.
- Drive a hero object off **one CSS custom property** (e.g. `--cw` for the card)
  so the whole thing rescales from a single knob.
- Multi-phase intros are driven by a tiny React state machine (a `phase` integer
  + `setTimeout` cues) exposed as a class on the root (`.ft-p0`..`.ft-p3`); all
  the actual animation is CSS keyed off those classes. Keep JS to phase-advancing.
- Honour `prefers-reduced-motion` (disable animations, snap to the end state).
- The `cn-woodbridge-logo.png` wordmark has **no light-on-dark variant** and does
  **not** include "Woodbridge" text — add a separate "WOODBRIDGE" label when you
  need the full lockup, and foil it on dark with `grayscale(1) invert(1)` (a flat
  invert flattens the ninja head to a white disc).

## Copy / claims

Ad copy and offer details (ages, pricing, "free session", session names) are
often placeholders — **confirm real numbers with the user before treating them
as final**, especially anything public-facing.

## Workflow

Commit and push after each change (per user preference) — **straight to
`master`, no side branches.** This repo auto-deploys through Cloudflare Pages
(the connection lives in the Cloudflare dashboard, not in any file here):
`master` builds as **Production**, every other branch builds only as a
**Preview**. Branching therefore hides the work from the URL the user actually
looks at. Don't ask first; just push.
