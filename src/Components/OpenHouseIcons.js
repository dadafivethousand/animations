// OpenHouseIcons.js — the drawn icon set for the open house poster.
//
// Not placeholders. These are the poster's icons, drawn here so the whole
// sheet is one file with nothing to go missing before a print run, and every
// one is still overridable by passing a src for that slot.
//
// ── THEY TAKE THEIR COLOUR FROM WHERE THEY SIT ──
//
// The previous set hard-coded a colour into every icon: a brown dirt block, a
// green calendar, a purple clock, a blue printer, a navy bag. Nothing agreed
// with anything, and the two icons that landed on a yellow tab had to be drawn
// twice to stay legible.
//
// Now the mass of every icon is `currentColor` and the detail cut into it is
// `--ink`, so an icon is legible wherever it is put and the parent decides:
//
//     .oh-tab           color:#fff   --ink: the tab's own hue
//     .oh-tab--yellow   color:navy   --ink:#fff        (white washes out on yellow)
//     .oh-program       color:#fff   --ink: navy       (on the dark panel)
//     .oh-foot          color:lime   --ink: navy
//
// That is one drawing per idea instead of two, and it is why the row finally
// reads as a set.
//
// ── NO PARTNER LOGOS ARE DRAWN ──
//
// The old set had a recognisable Minecraft grass block and a Roblox tile —
// reproductions of other companies' marks on a piece of advertising. The names
// stay on the poster as TEXT, which is nominative use and is how you are
// allowed to say what you teach; the icons beside them are generic, so they
// read as "block-building games" without impersonating either brand.
//
// Drawn on a 64 grid, flat, one idea each: read at 44–88px on a busy field,
// where a detailed drawing turns to mush.
import React from "react";

const box = { viewBox: "0 0 64 64", xmlns: "http://www.w3.org/2000/svg" };
const INK = "var(--icon-ink, #0b2a5b)";
/* A SECOND ink, for the parts that sit ON the icon's own mass rather than
 * against the surface behind it.
 *
 * The calendar needed both at once. Its body is the mass, its top band and
 * rings are cut against the SURFACE, and the numeral is printed on the BODY —
 * so with one ink the band and the numeral had to be the same colour, and the
 * only colour that worked for the numeral was white. On the white date pill
 * that made the top of the calendar vanish and left a green box with a
 * floating date over it. */
const FACE = "var(--icon-face, #fff)";

/* ---------- the date pill ---------- */

/* The calendar carries THE ACTUAL DATE. A generic grid of dots is a picture of
 * a calendar; a calendar reading 23 is a second, silent statement of the one
 * number on the poster that matters. `day` is passed down from the component
 * so it can never drift from the date beside it. */
export const Calendar = ({ day = "23" }) => (
  <svg {...box}>
    <rect x="5" y="12" width="54" height="47" rx="7" fill="currentColor" />
    <rect x="5" y="12" width="54" height="15" rx="7" fill={INK} />
    <rect x="5" y="20" width="54" height="7" fill={INK} />
    <rect x="15" y="4" width="8" height="15" rx="4" fill={INK} />
    <rect x="41" y="4" width="8" height="15" rx="4" fill={INK} />
    <text x="32" y="51" textAnchor="middle" fill={FACE}
          fontFamily="Fredoka, Poppins, sans-serif" fontWeight="700" fontSize="26">
      {day}
    </text>
  </svg>
);

/* Same split as the calendar: the rim is cut against the surface, the hands are
 * printed on the face. A white rim on the white pill was doing nothing except
 * eating two units off the edge of the violet disc. */
