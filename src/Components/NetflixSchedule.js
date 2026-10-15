// NetflixSchedule.js
//
// Richmond Hill Jiu-Jitsu — the day's classes as a streaming series page.
//
// The day is the show and each class is an episode. A red RH ident plays first
// (the "ta-dum"), the series page comes up with the day as its title, the
// episodes land one by one, and then an Up Next card counts down into the
// first class at the King Rd mat — the one somebody watching tonight can still
// make. It ends on the wolf and the address.
//
// The thumbnails are drawn, not photographed, on purpose: the only class photo
// in the repo was taken in front of the Maple wall, and a Richmond Hill board
// should not show the other gym's sign.
//
// `maple` gets its own tag colour and says AT MAPLE, because a class at the
// other address is a different drive, and the board has to say so before
// anybody gets in the car.
import React, { useEffect, useState } from "react";
import "../Stylesheets/NetflixSchedule.css";
import schedule from "../RhSchedule";
import logo from "../Images/rh-bjj-logo.png";

// p0 ident · p1 series page · p2 episodes · p3 up next · p4 end card
const CUES = [0, 2300, 3300, 8600, 13600];
const COUNT_FROM = 5;

const formatTime = (t) => {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

const minutes = (c) => Math.round((c.end - c.start) * 60);

// Each kind of class gets its own key-art colour, the way a series gives every
// episode a different still.
const artFor = (name = "") => {
  if (/kids/i.test(name)) return "kids";
  if (/teen/i.test(name)) return "teens";
  if (/no[ -]?gi/i.test(name)) return "nogi";
  if (/muay|thai/i.test(name)) return "muay";
  if (/wrestl/i.test(name)) return "wrestling";
  return "gi";
};

export default function NetflixSchedule({ day = "Thursday", date = "Oct 15" }) {
  const items = schedule[day] || [];
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Up Next points at the first class at King Rd, not the first of the day:
  // the morning ones are at Maple and are over by the time this is posted.
  const nextIndex = Math.max(0, items.findIndex((c) => !c.maple));
  const next = items[nextIndex];

  const [phase, setPhase] = useState(reduced ? 4 : 0);
  const [count, setCount] = useState(COUNT_FROM);

  useEffect(() => {
    if (reduced) return undefined;
    const timers = CUES.slice(1).map((at, i) => setTimeout(() => setPhase(i + 1), at));
    for (let n = 1; n <= COUNT_FROM; n++) {
      timers.push(setTimeout(() => setCount(COUNT_FROM - n), CUES[3] + 600 + n * 760));
    }
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  return (
    <div className={`nfx-stage nfx-p${phase}`}>
      {/* ── The ident ── */}
      <div className="nfx-ident" aria-hidden="true">
        <div className="nfx-ident-mark">
          <span>R</span>
          <span>H</span>
        </div>
        <div className="nfx-ident-streaks">
          {Array.from({ length: 14 }).map((_, i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </div>
      </div>

      {/* ── The series page ── */}
      <div className="nfx-card">
        <header className="nfx-head">
          <div className="nfx-badge">
            <b>RH</b>
            <span>SERIES</span>
          </div>
          <h1 className="nfx-title">{day}</h1>
          <div className="nfx-meta">
            <span className="nfx-match">98% Match</span>
            <span>{date}</span>
            <span className="nfx-rating">ALL AGES</span>
            <span>{items.length} Episodes</span>
          </div>
          <div className="nfx-play">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
            </svg>
            Play
          </div>
        </header>

        <section className="nfx-episodes">
          <div className="nfx-ep-head">
            <span>Episodes</span>
            <span className="nfx-ep-season">Richmond Hill</span>
          </div>
          {items.map((c, i) => (
            <article
              key={i}
              className={`nfx-ep nfx-art-${artFor(c.name)}${c.maple ? " is-maple" : ""}${
                i === nextIndex ? " is-next" : ""
              }`}
              style={{ "--i": i }}
            >
              <div className="nfx-thumb">
                <span className="nfx-thumb-word">{c.short || c.name}</span>
                <span className="nfx-thumb-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>
                <span className="nfx-thumb-bar" aria-hidden="true">
                  <i />
                </span>
              </div>
              <div className="nfx-ep-text">
                <div className="nfx-ep-title">
                  {i + 1}. {c.short || c.name}
                </div>
                <div className="nfx-ep-time">
                  {formatTime(c.start)} – {formatTime(c.end)}
                  <span className="nfx-ep-len">{minutes(c)}m</span>
                </div>
                <div className="nfx-ep-where">{c.maple ? "At Maple" : "At Richmond Hill"}</div>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* ── Up next ── */}
      {next && (
        <div className="nfx-next">
          <div className="nfx-next-kicker">Next Episode</div>
          <div className="nfx-next-title">{next.short || next.name}</div>
          <div className="nfx-next-time">
            Tonight · {formatTime(next.start)} · At Richmond Hill
          </div>
          <div className="nfx-next-ring">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="44" className="nfx-ring-track" />
              <circle cx="50" cy="50" r="44" className="nfx-ring-fill" />
            </svg>
            <span key={count}>{count > 0 ? count : "▶"}</span>
          </div>
        </div>
      )}

      {/* ── End card ── */}
      <div className="nfx-end">
        <img className="nfx-end-logo" src={logo} alt="Richmond Hill Jiu-Jitsu" />
        <div className="nfx-end-line">Now streaming on the mats</div>
        <div className="nfx-end-addr">132 King Rd · Richmond Hill</div>
        <div className="nfx-end-url">rhbjj.ca</div>
      </div>
    </div>
  );
}
