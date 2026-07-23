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

Because the ad is screen-recorded before it goes to IG, the very edges can get
cropped. **Keep a dead-space safe margin that stays empty: at least 40px clear
at the top and bottom, and 30px on the left and right.** No meaningful content
(headings, logos, CTAs, the subject/graphic) may sit inside that band — treat
it as bleed. On a 390px-wide phone that means content width ≤ ~330px
(390 − 30 − 30), so cap hero widths around 80–84vw, not 90vw+.

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

Commit and push after each change (per user preference) on a branch, not
straight commits to a shared default without asking.