export const Clock = () => (
  <svg {...box}>
    <circle cx="32" cy="32" r="27" fill="currentColor" />
    <circle cx="32" cy="32" r="27" fill="none" stroke={INK} strokeWidth="4" />
    <path d="M32 15v18l11 6.5" fill="none" stroke={FACE} strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- the tabs ---------- */

export const Gamepad = () => (
  <svg {...box}>
    <path d="M19 20h26c8.3 0 15 6.7 15 15v6.5c0 5-4 9-9 9-3.6 0-6.2-1.9-8-5H21c-1.8 3.1-4.4 5-8 5-5 0-9-4-9-9V35c0-8.3 6.7-15 15-15z"
          fill="currentColor" />
    <rect x="12" y="31.5" width="15" height="5" rx="2.5" fill={INK} />
    <rect x="17" y="26.5" width="5" height="15" rx="2.5" fill={INK} />
    <circle cx="45" cy="30" r="3.6" fill={INK} />
    <circle cx="52.5" cy="37.5" r="3.6" fill={INK} />
  </svg>
);

export const Gift = () => (
  <svg {...box}>
    <rect x="7" y="27" width="50" height="31" rx="5" fill="currentColor" />
    <rect x="4" y="17" width="56" height="12" rx="4" fill="currentColor" />
    <rect x="27" y="17" width="10" height="41" fill={INK} />
    <path d="M32 17c-6-9-18-10-18-3 0 5 9 6 18 3zM32 17c6-9 18-10 18-3 0 5-9 6-18 3z"
          fill="currentColor" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
  </svg>
);

/* PRIZES and GIVEAWAYS were both drawing Gift — two adjacent tabs carrying the
 * identical picture, which makes them read as one thing said twice. A trophy
 * is what you win and a parcel is what you are handed, and that is the actual
 * difference between the two tabs. */
export const Trophy = () => (
  <svg {...box}>
    <path d="M20 7h24v15c0 6.6-5.4 12-12 12s-12-5.4-12-12z" fill="currentColor" />
    <path d="M20 11h-8v5.5c0 5.2 3.4 8.5 8.5 8.5M44 11h8v5.5c0 5.2-3.4 8.5-8.5 8.5"
          fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M28 34h8v10h-8z" fill="currentColor" />
    <rect x="17" y="44" width="30" height="6" rx="3" fill="currentColor" />
    <rect x="12" y="50" width="40" height="8" rx="4" fill="currentColor" />
    <circle cx="32" cy="19" r="5" fill={INK} />
  </svg>
);

/* A KING. The knight before this was all silhouette detail — muzzle, mane,
 * ear — and every one of those closed into a lump at 44px. A king is the
 * opposite: it is identified by ONE feature, the cross on top, sitting above
 * three simple masses. That reads at any size, which is the only property that
 * matters here.
 *
 * currentColor, so it takes its ink from the tab like the rest of the set. */
export const Chess = () => (
  <svg {...box}>
    {/* the cross — the whole reason you know it is a king */}
    <path d="M29.2 2h5.6v4.6h4.6v5.6h-4.6V17h-5.6v-4.8h-4.6V6.6h4.6z" fill="currentColor" />
    {/* crown and body */}
    <path d="M32 19c4.8 0 8.6 3.7 8.6 8.2 0 2.5-1.2 4.8-3.2 6.3L41.6 44H22.4l4.2-10.5c-2-1.5-3.2-3.8-3.2-6.3C23.4 22.7 27.2 19 32 19z"
          fill="currentColor" />
    {/* collar */}
    <path d="M20.5 45.5h23l3.5 7.5H17z" fill="currentColor" />
    {/* base */}
    <rect x="12" y="53" width="40" height="8" rx="3.5" fill="currentColor" />
  </svg>
);

export const Bag = () => (
  <svg {...box}>
    <path d="M11 20h42l4.2 34.4c.4 3.2-2.1 6-5.3 6H12.1c-3.2 0-5.7-2.8-5.3-6z"
          fill="currentColor" />
    <path d="M22 24V17c0-5.5 4.5-10 10-10s10 4.5 10 10v7" fill="none" stroke="currentColor"
          strokeWidth="5" strokeLinecap="round" />
    <circle cx="21" cy="31" r="3.4" fill={INK} />
    <circle cx="43" cy="31" r="3.4" fill={INK} />
  </svg>
);

/* ---------- the programs row ---------- */

export const Laptop = () => (
  <svg {...box}>
    <rect x="8" y="11" width="48" height="33" rx="4" fill="currentColor" />
    <rect x="12.5" y="15.5" width="39" height="24" rx="2" fill={INK} />
    <path d="M25 22l-6 5.5 6 5.5M39 22l6 5.5-6 5.5M35.5 20l-7 15"
          fill="none" stroke="currentColor" strokeWidth="3.2"
          strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 48h58l-2.6 4.6c-.7 1.2-2 1.9-3.4 1.9H9c-1.4 0-2.7-.7-3.4-1.9z"
          fill="currentColor" />
  </svg>
);

/* THE TWO NAMED GAMES ARE THE ONLY ICONS THAT BREAK THE COLOUR SYSTEM, and it
 * is deliberate. Everything else on this sheet paints in `currentColor` so the
 * row reads as a set — but a grass block that is not green on top and earth
 * underneath is not a grass block, it is a grey hexagon, and a child scanning
 * the row does not recognise it. These two are drawn in their own colours; the
 * two generic ones either side keep the poster's inks.
 *
 * Note this reproduces marks these companies own. That is a call for whoever
 * signs off the print run, not for this file — the previous version drew them
 * generically for exactly that reason. The ® is on the labels either way. */
export const Cube = () => (
  <svg {...box}>
    {/* top face — grass */}
    <path d="M32 5l25 13-25 13L7 18z" fill="#6cbb3c" />
    <path d="M32 5l25 13-25 13L7 18z" fill="none" stroke="#4e8c2b" strokeWidth="1.4"
          strokeLinejoin="round" />
    {/* left face — the grass overhangs the dirt, which is the detail that makes
        it read as turf rather than as a green lid */}
    <path d="M7 18l25 13v25L7 43z" fill="#8b6239" />
    <path d="M7 18l25 13v7L7 25z" fill="#5fa834" />
    {/* right face, one step darker so the solid turns */}
    <path d="M57 18L32 31v25l25-13z" fill="#6e4b2a" />
    <path d="M57 18L32 31v7l25-13z" fill="#4e8c2b" />
    {/* a few darker voxels, so it reads as blocks and not as a smooth solid */}
    <path d="M12 27.5l7 3.6v6.4l-7-3.6z" fill="#000" opacity=".14" />
    <path d="M22 39l7 3.6v6.4l-7-3.6z" fill="#000" opacity=".12" />
    <path d="M45 30l7-3.6v6.4l-7 3.6z" fill="#000" opacity=".12" />
    <path d="M21 14.5l8 4.2-6 3.1-8-4.2z" fill="#000" opacity=".08" />
  </svg>
);

/* THE TILTED SQUARE WITH THE SQUARE HOLE. Four studded tiles was a guess at
 * "block game" and read as a keypad. The mark people actually recognise is one
 * rounded square rotated off-axis with a smaller rounded square knocked out of
 * its centre — and the hole has to be a REAL hole, cut with fill-rule evenodd,
 * because the panel behind it is a gradient and a matching fill would show as
 * a patch the moment the panel changed. */
export const Blocks = () => (
  <svg {...box}>
    <g transform="rotate(13 32 32)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#fff"
        d="M16 10h32a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6Zm10 14h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V26a2 2 0 0 1 2-2Z"
      />
    </g>
  </svg>
);

/* A printer mid-print: gantry, nozzle, and an object growing on the bed. The
 * old one had the letters "3D" set inside it, which is a label pretending to
 * be a drawing — and the words "3D PRINTING" are already underneath. */
/* DRAW THE PRINTING, NOT THE PRINTER. Two attempts at the machine both failed
 * the same way: any frame that closes round the mechanism reads as a monitor
 * at 84px, which is disastrous directly beside a laptop. What is unmistakable
 * at this size is a nozzle laying down layers — the process, not the appliance
 * — and it is also the only icon in the row that shows something being MADE,
 * which is the point of the whole programme. */
export const Printer = () => (
  <svg {...box}>
    {/* the gantry rail and the nozzle hanging off it */}
    <rect x="8" y="6" width="48" height="6" rx="3" fill="currentColor" />
    <rect x="28" y="12" width="8" height="6" fill="currentColor" />
    <path d="M26 18h12l-4 7h-4z" fill="currentColor" />
    {/* the extruded strand, mid-air between nozzle and object */}
    <path d="M32 25v5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* the object, built up in layers that widen as they go down */}
    <rect x="25" y="31" width="14" height="6" rx="2" fill="currentColor" opacity=".55" />
    <rect x="21" y="38" width="22" height="6" rx="2" fill="currentColor" opacity=".72" />
    <rect x="17" y="45" width="30" height="6" rx="2" fill="currentColor" opacity=".88" />
    {/* the bed */}
    <rect x="8" y="53" width="48" height="6" rx="3" fill="currentColor" />
  </svg>
);

/* ---------- footer ---------- */

export const Pin = () => (
  <svg {...box}>
    <path d="M32 4c-10.5 0-19 8.5-19 19 0 14 19 37 19 37s19-23 19-37c0-10.5-8.5-19-19-19z"
          fill="currentColor" />
    <circle cx="32" cy="23" r="7.5" fill={INK} />
  </svg>
);

export const Phone = () => (
  <svg {...box}>
    <path d="M23 18c2 0 3 1 4 3l2 4c1 2 0 3-1 4l-2 2c2 5 6 9 11 11l2-2c1-1 2-2 4-1l4 2c2 1 3 2 3 4 0 4-3 7-7 7C29 52 12 35 12 21c0-4 3-7 7-7z"
          fill="currentColor" />
  </svg>
);

/** Slot key → drawn icon. Anything not listed renders nothing. */
const FALLBACKS = {
  calendar: Calendar,
  clock: Clock,
  pin: Pin,
  phone: Phone,
  games: Gamepad,
  prizes: Trophy,
  chess: Chess,
  giveaways: Gift,
  more: Bag,
  coding: Laptop,
  minecraft: Cube,
  roblox: Blocks,
  printing: Printer,
};

export default FALLBACKS;
