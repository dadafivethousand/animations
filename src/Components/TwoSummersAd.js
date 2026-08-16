// TwoSummersAd.jsx — same sixty days, two different things to show for them.
//
// One day counter runs 1 → 60 while two columns fill beside it. They fill at
// exactly the same rate, because the whole point is that nobody gets more
// summer than anybody else. The difference is what the fill is MADE of: on the
// left it is one undifferentiated block, on the right it is nine separate
// things with names on them.
//
// ── The counter does the arguing ──
//
// There is no line of copy in this ad that says a summer was wasted, and there
// must not be. "PLAYING GAMES" is not an accusation — kids play games, that is
// fine, and a parent who feels told off closes the app. The two columns simply
// end up at the same height with different contents, and the two totals
// underneath sit at 0 and 9. A viewer draws the conclusion themselves, which
// is the only way they will accept it.
//
// That is also why both columns fill at the same rate rather than the right one
// racing ahead: the ad is not claiming coding gives you more hours. It gives
// you something at the end of the same hours.
//
// ── Cold light and warm light ──
//
// The left column is lit like a screen in a dark room — cold blue, and it
// FLICKERS, which is the only movement on that side for the entire count. The
// right is lit like daylight. The palette is the argument before a single word
// is read, and it is the reason this ad opens on a dusk-indigo ground rather
// than on the dark terminal the last few used.
//
// ── The two fills are deliberately different KINDS of animation ──
//
// Left rises continuously — that is time passing, and time does not arrive in
// chunks. Right pops in discrete tiles at the days a build lands. Making them
// match would flatten the whole idea into two progress bars.
//
// JS owns the day counter and the phase; every movement is CSS keyed off them.
import React from "react";
import "../Stylesheets/TwoSummersAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// The nine builds, and the day each one lands.
//
// JITTERED AROUND AN EVEN CADENCE, NOT SCATTERED. Each tile is a ninth of the
// tube, so tile number k has to land near day k*60/9 or the stack stops
// tracking the fill beside it — and the two columns being level at every
// moment is the whole claim. An earlier set clumped early and ran the right
// column up to 9 points ahead of the left, which quietly turned the ad into
// "coding gives you more summer".
//
// The jitter is what stops it reading as a progress bar with ticks on it. Last
// one lands at 59 so the column is full a beat before the counter stops — the
// eye should reach the total before the number does.
//
// PLACEHOLDER COPY: these are plausible first builds, not the actual course
// list. Worth swapping for the real project names before this ships.
const BUILDS = [
  { day: 5,  label: "MAZE" },
  { day: 14, label: "PLATFORMER" },
  { day: 19, label: "SHOOTER" },
  { day: 27, label: "QUIZ" },
  { day: 32, label: "RACER" },
  { day: 41, label: "DEFENDER" },
  { day: 46, label: "CHATBOT" },
  { day: 54, label: "PUZZLE" },
  { day: 59, label: "BOSS FIGHT" },
];

const DAYS = 60;

// The whole take. `end` has no duration — it is where the ad rests.
const TIMELINE = [
  { k: "intro", ms: 750 },
  { k: "count", ms: 4600 },   // ≈ 77ms a day
  { k: "hold",  ms: 1500 },   // the finished pair, before anything is sold
  { k: "end",   ms: 0 },
];

// How long one day is on screen. Derived, so the count always fills the beat it
// was given rather than drifting out of it when either number changes.
//
// FLOOR, NOT ROUND. Rounding up puts 60 ticks past the end of the beat, the
// counter's own effect stops when the beat changes, and the ad settles on 58 —
// which is exactly what happened. Flooring guarantees the count lands inside
// its beat with a little room to spare.
const DAY_MS = Math.floor(TIMELINE[1].ms / DAYS);

