// WheelSchedule.js
//
// Richmond Hill Jiu-Jitsu — the day's classes as a game-show wheel.
//
// Eight wedges: the day's classes alternate with four filler wedges (OSS, TAP,
// ROLL, SHRIMP) so the wheel looks like a wheel and not a pie chart. It spins
// once per class and lands on it; each landing drops that class onto the prize
// board underneath with its time and where it runs. Then the letter board
// lights up tile by tile into the sign-off.
//
// The wheel only ever lands on a class wedge — the fillers are scenery. The
// landing angle is computed, not tuned: wedge k is centred at k * 45 degrees,
// so the wheel has to finish at -k * 45 (mod 360) for the pointer to sit on it.
// A small jitter keeps each stop from landing dead centre, which reads as fake.
//
// `maple` prints AT MAPLE on the prize row, because a class at the other
// address is a different drive.
import React, { useEffect, useMemo, useState } from "react";
import "../Stylesheets/WheelSchedule.css";
import schedule from "../RhSchedule";
import logo from "../Images/rh-bjj-logo.png";

const WEDGES = 8;
const STEP = 360 / WEDGES;
const FILLERS = ["OSS", "TAP", "ROLL", "SHRIMP"];
const CLASS_COLOURS = ["#e8252a", "#f7c21a", "#1f6fe0", "#18a84c", "#f97316"];
const FILLER_COLOURS = ["#7c3aed", "#111214", "#ec4899", "#0ea5b7"];

const INTRO = 1500;
const SPIN_MS = 2300;
const GAP = 750; // the beat between a landing and the next pull
const PUZZLE = ["SEE YOU ON", "THE MATS", "TONIGHT!"];
const COLS = 12;

const formatTime = (t) => {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

// polar point on the wheel, 0 degrees at twelve o'clock, clockwise
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
};

