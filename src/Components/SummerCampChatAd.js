// SummerCampChatAd.jsx — the question, asked in a ChatGPT-styled thread.
//
// A ChatGPT dark-mode interface rendered as a phone screen floating on a warm
// summer ground: a parent asks where to send their child for the rest of the
// summer, and the answer streams back word by word with the camp details
// attached as a card inside the reply.
//
// The interface is a recreation — the mark below is drawn in SVG, the palette
// and the chrome are matched by hand. The reply is ad copy we wrote, not a
// real model output, and the client should be comfortable running an ad whose
// persuasion rests on an implied third-party recommendation.
//
// Beat sheet (plays once, then holds a complete frame):
//   p1  the screen lifts in
//   p2  the question goes up from the composer
//   p3  the typing dots run — a finite burst, not a loop
//   p4  the answer streams in word by word, then the three lines
//   p5  the details card unfolds inside the answer
//   p6  the closing line lands and the CTA pops under the screen
//
// Every child is in the layout from frame one at its final position and only
// animates its own appearance, so the thread never reflows as it fills.
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

const CUES = [250, 1700, 3300, 5300, 8200, 11000];

function OpenAIMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.028l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

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
            <span className="scc-side" aria-hidden>
              <i />
              <i />
            </span>
            <span className="scc-title">
              ChatGPT <b className="scc-chev" aria-hidden />
            </span>
            <span className="scc-pen" aria-hidden />
          </div>

          <div className="scc-thread">
            <div className="scc-ask">{ASK}</div>

            <div className="scc-reply">
              <OpenAIMark className="scc-mark" />

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
            <span className="scc-plus" aria-hidden />
            <span className="scc-ph">Ask anything</span>
            <span className="scc-mic" aria-hidden />
            <span className="scc-send" aria-hidden />
          </div>

          <div className="scc-legal">ChatGPT can make mistakes. Check important info.</div>
        </div>

        <div className="scc-cta">REGISTER NOW</div>
      </div>
    </div>
  );
}
