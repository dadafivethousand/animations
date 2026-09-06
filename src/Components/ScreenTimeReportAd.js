// ScreenTimeReportAd.js — the weekly screen time report, relabelled.
//
// ── THE IDEA, AND WHY THE FIRST TWO SECONDS ARE STILL ──
//
// Frame one is a phone's own screen time card, full bleed, in the system font.
// It is supposed to be mistaken for a screenshot — that mistake is the entire
// scroll-stop. Which is why the opening does almost nothing: the bars draw in
// the way a real report renders, and then the ad HOLDS for a second and a half
// with no motion at all. An ad that starts animating at 0.3s announces itself
// as an ad; this one has to read as something the viewer already recognises
// before it is allowed to move.
//
// Then the turn. A red line sweeps down the screen and the categories relabel —
// Social becomes Building, Entertainment becomes Debugging, Games becomes
// Publishing — and the DURATIONS DO NOT CHANGE. Nor do the bar heights, nor the
// 5h 12m average. That is the whole argument, made visually before a word of
// copy appears: the pitch is not "less screen time", which every parent has
// already tuned out. It is "the same hours, pointed somewhere else."
//
// ── NOT A COPY OF ANYONE'S UI ──
//
// The layout is recognisable as a phone settings screen and is deliberately
// not a pixel copy of Apple's: the glyphs are drawn here, the type is the
// system stack rather than a licensed face, and no marks appear. Same call the
// OpenHouse icon set makes about partner logos — recognition without wearing
// somebody else's trade dress.
//
//   MS=9200 HOLD=1.7 BG='#f2f2f7' OUT=~/Downloads/cn-screen-time.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
//
// BG matters and is LIGHT for this one, unlike every recent ad in this repo —
// the recorder paints it for the ~150ms before React mounts, and a flash of
// dark navy in front of a white UI is the worst possible frame one here.
import React from "react";
import "../Stylesheets/ScreenTimeReportAd.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";

/* The week. Fixed, not random — a render that differs between takes cannot be
 * checked against the take before it. Heights are a percentage of the tallest
 * day, and they are the ONE thing in this ad that never changes: the turn
 * recolours these bars and leaves every height exactly where it was. */
const DAYS = [
  ["M", 62], ["T", 74], ["W", 58], ["T", 81], ["F", 92], ["S", 100], ["S", 88],
];

/* Same durations, different work. The rows are written as pairs precisely so
 * nobody can later edit one side and leave the other — the point of the whole
 * ad is that the numbers are identical on both. */
const ROWS = [
  { time: "2h 10m", pct: 100, before: "Social", after: "Building" },
  { time: "1h 48m", pct: 83, before: "Entertainment", after: "Debugging" },
  { time: "1h 14m", pct: 57, before: "Games", after: "Publishing" },
];

/* Drawn, not borrowed. Two sets: what the hours were, and what they become. */
const GLYPH = {
  Social: (
    <path d="M12 5h16a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H20l-6 5v-5h-2a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4Z" />
  ),
  Entertainment: <path d="M9 8.5v23l19-11.5z" />,
  Games: (
    <path d="M11 12h18a7 7 0 0 1 7 7v3a5 5 0 0 1-9 3H13a5 5 0 0 1-9-3v-3a7 7 0 0 1 7-7Zm2 6v6m-3-3h6m12 0h.1m-3 3h.1" />
  ),
  Building: <path d="M20 5 34 13v16L20 37 6 29V13z M20 5v32 M6 13l14 8 14-8" />,
  Debugging: (
    <path d="M20 12a8 8 0 0 1 8 8v6a8 8 0 0 1-16 0v-6a8 8 0 0 1 8-8Z M12 18H5m23 0h7M12 28H6m22 0h6M15 12l-4-4m14 4 4-4" />
  ),
  Publishing: <path d="M20 4c6 5 9 11 9 18l-9 8-9-8c0-7 3-13 9-18Z M20 15a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z M13 30l-3 6 6-2m11-4 3 6-6-2" />,
};

