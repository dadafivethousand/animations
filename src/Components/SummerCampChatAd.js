// SummerCampChatAd.jsx — the question, asked to an assistant, answered.
//
// A different format from anything else in the repo: not a poster, a
// conversation. A dark chat panel floating on a warm summer ground, a parent's
// question typed into it, and the answer streaming back word by word with the
// camp details attached.
//
// The assistant is deliberately unbranded — a spark mark and no product name.
// The format is what sells it; putting a real company's logo on an answer we
// wrote would be inventing an endorsement, and the beat lands the same without
// one.
//
// Beat sheet (plays once, then holds a complete frame):
//   p1  the panel lifts in
//   p2  the question slides up from the composer
//   p3  the typing dots run — a finite burst, not a loop
//   p4  the answer streams in word by word, then the three lines
//   p5  the details card unfolds inside the answer
//   p6  the closing line lands and the CTA pops under the panel
//
// Every child is in the layout from frame one at its final position and only
// animates its own appearance, so the panel never reflows as the thread fills.
//
// JS advances the phase and nothing else; all motion is CSS keyed off
// .scc-p0..p6.
import React from "react";
import "../Stylesheets/SummerCampChatAd.css";

import logo from "../Images/cn-woodbridge-logo.png";

const ASK = "Where should I send my child for the remainder of summer?";
const LEAD = "Easy — Code Ninjas Woodbridge.";
const SUB = "Their summer camp keeps kids building all week.";

const BULLETS = [
  { icon: "🎮", text: "Build real video games" },
  { icon: "💻", text: "Level up coding skills" },
  { icon: "🥷", text: "Epic ninja challenges" },
];

const ROWS = [
  { icon: "📍", text: "6175 Highway 7" },
  { icon: "📞", text: "647-887-9940" },
  { icon: "🌐", text: "cnwoodbridge.com", strong: true },
];

// ~12s to the last frame of motion, then it holds. The CTA pop is the last
// thing to finish, which is what sets the total.
const CUES = [250, 1700, 3300, 5300, 8200, 11000];

// One span per word so the answer can stream. The spaces are real text nodes
// *between* the spans, not inside them — the spans are inline-block so they can
// carry a transform, and an inline-block would swallow a trailing space.
// Keeping the spaces outside also keeps the rendered string intact.
function Words({ text, from = 0 }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <React.Fragment key={i}>
      <span className="scc-w" style={{ "--i": from + i }}>
        {w}
      </span>
      {i < words.length - 1 ? " " : ""}
    </React.Fragment>
  ));
}

export default function SummerCampChatAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // reduced motion: no stream, no dots — hand over the finished thread
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(6);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  const leadWords = LEAD.split(" ").length;

  return (
    <div className={`scc-stage scc-p${phase}`}>
      <div className="scc-ground" aria-hidden />
      <div className="scc-bloom" aria-hidden />

      <div className="scc-card">
        <div className="scc-panel">
          <div className="scc-bar">
            <span className="scc-tl" aria-hidden />
            <span className="scc-tl" aria-hidden />
            <span className="scc-tl" aria-hidden />
            <span className="scc-bar-t">new chat</span>
          </div>

          <div className="scc-thread">
            <div className="scc-ask">{ASK}</div>

            <div className="scc-reply">
              <div className="scc-avatar" aria-hidden>
                <i />
              </div>

              <div className="scc-body">
                {/* overlaid, not in flow — so the answer's box is already the
                    right size and nothing jumps when the dots go */}
                <div className="scc-dots" aria-hidden>
                  <i style={{ "--i": 0 }} />
                  <i style={{ "--i": 1 }} />
                  <i style={{ "--i": 2 }} />
                </div>

                <p className="scc-lead">
                  <Words text={LEAD} />
                </p>
                <p className="scc-sub">
                  <Words text={SUB} from={leadWords} />
                </p>

                <ul className="scc-bul">
                  {BULLETS.map((b, i) => (
                    <li key={b.text} style={{ "--i": i }}>
                      <span className="scc-bul-i" aria-hidden>
                        {b.icon}
                      </span>
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="scc-biz">
                  {/* the mark is dark-on-transparent with no light-on-dark
                      variant, so it is foiled: grayscale first — which keeps
                      the mask band and the eye slits distinct from the head —
                      then inverted, where a flat invert would flatten the head
                      into a white disc */}
                  <img className="scc-biz-logo" src={logo} alt="Code Ninjas" />
                  <div className="scc-biz-city">WOODBRIDGE</div>
                  {ROWS.map((r, i) => (
                    <div
                      key={r.text}
                      className={r.strong ? "scc-row scc-row--s" : "scc-row"}
                      style={{ "--i": i }}
                    >
                      <span className="scc-row-i" aria-hidden>
                        {r.icon}
                      </span>
                      <span>{r.text}</span>
                    </div>
                  ))}
                </div>

                <p className="scc-close">Spots are filling fast.</p>
              </div>
            </div>
          </div>

          <div className="scc-composer">
            <span className="scc-ph">Ask anything</span>
            <span className="scc-send" aria-hidden />
          </div>
        </div>

        <div className="scc-cta">REGISTER NOW</div>
      </div>
    </div>
  );
}