export default function TwoSummersAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [step, setStep] = React.useState(0);
  const [day, setDay] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setStep(TIMELINE.length - 1);
      setDay(DAYS);
      return undefined;
    }
    if (step >= TIMELINE.length - 1) return undefined;   // `end` holds
    const t = setTimeout(() => setStep((n) => n + 1), TIMELINE[step].ms);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const kind = TIMELINE[step].k;

  // Runs from the count onward and stops ON 60 rather than wrapping — the last
  // frame of the count is the number the ad is about.
  //
  // It deliberately keeps running into `hold` as well. Tying it to the count
  // beat alone means any drift between DAY_MS * 60 and that beat's length
  // strands the counter a day or two short, and the ad's closing line is gated
  // on reaching 60.
  React.useEffect(() => {
    if (reduce || kind === "intro" || kind === "end" || day >= DAYS) {
      return undefined;
    }
    const t = setTimeout(() => setDay((d) => d + 1), DAY_MS);
    return () => clearTimeout(t);
  }, [kind, day, reduce]);

  const shown = BUILDS.filter((b) => b.day <= day);
  const counting = kind === "count" || kind === "hold";
  const pct = (day / DAYS) * 100;

  return (
    <div className={`ts-stage ts-k-${kind}`}>
      {/* dusk, and a low warm glow on the right half only — the ground is
          taking sides before any type is read */}
      <div className="ts-sky" aria-hidden />

      <div className="ts-card">
        <div className="ts-head">
          <span className="ts-kicker">TWO SUMMERS</span>
          <span className="ts-thesis">SAME 60 DAYS</span>
        </div>

        {/* The counter, and the only thing either column is waiting on. */}
        <div className="ts-day" aria-hidden>
          <span className="ts-day-k">DAY</span>
          <span className="ts-day-n">{String(Math.max(day, 1)).padStart(2, "0")}</span>
        </div>

        <div className="ts-cols">
          {/* ---- the cold one ----
              Fills continuously, because that is time passing and time does
              not arrive in chunks. Nothing else on this side ever changes
              except the flicker. */}
          <div className="ts-col is-cold">
            <div className="ts-label">PLAYING GAMES</div>
            <div className="ts-tube">
              <div className="ts-fill" style={{ height: `${pct}%` }}>
                <span className="ts-flicker" aria-hidden />
              </div>
            </div>
            <div className="ts-stat">
              <span className="ts-stat-n">0</span>
              <span className="ts-stat-k">BUILT</span>
            </div>
          </div>

          {/* ---- the warm one ----
              Same height at every moment, but arriving as nine separate things
              with names on them. Rendered bottom-up so the stack grows off the
              floor of the tube rather than hanging from its ceiling. */}
          <div className="ts-col is-warm">
            <div className="ts-label">MAKING GAMES</div>
            <div className="ts-tube">
              <div className="ts-stack">
                {shown
                  .slice()
                  .reverse()
                  .map((b) => (
                    <span className="ts-tile" key={b.label}>
                      {b.label}
                    </span>
                  ))}
              </div>
            </div>
            <div className="ts-stat">
              <span className="ts-stat-n">{shown.length}</span>
              <span className="ts-stat-k">BUILT</span>
            </div>
          </div>
        </div>

        {/* Held back until the count is over. Landing this line while the
            columns are still filling gives the viewer two things to read at
            once, and they will read neither. */}
        <div className={`ts-punch${counting && day >= DAYS ? " is-in" : ""}`}>
          Same summer. Different September.
        </div>
      </div>

      {/* ---- the endcard ----
          Always mounted and stacked over the card, so the comparison can fade
          under it rather than being cut away. */}
      <div className="ts-end">
        <img className="ts-logo" src={cnLogo} alt="Code Ninjas" />
        <div className="ts-loc">WOODBRIDGE</div>
        <span className="ts-rule" aria-hidden />
        <div className="ts-sub">
          <span>Summer camp for ages 5&ndash;14</span>
          <span>Build real games, all summer</span>
        </div>
        <div className="ts-cta">cnwoodbridge.com</div>
      </div>

      <div className="ts-vignette" aria-hidden />
      <div className="ts-grain" aria-hidden />
    </div>
  );
}