const Icon = ({ name }) => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.6"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {GLYPH[name]}
  </svg>
);

export default function ScreenTimeReportAd({
  average = "5h 12m",
  lineA = "Same hours.",
  lineB = "Different screen.",
  tail = "Your kid is going to be on a screen.\nAt Code Ninjas they build what's on it.",

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  phone = "647-887-9940",
}) {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  return (
    <div className="st-frame">
      <div className={`st-stage st${go ? " st-go" : ""}${reduce ? " st-still" : ""}`}>
        <div className="st-push">
          <div className="st-shake">
            <div className="st-wall" aria-hidden />

            {/* ---------- the report ---------- */}
            <div className="st-ui">
              <div className="st-status" aria-hidden>
                <span className="st-clock">9:41</span>
                <span className="st-sysicons">
                  <i className="st-sig" /><i className="st-wifi" /><i className="st-batt" />
                </span>
              </div>

              <h1 className="st-h1">Screen Time</h1>
              <p className="st-week">This Week</p>

              <section className="st-card">
                <p className="st-label">Daily Average</p>
                <p className="st-avg">{average}</p>

                <div className="st-chart">
                  {/* The line the bars are measured against. It is drawn BEFORE
                      the turn and never moves, which is what makes "the total
                      did not change" something the viewer sees rather than
                      something the copy has to claim. */}
                  <span className="st-avgline" aria-hidden><em>{average}</em></span>
                  {DAYS.map(([d, h], i) => (
                    <span className="st-bar" key={i} style={{ "--h": `${h}%`, "--i": i }}>
                      <i />
                    </span>
                  ))}
                </div>

                <div className="st-days" aria-hidden>
                  {DAYS.map(([d], i) => <span key={i}>{d}</span>)}
                </div>
              </section>

              <section className="st-card st-card--rows">
                <p className="st-cap">MOST USED</p>
                {ROWS.map((r, i) => (
                  <div className="st-row" key={r.time} style={{ "--i": i }}>
                    <span className="st-ico">
                      <span className="st-ico-a"><Icon name={r.before} /></span>
                      <span className="st-ico-b"><Icon name={r.after} /></span>
                    </span>

                    <span className="st-name">
                      <b className="st-name-a">{r.before}</b>
                      <b className="st-name-b">{r.after}</b>
                    </span>

                    {/* THE DURATION IS ONE NODE, NOT TWO. Everything else in
                        the row swaps; this deliberately cannot, because the
                        argument dies the moment these numbers look editable. */}
                    <span className="st-time">{r.time}</span>

                    <span className="st-mini" style={{ "--p": `${r.pct}%` }}><i /></span>
                  </div>
                ))}
              </section>

              {/* Kept deliberately dull. It is here to make the page look like
                  it continues past the crop, which is what a real one does. */}
              <section className="st-card st-card--foot">
                <span className="st-foot-stat"><b>47</b><i>Pickups</i></span>
                <span className="st-foot-stat"><b>7:12 AM</b><i>First pickup</i></span>
                <span className="st-foot-stat"><b>312</b><i>Notifications</i></span>
              </section>
            </div>

            {/* the line that does the relabelling as it passes */}
            <div className="st-sweep" aria-hidden />

            {/* washes the report out from under the endcard */}
            <div className="st-scrim" aria-hidden />

            {/* ---------- the copy ---------- */}
            <div className="st-lines">
              <p className="st-line-a">{lineA}</p>
              <p className="st-line-b">{lineB}</p>
            </div>

            {/* ---------- the endcard ---------- */}
            <div className="st-end">
              <img className="st-logo" src={cnLogo} alt="Code Ninjas" />
              <p className="st-city">WOODBRIDGE</p>
              <p className="st-tail">
                {tail.split("\n").map((l, i) => (
                  <React.Fragment key={i}>{l}<br /></React.Fragment>
                ))}
              </p>
              <p className="st-where"><b>{centre}</b><i>{address}</i></p>
              <p className="st-tel">{phone}</p>
            </div>

            <div className="st-vig" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