const wedgePath = (r, a0, a1) => {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  return `M0 0 L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
};

export default function WheelSchedule({ day = "Thursday", place = "Richmond Hill" }) {
  // memoised: a fresh array every render would re-run the timer effect below
  // on each state change and clear the spins it had queued
  const items = useMemo(() => (schedule[day] || []).slice(0, 4), [day]);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Classes on the even wedges, fillers on the odd ones.
  const wedges = useMemo(() => {
    const out = [];
    for (let k = 0; k < WEDGES; k++) {
      if (k % 2 === 0 && items[k / 2]) {
        const c = items[k / 2];
        out.push({
          k,
          cls: k / 2,
          label: (c.short || c.name).replace(" - ", " ").toUpperCase(),
          sub: formatTime(c.start).replace(":00", "").replace(" ", ""),
          colour: CLASS_COLOURS[k / 2],
        });
      } else {
        const f = Math.floor(k / 2);
        out.push({ k, label: FILLERS[f % FILLERS.length], colour: FILLER_COLOURS[f % FILLER_COLOURS.length] });
      }
    }
    return out;
  }, [items]);

  // One absolute rotation per spin. Each one adds at least two full turns
  // and finishes on its class wedge, plus a little jitter.
  const stops = useMemo(() => {
    const jitter = [-9, 11, -6, 8, -10];
    let r = 0;
    return items.map((_, i) => {
      const target = (((-(i * 2) * STEP + jitter[i % jitter.length]) % 360) + 360) % 360;
      const base = r + 720 + 180 * (i % 2);
      let next = base - (base % 360) + target;
      if (next < base) next += 360;
      r = next;
      return next;
    });
  }, [items]);

  const [shown, setShown] = useState(reduced);
  const [spin, setSpin] = useState(-1);
  const [landed, setLanded] = useState(reduced ? items.length - 1 : -1);
  const [end, setEnd] = useState(reduced);

  useEffect(() => {
    if (reduced) return undefined;
    const t = [setTimeout(() => setShown(true), 150)];
    items.forEach((_, i) => {
      const at = INTRO + i * (SPIN_MS + GAP);
      t.push(setTimeout(() => setSpin(i), at));
      t.push(setTimeout(() => setLanded(i), at + SPIN_MS));
    });
    t.push(setTimeout(() => setEnd(true), INTRO + items.length * (SPIN_MS + GAP) + 500));
    return () => t.forEach(clearTimeout);
  }, [reduced, items]);

  const rotation = spin >= 0 ? stops[spin] : 0;
  const spinning = spin >= 0 && landed < spin;

  // the puzzle laid out on the 12-wide board, centred row by row
  const board = PUZZLE.map((line) => {
    const pad = Math.floor((COLS - line.length) / 2);
    return Array.from({ length: COLS }, (_, c) => {
      const ch = line[c - pad];
      return c >= pad && ch !== undefined ? ch : null;
    });
  });
  let letterNo = 0;

  return (
    <div className={`wof-stage${shown ? " is-shown" : ""}${end ? " is-end" : ""}`}>
      <div className="wof-glow" aria-hidden="true" />

      {/* ── The game ── */}
      <div className="wof-card">
        <header className="wof-title">
          <span className="wof-title-top">Wheel of</span>
          <span className="wof-title-main">Jiu-Jitsu</span>
          <span className="wof-title-cat">
            {day} · {place}
          </span>
        </header>

        <div className={`wof-wheel-wrap${spinning ? " is-spinning" : ""}`}>
          <div className="wof-pointer" key={`p${spin}`} aria-hidden="true" />
          <svg className="wof-wheel" viewBox="-110 -110 220 220" aria-hidden="true">
            <circle r="108" className="wof-rim" />
            {Array.from({ length: 24 }).map((_, i) => {
              const [x, y] = pt(102, i * 15 + 7.5);
              return <circle key={i} cx={x} cy={y} r="2.6" className={`wof-bulb wof-bulb-${i % 2}`} />;
            })}
            <g
              className="wof-spin"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: spin >= 0 ? `${SPIN_MS}ms` : "0ms",
              }}
            >
              {wedges.map((w) => (
                <g key={w.k} className={`wof-wedge${w.cls === landed && !spinning ? " is-hit" : ""}`}>
                  <path d={wedgePath(96, w.k * STEP - STEP / 2, w.k * STEP + STEP / 2)} fill={w.colour} />
                  <g transform={`rotate(${w.k * STEP})`}>
                    <text
                      className={`wof-label${w.cls === undefined ? " is-filler" : ""}${
                        w.colour === "#f7c21a" ? " is-dark" : ""
                      }`}
                      transform="translate(0 -56) rotate(90)"
                      textAnchor="middle"
                      dominantBaseline="central"
                      y={w.sub ? -4.5 : 0}
                    >
                      {w.label}
                    </text>
                    {w.sub && (
                      <text
                        className={`wof-sub${w.colour === "#f7c21a" ? " is-dark" : ""}`}
                        transform="translate(0 -56) rotate(90)"
                        textAnchor="middle"
                        dominantBaseline="central"
                        y="6"
                      >
                        {w.sub}
                      </text>
                    )}
                  </g>
                </g>
              ))}
              {wedges.map((w) => {
                const [x, y] = pt(96, w.k * STEP - STEP / 2);
                return <line key={`s${w.k}`} x1="0" y1="0" x2={x} y2={y} className="wof-spoke" />;
              })}
            </g>
            <circle r="17" className="wof-hub" />
            <text className="wof-hub-txt" textAnchor="middle" dominantBaseline="central">
              RH
            </text>
          </svg>
        </div>

        <ol className="wof-prizes">
          {items.map((c, i) => (
            <li key={i} className={i <= landed ? "is-won" : ""} style={{ "--c": CLASS_COLOURS[i] }}>
              <i className="wof-chip" />
              <span className="wof-p-name">{c.short || c.name}</span>
              <span className="wof-p-time">
                {formatTime(c.start)} – {formatTime(c.end)}
              </span>
              <span className={`wof-p-where${c.maple ? " is-maple" : ""}`}>
                {c.maple ? "At Maple" : "At RH"}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── The letter board ── */}
      <div className="wof-end">
        <div className="wof-board-cat">Phrase</div>
        <div className="wof-board">
          {board.map((row, r) => (
            <div className="wof-row" key={r}>
              {row.map((ch, c) => {
                if (ch === null) return <span key={c} className="wof-tile is-blank" />;
                if (ch === " ") return <span key={c} className="wof-tile is-space" />;
                const n = letterNo++;
                return (
                  <span key={c} className="wof-tile is-letter" style={{ "--n": n }}>
                    <b>{ch}</b>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <img className="wof-logo" src={logo} alt="Richmond Hill Jiu-Jitsu" />
        <div className="wof-addr">132 King Rd · Richmond Hill · rhbjj.ca</div>
      </div>
    </div>
  );
}
