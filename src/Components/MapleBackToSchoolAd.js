// MapleBackToSchool.js — Maple Jiu Jitsu back-to-school offer, Instagram post.
//
// Recreated from ~/Downloads/"maple back to school special.PNG", which had no
// source. Deep navy field, the leaf mark up top, a stacked condensed headline
// with SPECIAL knocked out of a white slab, a bonus-value roundel, three
// numbered offer cards and the sign-up block.
//
// The two product shots in the original — a branded gi and branded gloves —
// are EMOJI here at the user's direction. That is a deliberate trade: the
// photographs carried Maple patches, so reproducing them would mean sourcing
// and retouching artwork for a post that reads fine with a glyph. It also
// keeps the sheet self-contained: no photography to re-license or re-shoot
// when a value changes.
//
// EVERY NUMBER IS A PROP. $120, $50, $169, "over $300", the address and the
// domain are the club's claims, not this file's. The three values sum to $339,
// which is what "over $300" is standing on — change one and check the other
// still holds.
import React from "react";
import "../Stylesheets/MapleBackToSchoolAd.css";
import mapleLogo from "../Images/maple-logo.png";
import cnLogo from "../Images/cn-logo-horizontal.svg";

export default function MapleBackToSchoolAd({
  headline = ["BACK TO", "SCHOOL"],
  emphasis = "SPECIAL",
  badge = ["OVER", "$300", "IN BONUS", "VALUE"],
  eyebrow = "For New Kids Signups",

  cards = [
    { big: "FREE GI", small: [], value: "($120 Value)", emoji: "🥋" },
    { big: "FREE", small: ["BOXING GLOVES"], value: "($50 Value)", emoji: "🥊" },
    {
      big: "FREE",
      small: ["1 MONTH OF", "CODE NINJAS"],
      note: "(WOODBRIDGE LOCATION)",
      value: "($169 Value)",
      art: "partner",
    },
  ],

  cta = "SIGN UP TODAY",
  site = "maplebjj.com",
  address = "20 Cranston Park Ave, Vaughan",
}) {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Mount paints the empty field; the class lands on the next frame so the ad
  // opens ON it rather than a third of the way through the first move.
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  return (
    <div className="mb-frame">
    <div
      className={`mb-stage mb${go ? " mb-go" : ""}${reduce ? " mb-still" : ""}`}
    >
      {/* Field layers: key light, tatami weave, vignette. First child, so every
          positioned element after it paints on top without a z-index fight. */}
      <div className="mb-field" aria-hidden />

      {/* The leaf, enormous and nearly invisible. The mark's alpha IS the leaf
          outline — the wordmark inside it is painted, not punched — so masking
          with the logo file gives a clean silhouette with no type in it. */}
      <div
        className="mb-leaf"
        aria-hidden
        style={{
          WebkitMaskImage: `url(${mapleLogo})`,
          maskImage: `url(${mapleLogo})`,
        }}
      />

      {/* One shaft off the key light, raking across the upper third. */}
      <div className="mb-shaft" aria-hidden />

      {/* Everything the viewer READS lives in here, inset from the frame so a
          crop off any edge takes field and not content. The atmosphere layers
          above stay full-bleed on purpose — a vignette that stopped short of
          the edge would draw the very border it exists to hide. */}
      <div className="mb-content">
      <img className="mb-logo" src={mapleLogo} alt="Maple Jiu Jitsu" />

      {/* ---- headline. The roundel sits beside it rather than over it, so the
              two never fight for the same pixels at any string length. ---- */}
      <div className="mb-top">
        <h1 className="mb-head">
          {/* the inner <i> is what moves; the <span> is the window it moves
              up into, so the words arrive from behind the line above rather
              than fading in over the field */}
          {headline.map((l) => (
            <span key={l}>
              <i>{l}</i>
            </span>
          ))}
        </h1>

        <div className="mb-badge" aria-hidden={false}>
          <span className="mb-badge-sm">{badge[0]}</span>
          <span className="mb-badge-lg">{badge[1]}</span>
          <span className="mb-badge-sm">{badge[2]}</span>
          <span className="mb-badge-sm">{badge[3]}</span>
        </div>
      </div>

      {/* Knocked out of a white slab — the one place on the sheet where the
          navy becomes the ink and the paper becomes the ground. */}
      <p className="mb-emph">
        <span>{emphasis}</span>
      </p>

      <p className="mb-eyebrow">
        <span>{eyebrow}</span>
      </p>

      <div className="mb-cards">
        {cards.map((c, i) => (
          <div
            className={`mb-card ${c.art === "partner" ? "mb-card--partner" : ""}`}
            key={c.big + i}
          >
            <span className="mb-num">{i + 1}</span>
            <div className="mb-copy">
              <p className="mb-big">{c.big}</p>
              {c.small.length > 0 && (
                <p className="mb-small">
                  {c.small.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </p>
              )}
              {c.note && <p className="mb-note">{c.note}</p>}
              <p className="mb-value">{money(c.value)}</p>
            </div>

            <div className="mb-art">
              {c.art === "partner" ? (
                <span className="mb-disc mb-disc--paper">
                  <img src={cnLogo} alt="Code Ninjas" />
                  <em>WOODBRIDGE</em>
                </span>
              ) : (
                <span className="mb-disc mb-disc--glass">
                  <span className="mb-emoji">{c.emoji}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mb-cta">
        <span>{cta}</span>
      </p>

      <p className="mb-site">
        <Globe />
        {site}
      </p>

      <p className="mb-addr">
        <Pin />
        {address}
      </p>
      </div>

      <Grain />
    </div>
    </div>
  );
}


/* ---------------------------------------------------------------------------
 * The gi and the gloves, drawn.
 *
 * These were 🥋 and 🥊 — the user's own shortcut so the post could exist
 * without sourcing product artwork, and the right call at the time. They were
 * also the last thing on the sheet that looked bought rather than made: Apple
 * emoji arrive in someone else's palette, someone else's lighting and someone
 * else's line weight, and no amount of glow behind them fixes that.
 *
 * Drawn here they cost nothing extra, carry the poster's own navy/white/gold,
 * and take the same light as everything else — lit from the upper left, same
 * as the field's key. The emoji path is still live: give a card `emoji`
 * instead of `art` and it renders exactly as before.
 * ------------------------------------------------------------------------- */

function Gi() {  // eslint-disable-line no-unused-vars
  return (
    <svg className="mb-svg" viewBox="0 0 200 200" role="img" aria-label="Gi">
      <defs>
        <linearGradient id="mb-gi-a" x1=".15" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c6d1e0" />
        </linearGradient>
        <linearGradient id="mb-gi-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f6fb" />
          <stop offset="1" stopColor="#adbaca" />
        </linearGradient>
      </defs>

      {/* Sleeves thrown wide — the silhouette is what identifies a gi at
          thumbnail size, and a narrow one reads as a shirt. */}
      <path d="M62 30 L12 78a12 12 0 0 0 0 17l17 18a11 11 0 0 0 16 0l30-32z"
            fill="url(#mb-gi-b)" />
      <path d="M138 30l50 48a12 12 0 0 1 0 17l-17 18a11 11 0 0 1-16 0l-30-32z"
            fill="url(#mb-gi-b)" />

      {/* body, widening to the hem */}
      <path d="M62 24h76l12 148a8 8 0 0 1-8 9H58a8 8 0 0 1-8-9z"
            fill="url(#mb-gi-a)" />

      {/* Lapels: one thick V and the closure below it, drawn as a stroke so
          the join mitres itself. */}
      <path d="M66 26 L100 96 L134 26" fill="none" stroke="#e2e9f3"
            strokeWidth="24" strokeLinejoin="round" />
      <path d="M100 96 V181" fill="none" stroke="#e2e9f3" strokeWidth="24" />
      <path d="M66 26 L100 96 L134 26" fill="none" stroke="#a3b1c6"
            strokeWidth="2.5" strokeLinejoin="round" opacity=".75" />
      <path d="M100 96 V181" fill="none" stroke="#a3b1c6" strokeWidth="2.5"
            opacity=".45" />

      {/* black belt: band, knot, two hanging ends */}
      <path d="M91 140l-8 46h14l4-46zM109 140l8 46h-14l-4-46z" fill="#0b1220" />
      <rect x="46" y="114" width="108" height="27" rx="6" fill="#121b29" />
      <rect x="46" y="114" width="108" height="9" rx="4" fill="#1f2b3e" />
      <rect x="84" y="108" width="32" height="39" rx="8" fill="#0b1220" />
      <rect x="84" y="108" width="32" height="10" rx="5" fill="#28374e" />
    </svg>
  );
}

function Gloves() {  // eslint-disable-line no-unused-vars
  /* ORIENTATION was the thing, not the modelling. Drawn upright — fist above,
   * cuff below — a glove is a tall stack of a big round mass on a small one,
   * which is a mushroom, and three passes of better shading did not change
   * that. A boxing glove reads HORIZONTALLY: the fist punches forward, the
   * wrist trails behind it, and the thumb drops off the underside. Wide
   * silhouette, off-centre mass, and it is unmistakable.
   *
   * Everything shares one fill and overlaps, so the parts fuse into a single
   * outline rather than stacking as separate objects. */
  const glove = (
    <g transform="rotate(-8 100 100)">
      {/* wrist, behind and to the right */}
      <rect x="132" y="64" width="56" height="60" rx="20" fill="url(#mb-gl-b)" />
      <rect x="146" y="64" width="20" height="60" fill="#e9c46a" />
      <rect x="143" y="84" width="26" height="20" rx="4" fill="#c8a24d" />
      {/* thumb, dropping off the underside */}
      <ellipse cx="66" cy="130" rx="27" ry="21" fill="url(#mb-gl-b)" />
      {/* fist, forward and left */}
      <ellipse cx="90" cy="92" rx="60" ry="50" fill="url(#mb-gl-a)" />
      {/* crease where the thumb meets the fist */}
      <path d="M62 108c6 8 7 16 6 24" fill="none" stroke="#93a3ba"
            strokeWidth="4" strokeLinecap="round" opacity=".55" />
      {/* knuckle seam, following the punching face */}
      <path d="M44 74c-6 16-5 32 3 46" fill="none" stroke="#8e9fb8"
            strokeWidth="4.5" strokeLinecap="round" opacity=".6" />
      {/* highlight, upper left — same key as the field */}
      <path d="M52 74a52 40 0 0 1 34-26" fill="none" stroke="#ffffff"
            strokeWidth="10" strokeLinecap="round" opacity=".8" />
    </g>
  );
  return (
    <svg className="mb-svg" viewBox="0 0 200 200" role="img"
         aria-label="Boxing gloves">
      <defs>
        <linearGradient id="mb-gl-a" x1=".15" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b6c2d5" />
        </linearGradient>
        <linearGradient id="mb-gl-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7ecf5" />
          <stop offset="1" stopColor="#98a6bb" />
        </linearGradient>
      </defs>
      {/* A PAIR: the second mirrored and set back, so they face each other the
          way a pair hangs. One glove alone reads as a mitt. */}
      <g transform="translate(202 -34) scale(-.74 .74)" opacity=".42">{glove}</g>
      <g transform="translate(-4 22) scale(.92)">{glove}</g>
    </svg>
  );
}

/* The dollar figure carries the offer, so it is the one thing in the value line
 * that gets the accent. Splitting on the amount rather than asking for two
 * props keeps the caller writing "($120 Value)" as one readable string. */
function money(text) {
  return String(text)
    .split(/(\$[\d,]+)/)
    .map((part, i) =>
      /^\$/.test(part) ? (
        <b key={i} className="mb-money">
          {part}
        </b>
      ) : (
        part
      )
    );
}

/* Film grain over the whole sheet.
 *
 * This is the difference between a gradient and a photograph. Every tone on
 * this poster is a CSS gradient, and gradients band — on a navy this deep the
 * steps are visible on a phone and unmissable in print. A few percent of
 * monochrome noise breaks the banding into dither and the field reads as a
 * surface instead of a ramp. It has to be desaturated with feColorMatrix or
 * raw turbulence lands as coloured confetti. */
function Grain() {
  return (
    <svg className="mb-grain" aria-hidden focusable="false">
      <filter id="mb-noise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#mb-noise)" />
    </svg>
  );
}

/* Drawn, not set as emoji: 🌐 and 📍 render full-colour on Apple platforms and
 * would be the only two coloured marks on a two-colour sheet. */
function Globe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9.4" />
      <ellipse cx="12" cy="12" rx="4" ry="9.4" />
      <path d="M2.9 9h18.2M2.9 15h18.2" />
    </svg>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" />
    </svg>
  );
}
